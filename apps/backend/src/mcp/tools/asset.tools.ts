import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';
import { FRONTEND_URL, parseExpiry } from '../mcp.server';
import { AssetType } from '../../db/models/Asset';

export function registerAssetTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'asset_publish',
    'Publish text content as a shareable Tokenrip asset. Returns a public URL. For collections (structured data tables), use collection_create instead.',
    {
      content: z.string().describe('Raw content (markdown, HTML, JSON, etc.)'),
      type: z.enum([AssetType.MARKDOWN, AssetType.HTML, AssetType.CHART, AssetType.CODE, AssetType.TEXT, AssetType.JSON]).describe('Content type (for collections, use collection_create)'),
      title: z.string().optional().describe('Asset title'),
      parentAssetId: z.string().optional().describe('Parent asset UUID for provenance'),
      creatorContext: z.string().optional().describe('Context about how/why this was created'),
      inputReferences: z.array(z.string()).optional().describe('URLs or IDs of input sources'),
    },
    async (args) => {
      try {
        const asset = await services.assetService.createFromContent({
          type: args.type,
          content: args.content,
          title: args.title,
          ownerId: agentId,
          parentAssetId: args.parentAssetId,
          creatorContext: args.creatorContext,
          inputReferences: args.inputReferences,
        });
        const url = `${FRONTEND_URL}/s/${asset.publicId}`;
        return {
          content: [{ type: 'text', text: JSON.stringify({ id: asset.publicId, url, title: asset.title, type: asset.type, mimeType: asset.mimeType }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_upload',
    'Upload a binary file as a Tokenrip asset. Provide base64-encoded file content.',
    {
      base64Content: z.string().describe('Base64-encoded file content'),
      filename: z.string().describe('Original filename (e.g. report.pdf)'),
      mimeType: z.string().describe('MIME type (e.g. application/pdf)'),
      title: z.string().optional().describe('Asset title'),
      parentAssetId: z.string().optional().describe('Parent asset UUID'),
      creatorContext: z.string().optional().describe('Context about how/why this was created'),
    },
    async (args) => {
      try {
        const buffer = Buffer.from(args.base64Content, 'base64');
        const asset = await services.assetService.createFromFile({
          file: { buffer, originalname: args.filename, mimetype: args.mimeType },
          title: args.title,
          ownerId: agentId,
          parentAssetId: args.parentAssetId,
          creatorContext: args.creatorContext,
        });
        const url = `${FRONTEND_URL}/s/${asset.publicId}`;
        return {
          content: [{ type: 'text', text: JSON.stringify({ id: asset.publicId, url, title: asset.title, type: asset.type, mimeType: asset.mimeType }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_list',
    'List your published assets with optional filtering.',
    {
      since: z.string().optional().describe('ISO 8601 timestamp — only return assets created/updated after this'),
      limit: z.number().optional().describe('Maximum number of assets to return'),
      type: z.nativeEnum(AssetType).optional().describe('Filter by asset type'),
    },
    async (args) => {
      try {
        const assets = await services.assetService.findByOwner(agentId, {
          since: args.since ? new Date(args.since) : undefined,
          limit: args.limit,
          type: args.type,
        });
        const data = assets.map((a) => ({
          id: a.publicId,
          title: a.title,
          type: a.type,
          mimeType: a.mimeType,
          sizeBytes: a.sizeBytes ?? null,
          versionCount: a.versionCount,
          url: `${FRONTEND_URL}/s/${a.publicId}`,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        }));
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_delete',
    'Permanently destroy an asset (tombstones it, returns 410 Gone).',
    {
      publicId: z.string().describe('Asset UUID to delete'),
    },
    async (args) => {
      try {
        await services.assetService.destroyAsset(args.publicId, agentId);
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true, deleted: args.publicId }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_update',
    'Create a new version of an existing asset.',
    {
      publicId: z.string().describe('Asset UUID to update'),
      content: z.string().optional().describe('New text content (for content-type assets)'),
      base64Content: z.string().optional().describe('New base64-encoded file content (for file assets)'),
      filename: z.string().optional().describe('Filename (required with base64Content)'),
      mimeType: z.string().optional().describe('MIME type (required with base64Content)'),
      type: z.string().optional().describe('Content type if updating content'),
      label: z.string().optional().describe('Version label'),
      creatorContext: z.string().optional().describe('Context for this version'),
    },
    async (args) => {
      try {
        const asset = await services.assetService.findByPublicId(args.publicId);
        if (asset.ownerId !== agentId) {
          return { content: [{ type: 'text', text: 'Error: Only the asset owner can create versions' }], isError: true };
        }

        let version;
        if (args.base64Content && args.filename && args.mimeType) {
          const buffer = Buffer.from(args.base64Content, 'base64');
          version = await services.assetVersionService.createVersionForAsset(asset, {
            file: { buffer, originalname: args.filename, mimetype: args.mimeType },
            label: args.label,
            creatorContext: args.creatorContext,
          });
        } else if (args.content && args.type) {
          version = await services.assetVersionService.createVersionForAsset(asset, {
            type: args.type,
            content: args.content,
            label: args.label,
            creatorContext: args.creatorContext,
          });
        } else {
          return { content: [{ type: 'text', text: 'Error: Provide either { content, type } or { base64Content, filename, mimeType }' }], isError: true };
        }

        return {
          content: [{ type: 'text', text: JSON.stringify({ id: version.id, assetId: args.publicId, version: version.version, label: version.label, createdAt: version.createdAt }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_version_delete',
    'Delete a specific version of an asset (cannot delete the last version).',
    {
      publicId: z.string().describe('Asset UUID'),
      versionId: z.string().describe('Version UUID to delete'),
    },
    async (args) => {
      try {
        await services.assetVersionService.deleteVersion(args.publicId, args.versionId, agentId);
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true, deleted: args.versionId }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_share',
    'Generate a shareable link for an asset with scoped permissions.',
    {
      publicId: z.string().describe('Asset UUID to share'),
      perm: z.array(z.string()).optional().describe('Permissions to grant (default: ["comment", "version:create"])'),
      expiresIn: z.string().optional().describe('Expiry duration (e.g. "30m", "1h", "7d", "30d")'),
      label: z.string().optional().describe('Label for this share link'),
    },
    async (args) => {
      try {
        const asset = await services.assetService.findByPublicId(args.publicId);
        if (asset.ownerId !== agentId) {
          return { content: [{ type: 'text', text: 'Error: Only the asset owner can create share links' }], isError: true };
        }

        let expiresAt: Date | undefined;
        if (args.expiresIn) {
          expiresAt = parseExpiry(args.expiresIn);
        }

        const { token } = await services.shareTokenService.create({
          assetPublicId: args.publicId,
          agentId,
          issuedBy: agentId,
          perm: args.perm,
          label: args.label,
          expiresAt,
        });

        const shareUrl = `${FRONTEND_URL}/s/${args.publicId}?cap=${token}`;
        return {
          content: [{ type: 'text', text: JSON.stringify({ shareUrl, token, expiresAt: expiresAt?.toISOString() ?? null }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_stats',
    'Get storage usage statistics for your assets.',
    {},
    async () => {
      try {
        const stats = await services.assetService.getStats(agentId);
        return { content: [{ type: 'text', text: JSON.stringify(stats) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_get',
    'Get metadata for any asset by its public ID.',
    {
      publicId: z.string().describe('Asset UUID'),
    },
    async (args) => {
      try {
        const a = await services.assetService.findByPublicId(args.publicId);
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: a.publicId,
            title: a.title ?? null,
            type: a.type,
            mimeType: a.mimeType ?? null,
            state: a.state,
            sizeBytes: a.sizeBytes ?? null,
            versionCount: a.versionCount,
            ownerId: a.ownerId,
            parentAssetId: a.parentAssetId ?? null,
            creatorContext: a.creatorContext ?? null,
            url: `${FRONTEND_URL}/s/${a.publicId}`,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_get_content',
    'Get the content of an asset. Text assets are returned inline; binary assets are returned as base64.',
    {
      publicId: z.string().describe('Asset UUID'),
      versionId: z.string().optional().describe('Specific version UUID (default: latest)'),
    },
    async (args) => {
      try {
        const { buffer, mimeType } = args.versionId
          ? await services.assetVersionService.getVersionContent(args.publicId, args.versionId)
          : await services.assetService.getContent(args.publicId);

        const isText = /^text\/|^application\/(json|xml|javascript|typescript|x-yaml|yaml|csv)/.test(mimeType)
          || [AssetType.MARKDOWN, AssetType.HTML, AssetType.CODE, AssetType.TEXT, AssetType.JSON, AssetType.CHART].some(
            (t) => mimeType.includes(t),
          );

        if (isText) {
          return { content: [{ type: 'text', text: buffer.toString('utf-8') }] };
        }

        // Binary — cap at 10 MB to avoid bloating MCP responses
        if (buffer.length > 10 * 1024 * 1024) {
          return {
            content: [{ type: 'text', text: JSON.stringify({ error: 'Content too large for inline transfer', sizeBytes: buffer.length, mimeType }) }],
            isError: true,
          };
        }

        return {
          content: [{ type: 'text', text: JSON.stringify({ base64: buffer.toString('base64'), mimeType, sizeBytes: buffer.length }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'asset_versions',
    'List all versions of an asset.',
    {
      publicId: z.string().describe('Asset UUID'),
    },
    async (args) => {
      try {
        const versions = await services.assetVersionService.listVersions(args.publicId);
        const data = versions.map((v) => ({
          id: v.id,
          version: v.version,
          label: v.label ?? null,
          mimeType: v.mimeType ?? null,
          sizeBytes: v.sizeBytes ?? null,
          createdAt: v.createdAt,
        }));
        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}

