import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';
import { validate as uuidValidate } from 'uuid';

export function registerMessageTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'msg_send',
    'Send a message to a recipient (by agent ID or alias) or to an existing thread.',
    {
      body: z.string().describe('Message body text'),
      to: z.string().optional().describe('Recipient agent ID (trip1...) or alias. Creates a new thread if needed.'),
      threadId: z.string().optional().describe('Existing thread UUID to post to (use instead of "to")'),
      intent: z.string().optional().describe('Message intent: propose, accept, reject, counter, inform, request, confirm'),
      type: z.string().optional().describe('Message type: meeting, review, notification, status_update'),
      data: z.string().optional().describe('Structured data payload as JSON string'),
      inReplyTo: z.string().optional().describe('Message ID being replied to'),
      refs: z.string().optional().describe('Reference links as JSON array string: [{"type":"asset","target_id":"uuid"}]'),
    },
    async (args) => {
      try {
        if (!args.to && !args.threadId) {
          return { content: [{ type: 'text', text: 'Error: Provide either "to" (recipient) or "threadId"' }], isError: true };
        }

        let thread;

        if (args.threadId) {
          // Post to existing thread
          thread = await services.threadService.findById(args.threadId, { agent: { id: agentId } });
        } else if (args.to) {
          if (uuidValidate(args.to)) {
            // UUID means asset thread
            thread = await services.threadService.findOrCreateAssetThread(args.to, agentId, agentId);
          } else {
            // Agent ID or alias — create 1:1 thread
            const recipientId = await services.agentService.resolveByIdOrAlias(args.to);
            thread = await services.threadService.create(agentId, { ownerId: recipientId });
            await services.participantService.addAgent(thread, recipientId);
          }
        }

        const participant = await services.participantService.getOrCreateForAuth(thread!, { agent: { id: agentId } });

        const data = args.data ? JSON.parse(args.data) : undefined;
        const message = await services.messageService.create(thread!, participant, args.body, {
          intent: args.intent,
          type: args.type,
          data,
          inReplyTo: args.inReplyTo,
        });

        if (args.refs) {
          const refs = JSON.parse(args.refs);
          if (Array.isArray(refs) && refs.length) {
            await services.refService.addRefs('message', message.id, refs);
          }
        }

        return {
          content: [{ type: 'text', text: JSON.stringify({ messageId: message.id, threadId: thread!.id, sequence: message.sequence }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'msg_list',
    'List messages in a thread.',
    {
      threadId: z.string().describe('Thread UUID'),
      sinceSequence: z.number().optional().describe('Only return messages after this sequence number'),
      limit: z.number().optional().describe('Maximum number of messages to return'),
    },
    async (args) => {
      try {
        await services.threadService.findById(args.threadId, { agent: { id: agentId } });

        const messages = await services.messageService.list(args.threadId, {
          sinceSequence: args.sinceSequence,
          limit: args.limit,
        });

        const data = messages.map((m) => ({
          id: m.id,
          sequence: m.sequence,
          body: m.body,
          intent: m.intent ?? null,
          type: m.type ?? null,
          data: m.data ?? null,
          inReplyTo: m.inReplyTo ?? null,
          sender: {
            agentId: m.participant?.agent?.id ?? null,
            userId: m.participant?.user?.id ?? null,
          },
          createdAt: m.createdAt,
        }));

        return { content: [{ type: 'text', text: JSON.stringify(data) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
