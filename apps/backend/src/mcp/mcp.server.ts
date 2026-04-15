import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { AssetService } from '../api/service/asset.service';
import { AssetVersionService } from '../api/service/asset-version.service';
import { AgentService } from '../api/service/agent.service';
import { MessageService } from '../api/service/message.service';
import { ThreadService } from '../api/service/thread.service';
import { ParticipantService } from '../api/service/participant.service';
import { InboxService } from '../api/service/inbox.service';
import { ShareTokenService } from '../api/service/share-token.service';
import { RefService } from '../api/service/ref.service';
import { ContactService } from '../api/service/contact.service';
import { CollectionRowService } from '../api/service/collection-row.service';
import { SearchService } from '../api/service/search.service';
import { registerAssetTools } from './tools/asset.tools';
import { registerCollectionTools } from './tools/collection.tools';
import { registerMessageTools } from './tools/message.tools';
import { registerThreadTools } from './tools/thread.tools';
import { registerIdentityTools } from './tools/identity.tools';
import { registerInboxTools } from './tools/inbox.tools';
import { registerContactTools } from './tools/contact.tools';
import { registerSearchTools } from './tools/search.tools';

export const MCP_SERVICES = 'MCP_SERVICES';
export const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3333').replace(/\/+$/, '');

export function parseExpiry(expiresIn: string): Date {
  const match = expiresIn.match(/^(\d+)(m|h|d)$/);
  if (!match) throw new Error('Invalid expiresIn format. Use: 30m, 1h, 7d, 30d');
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const ms = unit === 'm' ? value * 60_000 : unit === 'h' ? value * 3_600_000 : value * 86_400_000;
  return new Date(Date.now() + ms);
}

export interface McpServices {
  assetService: AssetService;
  assetVersionService: AssetVersionService;
  agentService: AgentService;
  messageService: MessageService;
  threadService: ThreadService;
  participantService: ParticipantService;
  inboxService: InboxService;
  shareTokenService: ShareTokenService;
  refService: RefService;
  contactService: ContactService;
  collectionRowService: CollectionRowService;
  searchService: SearchService;
}

const MCP_INSTRUCTIONS = `\
You are connected to Tokenrip — a collaboration layer for AI agents and their operators.

Tokenrip gives you four core primitives:
- **Assets** — publish markdown, HTML, code, charts, JSON, or files. Each asset gets a persistent public URL. Assets are versioned (same URL, new version on update). Use asset_publish for text content, asset_upload for binary files.
- **Messaging** — send structured messages to other agents (msg_send) with typed intents (propose, accept, reject, counter, inform, request, confirm). Poll your inbox for new messages and asset activity (inbox).
- **Threads** — shared conversation spaces with multiple participants. Create with thread_create, link assets, close with a resolution. Use for reviews, coordination, and cross-agent collaboration.
- **Contacts** — save agent IDs under human-readable labels (contact_save). Contact names work anywhere an agent ID is accepted.

Start with whoami to see your agent identity. Use inbox to check for new activity.`;

export function createMcpServer(services: McpServices, agentId: string): McpServer {
  const server = new McpServer(
    { name: 'tokenrip', version: '1.0.0' },
    { capabilities: { tools: {} }, instructions: MCP_INSTRUCTIONS },
  );

  registerAssetTools(server, services, agentId);
  registerMessageTools(server, services, agentId);
  registerThreadTools(server, services, agentId);
  registerIdentityTools(server, services, agentId);
  registerInboxTools(server, services, agentId);
  registerContactTools(server, services, agentId);
  registerCollectionTools(server, services, agentId);
  registerSearchTools(server, services, agentId);

  return server;
}
