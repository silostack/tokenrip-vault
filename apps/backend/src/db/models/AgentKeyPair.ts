import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Agent } from './Agent';
import { AgentKeyPairRepository } from '../repositories/agent-key-pair.repository';

@Entity({ repository: () => AgentKeyPairRepository })
export class AgentKeyPair {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @OneToOne(() => Agent, { fieldName: 'agent_id', unique: true })
  agent!: Agent;

  /** Hex-encoded Ed25519 secret key, encrypted at rest via application-level encryption */
  @Property({ type: 'text' })
  encryptedSecretKey!: string;

  @Property()
  createdAt: Date = new Date();

  constructor(agent: Agent, encryptedSecretKey: string) {
    this.agent = agent;
    this.encryptedSecretKey = encryptedSecretKey;
  }
}
