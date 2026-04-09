import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { sha256 } from '../auth/crypto';
import { Public } from '../auth/public.decorator';
import { UserService } from '../service/user.service';
import { Agent } from '../../db/models/Agent';
import { OperatorBinding } from '../../db/models/OperatorBinding';

@Controller('v0/operators')
export class OperatorController {
  constructor(
    private readonly userService: UserService,
    private readonly em: EntityManager,
  ) {}

  @Public()
  @Post('register')
  @Transactional()
  async register(
    @Body() body: { display_name?: string; password?: string; alias?: string; operator_token?: string },
  ) {
    if (!body?.operator_token || !body?.display_name || !body?.password) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'operator_token, display_name, and password are required',
      });
    }

    const tokenHash = sha256(body.operator_token);
    const agent = await this.em.findOne(Agent, { operatorTokenHash: tokenHash });
    if (!agent) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired operator token',
      });
    }

    const { user, sessionToken } = await this.userService.register(
      body.display_name,
      body.password,
      body.alias,
    );

    const binding = new OperatorBinding(agent, user);
    this.em.persist(binding);

    // Clear operator token (one-time use)
    agent.operatorTokenHash = undefined;

    return {
      ok: true,
      data: {
        user_id: user.id,
        auth_token: sessionToken,
      },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { alias?: string; password?: string }) {
    if (!body?.alias || !body?.password) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'alias and password are required',
      });
    }

    const { user, sessionToken } = await this.userService.login(body.alias, body.password);

    return {
      ok: true,
      data: {
        user_id: user.id,
        auth_token: sessionToken,
      },
    };
  }
}
