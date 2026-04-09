import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ShareTokenRepository } from '../repositories/share-token.repository';

@Entity({ repository: () => ShareTokenRepository })
export class ShareToken {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  /** sha256(raw token) — used for lookup */
  @Property({ type: 'text' })
  tokenHash!: string;

  /** Asset public ID this token grants access to */
  @Property()
  assetPublicId!: string;

  /** Agent ID that owns the asset */
  @Property()
  agentId!: string;

  /** User ID that created this token */
  @Property()
  issuedBy!: string;

  /** Permissions granted: ['comment', 'version:create'] */
  @Property({ type: 'json' })
  perm: string[] = ['comment', 'version:create'];

  @Property({ nullable: true })
  label?: string;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ nullable: true })
  revokedAt?: Date;

  @Property()
  createdAt: Date = new Date();
}
