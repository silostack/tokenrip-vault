import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { RefRepository } from '../repositories/ref.repository';

@Entity({ repository: () => RefRepository })
export class Ref {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  ownerType!: string;

  @Property({ type: 'uuid' })
  ownerId!: string;

  @Property()
  type!: string;

  @Property()
  targetId!: string;

  @Property({ type: 'int', nullable: true })
  version?: number;
}
