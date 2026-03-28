import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Artifact } from '../db/models/Artifact';
import { ApiKey } from '../db/models/ApiKey';
import { ArtifactController } from './controller/artifact.controller';
import { HealthController } from './controller/health.controller';
import { AuthController } from './auth/auth.controller';
import { ArtifactService } from './service/artifact.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [MikroOrmModule.forFeature([Artifact, ApiKey])],
  controllers: [ArtifactController, HealthController, AuthController],
  providers: [ArtifactService, AuthService],
  exports: [AuthService],
})
export class ApiModule {}
