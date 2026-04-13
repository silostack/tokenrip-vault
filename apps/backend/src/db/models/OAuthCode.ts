import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { OAuthCodeRepository } from '../repositories/oauth-code.repository';

@Entity({ repository: () => OAuthCodeRepository })
export class OAuthCode {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  codeHash!: string;

  @Property()
  agentId!: string;

  /** PKCE code_challenge (S256) */
  @Property({ type: 'text' })
  codeChallenge!: string;

  @Property()
  redirectUri!: string;

  @Property()
  expiresAt!: Date;

  @Property()
  used: boolean = false;

  @Property()
  createdAt: Date = new Date();

  constructor(codeHash: string, agentId: string, codeChallenge: string, redirectUri: string, expiresAt: Date) {
    this.codeHash = codeHash;
    this.agentId = agentId;
    this.codeChallenge = codeChallenge;
    this.redirectUri = redirectUri;
    this.expiresAt = expiresAt;
  }
}
