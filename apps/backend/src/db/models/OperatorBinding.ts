import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Agent } from './Agent';
import { User } from './User';

@Entity()
export class OperatorBinding {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => Agent, { fieldName: 'agent_id' })
  agent!: Agent;

  @ManyToOne(() => User, { fieldName: 'user_id' })
  user!: User;

  @Property()
  createdAt: Date = new Date();

  constructor(agent: Agent, user: User) {
    this.agent = agent;
    this.user = user;
  }
}
