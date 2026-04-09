import { Injectable, ForbiddenException } from '@nestjs/common';
import { EntityManager, LockMode } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Message } from '../../db/models/Message';
import { MessageRepository } from '../../db/models';
import { Thread, ThreadState } from '../../db/models/Thread';
import { Participant } from '../../db/models/Participant';

interface CreateMessageOpts {
  intent?: string;
  type?: string;
  data?: Record<string, unknown>;
  inReplyTo?: string;
}

@Injectable()
export class MessageService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Message) private readonly messageRepo: MessageRepository,
  ) {}

  async create(
    thread: Thread,
    participant: Participant,
    body: string,
    opts?: CreateMessageOpts,
  ): Promise<Message> {
    return this.em.transactional(async (em) => {
      const lockedThread = await em.findOneOrFail(Thread, { id: thread.id }, { lockMode: LockMode.PESSIMISTIC_WRITE });

      if (lockedThread.state === ThreadState.CLOSED) {
        throw new ForbiddenException({
          ok: false,
          error: 'THREAD_CLOSED',
          message: 'This thread is closed and no longer accepts messages',
        });
      }

      // Raw SQL: aggregate MAX() inside a pessimistic lock transaction — MikroORM's QB
      // doesn't reliably support aggregates within transactional forked EMs.
      const rows = await em.getConnection().execute<Array<{ max_seq: string | null }>>(
        `SELECT MAX(sequence) as max_seq FROM message WHERE thread_id = ?`,
        [thread.id],
      );
      const sequence = (parseInt(rows[0]?.max_seq || '0', 10)) + 1;

      const message = new Message();
      message.thread = em.getReference(Thread, thread.id);
      message.participant = em.getReference(Participant, participant.id);
      message.body = body;
      message.sequence = sequence;
      if (opts?.intent) message.intent = opts.intent;
      if (opts?.type) message.type = opts.type;
      if (opts?.data) message.data = opts.data;
      if (opts?.inReplyTo) message.inReplyTo = opts.inReplyTo;

      em.persist(message);

      lockedThread.updatedAt = new Date();

      return message;
    });
  }

  async list(
    threadId: string,
    opts?: { sinceSequence?: number; limit?: number },
  ): Promise<Message[]> {
    const limit = Math.min(opts?.limit || 50, 200);
    const where: Record<string, unknown> = { thread: { id: threadId } };

    if (opts?.sinceSequence) {
      where.sequence = { $gt: opts.sinceSequence };
    }

    return this.messageRepo.find(where, {
      orderBy: { sequence: 'ASC' },
      limit,
      populate: ['participant', 'participant.agent', 'participant.user'],
    });
  }
}
