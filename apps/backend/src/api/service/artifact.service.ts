import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';
import { Artifact, ArtifactType } from '../../db/models/Artifact';
import { ArtifactRepository } from '../../db/repositories/artifact.repository';
import { STORAGE_SERVICE, StorageService } from '../../storage/storage.interface';

interface ProvenanceFields {
  parentArtifactId?: string;
  creatorContext?: string;
  inputReferences?: string[];
}

interface CreateFileDto extends ProvenanceFields {
  file: { buffer: Buffer; originalname: string; mimetype: string };
  title?: string;
  apiKeyId: string;
}

interface CreateContentDto extends ProvenanceFields {
  type: ArtifactType;
  content: string;
  title?: string;
  apiKeyId: string;
}

const CONTENT_MIME_TYPES: Record<string, string> = {
  [ArtifactType.MARKDOWN]: 'text/markdown',
  [ArtifactType.HTML]: 'text/html',
  [ArtifactType.CHART]: 'application/json',
  [ArtifactType.CODE]: 'text/plain',
  [ArtifactType.TEXT]: 'text/plain',
};

@Injectable()
export class ArtifactService {
  private readonly logger = new Logger(ArtifactService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Artifact) private readonly artifactRepository: ArtifactRepository,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  async createFromFile(dto: CreateFileDto): Promise<Artifact> {
    const storageKey = `${v4()}/${dto.file.originalname}`;
    this.logger.debug(`Saving file to storage: ${storageKey} (${dto.file.mimetype}, ${dto.file.buffer.length} bytes)`);
    await this.storage.save(storageKey, dto.file.buffer);

    return await this.em.transactional(async () => {
      const artifact = new Artifact(ArtifactType.FILE, storageKey, dto.apiKeyId);
      artifact.mimeType = dto.file.mimetype;
      artifact.title = dto.title || dto.file.originalname;
      if (dto.parentArtifactId) artifact.parentArtifactId = dto.parentArtifactId;
      if (dto.creatorContext) artifact.creatorContext = dto.creatorContext;
      if (dto.inputReferences) artifact.inputReferences = dto.inputReferences;

      this.artifactRepository.persistArtifact(artifact);
      this.logger.debug(`Created file artifact ${artifact.id} (key=${storageKey})`);
      return artifact;
    });
  }

  async createFromContent(dto: CreateContentDto): Promise<Artifact> {
    const storageKey = `${v4()}/content`;
    this.logger.debug(`Saving ${dto.type} content to storage: ${storageKey} (${dto.content.length} chars)`);
    await this.storage.save(storageKey, Buffer.from(dto.content, 'utf-8'));

    return await this.em.transactional(async () => {
      const artifact = new Artifact(dto.type, storageKey, dto.apiKeyId);
      artifact.mimeType = CONTENT_MIME_TYPES[dto.type];
      artifact.title = dto.title;
      if (dto.parentArtifactId) artifact.parentArtifactId = dto.parentArtifactId;
      if (dto.creatorContext) artifact.creatorContext = dto.creatorContext;
      if (dto.inputReferences) artifact.inputReferences = dto.inputReferences;

      this.artifactRepository.persistArtifact(artifact);
      this.logger.debug(`Created ${dto.type} artifact ${artifact.id} (key=${storageKey})`);
      return artifact;
    });
  }

  async findById(id: string): Promise<Artifact> {
    this.logger.debug(`Looking up artifact ${id}`);
    const artifact = await this.artifactRepository.findOne({ id });
    if (!artifact) {
      this.logger.debug(`Artifact ${id} not found`);
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Artifact not found' });
    }
    return artifact;
  }

  async findByApiKey(apiKeyId: string, since?: Date): Promise<Artifact[]> {
    const where: Record<string, unknown> = { apiKeyId };
    if (since) where.updatedAt = { $gte: since };
    return this.artifactRepository.find(where, { orderBy: { updatedAt: 'DESC' }, limit: 100 });
  }

  async getContent(id: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const artifact = await this.findById(id);
    this.logger.debug(`Reading content for artifact ${id} (key=${artifact.storageKey})`);
    const buffer = await this.storage.read(artifact.storageKey);
    return { buffer, mimeType: artifact.mimeType || 'application/octet-stream' };
  }
}
