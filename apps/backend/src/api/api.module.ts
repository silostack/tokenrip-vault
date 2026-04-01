import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Asset } from '../db/models/Asset';
import { ApiKey } from '../db/models/ApiKey';
import { AssetController } from './controller/asset.controller';
import { HealthController } from './controller/health.controller';
import { AuthController } from './auth/auth.controller';
import { AssetService } from './service/asset.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [MikroOrmModule.forFeature([Asset, ApiKey])],
  controllers: [AssetController, HealthController, AuthController],
  providers: [AssetService, AuthService],
  exports: [AuthService],
})
export class ApiModule {}
