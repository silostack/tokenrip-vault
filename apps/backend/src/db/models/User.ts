import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomBytes } from 'crypto';
import { UserRepository } from '../repositories/user.repository';

@Entity({ repository: () => UserRepository })
export class User {
  @PrimaryKey({ type: 'string' })
  id: string = `u_${randomBytes(12).toString('hex')}`;

  @Property({ nullable: true, unique: true })
  alias?: string; // must NOT end with .ai

  @Property({ nullable: true })
  displayName?: string;

  @Property()
  registered: boolean = false;

  @Property({ nullable: true })
  sessionTokenHash?: string;

  @Property({ nullable: true })
  passwordHash?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;
}
