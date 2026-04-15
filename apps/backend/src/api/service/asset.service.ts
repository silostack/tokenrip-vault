import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4, validate as uuidValidate } from 'uuid';
import { Asset, AssetType, AssetState } from '../../db/models/Asset';
import { AssetVersion } from '../../db/models/AssetVersion';
import { AssetRepository } from '../../db/repositories/asset.repository';
import { STORAGE_SERVICE, StorageService } from '../../storage/storage.interface';
import { RefService } from './ref.service';
import { ThreadService } from './thread.service';

interface ProvenanceFields {
  parentAssetId?: string;
  creatorContext?: string;
  inputReferences?: string[];
}

interface CreateFileDto extends ProvenanceFields {
  file: { buffer: Buffer; originalname: string; mimetype: string };
  title?: string;
  ownerId: string;
  alias?: string;
  metadata?: Record<string, unknown>;
}

interface CreateContentDto extends ProvenanceFields {
  type: AssetType;
  content: string;
  title?: string;
  ownerId: string;
  alias?: string;
  metadata?: Record<string, unknown>;
}

interface CreateCollectionDto extends ProvenanceFields {
  title?: string;
  description?: string;
  schema: Array<{
    name: string;
    type: 'text' | 'number' | 'date' | 'url' | 'enum';
    values?: string[];
  }>;
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
    private readonly refService: RefService,
    private readonly threadService: ThreadService,
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
      if (dto.alias) asset.alias = dto.alias;
      if (dto.metadata) asset.metadata = dto.metadata;
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
      if (dto.alias) asset.alias = dto.alias;
      if (dto.metadata) asset.metadata = dto.metadata;
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

  async createCollection(dto: CreateCollectionDto): Promise<Asset> {
    return await this.em.transactional(async () => {
      const schema = dto.schema.map((col, i) => ({ ...col, position: i }));
      const asset = new Asset(AssetType.COLLECTION, undefined, dto.ownerId);
      asset.title = dto.title;
      asset.description = dto.description;
      asset.metadata = { schema };
      asset.versionCount = 0;
      if (dto.parentAssetId) asset.parentAssetId = dto.parentAssetId;
      if (dto.creatorContext) asset.creatorContext = dto.creatorContext;
      if (dto.inputReferences) asset.inputReferences = dto.inputReferences;

      this.em.persist(asset);
      this.logger.debug(`Created collection asset ${asset.id}`);
      return asset;
    });
  }

  private throwIfDestroyed(asset: Asset): void {
    if (asset.state === AssetState.DESTROYED) {
      throw new HttpException({
        ok: false,
        error: 'ASSET_DESTROYED',
        message: 'This asset has been destroyed',
        data: {
          id: asset.publicId,
          title: asset.title ?? null,
          owner_id: asset.ownerId,
          destroyed_at: asset.destroyedAt,
        },
      }, HttpStatus.GONE);
    }
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
    this.throwIfDestroyed(asset);
    return asset;
  }

  async findByAlias(alias: string): Promise<Asset> {
    this.logger.debug(`Looking up asset by alias ${alias}`);
    const asset = await this.assetRepository.findOne({ alias });
    if (!asset) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    this.throwIfDestroyed(asset);
    return asset;
  }

  async findByIdentifier(identifier: string): Promise<Asset> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    return isUuid ? this.findByPublicId(identifier) : this.findByAlias(identifier);
  }

  async findByOwner(
    ownerId: string,
    opts: { since?: Date; limit?: number; type?: string } = {},
  ): Promise<Asset[]> {
    const where: Record<string, unknown> = { ownerId, state: { $ne: AssetState.DESTROYED } };
    if (opts.since) where.updatedAt = { $gte: opts.since };
    if (opts.type) where.type = opts.type;
    const limit = Math.min(opts.limit ?? 100, 100);
    return this.assetRepository.find(where, { orderBy: { updatedAt: 'DESC' }, limit });
  }

  async getContent(publicId: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const asset = await this.findByPublicId(publicId);
    if (asset.type === AssetType.COLLECTION) {
      throw new BadRequestException({
        ok: false,
        error: 'NO_CONTENT',
        message: 'Collections do not have file content. Use the rows endpoint instead.',
      });
    }
    this.logger.debug(`Reading content for asset publicId=${publicId} (key=${asset.storageKey})`);
    const buffer = await this.storage.read(asset.storageKey!);
    return { buffer, mimeType: asset.mimeType || 'application/octet-stream' };
  }

  async readContent(asset: Asset): Promise<Buffer> {
    this.logger.debug(`Reading content for asset ${asset.id} (key=${asset.storageKey})`);
    return this.storage.read(asset.storageKey);
  }

  async getStats(ownerId: string): Promise<{
    assetCount: number;
    totalBytes: number;
    countsByType: Record<string, number>;
    bytesByType: Record<string, number>;
  }> {
    // Raw SQL: MikroORM lacks native support for cross-table aggregation (JOIN + COUNT DISTINCT + SUM + GROUP BY).
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

  async queryAssets(filters: {
    metadata?: Record<string, unknown>;
    tag?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ assets: any[]; total: number }> {
    const conn = this.em.getConnection();

    const conditions: string[] = [`"state" = '${AssetState.PUBLISHED}'`];
    const params: any[] = [];

    if (filters.metadata) {
      conditions.push(`"metadata" @> ?::jsonb`);
      params.push(JSON.stringify(filters.metadata));
    }

    if (filters.tag) {
      conditions.push(`"metadata"->'tags' @> ?::jsonb`);
      params.push(JSON.stringify([filters.tag]));
    }

    const whereClause = conditions.join(' AND ');

    // Sort — whitelist: publish_date, created_at
    const sortField = (filters.sort || '').replace(/^-/, '');
    const sortDir = filters.sort?.startsWith('-') ? 'DESC' : 'ASC';
    const orderClause = sortField === 'publish_date'
      ? `("metadata"->>'publish_date')::timestamptz ${sortDir}`
      : `"created_at" DESC`;

    const limit = Math.min(filters.limit ?? 20, 100);
    const offset = filters.offset ?? 0;

    const [countRows, rows] = await Promise.all([
      conn.execute<[{ count: string }]>(
        `SELECT COUNT(*) as count FROM "asset" WHERE ${whereClause}`,
        params,
      ),
      conn.execute(
        `SELECT "public_id", "alias", "type", "state", "metadata", "title", "created_at", "updated_at"
         FROM "asset"
         WHERE ${whereClause}
         ORDER BY ${orderClause}
         LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
    ]);

    return { assets: rows, total: Number(countRows[0]?.count ?? 0) };
  }

  async updateAsset(
    publicId: string,
    ownerId: string,
    updates: { alias?: string; metadata?: Record<string, unknown> },
  ): Promise<Asset> {
    const asset = await this.findByPublicId(publicId);
    if (asset.ownerId !== ownerId) {
      throw new ForbiddenException({ ok: false, error: 'FORBIDDEN', message: 'You can only update your own assets' });
    }

    if (updates.alias !== undefined) {
      asset.alias = updates.alias || undefined;
    }
    if (updates.metadata !== undefined) {
      asset.metadata = updates.metadata;
    }

    await this.em.flush();
    return asset;
  }

  /**
   * Destroy an asset: delete storage, tombstone the row, cascade-close referencing threads.
   */
  async destroyAsset(publicId: string, ownerId: string): Promise<void> {
    const asset = await this.findByPublicId(publicId);
    if (asset.ownerId !== ownerId) {
      throw new ForbiddenException({ ok: false, error: 'FORBIDDEN', message: 'You can only destroy your own assets' });
    }

    const versions = await this.em.find(AssetVersion, { asset: { id: asset.id } }, { fields: ['storageKey'] });
    this.logger.debug(`Destroying asset ${asset.id} (publicId=${publicId}) with ${versions.length} version(s)`);

    // Tombstone before storage deletion — other agents see 410 immediately
    await this.em.transactional(async () => {
      asset.state = AssetState.DESTROYED;
      asset.destroyedAt = new Date();
      for (const v of versions) {
        this.em.remove(v);
      }
    });

    // Storage deletes and thread cascade are independent — run concurrently
    const storageDeletePromise = Promise.all(versions.map((v) => this.storage.delete(v.storageKey)));
    const refs = await this.refService.findByTarget('asset', asset.publicId);
    const threadIds = refs.filter((r) => r.ownerType === 'thread').map((r) => r.ownerId);
    if (threadIds.length) {
      await this.threadService.closeByIds(threadIds);
    }
    await storageDeletePromise;
  }
}
