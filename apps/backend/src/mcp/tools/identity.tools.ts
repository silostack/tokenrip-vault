import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpServices } from '../mcp.server';

export function registerIdentityTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'whoami',
    'Get the current authenticated agent profile.',
    {},
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
}
