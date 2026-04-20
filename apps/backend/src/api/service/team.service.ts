import { Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Team } from '../../db/models/Team';
import { TeamMembership } from '../../db/models/TeamMembership';
import { TeamAsset } from '../../db/models/TeamAsset';
import { TeamInvite } from '../../db/models/TeamInvite';
import { TeamRepository } from '../../db/repositories/team.repository';
import { TeamMembershipRepository } from '../../db/repositories/team-membership.repository';
import { TeamAssetRepository } from '../../db/repositories/team-asset.repository';
import { TeamInviteRepository } from '../../db/repositories/team-invite.repository';
import { OperatorBindingService } from './operator-binding.service';
import { ParticipantService } from './participant.service';
import { AgentService } from './agent.service';
import { ThreadService } from './thread.service';
import { MessageService } from './message.service';
import { Thread, ThreadState } from '../../db/models/Thread';
import { Asset } from '../../db/models/Asset';
import { randomBytes, createHash } from 'crypto';

export function serializeTeam(team: Team, members: TeamMembership[], aliases: Map<string, string | null>) {
  return {
    id: team.id,
    slug: team.slug,
    name: team.name,
    owner_id: team.ownerId,
    description: team.description ?? null,
    member_count: members.length,
    members: members.map((m) => ({
      agent_id: m.agentId,
      alias: aliases.get(m.agentId) ?? null,
      joined_at: m.joinedAt,
    })),
    created_at: team.createdAt,
  };
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$|^[a-z0-9]{1,2}$/;

function validateSlug(slug: string): void {
  if (!SLUG_RE.test(slug) || slug.length < 2 || slug.length > 50) {
    throw new BadRequestException({
      ok: false,
      error: 'INVALID_SLUG',
      message: 'Slug must be 2-50 lowercase alphanumeric characters or hyphens, no leading/trailing hyphens',
    });
  }
}

@Injectable()
export class TeamService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Team) private readonly teamRepo: TeamRepository,
    @InjectRepository(TeamMembership) private readonly membershipRepo: TeamMembershipRepository,
    @InjectRepository(TeamAsset) private readonly teamAssetRepo: TeamAssetRepository,
    @InjectRepository(TeamInvite) private readonly inviteRepo: TeamInviteRepository,
    private readonly bindingService: OperatorBindingService,
    private readonly participantService: ParticipantService,
    private readonly agentService: AgentService,
    private readonly threadService: ThreadService,
    private readonly messageService: MessageService,
  ) {}

  // ─── Core CRUD ────────────────────────────────────────────────────────────

  @Transactional()
  async create(agentId: string, slug: string, name: string, description?: string): Promise<Team> {
    validateSlug(slug);

    const existing = await this.teamRepo.findOne({ slug });
    if (existing) {
      throw new ConflictException({
        ok: false,
        error: 'SLUG_TAKEN',
        message: `Team slug "${slug}" is already taken`,
      });
    }

    const team = new Team(slug, name, agentId);
    if (description) team.description = description;
    this.em.persist(team);

    await this.em.flush();

    const membership = new TeamMembership(team.id, agentId, agentId);
    this.em.persist(membership);

    return team;
  }

  async findBySlugOrId(slugOrId: string): Promise<Team> {
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const bySlug = await this.teamRepo.findOne({ slug: slugOrId });
    const team = bySlug ?? (UUID_RE.test(slugOrId) ? await this.teamRepo.findOne({ id: slugOrId }) : null);
    if (!team) {
      throw new NotFoundException({
        ok: false,
        error: 'TEAM_NOT_FOUND',
        message: `Team "${slugOrId}" not found`,
      });
    }
    return team;
  }

  async listForAgent(agentId: string): Promise<Array<{ team: Team; memberCount: number }>> {
    const memberships = await this.membershipRepo.find({ agentId });
    const teamIds = memberships.map((m) => m.teamId);
    if (teamIds.length === 0) return [];

    const [teams, counts] = await Promise.all([
      this.teamRepo.find({ id: { $in: teamIds } }, { orderBy: { createdAt: 'DESC' } }),
      this.membershipRepo.countByTeamIds(teamIds),
    ]);

    return teams.map((team) => ({ team, memberCount: counts.get(team.id) ?? 0 }));
  }

  async getDetails(teamId: string): Promise<{ team: Team; members: TeamMembership[]; aliases: Map<string, string | null> }> {
    const team = await this.teamRepo.findOne({ id: teamId });
    if (!team) {
      throw new NotFoundException({ ok: false, error: 'TEAM_NOT_FOUND', message: 'Team not found' });
    }

    const members = await this.membershipRepo.find({ teamId }, { orderBy: { joinedAt: 'ASC' } });
    const agentIds = members.map((m) => m.agentId);
    const agents = agentIds.length > 0 ? await this.agentService.findByIds(agentIds) : [];
    const aliases = new Map<string, string | null>();
    for (const a of agents) aliases.set(a.id, a.alias ?? null);

    return { team, members, aliases };
  }

  @Transactional()
  async delete(teamId: string, agentId: string): Promise<void> {
    const team = await this.teamRepo.findOne({ id: teamId });
    if (!team) {
      throw new NotFoundException({ ok: false, error: 'TEAM_NOT_FOUND', message: 'Team not found' });
    }
    if (team.ownerId !== agentId) {
      throw new ForbiddenException({ ok: false, error: 'NOT_OWNER', message: 'Only the team owner can delete the team' });
    }
    this.em.remove(team);
  }

  // ─── Membership ───────────────────────────────────────────────────────────

  @Transactional()
  async addMember(
    teamId: string,
    targetAgentId: string,
    requestingAgentId: string,
  ): Promise<{ added: boolean; invited: boolean }> {
    const isMember = await this.isMember(teamId, requestingAgentId);
    if (!isMember) {
      throw new ForbiddenException({ ok: false, error: 'NOT_A_MEMBER', message: 'You are not a member of this team' });
    }

    const alreadyMember = await this.isMember(teamId, targetAgentId);
    if (alreadyMember) {
      throw new ConflictException({ ok: false, error: 'ALREADY_MEMBER', message: 'Agent is already a member of this team' });
    }

    const sameOwner = await this.isSameOwner(requestingAgentId, targetAgentId);
    if (sameOwner) {
      await this.addMemberDirect(teamId, targetAgentId, requestingAgentId);
      return { added: true, invited: false };
    }

    const team = await this.teamRepo.findOneOrFail({ id: teamId });
    await this.sendInviteMessage(requestingAgentId, targetAgentId, team.slug, team.name);
    return { added: false, invited: true };
  }

  async sendInviteMessage(inviterAgentId: string, inviteeAgentId: string, teamSlug: string, teamName: string): Promise<void> {
    const thread = await this.threadService.create(inviterAgentId);
    const inviterParticipant = await this.participantService.addAgent(thread, inviterAgentId);
    await this.participantService.addAgent(thread, inviteeAgentId);
    await this.messageService.create(
      thread,
      inviterParticipant,
      `You've been invited to join team "${teamName}" (@${teamSlug}). Reply to accept or decline.`,
      { intent: 'team-invite', data: { team_slug: teamSlug, team_name: teamName } },
    );
  }

  @Transactional()
  async addMemberDirect(teamId: string, targetAgentId: string, addedBy: string): Promise<TeamMembership> {
    const membership = new TeamMembership(teamId, targetAgentId, addedBy);
    this.em.persist(membership);
    await this.em.flush();

    await this.addMemberToOpenTeamThreads(teamId, targetAgentId);

    return membership;
  }

  @Transactional()
  async removeMember(teamId: string, agentId: string, requestingAgentId: string): Promise<void> {
    const team = await this.teamRepo.findOne({ id: teamId });
    if (!team) {
      throw new NotFoundException({ ok: false, error: 'TEAM_NOT_FOUND', message: 'Team not found' });
    }

    const isOwner = team.ownerId === requestingAgentId;
    const isSelf = agentId === requestingAgentId;
    if (!isOwner && !isSelf) {
      throw new ForbiddenException({ ok: false, error: 'FORBIDDEN', message: 'Only the owner or the member themselves can remove a member' });
    }

    const membership = await this.membershipRepo.findOne({ teamId, agentId });
    if (!membership) {
      throw new NotFoundException({ ok: false, error: 'NOT_A_MEMBER', message: 'Agent is not a member of this team' });
    }
    this.em.remove(membership);
    await this.em.flush();

    if (team.ownerId === agentId) {
      const remaining = await this.membershipRepo.find({ teamId }, { orderBy: { joinedAt: 'ASC' } });
      if (remaining.length === 0) {
        this.em.remove(team);
      } else {
        team.ownerId = remaining[0].agentId;
      }
    }
  }

  async isMember(teamId: string, agentId: string): Promise<boolean> {
    const m = await this.membershipRepo.findOne({ teamId, agentId });
    return m !== null;
  }

  async getTeamIdsForAgent(agentId: string): Promise<string[]> {
    const memberships = await this.membershipRepo.find({ agentId });
    return memberships.map((m) => m.teamId);
  }

  private async isSameOwner(agentA: string, agentB: string): Promise<boolean> {
    const bindingA = await this.bindingService.findBoundUser(agentA);
    const bindingB = await this.bindingService.findBoundUser(agentB);
    if (!bindingA || !bindingB) return false;
    return bindingA.id === bindingB.id;
  }

  private async addMemberToOpenTeamThreads(teamId: string, agentId: string): Promise<void> {
    const openThreads = await this.em.find(Thread, { teamId, state: ThreadState.OPEN });
    for (const thread of openThreads) {
      const alreadyParticipant = await this.participantService.findByThreadAndAgent(thread.id, agentId);
      if (!alreadyParticipant) {
        await this.participantService.addAgent(thread, agentId);
      }
    }
  }

  // ─── Asset Sharing ────────────────────────────────────────────────────────

  @Transactional()
  async shareAsset(assetId: string, teamSlugs: string[], agentId: string): Promise<void> {
    const asset = await this.em.findOne(Asset, { id: assetId });
    if (!asset) {
      throw new NotFoundException({ ok: false, error: 'ASSET_NOT_FOUND', message: 'Asset not found' });
    }
    if (asset.ownerId !== agentId) {
      throw new ForbiddenException({ ok: false, error: 'NOT_OWNER', message: 'Only the asset owner can share it' });
    }

    for (const slug of teamSlugs) {
      const team = await this.findBySlugOrId(slug);
      const member = await this.isMember(team.id, agentId);
      if (!member) {
        throw new ForbiddenException({ ok: false, error: 'NOT_A_MEMBER', message: `You are not a member of team "${slug}"` });
      }

      const existing = await this.teamAssetRepo.findOne({ teamId: team.id, assetId });
      if (!existing) {
        const teamAsset = new TeamAsset(team.id, assetId, agentId);
        this.em.persist(teamAsset);
      }
    }
  }

  @Transactional()
  async unshareAsset(assetId: string, teamSlug: string, agentId: string): Promise<void> {
    const asset = await this.em.findOne(Asset, { id: assetId });
    if (!asset) {
      throw new NotFoundException({ ok: false, error: 'ASSET_NOT_FOUND', message: 'Asset not found' });
    }
    if (asset.ownerId !== agentId) {
      throw new ForbiddenException({ ok: false, error: 'NOT_OWNER', message: 'Only the asset owner can unshare it' });
    }

    const team = await this.findBySlugOrId(teamSlug);
    const teamAsset = await this.teamAssetRepo.findOne({ teamId: team.id, assetId });
    if (teamAsset) {
      this.em.remove(teamAsset);
    }
  }

  async isTeamAsset(assetId: string, agentId: string): Promise<boolean> {
    const teamIds = await this.getTeamIdsForAgent(agentId);
    if (teamIds.length === 0) return false;
    const ta = await this.teamAssetRepo.findOne({ assetId, teamId: { $in: teamIds } });
    return ta !== null;
  }

  async getTeamsForAsset(assetId: string): Promise<Array<{ slug: string; name: string }>> {
    const teamAssets = await this.teamAssetRepo.find({ assetId });
    if (teamAssets.length === 0) return [];
    const teamIds = teamAssets.map((ta) => ta.teamId);
    const teams = await this.teamRepo.find({ id: { $in: teamIds } });
    return teams.map((t) => ({ slug: t.slug, name: t.name }));
  }

  async getAssetIdsForTeam(teamId: string): Promise<string[]> {
    const records = await this.teamAssetRepo.find({ teamId });
    return records.map((r) => r.assetId);
  }

  async getTeamsForAssets(assetPublicIds: string[]): Promise<Map<string, Array<{ slug: string; name: string }>>> {
    if (assetPublicIds.length === 0) return new Map();
    const rows = await this.teamAssetRepo.findTeamsForAssetPublicIds(assetPublicIds);
    const result = new Map<string, Array<{ slug: string; name: string }>>();
    for (const row of rows) {
      const list = result.get(row.public_id) ?? [];
      list.push({ slug: row.slug, name: row.name });
      result.set(row.public_id, list);
    }
    return result;
  }

  // ─── Invite Links ─────────────────────────────────────────────────────────

  @Transactional()
  async createInviteLink(teamId: string, agentId: string): Promise<string> {
    const member = await this.isMember(teamId, agentId);
    if (!member) {
      throw new ForbiddenException({ ok: false, error: 'NOT_A_MEMBER', message: 'You are not a member of this team' });
    }

    const raw = randomBytes(32).toString('hex');
    const hash = createHash('sha256').update(raw).digest('hex');

    const invite = new TeamInvite(teamId, hash, agentId);
    invite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    this.em.persist(invite);

    return raw;
  }

  @Transactional()
  async acceptInviteByToken(rawToken: string, agentId: string): Promise<TeamMembership> {
    const hash = createHash('sha256').update(rawToken).digest('hex');
    const invite = await this.inviteRepo.findOne({ tokenHash: hash });

    if (!invite) {
      throw new NotFoundException({ ok: false, error: 'INVITE_NOT_FOUND', message: 'Invalid or expired invite token' });
    }
    if (invite.acceptedAt) {
      throw new ConflictException({ ok: false, error: 'ALREADY_ACCEPTED', message: 'This invite has already been used' });
    }
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new BadRequestException({ ok: false, error: 'INVITE_EXPIRED', message: 'This invite has expired' });
    }

    const alreadyMember = await this.isMember(invite.teamId, agentId);
    if (alreadyMember) {
      throw new ConflictException({ ok: false, error: 'ALREADY_MEMBER', message: 'You are already a member of this team' });
    }

    invite.acceptedAt = new Date();
    invite.acceptedBy = agentId;

    return this.addMemberDirect(invite.teamId, agentId, invite.invitedBy);
  }
}
