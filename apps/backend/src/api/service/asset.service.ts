import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';
import { Asset, AssetType } from '../../db/models/Asset';
import { AssetRepository } from '../../db/repositories/asset.repository';
import { STORAGE_SERVICE, StorageService } from '../../storage/storage.interface';

interface ProvenanceFields {
  parentAssetId?: string;
  creatorContext?: string;
  inputReferences?: string[];
}

interface CreateFileDto extends ProvenanceFields {
  file: { buffer: Buffer; originalname: string; mimetype: string };
  title?: string;
  apiKeyId: string;
}

interface CreateContentDto extends ProvenanceFields {
  type: AssetType;
  content: string;
  title?: string;
  apiKeyId: string;
}

const CONTENT_MIME_TYPES: Record<string, string> = {
  [AssetType.MARKDOWN]: 'text/markdown',
  [AssetType.HTML]: 'text/html',
  [AssetType.CHART]: 'application/json',
  [AssetType.CODE]: 'text/plain',
  [AssetType.TEXT]: 'text/plain',
};

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Asset) private readonly assetRepository: AssetRepository,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  /**
   * Transaction boundary: Creates asset record + stores file.
   * External I/O (file storage) outside transaction to avoid holding DB locks during slow I/O.
   * Tight transaction for DB write only.
   */
  async createFromFile(dto: CreateFileDto): Promise<Asset> {
    const storageKey = `${v4()}/${dto.file.originalname}`;
    this.logger.debug(`Saving file to storage: ${storageKey} (${dto.file.mimetype}, ${dto.file.buffer.length} bytes)`);
    // 1. External I/O - outside transaction
    await this.storage.save(storageKey, dto.file.buffer);

    // 2. Tight transaction for DB write only
    return await this.em.transactional(async () => {
      const asset = new Asset(AssetType.FILE, storageKey, dto.apiKeyId);
      asset.mimeType = dto.file.mimetype;
      asset.title = dto.title || dto.file.originalname;
      if (dto.parentAssetId) asset.parentAssetId = dto.parentAssetId;
      if (dto.creatorContext) asset.creatorContext = dto.creatorContext;
      if (dto.inputReferences) asset.inputReferences = dto.inputReferences;

      this.em.persist(asset);
      this.logger.debug(`Created file asset ${asset.id} (key=${storageKey})`);
      return asset;
    });
  }

  /**
   * Transaction boundary: Creates asset record + stores content.
   * External I/O (file storage) outside transaction to avoid holding DB locks during slow I/O.
   * Tight transaction for DB write only.
   */
  async createFromContent(dto: CreateContentDto): Promise<Asset> {
    const storageKey = `${v4()}/content`;
    this.logger.debug(`Saving ${dto.type} content to storage: ${storageKey} (${dto.content.length} chars)`);
    // 1. External I/O - outside transaction
    await this.storage.save(storageKey, Buffer.from(dto.content, 'utf-8'));

    // 2. Tight transaction for DB write only
    return await this.em.transactional(async () => {
      const asset = new Asset(dto.type, storageKey, dto.apiKeyId);
      asset.mimeType = CONTENT_MIME_TYPES[dto.type];
      asset.title = dto.title;
      if (dto.parentAssetId) asset.parentAssetId = dto.parentAssetId;
      if (dto.creatorContext) asset.creatorContext = dto.creatorContext;
      if (dto.inputReferences) asset.inputReferences = dto.inputReferences;

      this.em.persist(asset);
      this.logger.debug(`Created ${dto.type} asset ${asset.id} (key=${storageKey})`);
      return asset;
    });
  }

  async findById(id: string): Promise<Asset> {
    this.logger.debug(`Looking up asset ${id}`);
    const asset = await this.assetRepository.findOne({ id });
    if (!asset) {
      this.logger.debug(`Asset ${id} not found`);
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    return asset;
  }

  async findByApiKey(apiKeyId: string, since?: Date): Promise<Asset[]> {
    const where: Record<string, unknown> = { apiKeyId };
    if (since) where.updatedAt = { $gte: since };
    return this.assetRepository.find(where, { orderBy: { updatedAt: 'DESC' }, limit: 100 });
  }

  async getContent(id: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const asset = await this.findById(id);
    this.logger.debug(`Reading content for asset ${id} (key=${asset.storageKey})`);
    const buffer = await this.storage.read(asset.storageKey);
    return { buffer, mimeType: asset.mimeType || 'application/octet-stream' };
  }
}
