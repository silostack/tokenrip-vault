import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ThreadRepository } from '../repositories/thread.repository';

@Entity({ repository: () => ThreadRepository })
export class Thread {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'string' })
  createdBy!: string; // Agent.id (bech32)

  @Property({ type: 'json', nullable: true })
  resolution?: Record<string, unknown>;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(createdBy: string) {
    this.createdBy = createdBy;
  }
}
