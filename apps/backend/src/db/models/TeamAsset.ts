import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { TeamAssetRepository } from '../repositories/team-asset.repository';

@Entity({ repository: () => TeamAssetRepository })
@Unique({ properties: ['teamId', 'assetId'] })
export class TeamAsset {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'uuid' })
  teamId!: string;

  @Property({ type: 'uuid' })
  assetId!: string;

  @Property()
  sharedBy!: string;

  @Property()
  sharedAt: Date = new Date();

  constructor(teamId: string, assetId: string, sharedBy: string) {
    this.teamId = teamId;
    this.assetId = assetId;
    this.sharedBy = sharedBy;
  }
}
