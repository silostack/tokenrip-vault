import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Agent } from './Agent';
import { ApiKeyRepository } from '../repositories/api-key.repository';

@Entity({ repository: () => ApiKeyRepository })
export class ApiKey {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  keyHash!: string;

  @Property()
  name!: string;

  @ManyToOne(() => Agent, { fieldName: 'agent_id' })
  agent!: Agent;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  lastUsedAt?: Date;

  @Property({ nullable: true })
  revokedAt?: Date;

  constructor(keyHash: string, name: string, agent: Agent) {
    this.keyHash = keyHash;
    this.name = name;
    this.agent = agent;
  }
}
