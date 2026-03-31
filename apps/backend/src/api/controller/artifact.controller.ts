import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Public } from '../auth/public.decorator';
import { ArtifactService } from '../service/artifact.service';
import { ArtifactType } from '../../db/models/Artifact';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES || String(10 * 1024 * 1024), 10); // default 10MB

@Controller('v0/artifacts')
export class ArtifactController {
  constructor(private readonly artifactService: ArtifactService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: { type?: string; content?: string; title?: string; mimeType?: string; parentArtifactId?: string; creatorContext?: string; inputReferences?: string[] },
    @Req() req: Request,
  ) {
    const apiKeyId = (req as any).apiKeyId;

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3333').replace(/\/+$/, '');

    if (file) {
      const artifact = await this.artifactService.createFromFile({
        file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
        title: body.title,
        apiKeyId,
        parentArtifactId: body.parentArtifactId,
        creatorContext: body.creatorContext,
        inputReferences: body.inputReferences,
      });
      return { ok: true, data: { id: artifact.id, url: `${frontendUrl}/s/${artifact.id}`, title: artifact.title, type: artifact.type, mimeType: artifact.mimeType } };
    }

    if (body.content && body.type) {
      if (!Object.values(ArtifactType).includes(body.type as ArtifactType) || body.type === ArtifactType.FILE) {
        throw new BadRequestException({ ok: false, error: 'INVALID_TYPE', message: 'type must be: markdown, html, chart, code, or text' });
      }
      const artifact = await this.artifactService.createFromContent({
        type: body.type as ArtifactType,
        content: body.content,
        title: body.title,
        apiKeyId,
        parentArtifactId: body.parentArtifactId,
        creatorContext: body.creatorContext,
        inputReferences: body.inputReferences,
      });
      return { ok: true, data: { id: artifact.id, url: `${frontendUrl}/s/${artifact.id}`, title: artifact.title, type: artifact.type, mimeType: artifact.mimeType } };
    }

    throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'Provide either a file upload or { type, content } JSON body' });
  }

  @Get('status')
  async status(@Req() req: Request, @Query('since') since?: string) {
    const apiKeyId = (req as any).apiKeyId;
    const sinceDate = since ? new Date(since) : undefined;
    const artifacts = await this.artifactService.findByApiKey(apiKeyId, sinceDate);
    return {
      ok: true,
      data: artifacts.map((a) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        mimeType: a.mimeType,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  }

  @Public()
  @Get(':uuid')
  async getMetadata(@Param('uuid') uuid: string) {
    const artifact = await this.artifactService.findById(uuid);
    return {
      ok: true,
      data: {
        id: artifact.id,
        title: artifact.title,
        description: artifact.description,
        type: artifact.type,
        mimeType: artifact.mimeType,
        metadata: artifact.metadata,
        parentArtifactId: artifact.parentArtifactId,
        creatorContext: artifact.creatorContext,
        inputReferences: artifact.inputReferences,
        createdAt: artifact.createdAt,
      },
    };
  }

  @Public()
  @Get(':uuid/content')
  async getContent(@Param('uuid') uuid: string, @Res() res: Response) {
    const { buffer, mimeType } = await this.artifactService.getContent(uuid);
    res.set('Content-Type', mimeType);
    res.send(buffer);
  }
}
