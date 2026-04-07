import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Asset } from '../db/models/Asset';
import { AssetVersion } from '../db/models/AssetVersion';
import { ApiKey } from '../db/models/ApiKey';
import { Agent } from '../db/models/Agent';
import { User } from '../db/models/User';
import { OperatorBinding } from '../db/models/OperatorBinding';
import { AssetController } from './controller/asset.controller';
import { AgentController } from './controller/agent.controller';
import { HealthController } from './controller/health.controller';
import { OpenapiController } from './controller/openapi.controller';
import { AssetService } from './service/asset.service';
import { AssetVersionService } from './service/asset-version.service';
import { AgentService } from './service/agent.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [MikroOrmModule.forFeature([Asset, AssetVersion, ApiKey, Agent, User, OperatorBinding])],
  controllers: [AssetController, AgentController, HealthController, OpenapiController],
  providers: [AssetService, AssetVersionService, AgentService, AuthService],
  exports: [AuthService],
})
export class ApiModule {}
