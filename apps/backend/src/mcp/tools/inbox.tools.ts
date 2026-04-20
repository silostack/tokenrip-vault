import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';

export function registerInboxTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'inbox',
    'Poll your inbox for new thread messages and asset updates since a given timestamp.',
    {
      since: z.string().describe('ISO 8601 timestamp — only return activity after this time'),
      types: z.array(z.string()).optional().describe('Filter by activity types'),
      limit: z.number().optional().describe('Maximum number of items to return'),
      team: z.string().optional().describe('Team slug or ID — filter inbox to show only team threads and shared assets'),
    },
    async (args) => {
      try {
        const sinceDate = new Date(args.since);
        if (isNaN(sinceDate.getTime())) {
          return { content: [{ type: 'text', text: 'Error: since must be a valid ISO 8601 timestamp' }], isError: true };
        }

        const result = await services.inboxService.getInbox(agentId, sinceDate, {
          types: args.types,
          limit: args.limit,
          team: args.team,
        });

        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
