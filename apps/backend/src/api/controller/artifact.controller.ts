import {
  Controller,
  Get,
  Post,
  Param,
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

@Controller('api/artifacts')
export class ArtifactController {
  constructor(private readonly artifactService: ArtifactService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: { type?: string; content?: string; title?: string; mimeType?: string },
    @Req() req: Request,
  ) {
    const apiKeyId = (req as any).apiKeyId;

    if (file) {
      const artifact = await this.artifactService.createFromFile({
        file: { buffer: file.buffer, originalname: file.originalname, mimetype: file.mimetype },
        title: body.title,
        apiKeyId,
      });
      return { ok: true, data: { id: artifact.id, title: artifact.title, type: artifact.type, mimeType: artifact.mimeType } };
    }

    if (body.content && body.type) {
      if (!['markdown', 'html', 'chart'].includes(body.type)) {
        throw new BadRequestException({ ok: false, error: 'INVALID_TYPE', message: 'type must be: markdown, html, or chart' });
      }
      const artifact = await this.artifactService.createFromContent({
        type: body.type as 'markdown' | 'html' | 'chart',
        content: body.content,
        title: body.title,
        apiKeyId,
      });
      return { ok: true, data: { id: artifact.id, title: artifact.title, type: artifact.type, mimeType: artifact.mimeType } };
    }

    throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'Provide either a file upload or { type, content } JSON body' });
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
