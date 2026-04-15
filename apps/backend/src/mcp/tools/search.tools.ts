import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { McpServices } from '../mcp.server';
import { parseSince } from '../../api/service/search.service';

export function registerSearchTools(server: McpServer, services: McpServices, agentId: string): void {

  server.tool(
    'search',
    'Search across threads and assets. Returns a unified list sorted by recency. Use type to filter to just threads or assets, state to filter thread state, intent to filter by last message intent, asset_type to filter by asset content type.',
    {
      q: z.string().optional().describe('Search query text (case-insensitive substring match on thread messages and asset titles)'),
      type: z.enum(['thread', 'asset']).optional().describe('Filter to only threads or only assets'),
      since: z.string().optional().describe('Only items updated after this time — ISO 8601 timestamp or integer days back (e.g. "7" = last week)'),
      limit: z.number().optional().describe('Max results to return (default: 50, max: 200)'),
      offset: z.number().optional().describe('Pagination offset (default: 0)'),
      state: z.enum(['open', 'closed']).optional().describe('Filter threads by state (ignored for assets)'),
      intent: z.string().optional().describe('Filter by last message intent: propose, accept, reject, counter, inform, request, confirm'),
      ref: z.string().optional().describe('Filter threads referencing this asset ID (UUID)'),
      asset_type: z.string().optional().describe('Filter by asset type: markdown, html, code, json, text, file, chart, collection'),
    },
    async (args) => {
      try {
        const since = parseSince(args.since);

        const result = await services.searchService.searchForAgent(agentId, {
          q: args.q,
          type: args.type,
          since,
          limit: args.limit,
          offset: args.offset,
          state: args.state,
          intent: args.intent,
          ref: args.ref,
          asset_type: args.asset_type,
        });

        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
      } catch (err: any) {
        return { content: [{ type: 'text' as const, text: `Error: ${err.message}` }], isError: true };
      }
    },
  );
}
