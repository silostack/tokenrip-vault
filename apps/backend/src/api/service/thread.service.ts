import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Thread } from '../../db/models/Thread';
import { Participant } from '../../db/models/Participant';
import { ThreadRepository, ParticipantRepository } from '../../db/models';
import { RefService } from './ref.service';
import { RequestAuth } from '../auth/auth.guard';
import { parseCapSub } from '../auth/crypto';

@Injectable()
export class ThreadService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Thread) private readonly threadRepo: ThreadRepository,
    @InjectRepository(Participant) private readonly participantRepo: ParticipantRepository,
    private readonly refService: RefService,
  ) {}

  @Transactional()
  async create(agentId: string, opts?: { metadata?: Record<string, unknown> }): Promise<Thread> {
    const thread = new Thread(agentId);
    if (opts?.metadata) thread.metadata = opts.metadata;
    this.em.persist(thread);
    return thread;
  }

  async findById(threadId: string, auth: RequestAuth): Promise<Thread> {
    const thread = await this.threadRepo.findOne({ id: threadId });
    if (!thread) {
      throw new NotFoundException({
        ok: false,
        error: 'THREAD_NOT_FOUND',
        message: 'Thread not found',
      });
    }
    await this.verifyAccess(thread, auth);
    return thread;
  }

  @Transactional()
  async setResolution(threadId: string, resolution: Record<string, unknown>, auth: RequestAuth): Promise<Thread> {
    const thread = await this.findById(threadId, auth);
    if (thread.resolution) {
      throw new ConflictException({
        ok: false,
        error: 'ALREADY_RESOLVED',
        message: 'Thread already has a resolution',
      });
    }
    thread.resolution = resolution;
    return thread;
  }

  @Transactional()
  async findOrCreateAssetThread(assetPublicId: string, agentId: string): Promise<Thread> {
    const ref = await this.refService.findOneByTarget('thread', 'asset', assetPublicId);
    if (ref) {
      const thread = await this.threadRepo.findOne({ id: ref.ownerId });
      if (thread) return thread;
    }

    const thread = new Thread(agentId);
    this.em.persist(thread);
    await this.refService.addRefs('thread', thread.id, [{ type: 'asset', target_id: assetPublicId }]);
    return thread;
  }

  async findAssetThread(assetPublicId: string): Promise<Thread | null> {
    const ref = await this.refService.findOneByTarget('thread', 'asset', assetPublicId);
    if (!ref) return null;
    return this.threadRepo.findOne({ id: ref.ownerId });
  }

  async verifyAccess(thread: Thread, auth: RequestAuth): Promise<void> {
    if (auth.capability) {
      const cap = parseCapSub(auth.capability.sub);
      if (cap?.type === 'thread' && cap.id === thread.id) {
        // Thread-scoped token: verify issuer is a participant
        const participant = await this.participantRepo.findOne({
          thread: { id: thread.id },
          agent: { id: auth.capability.iss },
        });
        if (participant) return;
      }
      if (cap?.type === 'asset') {
        // Asset-scoped token: check thread is linked to that asset via Ref
        const refs = await this.refService.findByOwner('thread', thread.id);
        if (refs.some((r) => r.type === 'asset' && r.targetId === cap.id)) return;
      }
    }

    if (auth.agent) {
      const participant = await this.participantRepo.findOne({
        thread: { id: thread.id },
        agent: { id: auth.agent.id },
      });
      if (participant) return;
    }

    throw new ForbiddenException({
      ok: false,
      error: 'NOT_A_PARTICIPANT',
      message: 'You are not a participant in this thread',
    });
  }
}
