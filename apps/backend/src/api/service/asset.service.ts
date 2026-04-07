import { Injectable, Inject, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4, validate as uuidValidate } from 'uuid';
import { Asset, AssetType } from '../../db/models/Asset';
import { AssetVersion } from '../../db/models/AssetVersion';
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
  ownerId: string;
}

interface CreateContentDto extends ProvenanceFields {
  type: AssetType;
  content: string;
  title?: string;
  ownerId: string;
}

const CONTENT_MIME_TYPES: Record<string, string> = {
  [AssetType.MARKDOWN]: 'text/markdown',
  [AssetType.HTML]: 'text/html',
  [AssetType.CHART]: 'application/json',
  [AssetType.CODE]: 'text/plain',
  [AssetType.TEXT]: 'text/plain',
  [AssetType.JSON]: 'application/json',
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
      const asset = new Asset(AssetType.FILE, storageKey, dto.ownerId);
      asset.mimeType = dto.file.mimetype;
      asset.title = dto.title || dto.file.originalname;
      asset.sizeBytes = dto.file.buffer.byteLength;
      if (dto.parentAssetId) asset.parentAssetId = dto.parentAssetId;
      if (dto.creatorContext) asset.creatorContext = dto.creatorContext;
      if (dto.inputReferences) asset.inputReferences = dto.inputReferences;

      const v1 = new AssetVersion(asset, 1, storageKey);
      v1.mimeType = dto.file.mimetype;
      v1.sizeBytes = dto.file.buffer.byteLength;
      if (dto.creatorContext) v1.creatorContext = dto.creatorContext;
      asset.currentVersionId = v1.id;
      asset.versionCount = 1;

      this.em.persist(asset);
      this.em.persist(v1);
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
      const asset = new Asset(dto.type, storageKey, dto.ownerId);
      asset.mimeType = CONTENT_MIME_TYPES[dto.type];
      asset.sizeBytes = Buffer.byteLength(dto.content, 'utf-8');
      asset.title = dto.title;
      if (dto.parentAssetId) asset.parentAssetId = dto.parentAssetId;
      if (dto.creatorContext) asset.creatorContext = dto.creatorContext;
      if (dto.inputReferences) asset.inputReferences = dto.inputReferences;

      const v1 = new AssetVersion(asset, 1, storageKey);
      v1.mimeType = CONTENT_MIME_TYPES[dto.type];
      v1.sizeBytes = Buffer.byteLength(dto.content, 'utf-8');
      if (dto.creatorContext) v1.creatorContext = dto.creatorContext;
      asset.currentVersionId = v1.id;
      asset.versionCount = 1;

      this.em.persist(asset);
      this.em.persist(v1);
      this.logger.debug(`Created ${dto.type} asset ${asset.id} (key=${storageKey})`);
      return asset;
    });
  }

  async findByPublicId(publicId: string): Promise<Asset> {
    this.logger.debug(`Looking up asset by publicId ${publicId}`);
    if (!uuidValidate(publicId)) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    const asset = await this.assetRepository.findOne({ publicId });
    if (!asset) {
      this.logger.debug(`Asset with publicId ${publicId} not found`);
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    return asset;
  }

  async findByOwner(
    ownerId: string,
    opts: { since?: Date; limit?: number; type?: string } = {},
  ): Promise<Asset[]> {
    const where: Record<string, unknown> = { ownerId };
    if (opts.since) where.updatedAt = { $gte: opts.since };
    if (opts.type) where.type = opts.type;
    const limit = Math.min(opts.limit ?? 100, 100);
    return this.assetRepository.find(where, { orderBy: { updatedAt: 'DESC' }, limit });
  }

  async getContent(publicId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const asset = await this.findByPublicId(publicId);
    this.logger.debug(`Reading content for asset publicId=${publicId} (key=${asset.storageKey})`);
    const buffer = await this.storage.read(asset.storageKey);
    return { buffer, mimeType: asset.mimeType || 'application/octet-stream' };
  }

  async getStats(ownerId: string): Promise<{
    assetCount: number;
    totalBytes: number;
    countsByType: Record<string, number>;
    bytesByType: Record<string, number>;
  }> {
    const rows = await this.em.getConnection().execute<
      Array<{ type: string; count: string; bytes: string }>
    >(
      `SELECT a.type, COUNT(DISTINCT a.id) AS count, COALESCE(SUM(av.size_bytes), 0) AS bytes
       FROM asset_version av
       JOIN asset a ON a.id = av.asset_id
       WHERE a.owner_id = ?
       GROUP BY a.type`,
      [ownerId],
    );

    let assetCount = 0;
    let totalBytes = 0;
    const countsByType: Record<string, number> = {};
    const bytesByType: Record<string, number> = {};

    for (const row of rows) {
      const count = Number(row.count);
      const bytes = Number(row.bytes) || 0;
      assetCount += count;
      totalBytes += bytes;
      countsByType[row.type] = count;
      if (bytes > 0) bytesByType[row.type] = bytes;
    }

    return { assetCount, totalBytes, countsByType, bytesByType };
  }

  async deleteAsset(publicId: string, ownerId: string): Promise<void> {
    const asset = await this.findByPublicId(publicId);
    if (asset.ownerId !== ownerId) {
      throw new ForbiddenException({ ok: false, error: 'FORBIDDEN', message: 'You can only delete your own assets' });
    }

    // Fetch version storage keys for cleanup
    const versionRows = await this.em.getConnection().execute<Array<{ storage_key: string }>>(
      `SELECT storage_key FROM asset_version WHERE asset_id = ?`,
      [asset.id],
    );
    this.logger.debug(`Deleting asset ${asset.id} (publicId=${publicId}) with ${versionRows.length} version(s)`);

    // DB delete first (CASCADE removes version rows), then storage cleanup
    await this.em.transactional(async () => {
      this.em.remove(asset);
    });

    // External I/O outside transaction — orphaned storage files are cleanable
    await Promise.all(versionRows.map((r) => this.storage.delete(r.storage_key)));
  }
}
