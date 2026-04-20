import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { TeamInviteRepository } from '../repositories/team-invite.repository';

@Entity({ repository: () => TeamInviteRepository })
export class TeamInvite {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'uuid' })
  teamId!: string;

  @Property({ type: 'text' })
  tokenHash!: string;

  @Property()
  invitedBy!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ nullable: true })
  acceptedAt?: Date;

  @Property({ nullable: true })
  acceptedBy?: string;

  constructor(teamId: string, tokenHash: string, invitedBy: string) {
    this.teamId = teamId;
    this.tokenHash = tokenHash;
    this.invitedBy = invitedBy;
  }
}
