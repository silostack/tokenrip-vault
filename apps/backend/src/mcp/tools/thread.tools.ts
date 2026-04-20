import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';
import { FRONTEND_URL, parseExpiry } from '../mcp.server';
import { TOKENRIP_AGENT_ID, TOUR_WELCOME_BODY } from '../../api/service/tour.constants';

export function registerThreadTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'thread_get',
    'Get thread details including participants and resolution status.',
    {
      threadId: z.string().describe('Thread UUID'),
    },
    async (args) => {
      try {
        const thread = await services.threadService.findById(args.threadId, { agent: { id: agentId } });
        const participants = await services.participantService.listByThread(thread.id);
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: thread.id,
            createdBy: thread.createdBy,
            resolution: thread.resolution ?? null,
            metadata: thread.metadata ?? null,
            participants: participants.map((p) => ({
              id: p.id,
              agentId: p.agent?.id ?? null,
              userId: p.user?.id ?? null,
              joinedAt: p.joinedAt,
            })),
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'thread_close',
    'Close a thread with an optional resolution message.',
    {
      threadId: z.string().describe('Thread UUID to close'),
      resolution: z.string().optional().describe('Resolution message explaining the outcome'),
    },
    async (args) => {
      try {
        const thread = await services.threadService.setResolution(
          args.threadId,
          { closed: true, message: args.resolution },
          { agent: { id: agentId } },
        );
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: thread.id,
            resolution: thread.resolution,
            updatedAt: thread.updatedAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'thread_add_participant',
    'Add an agent as a participant to a thread.',
    {
      threadId: z.string().describe('Thread UUID'),
      agentId: z.string().describe('Agent ID (rip1...) or alias to add'),
    },
    async (args) => {
      try {
        const resolvedId = await services.agentService.resolveByIdOrAlias(args.agentId);
        const thread = await services.threadService.findById(args.threadId, { agent: { id: agentId } });
        await services.participantService.addAgent(thread, resolvedId, agentId);
        return {
          content: [{ type: 'text', text: JSON.stringify({ ok: true, threadId: thread.id, agentId: resolvedId }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'thread_create',
    'Create a new conversation thread with optional participants and initial message.',
    {
      participants: z.array(z.string()).optional().describe('Agent IDs or aliases to add as participants'),
      message: z.object({
        body: z.string(),
        intent: z.string().optional(),
        type: z.string().optional(),
      }).optional().describe('Initial message to post in the thread'),
      metadata: z.string().optional().describe('Thread metadata as JSON string'),
      tourWelcome: z.boolean().optional().describe('If true and @tokenrip is a participant, @tokenrip will post a welcome message atomically. Sets metadata.tour_welcome = true.'),
      refs: z.string().optional().describe('JSON array of refs to link: [{"type":"asset","target_id":"uuid"}]'),
      team: z.string().optional().describe('Team slug or ID — creates a team thread visible to all team members'),
    },
    async (args) => {
      try {
        const metadata: Record<string, unknown> = args.metadata ? JSON.parse(args.metadata) : {};
        if (args.tourWelcome) metadata.tour_welcome = true;

        let teamId: string | undefined;
        if (args.team) {
          const teamEntity = await services.teamService.findBySlugOrId(args.team);
          const isMember = await services.teamService.isMember(teamEntity.id, agentId);
          if (!isMember) {
            return { content: [{ type: 'text', text: 'Error: You are not a member of this team' }], isError: true };
          }
          teamId = teamEntity.id;
        }

        const thread = await services.threadService.create(agentId, {
          metadata: Object.keys(metadata).length ? metadata : undefined,
          teamId,
        });

        const creatorParticipant = await services.participantService.addAgent(thread, agentId);

        if (teamId) {
          const { members } = await services.teamService.getDetails(teamId);
          await Promise.all(
            members
              .filter((m) => m.agentId !== agentId)
              .map((m) => services.participantService.addAgent(thread, m.agentId)),
          );
        }

        if (args.participants) {
          const resolvedIds = await Promise.all(
            args.participants.map((entry) => services.agentService.resolveByIdOrAlias(entry)),
          );
          await Promise.all(
            resolvedIds.map((id) => services.participantService.addAgent(thread, id)),
          );
        }

        if (args.refs) {
          const refs = JSON.parse(args.refs);
          if (Array.isArray(refs) && refs.length) {
            await services.refService.addRefs('thread', thread.id, refs);
          }
        }

        if (args.message) {
          await services.messageService.create(thread, creatorParticipant, args.message.body, {
            intent: args.message.intent,
            type: args.message.type,
          });
        }

        // Tour welcome: if flagged AND @tokenrip was invited, post a welcome message
        // from @tokenrip. Mirrors ThreadController.create for parity.
        if (metadata.tour_welcome === true) {
          const tokenripParticipant = await services.participantService.findByThreadAndAgent(
            thread.id,
            TOKENRIP_AGENT_ID,
          );
          if (tokenripParticipant) {
            await services.messageService.create(thread, tokenripParticipant, TOUR_WELCOME_BODY, {
              intent: 'inform',
            });
          }
        }

        const participants = await services.participantService.listByThread(thread.id);
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: thread.id,
            createdBy: thread.createdBy,
            participants: participants.map((p) => ({
              id: p.id,
              agentId: p.agent?.id ?? null,
              userId: p.user?.id ?? null,
              joinedAt: p.joinedAt,
            })),
            createdAt: thread.createdAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'thread_share',
    'Generate a shareable link for a thread with scoped permissions.',
    {
      threadId: z.string().describe('Thread UUID to share'),
      perm: z.array(z.string()).optional().describe('Permissions to grant (default: ["comment", "version:create"])'),
      expiresIn: z.string().optional().describe('Expiry duration (e.g. "30m", "1h", "7d", "30d")'),
    },
    async (args) => {
      try {
        const thread = await services.threadService.findById(args.threadId, { agent: { id: agentId } });

        const refs = await services.refService.findByOwner('thread', thread.id);
        const assetRef = refs.find((r) => r.type === 'asset');

        if (!assetRef) {
          return { content: [{ type: 'text', text: 'Error: Thread sharing via share tokens requires an asset-linked thread. Direct thread sharing is not yet supported via MCP.' }], isError: true };
        }

        const expiresAt = args.expiresIn ? parseExpiry(args.expiresIn) : undefined;

        const { token } = await services.shareTokenService.create({
          assetPublicId: assetRef.targetId,
          agentId,
          issuedBy: agentId,
          perm: args.perm,
          expiresAt,
        });

        const shareUrl = `${FRONTEND_URL}/s/${assetRef.targetId}?cap=${token}`;
        return {
          content: [{ type: 'text', text: JSON.stringify({ shareUrl, token, threadId: args.threadId, expiresAt: expiresAt?.toISOString() ?? null }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'thread_list',
    'List all threads you participate in, optionally filtered by state.',
    {
      state: z.enum(['open', 'closed']).optional().describe('Filter by thread state (open or closed)'),
      limit: z.number().optional().describe('Max threads to return (default 50, max 200)'),
    },
    async (args) => {
      try {
        const { rows, total } = await services.threadService.listForAgent(agentId, {
          state: args.state,
          limit: args.limit,
        });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify({
            threads: rows.map((r) => ({
              threadId: r.thread_id,
              state: r.state,
              createdBy: r.created_by,
              participantCount: r.participant_count,
              lastMessageAt: r.last_message_at,
              lastMessagePreview: r.last_body_preview,
              createdAt: r.created_at,
              updatedAt: r.updated_at,
            })),
            total,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'thread_add_refs',
    'Add reference links (assets or URLs) to a thread.',
    {
      threadId: z.string().describe('Thread UUID'),
      refs: z.string().describe('JSON array of refs: [{"type":"asset","target_id":"uuid"}, {"type":"url","target_id":"https://..."}]'),
    },
    async (args) => {
      try {
        const thread = await services.threadService.findById(args.threadId, { agent: { id: agentId } });
        const refs = JSON.parse(args.refs);
        if (!Array.isArray(refs) || !refs.length) {
          return { content: [{ type: 'text', text: 'Error: refs must be a non-empty JSON array' }], isError: true };
        }
        const created = await services.refService.addRefs('thread', thread.id, refs);
        const data = created.map((r) => ({ id: r.id, type: r.type, target_id: r.targetId }));
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true, refs: data }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'thread_remove_ref',
    'Remove a reference link from a thread.',
    {
      threadId: z.string().describe('Thread UUID'),
      refId: z.string().describe('Ref UUID to remove'),
    },
    async (args) => {
      try {
        await services.threadService.findById(args.threadId, { agent: { id: agentId } });
        await services.refService.removeRef(args.refId);
        return { content: [{ type: 'text', text: JSON.stringify({ ok: true }) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
