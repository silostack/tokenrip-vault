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
}

@Entity({ repository: () => AssetRepository })
export class Asset {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

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

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property()
  apiKeyId: string;

  @Property({ nullable: true, type: 'uuid' })
  parentAssetId?: string;

  @Property({ nullable: true, type: 'text' })
  creatorContext?: string;

  @Property({ type: 'json', nullable: true })
  inputReferences?: string[];

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(type: AssetType, storageKey: string, apiKeyId: string) {
    this.type = type;
    this.storageKey = storageKey;
    this.apiKeyId = apiKeyId;
  }
}
