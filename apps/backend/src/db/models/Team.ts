import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { TeamRepository } from '../repositories/team.repository';

@Entity({ repository: () => TeamRepository })
export class Team {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  slug!: string;

  @Property()
  name!: string;

  @Property()
  ownerId!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(slug: string, name: string, ownerId: string) {
    this.slug = slug;
    this.name = name;
    this.ownerId = ownerId;
  }
}
