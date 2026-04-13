import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AgentKeyPair } from '../db/models/AgentKeyPair';
import { OAuthCode } from '../db/models/OAuthCode';
import { OperatorBinding } from '../db/models/OperatorBinding';
import { ApiModule } from '../api/api.module';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([AgentKeyPair, OAuthCode, OperatorBinding]),
    ApiModule,
  ],
  controllers: [OAuthController],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
