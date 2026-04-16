import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4, validate as uuidValidate } from 'uuid';
import { Asset, AssetType, AssetState } from '../../db/models/Asset';
import { AssetVersion } from '../../db/models/AssetVersion';
import { AssetRepository } from '../../db/repositories/asset.repository';
import { AssetVersionRepository } from '../../db/repositories/asset-version.repository';
import { STORAGE_SERVICE, StorageService } from '../../storage/storage.interface';

const CONTENT_MIME_TYPES: Record<string, string> = {
  [AssetType.MARKDOWN]: 'text/markdown',
  [AssetType.HTML]: 'text/html',
  [AssetType.CHART]: 'application/json',
  [AssetType.CODE]: 'text/plain',
  [AssetType.TEXT]: 'text/plain',
  [AssetType.JSON]: 'application/json',
};

interface CreateVersionFromFileOpts {
  file: { buffer: Buffer; originalname: string; mimetype: string };
  label?: string;
  creatorContext?: string;
}

interface CreateVersionFromContentOpts {
  type: string;
  content: string;
  label?: string;
  creatorContext?: string;
}

@Injectable()
export class AssetVersionService {
  private readonly logger = new Logger(AssetVersionService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Asset) private readonly assetRepo: AssetRepository,
    @InjectRepository(AssetVersion) private readonly versionRepo: AssetVersionRepository,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  async createVersionForAsset(
    asset: Asset,
    opts: CreateVersionFromFileOpts | CreateVersionFromContentOpts,
  ): Promise<AssetVersion> {
    if ('file' in opts) {
      const storageKey = `${v4()}/${opts.file.originalname}`;
      return this.persistVersion(asset, storageKey, opts.file.buffer, opts.file.mimetype, opts);
    }
    const storageKey = `${v4()}/content`;
    const buffer = Buffer.from(opts.content, 'utf-8');
    const mimeType = CONTENT_MIME_TYPES[opts.type] || 'text/plain';
    return this.persistVersion(asset, storageKey, buffer, mimeType, opts);
  }

  private async persistVersion(
    asset: Asset,
    storageKey: string,
    buffer: Buffer,
    mimeType: string,
    opts: { label?: string; creatorContext?: string },
  ): Promise<AssetVersion> {
    await this.storage.save(storageKey, buffer);
    return this.em.transactional(async () => {
      const version = new AssetVersion(asset, asset.versionCount + 1, storageKey);
      version.mimeType = mimeType;
      version.sizeBytes = buffer.byteLength;
      if (opts.label) version.label = opts.label;
      if (opts.creatorContext) version.creatorContext = opts.creatorContext;

      asset.currentVersionId = version.id;
      asset.versionCount += 1;
      asset.storageKey = storageKey;
      asset.mimeType = mimeType;
      asset.sizeBytes = buffer.byteLength;

      this.em.persist(version);
      return version;
    });
  }

  async listVersions(publicId: string): Promise<AssetVersion[]> {
    if (!uuidValidate(publicId)) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    const asset = await this.assetRepo.findOne({ publicId });
    if (!asset) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    if (asset.state === AssetState.DESTROYED) {
      throw new HttpException({ ok: false, error: 'ASSET_DESTROYED', message: 'Asset has been deleted' }, HttpStatus.GONE);
    }
    return this.versionRepo.find(
      { asset: { id: asset.id } },
      { orderBy: { version: 'DESC' } },
    );
  }

  async findVersion(publicId: string, versionId: string): Promise<AssetVersion> {
    if (!uuidValidate(publicId) || !uuidValidate(versionId)) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Version not found' });
    }
    const asset = await this.assetRepo.findOne({ publicId });
    if (!asset) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Version not found' });
    }
    const version = await this.versionRepo.findOne({ id: versionId, asset: { id: asset.id } });
    if (!version) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Version not found' });
    }
    return version;
  }

  async getVersionContent(
    publicId: string,
    versionId: string,
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const version = await this.findVersion(publicId, versionId);
    const buffer = await this.storage.read(version.storageKey);
    return { buffer, mimeType: version.mimeType || 'application/octet-stream' };
  }

  async deleteVersion(publicId: string, versionId: string, ownerId: string): Promise<void> {
    const asset = await this.findOwnedAsset(publicId, ownerId);
    if (!uuidValidate(versionId)) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Version not found' });
    }
    const version = await this.versionRepo.findOne({ id: versionId, asset: { id: asset.id } });
    if (!version) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Version not found' });
    }

    if (asset.versionCount <= 1) {
      throw new BadRequestException({
        ok: false,
        error: 'LAST_VERSION',
        message: 'Cannot delete the last version. Delete the asset instead.',
      });
    }

    await this.storage.delete(version.storageKey);

    await this.em.transactional(async () => {
      asset.versionCount -= 1;

      if (asset.currentVersionId === versionId) {
        const latest = await this.versionRepo.findOne(
          { asset: { id: asset.id }, id: { $ne: versionId } },
          { orderBy: { version: 'DESC' } },
        );
        if (latest) {
          asset.currentVersionId = latest.id;
          asset.storageKey = latest.storageKey;
          asset.mimeType = latest.mimeType;
          asset.sizeBytes = latest.sizeBytes;
        }
      }

      this.em.remove(version);
    });
  }

  private async findOwnedAsset(publicId: string, ownerId: string): Promise<Asset> {
    if (!uuidValidate(publicId)) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    const asset = await this.assetRepo.findOne({ publicId });
    if (!asset) {
      throw new NotFoundException({ ok: false, error: 'NOT_FOUND', message: 'Asset not found' });
    }
    if (asset.ownerId !== ownerId) {
      throw new ForbiddenException({ ok: false, error: 'FORBIDDEN', message: 'You can only modify your own assets' });
    }
    return asset;
  }
}
