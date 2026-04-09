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
import { Auth, AuthUser, ReqAuth } from '../auth/auth.decorator';
import { RequestAuth } from '../auth/auth.guard';
import { UserService } from '../service/user.service';
import { OperatorAuthService } from '../service/operator-auth.service';
import { OperatorBindingService } from '../service/operator-binding.service';
import { InboxService } from '../service/inbox.service';
import { AssetService } from '../service/asset.service';
import { ThreadService } from '../service/thread.service';
import { ParticipantService } from '../service/participant.service';
import { MessageService } from '../service/message.service';

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
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const sinceDate = since ? new Date(since) : new Date(0);
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const result = await this.inboxService.getOperatorInbox(agent.id, user.id, sinceDate, { limit: parsedLimit });
    return { ok: true, data: result };
  }

  @Auth('user')
  @Get('operator/assets')
  async getAssets(
    @AuthUser() user: { id: string },
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    const agent = await this.requireBoundAgent(user.id);
    const assets = await this.assetService.findByOwner(agent.id, {
      since: since ? new Date(since) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      type,
    });
    return {
      ok: true,
      data: assets.map((a) => ({
        id: a.publicId,
        title: a.title ?? null,
        type: a.type,
        mimeType: a.mimeType ?? null,
        state: a.state,
        versionCount: a.versionCount,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    };
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
}
