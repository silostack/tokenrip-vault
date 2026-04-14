import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Res,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EntityManager } from '@mikro-orm/postgresql';
import { Request, Response } from 'express';
import { Public } from '../auth/public.decorator';
import { Auth, AuthAgent, ReqAuth } from '../auth/auth.decorator';
import { RequestAuth } from '../auth/auth.guard';
import { AssetService } from '../service/asset.service';
import { AssetVersionService } from '../service/asset-version.service';
import { ThreadService } from '../service/thread.service';
import { ParticipantService } from '../service/participant.service';
import { MessageService } from '../service/message.service';
import { Asset, AssetType } from '../../db/models/Asset';
import { parseCapSub, parseAndVerifyCapabilityToken } from '../auth/crypto';
import { validateAlias } from '../validation/alias.validation';
import { AgentService } from '../service/agent.service';
import { ShareTokenService } from '../service/share-token.service';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || String(10 * 1024 * 1024), 10); // default 10MB
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3333').replace(/\/+$/, '');

@Controller('v0/assets')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly assetVersionService: AssetVersionService,
    private readonly threadService: ThreadService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
    private readonly agentService: AgentService,
    private readonly shareTokenService: ShareTokenService,
    private readonly em: EntityManager,
  ) {}

  @Post()
  @Auth('agent')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body?: { type?: string; content?: string; title?: string; mimeType?: string; alias?: string; metadata?: Record<string, unknown>; parentAssetId?: string; creatorContext?: string; inputReferences?: string[] },
    @AuthAgent() agent: { id: string },
  ) {
    if (body?.alias) {
      const aliasError = validateAlias(body.alias);
      if (aliasError) {
        throw new BadRequestException({ ok: false, error: 'INVALID_ALIAS', message: aliasError });
      }
    }

    if (file) {
      const asset = await this.assetService.createFromFile({
        file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
        title: body?.title,
        alias: body?.alias,
        metadata: body?.metadata,
        ownerId: agent.id,
        parentAssetId: body?.parentAssetId,
        creatorContext: body?.creatorContext,
        inputReferences: body?.inputReferences,
      });
      return { ok: true, data: this.assetCreatedResponse(asset) };
    }

    if (body?.content && body?.type) {
      if (!Object.values(AssetType).includes(body.type as AssetType) || body.type === AssetType.FILE) {
        throw new BadRequestException({ ok: false, error: 'INVALID_TYPE', message: 'type must be: markdown, html, chart, code, text, or json' });
      }
      const asset = await this.assetService.createFromContent({
        type: body.type as AssetType,
        content: body.content,
        title: body.title,
        alias: body.alias,
        metadata: body.metadata,
        ownerId: agent.id,
        parentAssetId: body.parentAssetId,
        creatorContext: body.creatorContext,
        inputReferences: body.inputReferences,
      });
      return { ok: true, data: this.assetCreatedResponse(asset) };
    }

    throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'Provide either a file upload or { type, content } JSON body' });
  }

  @Post('query')
  @Auth('agent')
  async queryAssets(
    @Body() body: {
      metadata?: Record<string, unknown>;
      tag?: string;
      sort?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const { assets, total } = await this.assetService.queryAssets({
      metadata: body.metadata,
      tag: body.tag,
      sort: body.sort,
      limit: body.limit,
      offset: body.offset,
    });

    return {
      ok: true,
      assets: assets.map((a: any) => ({
        publicId: a.public_id,
        alias: a.alias ?? null,
        type: a.type,
        state: a.state,
        title: a.title ?? null,
        metadata: a.metadata,
        createdAt: a.created_at,
        updatedAt: a.updated_at,
      })),
      pagination: {
        total,
        limit: Math.min(body.limit ?? 20, 100),
        offset: body.offset ?? 0,
      },
    };
  }

  @Patch(':publicId')
  @Auth('agent')
  async updateAsset(
    @Param('publicId') publicId: string,
    @Body() body: { alias?: string; metadata?: Record<string, unknown> },
    @AuthAgent() agent: { id: string },
  ) {
    if (body.alias !== undefined && body.alias !== null && body.alias !== '') {
      const aliasError = validateAlias(body.alias);
      if (aliasError) {
        throw new BadRequestException({ ok: false, error: 'INVALID_ALIAS', message: aliasError });
      }
    }

    const asset = await this.assetService.updateAsset(publicId, agent.id, {
      alias: body.alias,
      metadata: body.metadata,
    });

    return {
      ok: true,
      data: {
        id: asset.publicId,
        alias: asset.alias ?? null,
        metadata: asset.metadata,
        updatedAt: asset.updatedAt,
      },
    };
  }

  private verifyAssetAccess(asset: Asset, auth: RequestAuth, requiredPerm?: string): void {
    if (auth.capability) {
      const cap = parseCapSub(auth.capability.sub);
      if (!cap || cap.type !== 'asset' || cap.id !== asset.publicId) {
        throw new ForbiddenException({
          ok: false,
          error: 'TOKEN_MISMATCH',
          message: 'Capability token does not match this asset',
        });
      }
      if (auth.capability.iss !== asset.ownerId) {
        throw new ForbiddenException({
          ok: false,
          error: 'INVALID_ISSUER',
          message: 'Capability token was not issued by the asset owner',
        });
      }
      if (requiredPerm && !auth.capability.perm.includes(requiredPerm)) {
        throw new ForbiddenException({
          ok: false,
          error: 'INSUFFICIENT_PERMISSION',
          message: `Token does not grant '${requiredPerm}' permission`,
        });
      }
      return;
    }
    if (auth.agent) {
      if (auth.agent.id !== asset.ownerId) {
        throw new ForbiddenException({
          ok: false,
          error: 'ACCESS_DENIED',
          message: 'Only the asset owner or capability token holders can access this',
        });
      }
      return;
    }
    throw new ForbiddenException({
      ok: false,
      error: 'ACCESS_DENIED',
      message: 'Only the asset owner or capability token holders can access this',
    });
  }


  private assetCreatedResponse(asset: Asset) {
    return { id: asset.publicId, alias: asset.alias ?? null, url: `${FRONTEND_URL}/s/${asset.publicId}`, title: asset.title, type: asset.type, mimeType: asset.mimeType };
  }

  @Delete(':publicId')
  @Auth('agent')
  @HttpCode(204)
  async delete(@Param('publicId') publicId: string, @AuthAgent() agent: { id: string }) {
    await this.assetService.destroyAsset(publicId, agent.id);
  }

  @Get('status')
  @Auth('agent')
  async status(
    @AuthAgent() agent: { id: string },
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    const sinceDate = since ? new Date(since) : undefined;
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const assets = await this.assetService.findByOwner(agent.id, {
      since: sinceDate,
      limit: parsedLimit,
      type,
    });
    return {
      ok: true,
      data: assets.map((a) => ({
        id: a.publicId,
        title: a.title,
        type: a.type,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes ?? null,
        versionCount: a.versionCount,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  }

  @Get('stats')
  @Auth('agent')
  async stats(@AuthAgent() agent: { id: string }) {
    const stats = await this.assetService.getStats(agent.id);
    return { ok: true, data: stats };
  }

  @Auth('agent', 'token')
  @Post(':publicId/messages')
  async postAssetMessage(
    @Param('publicId') publicId: string,
    @Body() body: { body?: string; intent?: string; type?: string },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body?.body) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'body is required',
      });
    }

    const asset = await this.assetService.findByPublicId(publicId);
    this.verifyAssetAccess(asset, auth, 'comment');
    const thread = await this.threadService.findOrCreateAssetThread(asset.publicId, asset.ownerId, asset.ownerId);
    const participant = await this.participantService.getOrCreateForAuth(thread, auth);

    const message = await this.messageService.create(thread, participant, body.body, {
      intent: body.intent,
      type: body.type,
    });

    return {
      ok: true,
      data: {
        id: message.id,
        thread_id: thread.id,
        sequence: message.sequence,
        body: message.body,
        intent: message.intent ?? null,
        type: message.type ?? null,
        sender: {
          agent_id: auth.agent?.id ?? null,
          user_id: auth.user?.id ?? null,
        },
        created_at: message.createdAt,
      },
    };
  }

  @Auth('agent', 'token')
  @Get(':publicId/messages')
  async getAssetMessages(
    @Param('publicId') publicId: string,
    @Query('since_sequence') sinceSequence: string | undefined,
    @Query('limit') limit: string | undefined,
    @ReqAuth() auth: RequestAuth,
  ) {
    const asset = await this.assetService.findByPublicId(publicId);
    this.verifyAssetAccess(asset, auth, 'comment');

    const thread = await this.threadService.findAssetThread(asset.publicId);
    if (!thread) {
      return { ok: true, data: [] };
    }

    const messages = await this.messageService.list(thread.id, {
      sinceSequence: sinceSequence ? parseInt(sinceSequence, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return {
      ok: true,
      data: messages.map((m) => ({
        id: m.id,
        sequence: m.sequence,
        body: m.body,
        intent: m.intent ?? null,
        type: m.type ?? null,
        sender: {
          agent_id: m.participant?.agent?.id ?? null,
          user_id: m.participant?.user?.id ?? null,
        },
        created_at: m.createdAt,
      })),
    };
  }

  @Public()
  @Get(':publicId')
  async getMetadata(@Param('publicId') publicId: string, @Req() req: Request) {
    const asset = await this.assetService.findByIdentifier(publicId);

    let creator: { agentId: string; alias: string | null } | undefined;
    const rawToken = (req.query?.cap as string) || req.headers['x-capability'];
    if (rawToken && typeof rawToken === 'string') {
      const payload = rawToken.startsWith('st_')
        ? await this.shareTokenService.validate(rawToken)
        : parseAndVerifyCapabilityToken(rawToken);
      if (payload) {
        try {
          const ownerAgent = await this.agentService.findById(asset.ownerId);
          creator = { agentId: ownerAgent.id, alias: ownerAgent.alias ?? null };
        } catch {
          // Owner agent not found — omit creator
        }
      }
    }

    return {
      ok: true,
      data: {
        id: asset.publicId,
        alias: asset.alias ?? null,
        title: asset.title,
        description: asset.description,
        type: asset.type,
        mimeType: asset.mimeType,
        metadata: asset.metadata,
        parentAssetId: asset.parentAssetId,
        creatorContext: asset.creatorContext,
        inputReferences: asset.inputReferences,
        versionCount: asset.versionCount,
        currentVersionId: asset.currentVersionId,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
        creator,
      },
    };
  }

  @Public()
  @Get(':publicId/content')
  async getContent(@Param('publicId') publicId: string, @Res() res: Response) {
    const asset = await this.assetService.findByIdentifier(publicId);
    const buffer = await this.assetService.readContent(asset);
    res.set('Content-Type', asset.mimeType || 'application/octet-stream');
    res.send(buffer);
  }

  @Post(':publicId/versions')
  @Auth('agent', 'token')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  async createVersion(
    @Param('publicId') publicId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: { type?: string; content?: string; label?: string; creatorContext?: string } | undefined,
    @ReqAuth() auth: RequestAuth,
  ) {
    const asset = await this.assetService.findByPublicId(publicId);
    this.verifyAssetAccess(asset, auth, 'version:create');

    if (file) {
      const version = await this.assetVersionService.createVersionForAsset(asset, {
        file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
        label: body?.label,
        creatorContext: body?.creatorContext,
      });
      return { ok: true, data: { id: version.id, assetId: publicId, version: version.version, label: version.label, createdAt: version.createdAt } };
    }

    if (body?.content && body?.type) {
      const version = await this.assetVersionService.createVersionForAsset(asset, {
        type: body.type,
        content: body.content,
        label: body.label,
        creatorContext: body.creatorContext,
      });
      return { ok: true, data: { id: version.id, assetId: publicId, version: version.version, label: version.label, createdAt: version.createdAt } };
    }

    throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'Provide either a file upload or { type, content } JSON body' });
  }

  @Public()
  @Get(':publicId/versions')
  async listVersions(@Param('publicId') publicId: string) {
    const versions = await this.assetVersionService.listVersions(publicId);
    return {
      ok: true,
      data: versions.map((v) => ({
        id: v.id,
        version: v.version,
        label: v.label,
        mimeType: v.mimeType,
        sizeBytes: v.sizeBytes ?? null,
        creatorContext: v.creatorContext,
        createdAt: v.createdAt,
      })),
    };
  }

  @Public()
  @Get(':publicId/versions/:versionId/content')
  async getVersionContent(
    @Param('publicId') publicId: string,
    @Param('versionId') versionId: string,
    @Res() res: Response,
  ) {
    const { buffer, mimeType } = await this.assetVersionService.getVersionContent(publicId, versionId);
    res.set('Content-Type', mimeType);
    res.send(buffer);
  }

  @Public()
  @Get(':publicId/versions/:versionId')
  async getVersionMetadata(
    @Param('publicId') publicId: string,
    @Param('versionId') versionId: string,
  ) {
    const version = await this.assetVersionService.findVersion(publicId, versionId);
    return {
      ok: true,
      data: {
        id: version.id,
        version: version.version,
        label: version.label,
        mimeType: version.mimeType,
        sizeBytes: version.sizeBytes ?? null,
        creatorContext: version.creatorContext,
        createdAt: version.createdAt,
      },
    };
  }

  @Delete(':publicId/versions/:versionId')
  @Auth('agent')
  @HttpCode(204)
  async deleteVersion(
    @Param('publicId') publicId: string,
    @Param('versionId') versionId: string,
    @AuthAgent() agent: { id: string },
  ) {
    await this.assetVersionService.deleteVersion(publicId, versionId, agent.id);
  }
}
