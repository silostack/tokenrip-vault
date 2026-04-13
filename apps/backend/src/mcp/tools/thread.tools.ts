import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';
import { FRONTEND_URL, parseExpiry } from '../mcp.server';

export function registerThreadTools(server: McpServer, services: McpServices, agentId: string): void {

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
    },
    async (args) => {
      try {
        const metadata = args.metadata ? JSON.parse(args.metadata) : undefined;
        const thread = await services.threadService.create(agentId, { metadata });

        const creatorParticipant = await services.participantService.addAgent(thread, agentId);

        if (args.participants) {
          const resolvedIds = await Promise.all(
            args.participants.map((entry) => services.agentService.resolveByIdOrAlias(entry)),
          );
          await Promise.all(
            resolvedIds.map((id) => services.participantService.addAgent(thread, id)),
          );
        }

        if (args.message) {
          await services.messageService.create(thread, creatorParticipant, args.message.body, {
            intent: args.message.intent,
            type: args.message.type,
          });
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
}
