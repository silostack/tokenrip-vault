import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { Auth, AuthAgent } from '../auth/auth.decorator';
import { AgentService } from '../service/agent.service';

@Controller('v0/agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Public()
  @Post()
  async register(@Body() body: { public_key?: string; alias?: string }) {
    if (!body?.public_key) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'public_key is required',
      });
    }

    const { agent, apiKey } = await this.agentService.register(body.public_key, body.alias);

    return {
      ok: true,
      data: {
        agent_id: agent.id,
        api_key: apiKey,
        alias: agent.alias ?? null,
      },
    };
  }

  @Auth('agent')
  @Post('revoke-key')
  async revokeKey(@AuthAgent() agent: { id: string }) {
    const apiKey = await this.agentService.revokeAndRegenerateKey(agent.id);
    return {
      ok: true,
      data: { api_key: apiKey },
    };
  }

  /** Recover API key via Ed25519 signed token (for lost/expired key recovery). */
  @Public()
  @Post('recover-key')
  async recoverKey(@Body() body: { token?: string }) {
    if (!body?.token) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'token is required' });
    }
    const apiKey = await this.agentService.recoverKey(body.token);
    return { ok: true, data: { api_key: apiKey } };
  }

  @Auth('agent')
  @Get('me')
  async getProfile(@AuthAgent() agent: { id: string }) {
    const found = await this.agentService.findById(agent.id);
    return {
      ok: true,
      data: {
        agent_id: found.id,
        alias: found.alias ?? null,
        metadata: found.metadata ?? null,
        registered_at: found.registeredAt,
      },
    };
  }

  @Auth('agent')
  @Patch('me')
  async updateProfile(
    @AuthAgent() agent: { id: string },
    @Body() body: { alias?: string | null; metadata?: Record<string, unknown> },
  ) {
    if (body.alias !== undefined) {
      await this.agentService.updateAlias(agent.id, body.alias);
    }
    if (body.metadata !== undefined) {
      await this.agentService.updateMetadata(agent.id, body.metadata);
    }

    const updated = await this.agentService.findById(agent.id);
    return {
      ok: true,
      data: {
        agent_id: updated.id,
        alias: updated.alias ?? null,
        metadata: updated.metadata ?? null,
        registered_at: updated.registeredAt,
      },
    };
  }
}
