import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Ref } from '../../db/models/Ref';
import { RefRepository } from '../../db/models';

const FRONTEND_URL = (process.env.FRONTEND_URL as string).replace(/\/+$/, '');
const API_URL = (process.env.API_URL as string).replace(/\/+$/, '');
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

interface RefInput {
  type: string;
  target_id: string;
  version?: number;
}

export function serializeRef(r: Ref): { id: string; type: string; target_id: string; version?: number } {
  return { id: r.id, type: r.type, target_id: r.targetId, ...(r.version != null ? { version: r.version } : {}) };
}

@Injectable()
export class RefService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Ref) private readonly refRepo: RefRepository,
  ) {}

  private normalizeRef(ref: RefInput): RefInput {
    for (const base of [FRONTEND_URL, API_URL]) {
      if (ref.target_id.startsWith(base)) {
        const match = ref.target_id.match(UUID_RE);
        if (match) {
          return { ...ref, type: 'asset', target_id: match[0] };
        }
      }
    }
    return ref;
  }

  @Transactional()
  async addRefs(ownerType: string, ownerId: string, refs: RefInput[]): Promise<Ref[]> {
    const entities = refs.map((r) => {
      const normalized = this.normalizeRef(r);
      const ref = new Ref();
      ref.ownerType = ownerType;
      ref.ownerId = ownerId;
      ref.type = normalized.type;
      ref.targetId = normalized.target_id;
      if (normalized.version !== undefined) ref.version = normalized.version;
      return ref;
    });
    entities.forEach((e) => this.em.persist(e));
    return entities;
  }

  async findByOwner(ownerType: string, ownerId: string): Promise<Ref[]> {
    return this.refRepo.find({ ownerType, ownerId });
  }

  async findByTarget(type: string, targetId: string): Promise<Ref[]> {
    return this.refRepo.find({ type, targetId });
  }

  async findOneByTarget(ownerType: string, type: string, targetId: string): Promise<Ref | null> {
    return this.refRepo.findOne({ ownerType, type, targetId });
  }

  async exists(ownerType: string, ownerId: string, type: string, targetId: string): Promise<boolean> {
    const count = await this.refRepo.count({ ownerType, ownerId, type, targetId });
    return count > 0;
  }

  async findAllForThread(threadId: string): Promise<Ref[]> {
    const threadRefs = await this.refRepo.find({ ownerType: 'thread', ownerId: threadId });

    const messageIds = await this.refRepo.findMessageIdsForThread(threadId);

    let messageRefs: Ref[] = [];
    if (messageIds.length > 0) {
      messageRefs = await this.refRepo.find({ ownerType: 'message', ownerId: { $in: messageIds } });
    }

    // Dedupe by type + target_id, preferring thread-level refs
    const seen = new Set<string>();
    const result: Ref[] = [];
    for (const ref of [...threadRefs, ...messageRefs]) {
      const key = `${ref.type}:${ref.targetId}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(ref);
      }
    }
    return result;
  }

  async countThreadsByAssets(assetPublicIds: string[]): Promise<Map<string, number>> {
    if (!assetPublicIds.length) return new Map();
    const placeholders = assetPublicIds.map(() => '?').join(', ');
    const rows = await this.em.getConnection().execute<Array<{ target_id: string; thread_count: number }>>(
      `SELECT r.target_id, COUNT(DISTINCT r.owner_id)::int AS thread_count
       FROM ref r
       WHERE r.owner_type = 'thread' AND r.type = 'asset' AND r.target_id IN (${placeholders})
       GROUP BY r.target_id`,
      assetPublicIds,
    );
    return new Map(rows.map((r) => [r.target_id, r.thread_count]));
  }

  async removeRef(refId: string): Promise<void> {
    const ref = await this.refRepo.findOne({ id: refId });
    if (ref) {
      await this.em.removeAndFlush(ref);
    }
  }
}
