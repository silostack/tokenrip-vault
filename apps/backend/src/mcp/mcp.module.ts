import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { McpController } from './mcp.controller';
import { MCP_SERVICES } from './mcp.server';
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
import type { McpServices } from './mcp.server';

@Module({
  imports: [ApiModule],
  controllers: [McpController],
  providers: [
    {
      provide: MCP_SERVICES,
      useFactory: (
        assetService: AssetService,
        assetVersionService: AssetVersionService,
        agentService: AgentService,
        messageService: MessageService,
        threadService: ThreadService,
        participantService: ParticipantService,
        inboxService: InboxService,
        shareTokenService: ShareTokenService,
        refService: RefService,
        contactService: ContactService,
        collectionRowService: CollectionRowService,
        searchService: SearchService,
      ): McpServices => ({
        assetService,
        assetVersionService,
        agentService,
        messageService,
        threadService,
        participantService,
        inboxService,
        shareTokenService,
        refService,
        contactService,
        collectionRowService,
        searchService,
      }),
      inject: [
        AssetService,
        AssetVersionService,
        AgentService,
        MessageService,
        ThreadService,
        ParticipantService,
        InboxService,
        ShareTokenService,
        RefService,
        ContactService,
        CollectionRowService,
        SearchService,
      ],
    },
  ],
})
export class McpModule {}
