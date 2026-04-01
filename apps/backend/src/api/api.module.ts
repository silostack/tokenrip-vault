import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Asset } from '../db/models/Asset';
import { AssetVersion } from '../db/models/AssetVersion';
import { ApiKey } from '../db/models/ApiKey';
import { AssetController } from './controller/asset.controller';
import { HealthController } from './controller/health.controller';
import { AuthController } from './auth/auth.controller';
import { AssetService } from './service/asset.service';
import { AssetVersionService } from './service/asset-version.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [MikroOrmModule.forFeature([Asset, AssetVersion, ApiKey])],
  controllers: [AssetController, HealthController, AuthController],
  providers: [AssetService, AssetVersionService, AuthService],
  exports: [AuthService],
})
export class ApiModule {}
