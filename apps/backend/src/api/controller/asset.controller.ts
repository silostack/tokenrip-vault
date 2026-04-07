import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Res,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Public } from '../auth/public.decorator';
import { Auth, AuthAgent } from '../auth/auth.decorator';
import { AssetService } from '../service/asset.service';
import { AssetVersionService } from '../service/asset-version.service';
import { Asset, AssetType } from '../../db/models/Asset';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || String(10 * 1024 * 1024), 10); // default 10MB
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3333').replace(/\/+$/, '');

@Controller('v0/assets')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly assetVersionService: AssetVersionService,
  ) {}

  @Post()
  @Auth('agent')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body?: { type?: string; content?: string; title?: string; mimeType?: string; parentAssetId?: string; creatorContext?: string; inputReferences?: string[] },
    @AuthAgent() agent: { id: string },
  ) {
    if (file) {
      const asset = await this.assetService.createFromFile({
        file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
        title: body?.title,
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
        ownerId: agent.id,
        parentAssetId: body.parentAssetId,
        creatorContext: body.creatorContext,
        inputReferences: body.inputReferences,
      });
      return { ok: true, data: this.assetCreatedResponse(asset) };
    }

    throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'Provide either a file upload or { type, content } JSON body' });
  }

  private assetCreatedResponse(asset: Asset) {
    return { id: asset.publicId, url: `${FRONTEND_URL}/s/${asset.publicId}`, token: asset.token, title: asset.title, type: asset.type, mimeType: asset.mimeType };
  }

  @Delete(':publicId')
  @Auth('agent')
  @HttpCode(204)
  async delete(@Param('publicId') publicId: string, @AuthAgent() agent: { id: string }) {
    await this.assetService.deleteAsset(publicId, agent.id);
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

  @Public()
  @Get(':publicId')
  async getMetadata(@Param('publicId') publicId: string) {
    const asset = await this.assetService.findByPublicId(publicId);
    return {
      ok: true,
      data: {
        id: asset.publicId,
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
      },
    };
  }

  @Public()
  @Get(':publicId/content')
  async getContent(@Param('publicId') publicId: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.assetService.getContent(publicId);
    res.set('Content-Type', mimeType);
    res.send(buffer);
  }

  @Post(':publicId/versions')
  @Auth('agent')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  async createVersion(
    @Param('publicId') publicId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body?: { type?: string; content?: string; label?: string; creatorContext?: string },
    @AuthAgent() agent: { id: string },
  ) {
    if (file) {
      const version = await this.assetVersionService.createVersionFromFile(publicId, agent.id, {
        file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
        label: body?.label,
        creatorContext: body?.creatorContext,
      });
      return { ok: true, data: { id: version.id, assetId: publicId, version: version.version, label: version.label, createdAt: version.createdAt } };
    }

    if (body?.content && body?.type) {
      const version = await this.assetVersionService.createVersionFromContent(publicId, agent.id, {
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
