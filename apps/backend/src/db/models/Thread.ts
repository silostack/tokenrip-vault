import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ThreadRepository } from '../repositories/thread.repository';

export enum ThreadState {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity({ repository: () => ThreadRepository })
export class Thread {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'string' })
  createdBy!: string; // Agent.id (bech32)

  @Property({ type: 'string' })
  ownerId!: string; // Agent.id (bech32) — immutable after creation

  @Enum(() => ThreadState)
  state: ThreadState = ThreadState.OPEN;

  @Property({ type: 'json', nullable: true })
  resolution?: Record<string, unknown>;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property({ type: 'uuid', nullable: true })
  teamId?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(createdBy: string, ownerId?: string) {
    this.createdBy = createdBy;
    this.ownerId = ownerId ?? createdBy;
  }
}
