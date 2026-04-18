import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  BadRequestException,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { Auth, AuthAgent, AuthUser, ReqAuth } from '../auth/auth.decorator';
import { RequestAuth } from '../auth/auth.guard';
import { UserService } from '../service/user.service';
import { OperatorAuthService } from '../service/operator-auth.service';
import { OperatorBindingService } from '../service/operator-binding.service';
import { InboxService } from '../service/inbox.service';
import { AssetService } from '../service/asset.service';
import { ThreadService } from '../service/thread.service';
import { ParticipantService } from '../service/participant.service';
import { MessageService } from '../service/message.service';
import { ShareTokenService } from '../service/share-token.service';
import { ContactService } from '../service/contact.service';
import { AgentService } from '../service/agent.service';
import { LinkCodeService } from '../service/link-code.service';
import { RefService, serializeRef } from '../service/ref.service';
import { parseSince } from '../service/search.service';

@Controller('v0')
export class OperatorController {
  constructor(
    private readonly userService: UserService,
    private readonly operatorAuthService: OperatorAuthService,
    private readonly bindingService: OperatorBindingService,
    private readonly inboxService: InboxService,
    private readonly assetService: AssetService,
    private readonly threadService: ThreadService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
    private readonly shareTokenService: ShareTokenService,
    private readonly contactService: ContactService,
    private readonly agentService: AgentService,
    private readonly linkCodeService: LinkCodeService,
    private readonly refService: RefService,
  ) {}

  // --- Auth ---

  @Public()
  @Post('auth/operator')
  async authenticate(
    @Body() body: { token?: string; display_name?: string; password?: string; alias?: string },
  ) {
    if (!body?.token) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'token is required' });
    }

    const registration = body.display_name
      ? { displayName: body.display_name, password: body.password, alias: body.alias }
      : undefined;

    const result = await this.operatorAuthService.authenticate(body.token, registration);

    return {
      ok: true,
      data: {
        user_id: result.userId,
        auth_token: result.sessionToken,
        is_new_registration: result.isNewRegistration,
      },
    };
  }

  /** Browser-based registration: creates a server-side agent + user + binding. */
  @Public()
  @Post('auth/register')
  @HttpCode(200)
  async browserRegister(
    @Body() body: { displayName?: string; password?: string; alias?: string },
  ) {
    if (!body?.displayName || !body?.password) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELDS',
        message: 'displayName and password are required',
      });
    }

    const result = await this.bindingService.registerWithServerAgent(
      body.displayName, body.password, body.alias,
    );

    return {
      ok: true,
      data: {
        user_id: result.userId,
        auth_token: result.sessionToken,
        agent_id: result.agentId,
      },
    };
  }

  /** Generate a 6-digit link code for operator linking (called by CLI agent) */
  @Auth('agent')
  @Post('auth/link-code')
  async createLinkCode(@AuthAgent() agent: { id: string }) {
    const { code, expiresAt } = await this.linkCodeService.create(agent.id);
    return { ok: true, data: { code, expires_at: expiresAt } };
  }

  /** Verify a link code (public — called from OAuth page or /link page) */
  @Public()
  @Post('auth/link-code/verify')
  @HttpCode(200)
  async verifyLinkCode(@Body() body: { code?: string }) {
    if (!body?.code) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'code is required' });
    }
    const { agentId, hasBinding } = await this.linkCodeService.peek(body.code);
    return { ok: true, data: { agent_id: agentId, has_binding: hasBinding } };
  }

  @Public()
  @Post('auth/link-code/login')
  @HttpCode(200)
  async loginWithLinkCode(@Body() body: { code?: string }) {
    if (!body?.code) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'code is required',
      });
    }
    const { agentId, userId, sessionToken } = await this.linkCodeService.loginWithCode(body.code);
    return {
      ok: true,
      data: { user_id: userId, auth_token: sessionToken, agent_id: agentId },
    };
  }

  /** Bind a CLI agent to the logged-in user's account via short code. */
  @Auth('user')
  @Post('auth/link-code/bind')
  @HttpCode(200)
  async bindLinkCodeAuth(
    @AuthUser() user: { id: string },
    @Body() body: { code?: string },
  ) {
    if (!body?.code) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'code is required' });
    }
    const { agentId } = await this.linkCodeService.consume(body.code);
    await this.bindingService.create(agentId, user.id);
    return { ok: true, data: { agent_id: agentId } };
  }

  /** Bind a CLI agent to a new user account via short code (registration). */
  @Public()
  @Post('auth/link-code/register')
  @HttpCode(200)
  async bindLinkCodeRegister(
    @Body() body: { code?: string; displayName?: string; password?: string; alias?: string },
  ) {
    if (!body?.code || !body?.displayName || !body?.password) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELDS',
        message: 'code, displayName, and password are required',
      });
    }
    const { agentId } = await this.linkCodeService.consume(body.code);
    const result = await this.bindingService.registerAndBind(
      agentId, body.displayName, body.password, body.alias,
    );
    return {
      ok: true,
      data: {
        user_id: result.userId,
        auth_token: result.sessionToken,
        agent_id: agentId,
      },
    };
  }

  @Public()
  @Post('operators/login')
  @HttpCode(200)
  async login(@Body() body: { alias?: string; password?: string }) {
    if (!body?.alias || !body?.password) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'alias and password are required' });
    }
    const { user, sessionToken } = await this.userService.login(body.alias, body.password);
    return { ok: true, data: { user_id: user.id, auth_token: sessionToken } };
  }

  // --- Dashboard ---

  private async requireBoundAgent(userId: string) {
    const agent = await this.bindingService.findBoundAgent(userId);
    if (!agent) {
      throw new ForbiddenException({ ok: false, error: 'NO_BINDING', message: 'No agent binding found for this user' });
    }
    return agent;
  }

  @Auth('user')
  @Get('operator/agent')
  async getAgent(@AuthUser() user: { id: string }) {
    const agent = await this.requireBoundAgent(user.id);
    return {
      ok: true,
      data: {
        agent_id: agent.id,
        alias: agent.alias ?? null,
        metadata: agent.metadata ?? null,
        registered_at: agent.registeredAt,
      },
    };
  }

  @Auth('user')
  @Get('operator/inbox')
  async getInbox(
    @AuthUser() user: { id: string },
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('state') state?: string,
    @Query('type') type?: string,
    @Query('kind') kind?: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const sinceDate = parseSince(since) ?? new Date(0);
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const resolvedType = type ?? kind;
    const result = await this.inboxService.getOperatorInbox(agent.id, user.id, sinceDate, {
      limit: parsedLimit,
      q: q || undefined,
      state: state || undefined,
      type: resolvedType || undefined,
    });
    return { ok: true, data: result };
  }

  @Auth('user')
  @Get('operator/assets')
  async getAssets(
    @AuthUser() user: { id: string },
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('archived') archived?: string,
    @Query('include_archived') includeArchived?: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const assets = await this.assetService.findByOwner(agent.id, {
      since: since ? new Date(since) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      type,
      archived: archived === 'true',
      includeArchived: includeArchived === 'true',
    });

    const publicIds = assets.map((a) => a.publicId);
    const threadCounts = publicIds.length > 0
      ? await this.refService.countThreadsByAssets(publicIds)
      : new Map<string, number>();

    return {
      ok: true,
      data: assets.map((a) => ({
        id: a.publicId,
        title: a.title ?? null,
        description: a.description ? a.description.slice(0, 80) : null,
        type: a.type,
        mimeType: a.mimeType ?? null,
        state: a.state,
        versionCount: a.versionCount,
        threadCount: threadCounts.get(a.publicId) ?? 0,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
  }

  @Auth('user')
  @Post('operator/assets/:publicId/archive')
  @HttpCode(204)
  async archiveAsset(
    @AuthUser() user: { id: string },
    @Param('publicId') publicId: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    await this.assetService.archiveAsset(publicId, agent.id);
  }

  @Auth('user')
  @Post('operator/assets/:publicId/unarchive')
  @HttpCode(204)
  async unarchiveAsset(
    @AuthUser() user: { id: string },
    @Param('publicId') publicId: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    await this.assetService.unarchiveAsset(publicId, agent.id);
  }

  @Auth('user')
  @Delete('operator/assets/:publicId')
  @HttpCode(204)
  async destroyAsset(
    @AuthUser() user: { id: string },
    @Param('publicId') publicId: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    await this.assetService.destroyAsset(publicId, agent.id);
  }

  @Auth('user')
  @Get('operator/threads')
  async listThreads(
    @AuthUser() user: { id: string },
    @Query('state') state?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);

    if (state && state !== 'open' && state !== 'closed') {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_STATE',
        message: 'state must be "open" or "closed"',
      });
    }

    const result = await this.threadService.listForOperator(agent.id, user.id, {
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
          participants: r.participants ?? [],
          ref_count: r.ref_count ?? 0,
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

  @Auth('user')
  @Get('operator/threads/:threadId')
  async getThread(
    @Param('threadId') threadId: string,
    @AuthUser() user: { id: string },
    @ReqAuth() auth: RequestAuth,
  ) {
    await this.requireBoundAgent(user.id);
    const thread = await this.threadService.findById(threadId, auth);
    const [participants, refs] = await Promise.all([
      this.participantService.listByThread(thread.id),
      this.refService.findAllForThread(thread.id),
    ]);

    return {
      ok: true,
      data: {
        thread_id: thread.id,
        state: thread.state,
        created_by: thread.createdBy,
        owner_id: thread.ownerId,
        resolution: thread.resolution ?? null,
        metadata: thread.metadata ?? null,
        participants: participants.map((p) => ({
          id: p.id,
          agent_id: p.agent?.id ?? null,
          user_id: p.user?.id ?? null,
          role: p.role ?? null,
          joined_at: p.joinedAt,
        })),
        refs: refs.map(serializeRef),
        created_at: thread.createdAt,
        updated_at: thread.updatedAt,
      },
    };
  }

  @Auth('user')
  @Get('operator/threads/:threadId/messages')
  async listMessages(
    @Param('threadId') threadId: string,
    @AuthUser() user: { id: string },
    @Query('since_sequence') sinceSequence?: string,
    @Query('limit') limit?: string,
    @ReqAuth() auth?: RequestAuth,
  ) {
    await this.requireBoundAgent(user.id);
    await this.threadService.findById(threadId, auth!);

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

  @Auth('user')
  @Patch('operator/threads/:threadId')
  async updateThread(
    @Param('threadId') threadId: string,
    @Body() body: { state?: string; resolution?: Record<string, unknown> },
    @ReqAuth() auth: RequestAuth,
  ) {
    let thread = await this.threadService.findById(threadId, auth);

    if (body.state === 'closed') {
      thread = await this.threadService.close(threadId, auth);
    }
    if (body.resolution) {
      thread = await this.threadService.setResolution(threadId, body.resolution, auth);
    }

    return {
      ok: true,
      data: {
        thread_id: thread.id,
        state: thread.state,
        resolution: thread.resolution ?? null,
        owner_id: thread.ownerId,
      },
    };
  }

  @Auth('user')
  @Post('operator/threads/:threadId/dismiss')
  @HttpCode(204)
  async dismissThread(
    @Param('threadId') threadId: string,
    @ReqAuth() auth: RequestAuth,
  ) {
    await this.threadService.findById(threadId, auth);
    await this.participantService.dismiss(threadId, auth);
  }

  @Auth('user')
  @Post('operator/threads/:threadId/messages')
  async postMessage(
    @Param('threadId') threadId: string,
    @Body() body: { body?: string; intent?: string; type?: string },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body?.body) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'body is required' });
    }

    const thread = await this.threadService.findById(threadId, auth);
    const participant = await this.participantService.getOrCreateForAuth(thread, auth);

    const message = await this.messageService.create(thread, participant, body.body, {
      intent: body.intent,
      type: body.type,
    });

    return {
      ok: true,
      data: {
        id: message.id,
        thread_id: thread.id,
        sequence: message.sequence,
        body: message.body,
        intent: message.intent ?? null,
        type: message.type ?? null,
        created_at: message.createdAt,
      },
    };
  }

  // --- Thread refs ---

  @Auth('user')
  @Post('operator/threads/:threadId/refs')
  async addThreadRefs(
    @Param('threadId') threadId: string,
    @Body() body: { refs?: Array<{ type: string; target_id: string; version?: number }> },
    @AuthUser() user: { id: string },
    @ReqAuth() auth: RequestAuth,
  ) {
    if (!body?.refs?.length) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'refs array is required',
      });
    }

    await this.requireBoundAgent(user.id);
    await this.threadService.findById(threadId, auth);
    const refs = await this.refService.addRefs('thread', threadId, body.refs);

    return { ok: true, data: refs.map(serializeRef) };
  }

  @Auth('user')
  @Delete('operator/threads/:threadId/refs/:refId')
  async removeThreadRef(
    @Param('threadId') threadId: string,
    @Param('refId') refId: string,
    @AuthUser() user: { id: string },
    @ReqAuth() auth: RequestAuth,
  ) {
    await this.requireBoundAgent(user.id);
    await this.threadService.findById(threadId, auth);
    await this.refService.removeRef(refId);
    return { ok: true };
  }

  // --- Contacts ---

  @Auth('user')
  @Get('operator/contacts')
  async listContacts(@AuthUser() user: { id: string }) {
    const agent = await this.requireBoundAgent(user.id);
    const contacts = await this.contactService.list(agent.id);
    const aliasMap = await this.contactService.buildAliasMap(contacts);
    return {
      ok: true,
      data: contacts.map((c) => this.contactService.serialize(c, aliasMap.get(c.contactAgentId) ?? null)),
    };
  }

  @Auth('user')
  @Post('operator/contacts')
  async addContact(
    @AuthUser() user: { id: string },
    @Body() body: { agentId: string; label?: string; notes?: string },
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const resolvedId = await this.agentService.resolveByIdOrAlias(body.agentId);
    const contact = await this.contactService.add(agent.id, resolvedId, {
      label: body.label,
      notes: body.notes,
    });
    const contactAgent = await this.agentService.findById(contact.contactAgentId);
    return {
      ok: true,
      data: this.contactService.serialize(contact, contactAgent.alias ?? null),
    };
  }

  @Auth('user')
  @Patch('operator/contacts/:id')
  async updateContact(
    @AuthUser() user: { id: string },
    @Param('id') id: string,
    @Body() body: { label?: string; notes?: string },
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const contact = await this.contactService.update(id, agent.id, {
      label: body.label,
      notes: body.notes,
    });
    const contactAgent = await this.agentService.findById(contact.contactAgentId);
    return {
      ok: true,
      data: this.contactService.serialize(contact, contactAgent.alias ?? null),
    };
  }

  @Auth('user')
  @Delete('operator/contacts/:id')
  @HttpCode(204)
  async removeContact(
    @AuthUser() user: { id: string },
    @Param('id') id: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    await this.contactService.removeById(id, agent.id);
  }

  // --- Share tokens ---

  @Auth('user')
  @Post('operator/assets/:publicId/share')
  async createShareToken(
    @AuthUser() user: { id: string },
    @Param('publicId') publicId: string,
    @Body() body: { perm?: string[]; label?: string; expires_in?: string },
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const asset = await this.assetService.findByPublicId(publicId);
    if (asset.ownerId !== agent.id) {
      throw new ForbiddenException({ ok: false, error: 'NOT_ASSET_OWNER', message: 'Asset not owned by your agent' });
    }

    let expiresAt: Date | undefined;
    if (body.expires_in) {
      const seconds = parseExpiry(body.expires_in);
      if (!seconds) {
        throw new BadRequestException({ ok: false, error: 'INVALID_EXPIRY', message: 'Invalid expires_in. Use e.g. 1h, 7d, 30d' });
      }
      expiresAt = new Date(Date.now() + seconds * 1000);
    }

    const { token, record } = await this.shareTokenService.create({
      assetPublicId: publicId,
      agentId: agent.id,
      issuedBy: user.id,
      perm: body.perm,
      label: body.label,
      expiresAt,
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3333';
    const url = `${frontendUrl}/s/${publicId}?cap=${encodeURIComponent(token)}`;

    return {
      ok: true,
      data: {
        id: record.id,
        token,
        url,
        perm: record.perm,
        label: record.label ?? null,
        expires_at: record.expiresAt ?? null,
        created_at: record.createdAt,
      },
    };
  }

  @Auth('user')
  @Get('operator/assets/:publicId/shares')
  async listShareTokens(
    @AuthUser() user: { id: string },
    @Param('publicId') publicId: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const asset = await this.assetService.findByPublicId(publicId);
    if (asset.ownerId !== agent.id) {
      throw new ForbiddenException({ ok: false, error: 'NOT_ASSET_OWNER', message: 'Asset not owned by your agent' });
    }

    const tokens = await this.shareTokenService.findByAsset(publicId);

    return {
      ok: true,
      data: tokens.map((t) => ({
        id: t.id,
        perm: t.perm,
        label: t.label ?? null,
        expires_at: t.expiresAt ?? null,
        created_at: t.createdAt,
      })),
    };
  }

  @Auth('user')
  @Delete('operator/shares/:id')
  @HttpCode(204)
  async revokeShareToken(
    @AuthUser() user: { id: string },
    @Param('id') id: string,
  ) {
    await this.shareTokenService.revoke(id, user.id);
  }
}

function parseExpiry(s: string): number | null {
  const match = s.match(/^(\d+)(m|h|d)$/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  const multipliers: Record<string, number> = { m: 60, h: 3600, d: 86400 };
  return n * multipliers[match[2]];
}
