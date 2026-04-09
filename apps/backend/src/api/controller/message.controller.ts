import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { Auth, AuthAgent } from '../auth/auth.decorator';
import { ThreadService } from '../service/thread.service';
import { ParticipantService } from '../service/participant.service';
import { MessageService } from '../service/message.service';
import { RefService } from '../service/ref.service';
import { AgentService } from '../service/agent.service';
import { validate as uuidValidate } from 'uuid';
import { Thread } from '../../db/models/Thread';

@Controller('v0/messages')
export class MessageController {
  constructor(
    private readonly threadService: ThreadService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
    private readonly refService: RefService,
    private readonly agentService: AgentService,
  ) {}

  @Auth('agent')
  @Post()
  async send(
    @AuthAgent() agent: { id: string },
    @Body() body: {
      to?: string[];
      body?: string;
      intent?: string;
      type?: string;
      data?: Record<string, unknown>;
      refs?: Array<{ type: string; target_id: string; version?: number }>;
    },
  ) {
    if (!body?.to?.length || !body?.body) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'to and body are required',
      });
    }

    const target = body.to[0];

    let thread: Thread;
    if (uuidValidate(target)) {
      thread = await this.threadService.findOrCreateAssetThread(target, agent.id, agent.id);
    } else {
      const recipientId = await this.agentService.resolveByIdOrAlias(target);
      // 1:1 thread: recipient is owner. Group: creator is owner.
      const ownerId = body.to!.length === 1 ? recipientId : agent.id;
      thread = await this.threadService.create(agent.id, { ownerId });
      await this.participantService.addAgent(thread, recipientId);
    }

    const participant = await this.participantService.getOrCreateForAuth(thread, { agent });

    const message = await this.messageService.create(thread, participant, body.body, {
      intent: body.intent,
      type: body.type,
      data: body.data,
    });

    if (body.refs?.length) {
      await this.refService.addRefs('message', message.id, body.refs);
    }

    return {
      ok: true,
      data: {
        message_id: message.id,
        thread_id: thread.id,
      },
    };
  }
}
