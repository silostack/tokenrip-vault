import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Asset } from './Asset';
import { CollectionRowRepository } from '../repositories/collection-row.repository';

@Entity({ repository: () => CollectionRowRepository })
export class CollectionRow {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => Asset, { fieldName: 'asset_id', deleteRule: 'cascade' })
  asset: Asset;

  @Property({ type: 'json' })
  data: Record<string, unknown>;

  @Property()
  createdBy: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(asset: Asset, data: Record<string, unknown>, createdBy: string) {
    this.asset = asset;
    this.data = data;
    this.createdBy = createdBy;
  }
}
