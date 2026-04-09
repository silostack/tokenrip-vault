import { Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Participant } from '../../db/models/Participant';
import { ParticipantRepository } from '../../db/models';
import { Thread } from '../../db/models/Thread';
import { Agent } from '../../db/models/Agent';
import { User } from '../../db/models/User';

@Injectable()
export class ParticipantService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Participant) private readonly participantRepo: ParticipantRepository,
  ) {}

  @Transactional()
  async addAgent(thread: Thread, agentId: string, addedByAgentId?: string): Promise<Participant> {
    if (addedByAgentId) {
      const adder = await this.findByThreadAndAgent(thread.id, addedByAgentId);
      if (!adder) {
        throw new ForbiddenException({
          ok: false,
          error: 'NOT_A_PARTICIPANT',
          message: 'Only participants can add other participants',
        });
      }
    }

    const existing = await this.findByThreadAndAgent(thread.id, agentId);
    if (existing) {
      throw new ConflictException({
        ok: false,
        error: 'ALREADY_PARTICIPANT',
        message: 'Agent is already a participant in this thread',
      });
    }

    const participant = new Participant();
    participant.thread = thread;
    participant.agent = this.em.getReference(Agent, agentId);
    this.em.persist(participant);
    return participant;
  }

  @Transactional()
  async addUser(thread: Thread, userId: string): Promise<Participant> {
    const existing = await this.findByThreadAndUser(thread.id, userId);
    if (existing) return existing;

    const participant = new Participant();
    participant.thread = thread;
    participant.user = this.em.getReference(User, userId);
    this.em.persist(participant);
    return participant;
  }

  @Transactional()
  async addAnonymous(thread: Thread): Promise<Participant> {
    const participant = new Participant();
    participant.thread = thread;
    this.em.persist(participant);
    return participant;
  }

  async findByThreadAndAgent(threadId: string, agentId: string): Promise<Participant | null> {
    return this.participantRepo.findOne({
      thread: { id: threadId },
      agent: { id: agentId },
    });
  }

  async findByThreadAndUser(threadId: string, userId: string): Promise<Participant | null> {
    return this.participantRepo.findOne({
      thread: { id: threadId },
      user: { id: userId },
    });
  }

  async listByThread(threadId: string): Promise<Participant[]> {
    return this.participantRepo.find(
      { thread: { id: threadId } },
      { populate: ['agent', 'user'] },
    );
  }

  async getOrCreateForAuth(
    thread: Thread,
    auth: { agent?: { id: string }; user?: { id: string } },
  ): Promise<Participant> {
    if (auth.agent) {
      const existing = await this.findByThreadAndAgent(thread.id, auth.agent.id);
      if (existing) return existing;
      return this.createAgentParticipant(thread, auth.agent.id);
    }
    if (auth.user) {
      return this.addUser(thread, auth.user.id);
    }
    return this.addAnonymous(thread);
  }

  @Transactional()
  async dismiss(threadId: string, auth: { agent?: { id: string }; user?: { id: string } }): Promise<void> {
    let participant: Participant | null = null;
    if (auth.agent) {
      participant = await this.findByThreadAndAgent(threadId, auth.agent.id);
    } else if (auth.user) {
      participant = await this.findByThreadAndUser(threadId, auth.user.id);
    }
    if (!participant) {
      throw new NotFoundException({
        ok: false,
        error: 'NOT_A_PARTICIPANT',
        message: 'Participant not found',
      });
    }
    participant.dismissedAt = new Date();
  }

  @Transactional()
  private async createAgentParticipant(thread: Thread, agentId: string): Promise<Participant> {
    const participant = new Participant();
    participant.thread = thread;
    participant.agent = this.em.getReference(Agent, agentId);
    this.em.persist(participant);
    return participant;
  }
}
