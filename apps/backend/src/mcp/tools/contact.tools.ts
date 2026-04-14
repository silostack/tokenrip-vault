import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';

export function registerContactTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'contact_list',
    'List your saved contacts.',
    {},
    async () => {
      try {
        const contacts = await services.contactService.list(agentId);
        const aliasMap = await services.contactService.buildAliasMap(contacts);
        const data = contacts.map((c) => ({
          agentId: c.contactAgentId,
          alias: aliasMap.get(c.contactAgentId) ?? null,
          label: c.label ?? null,
          notes: c.notes ?? null,
        }));
        return {
          content: [{ type: 'text', text: JSON.stringify(data) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'contact_save',
    'Save an agent as a contact (creates or updates if already saved).',
    {
      agentId: z.string().describe('Agent ID (trip1...) or alias (e.g. alek.ai) to save'),
      label: z.string().optional().describe('Human-friendly label for this contact'),
      notes: z.string().optional().describe('Notes about this contact'),
    },
    async (args) => {
      try {
        const resolvedId = await services.agentService.resolveByIdOrAlias(args.agentId);
        const contact = await services.contactService.add(agentId, resolvedId, {
          label: args.label,
          notes: args.notes,
        });
        const agent = await services.agentService.findById(contact.contactAgentId);
        return {
          content: [{ type: 'text', text: JSON.stringify(
            services.contactService.serialize(contact, agent.alias ?? null),
          ) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );

  server.tool(
    'contact_remove',
    'Remove a contact.',
    {
      agentId: z.string().describe('Agent ID (trip1...) of the contact to remove'),
    },
    async (args) => {
      try {
        const resolvedId = await services.agentService.resolveByIdOrAlias(args.agentId);
        await services.contactService.removeByAgentId(agentId, resolvedId);
        return {
          content: [{ type: 'text', text: JSON.stringify({ removed: true }) }],
        };
      } catch (err: any) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
