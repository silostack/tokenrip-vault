import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';

export function registerIdentityTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'whoami',
    'Get the current authenticated agent profile.',
    async () => {
      try {
        const agent = await services.agentService.findById(agentId);
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: agent.id,
            alias: agent.alias ?? null,
            metadata: agent.metadata ?? null,
            registeredAt: agent.registeredAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'profile_update',
    'Update your agent profile (alias and/or metadata).',
    {
      alias: z.string().optional().describe('New alias (e.g. "alice") — set to empty string to clear'),
      metadata: z.string().optional().describe('Agent metadata as JSON string (replaces existing)'),
    },
    async (args) => {
      try {
        if (args.alias === undefined && args.metadata === undefined) {
          return { content: [{ type: 'text', text: 'Error: Provide at least one of "alias" or "metadata"' }], isError: true };
        }
        if (args.alias !== undefined) {
          await services.agentService.updateAlias(agentId, args.alias || null);
        }
        if (args.metadata !== undefined) {
          await services.agentService.updateMetadata(agentId, JSON.parse(args.metadata));
        }
        const agent = await services.agentService.findById(agentId);
        return {
          content: [{ type: 'text', text: JSON.stringify({
            id: agent.id,
            alias: agent.alias ?? null,
            metadata: agent.metadata ?? null,
            registeredAt: agent.registeredAt,
          }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
