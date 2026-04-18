import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';
import { FRONTEND_URL } from '../mcp.server';
import { AssetType } from '../../db/models/Asset';

export function registerCollectionTools(server: McpServer, services: McpServices, agentId: string): void {

  async function findOwnedCollection(publicId: string) {
    const asset = await services.assetService.findByPublicId(publicId);
    if (asset.type !== AssetType.COLLECTION) {
      throw new Error('Asset is not a collection');
    }
    if (asset.ownerId !== agentId) {
      throw new Error('Only the collection owner can modify rows');
    }
    return asset;
  }

  server.tool(
    'collection_create',
    'Create a new collection (structured data table). Returns a shareable URL. Agents append rows via collection_append_rows.',
    {
      title: z.string().describe('Collection title'),
      schemaJson: z.string().describe('JSON array of column definitions, e.g. [{"name":"company","type":"text"},{"name":"relevance","type":"enum","values":["high","medium","low"]}]. Types: text, number, date, url, enum, boolean'),
      description: z.string().optional().describe('Collection description'),
      parentAssetId: z.string().optional().describe('Parent asset UUID for provenance'),
      creatorContext: z.string().optional().describe('Context about how/why this was created'),
      inputReferences: z.array(z.string()).optional().describe('URLs or IDs of input sources'),
    },
    async (args) => {
      try {
        const schema = JSON.parse(args.schemaJson);
        if (!Array.isArray(schema)) {
          return { content: [{ type: 'text', text: 'Error: schemaJson must be a JSON array of column definitions' }], isError: true };
        }
        const asset = await services.assetService.createCollection({
          title: args.title,
          description: args.description,
          schema,
          ownerId: agentId,
          parentAssetId: args.parentAssetId,
          creatorContext: args.creatorContext,
          inputReferences: args.inputReferences,
        });
        const url = `${FRONTEND_URL}/s/${asset.publicId}`;
        return {
          content: [{ type: 'text', text: JSON.stringify({ id: asset.publicId, url, title: asset.title, type: asset.type }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'collection_create_from_csv',
    'Parse CSV text and create a new collection with schema + rows populated in one call. Use `headers: true` if the first CSV row is the header row. Or pass `schemaJson` to set explicit column names + types (all rows are then data). If neither is set, columns are auto-named col_1, col_2, etc.',
    {
      csvContent: z.string().describe('Raw CSV text'),
      headers: z.boolean().optional().describe('If true, first CSV row provides column names (all text type). Mutually exclusive with schemaJson.'),
      schemaJson: z.string().optional().describe('JSON array of column definitions (e.g. [{"name":"company","type":"text"},{"name":"revenue","type":"number"}]). Types: text, number, date, url, enum, boolean. Mutually exclusive with headers.'),
      title: z.string().optional().describe('Collection title'),
      description: z.string().optional().describe('Collection description'),
      parentAssetId: z.string().optional().describe('Parent asset UUID for provenance'),
      creatorContext: z.string().optional().describe('Context about how/why this was created'),
      inputReferences: z.array(z.string()).optional().describe('URLs or IDs of input sources'),
    },
    async (args) => {
      try {
        let schema: any = undefined;
        if (args.schemaJson) {
          schema = JSON.parse(args.schemaJson);
          if (!Array.isArray(schema)) {
            return { content: [{ type: 'text', text: 'Error: schemaJson must be a JSON array' }], isError: true };
          }
        }
        const asset = await services.assetService.createCollectionFromCsv({
          content: args.csvContent,
          headers: args.headers,
          schema,
          title: args.title,
          description: args.description,
          ownerId: agentId,
          parentAssetId: args.parentAssetId,
          creatorContext: args.creatorContext,
          inputReferences: args.inputReferences,
        });
        const url = `${FRONTEND_URL}/s/${asset.publicId}`;
        const resolvedSchema = (asset.metadata as any)?.schema ?? [];
        return {
          content: [{ type: 'text', text: JSON.stringify({ id: asset.publicId, url, title: asset.title, type: asset.type, schema: resolvedSchema, rowCount: (asset.metadata as any)?.rowCount ?? undefined }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'collection_append_rows',
    'Append one or more rows to a collection (max 1000 per call). Rows are key-value objects matching the collection schema. Unknown keys auto-expand the schema.',
    {
      publicId: z.string().describe('Collection asset UUID'),
      rowsJson: z.string().describe('JSON array of row data objects, e.g. [{"company":"Acme","signal":"API launch"}]'),
    },
    async (args) => {
      try {
        const rows = JSON.parse(args.rowsJson);
        if (!Array.isArray(rows)) {
          return { content: [{ type: 'text', text: 'Error: rowsJson must be a JSON array' }], isError: true };
        }
        const asset = await findOwnedCollection(args.publicId);
        const created = await services.collectionRowService.appendRows(
          asset,
          rows.map((data: Record<string, unknown>) => ({ data })),
          agentId,
        );
        return {
          content: [{ type: 'text', text: JSON.stringify({ ok: true, rowIds: created.map((r) => r.id), count: created.length }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'collection_get_rows',
    'Get rows from a collection with optional pagination, sorting, and filtering.',
    {
      publicId: z.string().describe('Collection asset UUID'),
      limit: z.number().optional().describe('Max rows to return (default 100, max 500)'),
      after: z.string().optional().describe('Cursor: row UUID to start after'),
      sortBy: z.string().optional().describe('Column name to sort by'),
      sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort direction (default: asc)'),
      filters: z.record(z.string(), z.string()).optional().describe('Equality filters as {column: value} object, e.g. {"ignored":"false"}'),
    },
    async (args) => {
      try {
        const asset = await services.assetService.findByPublicId(args.publicId);
        if (asset.type !== AssetType.COLLECTION) {
          throw new Error('Asset is not a collection');
        }
        const result = await services.collectionRowService.getRows(asset, {
          limit: args.limit,
          after: args.after,
          sortBy: args.sortBy,
          sortOrder: args.sortOrder,
          filters: args.filters,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify({
            schema: (asset.metadata as any)?.schema ?? [],
            rows: result.rows.map((r) => ({ id: r.id, data: r.data, createdBy: r.createdBy, createdAt: r.createdAt })),
            nextCursor: result.nextCursor,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'collection_update_row',
    'Update a single row in a collection (partial merge).',
    {
      publicId: z.string().describe('Collection asset UUID'),
      rowId: z.string().describe('Row UUID to update'),
      dataJson: z.string().describe('JSON object with fields to update, e.g. {"relevance":"low"}'),
    },
    async (args) => {
      try {
        const data = JSON.parse(args.dataJson);
        const asset = await findOwnedCollection(args.publicId);
        const row = await services.collectionRowService.updateRow(asset.id, args.rowId, data);
        return {
          content: [{ type: 'text', text: JSON.stringify({ ok: true, id: row.id, data: row.data, updatedAt: row.updatedAt }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'collection_delete_rows',
    'Delete one or more rows from a collection.',
    {
      publicId: z.string().describe('Collection asset UUID'),
      ids: z.array(z.string()).describe('Row UUIDs to delete'),
    },
    async (args) => {
      try {
        const asset = await findOwnedCollection(args.publicId);
        await services.collectionRowService.deleteRows(asset.id, args.ids);
        return {
          content: [{ type: 'text', text: JSON.stringify({ ok: true, deleted: args.ids.length }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
