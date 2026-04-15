import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Participant } from '../../db/models/Participant';
import { Asset } from '../../db/models/Asset';
import { ParticipantRepository, AssetRepository } from '../../db/models';

export interface SearchFilters {
  q?: string;
  type?: 'thread' | 'asset';
  since?: Date;
  limit?: number;
  offset?: number;
  state?: 'open' | 'closed';
  intent?: string;
  ref?: string;
  asset_type?: string;
}

export interface SearchResult {
  type: 'thread' | 'asset';
  id: string;
  title: string | null;
  updated_at: Date;
  thread?: {
    state: string;
    last_intent: string | null;
    last_sequence: number | null;
    participant_count: number;
  };
  asset?: {
    asset_type: string;
    version_count: number;
    mime_type: string | null;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

/**
 * Parse `since` value: ISO 8601 string or integer (days back from now).
 */
export function parseSince(raw: string | undefined): Date | undefined {
  if (!raw) return undefined;
  const asInt = parseInt(raw, 10);
  if (!isNaN(asInt) && String(asInt) === raw) {
    return new Date(Date.now() - asInt * 86_400_000);
  }
  const d = new Date(raw);
  if (isNaN(d.getTime())) throw new Error('Invalid since value');
  return d;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Participant) private readonly participantRepo: ParticipantRepository,
    @InjectRepository(Asset) private readonly assetRepo: AssetRepository,
  ) {}

  /**
   * Search for an agent: threads where agent is participant, assets owned by agent.
   */
  async searchForAgent(agentId: string, filters: SearchFilters): Promise<SearchResponse> {
    const limit = Math.min(filters.limit ?? 50, 200);
    const offset = filters.offset ?? 0;

    const includeThreads = filters.type !== 'asset';
    const includeAssets = filters.type !== 'thread';

    const [threads, assets] = await Promise.all([
      includeThreads
        ? this.participantRepo.searchThreadsForAgent(agentId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
      includeAssets
        ? this.assetRepo.searchAssetsForOwner(agentId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
    ]);

    return this.mergeResults(threads, assets, limit, offset);
  }

  /**
   * Search for an operator: threads where agent OR user is participant, assets owned by agent.
   */
  async searchForOperator(
    agentId: string,
    userId: string,
    filters: SearchFilters,
  ): Promise<SearchResponse> {
    const limit = Math.min(filters.limit ?? 50, 200);
    const offset = filters.offset ?? 0;

    const includeThreads = filters.type !== 'asset';
    const includeAssets = filters.type !== 'thread';

    const [threads, assets] = await Promise.all([
      includeThreads
        ? this.participantRepo.searchThreadsUnified(agentId, userId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
      includeAssets
        ? this.assetRepo.searchAssetsForOwner(agentId, filters)
        : Promise.resolve({ rows: [], total: 0 }),
    ]);

    return this.mergeResults(threads, assets, limit, offset);
  }

  private mergeResults(
    threads: { rows: SearchResult[]; total: number },
    assets: { rows: SearchResult[]; total: number },
    limit: number,
    offset: number,
  ): SearchResponse {
    const all = [...threads.rows, ...assets.rows]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return {
      results: all.slice(offset, offset + limit),
      total: threads.total + assets.total,
    };
  }
}
