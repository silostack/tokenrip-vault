import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@mikro-orm/core';
import { Auth, AuthAgent, ReqAuth } from '../auth/auth.decorator';
import { RequestAuth } from '../auth/auth.guard';
import { ThreadService } from '../service/thread.service';
import { ParticipantService } from '../service/participant.service';
import { MessageService } from '../service/message.service';
import { RefService } from '../service/ref.service';
import { AgentService } from '../service/agent.service';
import { OperatorBindingService } from '../service/operator-binding.service';

@Controller('v0/threads')
export class ThreadController {
  constructor(
    private readonly threadService: ThreadService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
    private readonly refService: RefService,
    private readonly agentService: AgentService,
    private readonly bindingService: OperatorBindingService,
  ) {}

  private async serializeThread(thread: any) {
    const participants = await this.participantService.listByThread(thread.id);
    return {
      id: thread.id,
      created_by: thread.createdBy,
      resolution: thread.resolution ?? null,
      metadata: thread.metadata ?? null,
      participants: participants.map((p) => ({
        id: p.id,
        agent_id: p.agent?.id ?? null,
        user_id: p.user?.id ?? null,
        role: p.role ?? null,
        joined_at: p.joinedAt,
      })),
      created_at: thread.createdAt,
      updated_at: thread.updatedAt,
    };
  }

  @Auth('agent')
  @Post()
  @Transactional()
  async create(
    @AuthAgent() agent: { id: string },
    @Body() body: { participants?: string[]; metadata?: Record<string, unknown>; message?: { body: string; intent?: string; type?: string } },
  ) {
    const thread = await this.threadService.create(agent.id, { metadata: body.metadata });

    const creatorParticipant = await this.participantService.addAgent(thread, agent.id);

    if (body.participants) {
      for (const entry of body.participants) {
        const agentId = await this.agentService.resolveByIdOrAlias(entry);
        await this.participantService.addAgent(thread, agentId);
      }
    }

    if (body.message) {
      await this.messageService.create(thread, creatorParticipant, body.message.body, {
        intent: body.message.intent,
        type: body.message.type,
      });
    }

    return { ok: true, data: await this.serializeThread(thread) };
  }

  @Auth('agent')
  @Get()
  async listThreads(
    @AuthAgent() agent: { id: string },
    @Query('state') state: string | undefined,
    @Query('limit') limit: string | undefined,
    @Query('offset') offset: string | undefined,
  ) {
    if (state && state !== 'open' && state !== 'closed') {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_STATE',
        message: 'state must be "open" or "closed"',
      });
    }

    const result = await this.threadService.listForAgent(agent.id, {
      state,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    return {
      ok: true,
      data: {
        threads: result.rows.map((r) => ({
          thread_id: r.thread_id,
          state: r.state,
          created_by: r.created_by,
          owner_id: r.owner_id,
          participant_count: r.participant_count,
          last_message_at: r.last_message_at,
          last_message_preview: r.last_body_preview,
          metadata: r.metadata,
          created_at: r.created_at,
          updated_at: r.updated_at,
        })),
        total: result.total,
      },
    };
  }

  @Auth('agent', 'token')
  @Get(':threadId')
  async getThread(
    @Param('threadId') threadId: string,
    @ReqAuth() auth: RequestAuth,
  ) {
    const thread = await this.threadService.findById(threadId, auth);
    return { ok: true, data: await this.serializeThread(thread) };
  }

  @Auth('agent', 'token')
  @Patch(':threadId')
  async updateThread(
    @Param('threadId') threadId: string,
    @Body() body: { resolution?: Record<string, unknown> },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body.resolution) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'resolution is required',
      });
    }

    const thread = await this.threadService.setResolution(threadId, body.resolution, auth);

    return {
      ok: true,
      data: {
        id: thread.id,
        resolution: thread.resolution,
        updated_at: thread.updatedAt,
      },
    };
  }

  @Auth('agent', 'token')
  @Post(':threadId/messages')
  @Transactional()
  async postMessage(
    @Param('threadId') threadId: string,
    @Body() body: { body?: string; intent?: string; type?: string; data?: Record<string, unknown>; in_reply_to?: string; refs?: Array<{ type: string; target_id: string; version?: number }> },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body?.body) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'body is required',
      });
    }

    const thread = await this.threadService.findById(threadId, auth);
    const participant = await this.participantService.getOrCreateForAuth(thread, auth);

    const message = await this.messageService.create(thread, participant, body.body, {
      intent: body.intent,
      type: body.type,
      data: body.data,
      inReplyTo: body.in_reply_to,
    });

    if (body.refs?.length) {
      await this.refService.addRefs('message', message.id, body.refs);
    }

    return {
      ok: true,
      data: {
        id: message.id,
        thread_id: thread.id,
        sequence: message.sequence,
        body: message.body,
        intent: message.intent ?? null,
        type: message.type ?? null,
        data: message.data ?? null,
        in_reply_to: message.inReplyTo ?? null,
        sender: {
          agent_id: auth.agent?.id ?? null,
          user_id: auth.user?.id ?? null,
        },
        created_at: message.createdAt,
      },
    };
  }

  @Auth('agent', 'token')
  @Get(':threadId/messages')
  async listMessages(
    @Param('threadId') threadId: string,
    @Query('since_sequence') sinceSequence: string | undefined,
    @Query('limit') limit: string | undefined,
    @ReqAuth() auth: RequestAuth,
  ) {
    await this.threadService.findById(threadId, auth);

    const messages = await this.messageService.list(threadId, {
      sinceSequence: sinceSequence ? parseInt(sinceSequence, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return {
      ok: true,
      data: messages.map((m) => ({
        id: m.id,
        sequence: m.sequence,
        body: m.body,
        intent: m.intent ?? null,
        type: m.type ?? null,
        data: m.data ?? null,
        in_reply_to: m.inReplyTo ?? null,
        sender: {
          agent_id: m.participant?.agent?.id ?? null,
          user_id: m.participant?.user?.id ?? null,
        },
        created_at: m.createdAt,
      })),
    };
  }

  @Auth('agent')
  @Post(':threadId/participants')
  async addParticipant(
    @Param('threadId') threadId: string,
    @Body() body: { agent_id?: string; alias?: string },
    @AuthAgent() agent: { id: string },
  ) {
    if (!body?.agent_id && !body?.alias) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'agent_id or alias is required',
      });
    }

    const thread = await this.threadService.findById(threadId, { agent });
    const agentId = await this.agentService.resolveByIdOrAlias(body.agent_id || body.alias!);
    const participant = await this.participantService.addAgent(thread, agentId, agent.id);

    const boundUser = await this.bindingService.findBoundUser(agentId);
    if (boundUser) {
      await this.participantService.addUser(thread, boundUser.id);
    }

    return {
      ok: true,
      data: {
        id: participant.id,
        thread_id: thread.id,
        agent_id: agentId,
        joined_at: participant.joinedAt,
      },
    };
  }
}
