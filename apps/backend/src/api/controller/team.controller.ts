import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Auth, AuthAgent } from '../auth/auth.decorator';
import { TeamService, serializeTeam } from '../service/team.service';
import { AgentService } from '../service/agent.service';

@Controller('v0/teams')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly agentService: AgentService,
  ) {}

  @Auth('agent')
  @Post()
  async create(
    @AuthAgent() agent: { id: string },
    @Body() body: { slug: string; name?: string; description?: string },
  ) {
    if (!body?.slug) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'slug is required' });
    }
    const team = await this.teamService.create(agent.id, body.slug, body.name ?? body.slug, body.description);
    const { members, aliases } = await this.teamService.getDetails(team.id);
    return { ok: true, data: serializeTeam(team, members, aliases) };
  }

  @Auth('agent')
  @Get()
  async list(@AuthAgent() agent: { id: string }) {
    const results = await this.teamService.listForAgent(agent.id);
    return {
      ok: true,
      data: results.map(({ team, memberCount }) => ({
        id: team.id,
        slug: team.slug,
        name: team.name,
        owner_id: team.ownerId,
        description: team.description ?? null,
        member_count: memberCount,
        created_at: team.createdAt,
      })),
    };
  }

  @Auth('agent')
  @Get(':slugOrId')
  async show(@Param('slugOrId') slugOrId: string, @AuthAgent() agent: { id: string }) {
    const team = await this.teamService.findBySlugOrId(slugOrId);
    const { members, aliases } = await this.teamService.getDetails(team.id);
    return { ok: true, data: serializeTeam(team, members, aliases) };
  }

  @Auth('agent')
  @Delete(':slugOrId')
  @HttpCode(204)
  async deleteTeam(@Param('slugOrId') slugOrId: string, @AuthAgent() agent: { id: string }) {
    const team = await this.teamService.findBySlugOrId(slugOrId);
    await this.teamService.delete(team.id, agent.id);
  }

  @Auth('agent')
  @Post(':slugOrId/members')
  async addMember(
    @Param('slugOrId') slugOrId: string,
    @AuthAgent() agent: { id: string },
    @Body() body: { agentId: string },
  ) {
    if (!body?.agentId) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'agentId is required' });
    }
    const team = await this.teamService.findBySlugOrId(slugOrId);
    const targetAgentId = await this.agentService.resolveByIdOrAlias(body.agentId);
    const result = await this.teamService.addMember(team.id, targetAgentId, agent.id);

    if (result.invited) {
      return { ok: true, data: { invited: true, message: 'Invite sent to agent' } };
    }
    return { ok: true, data: { added: true } };
  }

  @Auth('agent')
  @Delete(':slugOrId/members/:agentId')
  @HttpCode(204)
  async removeMember(
    @Param('slugOrId') slugOrId: string,
    @Param('agentId') agentId: string,
    @AuthAgent() agent: { id: string },
  ) {
    const team = await this.teamService.findBySlugOrId(slugOrId);
    const resolvedAgentId = await this.agentService.resolveByIdOrAlias(agentId);
    await this.teamService.removeMember(team.id, resolvedAgentId, agent.id);
  }

  @Auth('agent')
  @Post(':slugOrId/leave')
  @HttpCode(204)
  async leaveTeam(@Param('slugOrId') slugOrId: string, @AuthAgent() agent: { id: string }) {
    const team = await this.teamService.findBySlugOrId(slugOrId);
    await this.teamService.removeMember(team.id, agent.id, agent.id);
  }

  @Auth('agent')
  @Post(':slugOrId/invite')
  async generateInvite(@Param('slugOrId') slugOrId: string, @AuthAgent() agent: { id: string }) {
    const team = await this.teamService.findBySlugOrId(slugOrId);
    const token = await this.teamService.createInviteLink(team.id, agent.id);
    return { ok: true, data: { token } };
  }

  @Auth('agent')
  @Post('accept-invite')
  async acceptInvite(
    @AuthAgent() agent: { id: string },
    @Body() body: { token: string },
  ) {
    if (!body?.token) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'token is required' });
    }
    await this.teamService.acceptInviteByToken(body.token, agent.id);
    return { ok: true };
  }
}
