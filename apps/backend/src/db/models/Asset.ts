import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { AssetRepository } from '../repositories/asset.repository';

export enum AssetType {
  FILE = 'file',
  MARKDOWN = 'markdown',
  HTML = 'html',
  CHART = 'chart',
  CODE = 'code',
  TEXT = 'text',
  JSON = 'json',
}

export enum AssetState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DESTROYED = 'destroyed',
}

@Entity({ repository: () => AssetRepository })
export class Asset {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'uuid', unique: true })
  publicId: string = v4();

  @Property()
  ownerId: string; // Agent.id (bech32)

  @Enum(() => AssetState)
  state: AssetState = AssetState.PUBLISHED;

  @Property({ nullable: true })
  title?: string;

  @Property({ nullable: true, type: 'text' })
  description?: string;

  @Enum(() => AssetType)
  type: AssetType;

  @Property({ nullable: true })
  mimeType?: string;

  @Property()
  storageKey: string;

  @Property({ type: 'varchar', length: 128, nullable: true, unique: true })
  alias?: string;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property({ nullable: true, type: 'uuid' })
  parentAssetId?: string;

  @Property({ nullable: true, type: 'text' })
  creatorContext?: string;

  @Property({ type: 'json', nullable: true })
  inputReferences?: string[];

  @Property({ type: 'bigint', nullable: true })
  sizeBytes?: number;

  @Property({ type: 'uuid', nullable: true })
  currentVersionId?: string;

  @Property({ type: 'int', default: 1 })
  versionCount: number = 1;

  @Property({ nullable: true })
  destroyedAt?: Date;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(type: AssetType, storageKey: string, ownerId: string) {
    this.type = type;
    this.storageKey = storageKey;
    this.ownerId = ownerId;
  }
}
