import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Thread } from './Thread';
import { Agent } from './Agent';
import { User } from './User';
import { ParticipantRepository } from '../repositories/participant.repository';

@Entity({ repository: () => ParticipantRepository })
export class Participant {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => Thread, { fieldName: 'thread_id' })
  thread!: Thread;

  @ManyToOne(() => Agent, { fieldName: 'agent_id', nullable: true })
  agent?: Agent;

  @ManyToOne(() => User, { fieldName: 'user_id', nullable: true })
  user?: User;

  @Property({ nullable: true })
  role?: string;

  @Property()
  joinedAt: Date = new Date();
}
