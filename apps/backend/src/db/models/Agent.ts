import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { AgentRepository } from '../repositories/agent.repository';

@Entity({ repository: () => AgentRepository })
export class Agent {
  @PrimaryKey({ type: 'string' })
  id!: string; // bech32-encoded public key (trip1...)

  @Property({ type: 'text' })
  publicKey!: string; // hex-encoded Ed25519 public key

  @Property({ nullable: true, unique: true })
  alias?: string; // .ai suffix auto-appended

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property()
  registeredAt: Date = new Date();

  constructor(id: string, publicKey: string) {
    this.id = id;
    this.publicKey = publicKey;
  }
}
