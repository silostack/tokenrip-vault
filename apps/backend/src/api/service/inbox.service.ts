import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Participant } from '../../db/models/Participant';
import { Asset } from '../../db/models/Asset';
import { Ref } from '../../db/models/Ref';
import { ParticipantRepository, type ThreadActivityRow, AssetRepository, type AssetUpdateRow, RefRepository } from '../../db/models';
import { TeamService } from './team.service';

interface InboxThread {
  thread_id: string;
  state: string;
  team_id: string | null;
  last_sequence: number | null;
  new_message_count: number;
  last_intent: string | null;
  last_body_preview: string | null;
  refs: Array<{ type: string; target_id: string; version?: number }>;
  updated_at: Date;
  owner_id: string;
  participants: Array<{ agent_id: string; alias: string | null }>;
  ref_count: number;
}

interface InboxAsset {
  asset_id: string;
  title: string | null;
  new_version_count: number;
  latest_version: number;
  updated_at: Date;
  description: string | null;
  thread_count: number;
  teams: Array<{ slug: string; name: string }>;
}

export interface InboxResult {
  threads: InboxThread[];
  assets: InboxAsset[];
  poll_after: number;
}

@Injectable()
export class InboxService {
  constructor(
    @InjectRepository(Participant) private readonly participantRepo: ParticipantRepository,
    @InjectRepository(Asset) private readonly assetRepo: AssetRepository,
    @InjectRepository(Ref) private readonly refRepo: RefRepository,
    private readonly teamService: TeamService,
  ) {}

  async getInbox(
    agentId: string,
    since: Date,
    opts?: { types?: string[]; limit?: number; q?: string; state?: string; type?: string; team?: string },
  ): Promise<InboxResult> {
    const types = opts?.types ?? ['threads', 'assets'];
    const limit = Math.min(opts?.limit ?? 50, 200);

    let teamId: string | undefined;
    let teamFilter: { threadTeamId?: string; assetTeamIds?: string[] } = {};

    if (opts?.team) {
      const team = await this.teamService.findBySlugOrId(opts.team);
      teamId = team.id;
      teamFilter = { threadTeamId: team.id, assetTeamIds: [team.id] };
    }

    const threadFilters: { state?: string; q?: string; teamId?: string } = {
      state: opts?.state,
      q: opts?.q,
    };

    // type filter: 'thread' skips assets, 'asset' skips threads
    const includeThreads = opts?.type !== 'asset' && types.includes('threads');
    const includeAssets = opts?.type !== 'thread' && types.includes('assets');

    const teamIds = teamId
      ? [teamId]
      : (includeAssets ? await this.teamService.getTeamIdsForAgent(agentId) : []);

    const threadRowsPromise = includeThreads
      ? this.participantRepo.findThreadActivityForAgent(agentId, since, limit, threadFilters)
      : Promise.resolve([] as ThreadActivityRow[]);

    const ownedAssetRowsPromise = includeAssets && !teamId
      ? this.assetRepo.findAssetUpdatesForOwner(agentId, since, limit, { q: opts?.q })
      : Promise.resolve([] as AssetUpdateRow[]);

    const teamAssetRowsPromise = includeAssets && teamIds.length > 0
      ? this.assetRepo.findTeamAssetUpdates(teamIds, since, limit)
      : Promise.resolve([] as AssetUpdateRow[]);

    const [threadRows, ownedAssetRows, teamAssetRows] = await Promise.all([
      threadRowsPromise,
      ownedAssetRowsPromise,
      teamAssetRowsPromise,
    ]);

    // Merge and deduplicate assets (owned + team-shared), owned takes priority
    const assetMap = new Map<string, AssetUpdateRow>();
    for (const row of ownedAssetRows) assetMap.set(row.asset_id, row);
    for (const row of teamAssetRows) {
      if (!assetMap.has(row.asset_id)) assetMap.set(row.asset_id, row);
    }

    // Filter threads by team if requested
    const filteredThreadRows = teamFilter.threadTeamId
      ? threadRows.filter((r) => r.team_id === teamFilter.threadTeamId)
      : threadRows;

    const mergedAssetRows = Array.from(assetMap.values())
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);

    const assetPublicIds = mergedAssetRows.map((r) => r.asset_id);
    const teamsForAssets = assetPublicIds.length > 0
      ? await this.teamService.getTeamsForAssets(assetPublicIds)
      : new Map<string, Array<{ slug: string; name: string }>>();

    return this.assembleResult(filteredThreadRows, mergedAssetRows, teamsForAssets);
  }

  async getOperatorInbox(
    agentId: string,
    userId: string,
    since: Date,
    opts?: { limit?: number; q?: string; state?: string; type?: string; team?: string },
  ): Promise<InboxResult> {
    const limit = Math.min(opts?.limit ?? 50, 200);
    const threadFilters = { state: opts?.state, q: opts?.q };

    let teamId: string | undefined;
    if (opts?.team) {
      const team = await this.teamService.findBySlugOrId(opts.team);
      teamId = team.id;
    }

    const includeThreads = opts?.type !== 'asset';
    const includeAssets = opts?.type !== 'thread';

    const teamIds = teamId
      ? [teamId]
      : (includeAssets ? await this.teamService.getTeamIdsForAgent(agentId) : []);

    const threadRowsPromise = includeThreads
      ? this.participantRepo.findUnifiedThreadActivity(agentId, userId, since, limit, threadFilters)
      : Promise.resolve([] as ThreadActivityRow[]);

    const ownedAssetRowsPromise = includeAssets && !teamId
      ? this.assetRepo.findAssetUpdatesForOwner(agentId, since, limit, { q: opts?.q })
      : Promise.resolve([] as AssetUpdateRow[]);

    const teamAssetRowsPromise = includeAssets && teamIds.length > 0
      ? this.assetRepo.findTeamAssetUpdates(teamIds, since, limit)
      : Promise.resolve([] as AssetUpdateRow[]);

    const [threadRows, ownedAssetRows, teamAssetRows] = await Promise.all([
      threadRowsPromise,
      ownedAssetRowsPromise,
      teamAssetRowsPromise,
    ]);

    const assetMap = new Map<string, AssetUpdateRow>();
    for (const row of ownedAssetRows) assetMap.set(row.asset_id, row);
    for (const row of teamAssetRows) {
      if (!assetMap.has(row.asset_id)) assetMap.set(row.asset_id, row);
    }
    const mergedAssetRows = Array.from(assetMap.values())
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);

    const filteredThreadRows = teamId
      ? threadRows.filter((r) => r.team_id === teamId)
      : threadRows;

    const assetPublicIds = mergedAssetRows.map((r) => r.asset_id);
    const teamsForAssets = assetPublicIds.length > 0
      ? await this.teamService.getTeamsForAssets(assetPublicIds)
      : new Map<string, Array<{ slug: string; name: string }>>();

    return this.assembleResult(filteredThreadRows, mergedAssetRows, teamsForAssets);
  }

  private async assembleResult(
    threadRows: ThreadActivityRow[],
    assetRows: AssetUpdateRow[],
    teamsForAssets: Map<string, Array<{ slug: string; name: string }>> = new Map(),
  ): Promise<InboxResult> {
    const refs = threadRows.length > 0
      ? await this.refRepo.find({ ownerType: 'thread', ownerId: { $in: threadRows.map((r) => r.thread_id) } })
      : [];

    const refsByThread = new Map<string, Array<{ type: string; target_id: string; version?: number }>>();
    for (const ref of refs) {
      const list = refsByThread.get(ref.ownerId) ?? [];
      list.push({ type: ref.type, target_id: ref.targetId, ...(ref.version != null ? { version: ref.version } : {}) });
      refsByThread.set(ref.ownerId, list);
    }

    const threads: InboxThread[] = threadRows.map((r) => ({
      thread_id: r.thread_id,
      state: r.state,
      team_id: r.team_id ?? null,
      last_sequence: r.last_sequence ?? null,
      new_message_count: r.new_message_count,
      last_intent: r.last_intent ?? null,
      last_body_preview: r.last_body_preview ?? null,
      refs: refsByThread.get(r.thread_id) ?? [],
      updated_at: r.updated_at,
      owner_id: r.owner_id,
      participants: r.participants ?? [],
      ref_count: r.ref_count ?? 0,
    }));

    const assets: InboxAsset[] = assetRows.map((r) => ({
      asset_id: r.asset_id,
      title: r.title ?? null,
      new_version_count: r.new_version_count,
      latest_version: r.latest_version,
      updated_at: r.updated_at,
      description: r.description ?? null,
      thread_count: r.thread_count ?? 0,
      teams: teamsForAssets.get(r.asset_id) ?? [],
    }));

    return { threads, assets, poll_after: 30 };
  }
}
