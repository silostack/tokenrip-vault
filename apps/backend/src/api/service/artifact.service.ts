import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';
import { Artifact, ArtifactType } from '../../db/models/Artifact';
import { ArtifactRepository } from '../../db/repositories/artifact.repository';
import { STORAGE_SERVICE, StorageService } from '../../storage/storage.interface';

interface CreateFileDto {
  file: { buffer: Buffer; originalname: string; mimetype: string };
  title?: string;
  apiKeyId: string;
}

interface CreateContentDto {
  type: ArtifactType;
  content: string;
  title?: string;
  apiKeyId: string;
}

const CONTENT_MIME_TYPES: Record<string, string> = {
  [ArtifactType.MARKDOWN]: 'text/markdown',
  [ArtifactType.HTML]: 'text/html',
  [ArtifactType.CHART]: 'application/json',
};

@Injectable()
export class ArtifactService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Artifact) private readonly artifactRepository: ArtifactRepository,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  async createFromFile(dto: CreateFileDto): Promise<Artifact> {
    // Storage I/O outside transaction
    const storageKey = `${v4()}/${dto.file.originalname}`;
    await this.storage.save(storageKey, dto.file.buffer);

    // Tight transaction for DB writes
    return await this.em.transactional(async () => {
      const artifact = new Artifact(ArtifactType.FILE, storageKey, dto.apiKeyId);
      artifact.mimeType = dto.file.mimetype;
      artifact.title = dto.title || dto.file.originalname;

      this.artifactRepository.persistArtifact(artifact);
      return artifact;
    });
  }

  async createFromContent(dto: CreateContentDto): Promise<Artifact> {
    // Storage I/O outside transaction
    const storageKey = `${v4()}/content`;
    await this.storage.save(storageKey, Buffer.from(dto.content, 'utf-8'));

    // Tight transaction for DB writes
    return await this.em.transactional(async () => {
      const artifact = new Artifact(dto.type, storageKey, dto.apiKeyId);
      artifact.mimeType = CONTENT_MIME_TYPES[dto.type];
      artifact.title = dto.title;

      this.artifactRepository.persistArtifact(artifact);
      return artifact;
    });
  }

  async findById(id: string): Promise<Artifact> {
    const artifact = await this.artifactRepository.findOne({ id });
    if (!artifact) throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Artifact not found' });
    return artifact;
  }

  async getContent(id: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const artifact = await this.findById(id);
    const buffer = await this.storage.read(artifact.storageKey);
    return { buffer, mimeType: artifact.mimeType || 'application/octet-stream' };
  }
}
