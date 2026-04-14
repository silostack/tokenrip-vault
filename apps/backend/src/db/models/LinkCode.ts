import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { LinkCodeRepository } from '../repositories/link-code.repository';

@Entity({ repository: () => LinkCodeRepository })
export class LinkCode {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ index: true })
  code!: string;

  @Property()
  agentId!: string;

  @Property()
  expiresAt!: Date;

  @Property()
  used: boolean = false;

  @Property()
  createdAt: Date = new Date();

  constructor(code: string, agentId: string, expiresAt: Date) {
    this.code = code;
    this.agentId = agentId;
    this.expiresAt = expiresAt;
  }
}
