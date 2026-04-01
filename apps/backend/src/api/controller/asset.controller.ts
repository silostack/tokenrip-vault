import {
  Controller,
  Get,
  Post,
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Public } from '../auth/public.decorator';
import { AssetService } from '../service/asset.service';
import { AssetType } from '../../db/models/Asset';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || String(10 * 1024 * 1024), 10); // default 10MB

@Controller('v0/assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body?: { type?: string; content?: string; title?: string; mimeType?: string; parentAssetId?: string; creatorContext?: string; inputReferences?: string[] },
    @Req() req?: Request,
  ) {
    const apiKeyId = (req as any)?.apiKeyId;

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3333').replace(/\/+$/, '');

    // Handle file upload with optional metadata
    if (file) {
      const asset = await this.assetService.createFromFile({
        file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
        title: body?.title,
        apiKeyId,
        parentAssetId: body?.parentAssetId,
        creatorContext: body?.creatorContext,
        inputReferences: body?.inputReferences,
      });
      return { ok: true, data: { id: asset.id, url: `${frontendUrl}/s/${asset.id}`, title: asset.title, type: asset.type, mimeType: asset.mimeType } };
    }

    // Handle JSON content publishing
    if (body?.content && body?.type) {
      if (!Object.values(AssetType).includes(body.type as AssetType) || body.type === AssetType.FILE) {
        throw new BadRequestException({ ok: false, error: 'INVALID_TYPE', message: 'type must be: markdown, html, chart, code, or text' });
      }
      const asset = await this.assetService.createFromContent({
        type: body.type as AssetType,
        content: body.content,
        title: body.title,
        apiKeyId,
        parentAssetId: body.parentAssetId,
        creatorContext: body.creatorContext,
        inputReferences: body.inputReferences,
      });
      return { ok: true, data: { id: asset.id, url: `${frontendUrl}/s/${asset.id}`, title: asset.title, type: asset.type, mimeType: asset.mimeType } };
    }

    throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'Provide either a file upload or { type, content } JSON body' });
  }

  @Delete(':uuid')
  @HttpCode(204)
  async delete(@Param('uuid') uuid: string, @Req() req: Request) {
    const apiKeyId = (req as any).apiKeyId;
    await this.assetService.deleteAsset(uuid, apiKeyId);
  }

  @Get('status')
  async status(
    @Req() req: Request,
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    const apiKeyId = (req as any).apiKeyId;
    const sinceDate = since ? new Date(since) : undefined;
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const assets = await this.assetService.findByApiKey(apiKeyId, {
      since: sinceDate,
      limit: parsedLimit,
      type,
    });
    return {
      ok: true,
      data: assets.map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes ?? null,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  }

  @Get('stats')
  async stats(@Req() req: Request) {
    const apiKeyId = (req as any).apiKeyId;
    const stats = await this.assetService.getStats(apiKeyId);
    return { ok: true, data: stats };
  }

  @Public()
  @Get(':uuid')
  async getMetadata(@Param('uuid') uuid: string) {
    const asset = await this.assetService.findById(uuid);
    return {
      ok: true,
      data: {
        id: asset.id,
        title: asset.title,
        description: asset.description,
        type: asset.type,
        mimeType: asset.mimeType,
        metadata: asset.metadata,
        parentAssetId: asset.parentAssetId,
        creatorContext: asset.creatorContext,
        inputReferences: asset.inputReferences,
        createdAt: asset.createdAt,
      },
    };
  }

  @Public()
  @Get(':uuid/content')
  async getContent(@Param('uuid') uuid: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.assetService.getContent(uuid);
    res.set('Content-Type', mimeType);
    res.send(buffer);
  }
}
