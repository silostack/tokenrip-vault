import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomBytes } from 'crypto';

@Entity()
export class User {
  @PrimaryKey({ type: 'string' })
  id: string = `u_${randomBytes(12).toString('hex')}`;

  @Property({ nullable: true, unique: true })
  alias?: string; // must NOT end with .ai

  @Property({ nullable: true })
  displayName?: string;

  @Property()
  registered: boolean = false;

  @Property()
  createdAt: Date = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;
}
