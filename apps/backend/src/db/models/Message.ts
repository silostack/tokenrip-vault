import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Thread } from './Thread';
import { Participant } from './Participant';
import { MessageRepository } from '../repositories/message.repository';

@Entity({ repository: () => MessageRepository })
export class Message {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => Thread, { fieldName: 'thread_id' })
  thread!: Thread;

  @ManyToOne(() => Participant, { fieldName: 'participant_id' })
  participant!: Participant;

  @Property({ type: 'text' })
  body!: string;

  @Property({ nullable: true })
  intent?: string;

  @Property({ nullable: true })
  type?: string;

  @Property({ type: 'json', nullable: true })
  data?: Record<string, unknown>;

  @Property({ type: 'uuid', nullable: true })
  inReplyTo?: string;

  @Property({ type: 'int' })
  sequence!: number;

  @Property()
  createdAt: Date = new Date();
}
