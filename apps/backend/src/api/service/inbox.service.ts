import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Participant } from '../../db/models/Participant';
import { Asset } from '../../db/models/Asset';
import { Ref } from '../../db/models/Ref';
import { ParticipantRepository, type ThreadActivityRow, AssetRepository, type AssetUpdateRow, RefRepository } from '../../db/models';

interface InboxThread {
  thread_id: string;
  state: string;
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
  ) {}

  async getInbox(
    agentId: string,
    since: Date,
    opts?: { types?: string[]; limit?: number; q?: string; state?: string; type?: string },
  ): Promise<InboxResult> {
    const types = opts?.types ?? ['threads', 'assets'];
    const limit = Math.min(opts?.limit ?? 50, 200);
    const threadFilters = { state: opts?.state, q: opts?.q };

    // type filter: 'thread' skips assets, 'asset' skips threads
    const includeThreads = opts?.type !== 'asset' && types.includes('threads');
    const includeAssets = opts?.type !== 'thread' && types.includes('assets');

    const threadRowsPromise = includeThreads
      ? this.participantRepo.findThreadActivityForAgent(agentId, since, limit, threadFilters)
      : Promise.resolve([] as ThreadActivityRow[]);

    const assetRowsPromise = includeAssets
      ? this.assetRepo.findAssetUpdatesForOwner(agentId, since, limit, { q: opts?.q })
      : Promise.resolve([] as AssetUpdateRow[]);

    return this.assembleResult(threadRowsPromise, assetRowsPromise);
  }

  async getOperatorInbox(
    agentId: string,
    userId: string,
    since: Date,
    opts?: { limit?: number; q?: string; state?: string; type?: string },
  ): Promise<InboxResult> {
    const limit = Math.min(opts?.limit ?? 50, 200);
    const threadFilters = { state: opts?.state, q: opts?.q };

    const includeThreads = opts?.type !== 'asset';
    const includeAssets = opts?.type !== 'thread';

    const threadRowsPromise = includeThreads
      ? this.participantRepo.findUnifiedThreadActivity(agentId, userId, since, limit, threadFilters)
      : Promise.resolve([] as ThreadActivityRow[]);

    const assetRowsPromise = includeAssets
      ? this.assetRepo.findAssetUpdatesForOwner(agentId, since, limit, { q: opts?.q })
      : Promise.resolve([] as AssetUpdateRow[]);

    return this.assembleResult(threadRowsPromise, assetRowsPromise);
  }

  private async assembleResult(
    threadRowsPromise: Promise<ThreadActivityRow[]>,
    assetRowsPromise: Promise<AssetUpdateRow[]>,
  ): Promise<InboxResult> {
    const threadRows = await threadRowsPromise;

    const [assetRows, refs] = await Promise.all([
      assetRowsPromise,
      threadRows.length > 0
        ? this.refRepo.find({ ownerType: 'thread', ownerId: { $in: threadRows.map((r) => r.thread_id) } })
        : Promise.resolve([] as Ref[]),
    ]);

    const refsByThread = new Map<string, Array<{ type: string; target_id: string; version?: number }>>();
    for (const ref of refs) {
      const list = refsByThread.get(ref.ownerId) ?? [];
      list.push({ type: ref.type, target_id: ref.targetId, ...(ref.version != null ? { version: ref.version } : {}) });
      refsByThread.set(ref.ownerId, list);
    }

    const threads: InboxThread[] = threadRows.map((r) => ({
      thread_id: r.thread_id,
      state: r.state,
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
    }));

    return { threads, assets, poll_after: 30 };
  }
}
