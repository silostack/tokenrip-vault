import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Asset } from './Asset';
import { AssetVersionRepository } from '../repositories/asset-version.repository';

@Entity({ repository: () => AssetVersionRepository })
@Unique({ properties: ['asset', 'version'] })
export class AssetVersion {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => Asset, { fieldName: 'asset_id', deleteRule: 'cascade' })
  asset: Asset;

  @Property({ type: 'int' })
  version: number;

  @Property({ nullable: true })
  label?: string;

  @Property()
  storageKey: string;

  @Property({ type: 'bigint', nullable: true })
  sizeBytes?: number;

  @Property({ nullable: true })
  mimeType?: string;

  @Property({ nullable: true, type: 'text' })
  creatorContext?: string;

  @Property()
  createdAt: Date = new Date();

  constructor(asset: Asset, version: number, storageKey: string) {
    this.asset = asset;
    this.version = version;
    this.storageKey = storageKey;
  }
}
