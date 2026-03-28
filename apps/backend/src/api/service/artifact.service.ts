import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';
import { Artifact } from '../../db/models/Artifact';
import { STORAGE_SERVICE, StorageService } from '../../storage/storage.interface';

interface CreateFileDto {
  file: { buffer: Buffer; originalname: string; mimetype: string };
  title?: string;
  apiKeyId: string;
}

interface CreateContentDto {
  type: 'markdown' | 'html' | 'chart';
  content: string;
  title?: string;
  apiKeyId: string;
}

const CONTENT_MIME_TYPES: Record<string, string> = {
  markdown: 'text/markdown',
  html: 'text/html',
  chart: 'application/json',
};

@Injectable()
export class ArtifactService {
  constructor(
    private readonly em: EntityManager,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  async createFromFile(dto: CreateFileDto): Promise<Artifact> {
    const storageKey = `${v4()}/${dto.file.originalname}`;
    await this.storage.save(storageKey, dto.file.buffer);

    const artifact = new Artifact();
    artifact.type = 'file';
    artifact.mimeType = dto.file.mimetype;
    artifact.storageKey = storageKey;
    artifact.title = dto.title || dto.file.originalname;
    artifact.apiKeyId = dto.apiKeyId;

    this.em.persist(artifact);
    await this.em.flush();
    return artifact;
  }

  async createFromContent(dto: CreateContentDto): Promise<Artifact> {
    const storageKey = `${v4()}/content`;
    await this.storage.save(storageKey, Buffer.from(dto.content, 'utf-8'));

    const artifact = new Artifact();
    artifact.type = dto.type;
    artifact.mimeType = CONTENT_MIME_TYPES[dto.type];
    artifact.storageKey = storageKey;
    artifact.title = dto.title;
    artifact.apiKeyId = dto.apiKeyId;

    this.em.persist(artifact);
    await this.em.flush();
    return artifact;
  }

  async findById(id: string): Promise<Artifact> {
    const artifact = await this.em.findOne(Artifact, { id });
    if (!artifact) throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Artifact not found' });
    return artifact;
  }

  async getContent(id: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const artifact = await this.findById(id);
    const buffer = await this.storage.read(artifact.storageKey);
    return { buffer, mimeType: artifact.mimeType || 'application/octet-stream' };
  }
}
