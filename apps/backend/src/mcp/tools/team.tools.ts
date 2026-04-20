import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';

export function registerTeamTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'team_create',
    'Create a new team. The team slug is a unique URL-safe identifier (lowercase, alphanumeric, hyphens).',
    {
      slug: z.string().describe('Unique team slug (e.g. "my-team")'),
      name: z.string().optional().describe('Display name (defaults to slug)'),
      description: z.string().optional().describe('Team description'),
    },
    async (args) => {
      try {
        const team = await services.teamService.create(agentId, args.slug, args.name ?? args.slug, args.description);
        const { members, aliases } = await services.teamService.getDetails(team.id);
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: team.id,
            slug: team.slug,
            name: team.name,
            owner_id: team.ownerId,
            description: team.description ?? null,
            member_count: members.length,
            members: members.map((m) => ({ agent_id: m.agentId, alias: aliases.get(m.agentId) ?? null, joined_at: m.joinedAt })),
            created_at: team.createdAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_list',
    'List all teams you are a member of.',
    {},
    async () => {
      try {
        const results = await services.teamService.listForAgent(agentId);
        return {
          content: [{ type: 'text', text: JSON.stringify(
            results.map(({ team, memberCount }) => ({
              id: team.id,
              slug: team.slug,
              name: team.name,
              owner_id: team.ownerId,
              description: team.description ?? null,
              member_count: memberCount,
              created_at: team.createdAt,
            })),
          ) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_show',
    'Get details of a team including its members.',
    {
      team: z.string().describe('Team slug or ID'),
    },
    async (args) => {
      try {
        const teamEntity = await services.teamService.findBySlugOrId(args.team);
        const { team, members, aliases } = await services.teamService.getDetails(teamEntity.id);
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: team.id,
            slug: team.slug,
            name: team.name,
            owner_id: team.ownerId,
            description: team.description ?? null,
            member_count: members.length,
            members: members.map((m) => ({ agent_id: m.agentId, alias: aliases.get(m.agentId) ?? null, joined_at: m.joinedAt })),
            created_at: team.createdAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_add_member',
    'Add an agent to a team. If the agent belongs to the same operator, they are added directly. Otherwise, an invite message is sent.',
    {
      team: z.string().describe('Team slug or ID'),
      agentId: z.string().describe('Agent ID (rip1...) or alias to add'),
    },
    async (args) => {
      try {
        const teamEntity = await services.teamService.findBySlugOrId(args.team);
        const targetId = await services.agentService.resolveByIdOrAlias(args.agentId);
        const result = await services.teamService.addMember(teamEntity.id, targetId, agentId);

        if (result.invited) {
          return { content: [{ type: 'text', text: JSON.stringify({ invited: true, message: 'Invite sent to agent' }) }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify({ added: true }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_invite',
    'Generate a one-time invite link for someone to join the team.',
    {
      team: z.string().describe('Team slug or ID'),
    },
    async (args) => {
      try {
        const teamEntity = await services.teamService.findBySlugOrId(args.team);
        const token = await services.teamService.createInviteLink(teamEntity.id, agentId);
        return {
          content: [{ type: 'text', text: JSON.stringify({ token, expires_in: '7 days' }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_leave',
    'Leave a team.',
    {
      team: z.string().describe('Team slug or ID'),
    },
    async (args) => {
      try {
        const teamEntity = await services.teamService.findBySlugOrId(args.team);
        await services.teamService.removeMember(teamEntity.id, agentId, agentId);
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_accept_invite',
    'Accept a team invite using the token from a team_invite or invite message.',
    {
      token: z.string().describe('Invite token'),
    },
    async (args) => {
      try {
        await services.teamService.acceptInviteByToken(args.token, agentId);
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_remove_member',
    'Remove an agent from a team. Only the team owner or the agent themselves can do this.',
    {
      team: z.string().describe('Team slug or ID'),
      agentId: z.string().describe('Agent ID (rip1...) to remove'),
    },
    async (args) => {
      try {
        const teamEntity = await services.teamService.findBySlugOrId(args.team);
        await services.teamService.removeMember(teamEntity.id, args.agentId, agentId);
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'team_delete',
    'Delete a team entirely. Only the team owner can do this. Removes all memberships and team-asset records; assets themselves are untouched.',
    {
      team: z.string().describe('Team slug or ID'),
    },
    async (args) => {
      try {
        const teamEntity = await services.teamService.findBySlugOrId(args.team);
        await services.teamService.delete(teamEntity.id, agentId);
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
