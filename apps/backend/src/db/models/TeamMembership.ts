import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { TeamMembershipRepository } from '../repositories/team-membership.repository';

@Entity({ repository: () => TeamMembershipRepository })
@Unique({ properties: ['teamId', 'agentId'] })
export class TeamMembership {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'uuid' })
  teamId!: string;

  @Property()
  agentId!: string;

  @Property()
  addedBy!: string;

  @Property()
  joinedAt: Date = new Date();

  constructor(teamId: string, agentId: string, addedBy: string) {
    this.teamId = teamId;
    this.agentId = agentId;
    this.addedBy = addedBy;
  }
}
