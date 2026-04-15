import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Asset } from '../db/models/Asset';
import { AssetVersion } from '../db/models/AssetVersion';
import { ApiKey } from '../db/models/ApiKey';
import { Agent } from '../db/models/Agent';
import { User } from '../db/models/User';
import { OperatorBinding } from '../db/models/OperatorBinding';
import { Thread } from '../db/models/Thread';
import { Participant } from '../db/models/Participant';
import { Message } from '../db/models/Message';
import { Ref } from '../db/models/Ref';
import { ShareToken } from '../db/models/ShareToken';
import { Contact } from '../db/models/Contact';
import { LinkCode } from '../db/models/LinkCode';
import { AssetController } from './controller/asset.controller';
import { CollectionRowController } from './controller/collection-row.controller';
import { AgentController } from './controller/agent.controller';
import { OperatorController } from './controller/operator.controller';
import { ThreadController } from './controller/thread.controller';
import { MessageController } from './controller/message.controller';
import { HealthController } from './controller/health.controller';
import { OpenapiController } from './controller/openapi.controller';
import { AssetService } from './service/asset.service';
import { AssetVersionService } from './service/asset-version.service';
import { AgentService } from './service/agent.service';
import { UserService } from './service/user.service';
import { ThreadService } from './service/thread.service';
import { ParticipantService } from './service/participant.service';
import { MessageService } from './service/message.service';
import { RefService } from './service/ref.service';
import { ContactController } from './controller/contact.controller';
import { InboxController } from './controller/inbox.controller';
import { SearchController } from './controller/search.controller';
import { ContactService } from './service/contact.service';
import { InboxService } from './service/inbox.service';
import { SearchService } from './service/search.service';
import { OperatorAuthService } from './service/operator-auth.service';
import { OperatorBindingService } from './service/operator-binding.service';
import { ShareTokenService } from './service/share-token.service';
import { LinkCodeService } from './service/link-code.service';
import { CollectionRowService } from './service/collection-row.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [MikroOrmModule.forFeature([Asset, AssetVersion, ApiKey, Agent, User, OperatorBinding, Thread, Participant, Message, Ref, ShareToken, Contact, LinkCode, CollectionRow])],
  controllers: [AssetController, CollectionRowController, AgentController, OperatorController, ThreadController, MessageController, InboxController, SearchController, ContactController, HealthController, OpenapiController],
  providers: [AssetService, AssetVersionService, CollectionRowService, AgentService, UserService, ThreadService, ParticipantService, MessageService, RefService, InboxService, SearchService, OperatorAuthService, OperatorBindingService, ShareTokenService, ContactService, LinkCodeService, AuthService],
  exports: [AuthService, AssetService, AssetVersionService, CollectionRowService, AgentService, UserService, ThreadService, ParticipantService, MessageService, RefService, InboxService, SearchService, ShareTokenService, ContactService, LinkCodeService],
})
export class ApiModule {}
