import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { randomInt } from 'crypto';
import { LinkCode } from '../../db/models/LinkCode';
import { LinkCodeRepository } from '../../db/models';
import { OperatorBinding } from '../../db/models/OperatorBinding';
import { OperatorBindingService } from './operator-binding.service';
import { UserService } from './user.service';

@Injectable()
export class LinkCodeService {
  constructor(
    @InjectRepository(LinkCode) private readonly repo: LinkCodeRepository,
    private readonly em: EntityManager,
    private readonly operatorBindingService: OperatorBindingService,
    private readonly userService: UserService,
  ) {}

  /**
   * Generate a 6-digit link code for an agent. Rotates: any existing codes
   * for this agent are deleted first so at most one code exists per agent.
   */
  @Transactional()
  async create(agentId: string): Promise<{ code: string; expiresAt: Date }> {
    await this.em.nativeDelete(LinkCode, { agentId });

    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const linkCode = new LinkCode(code, agentId, expiresAt);
    await this.em.persistAndFlush(linkCode);

    return { code, expiresAt };
  }

  /** Check a link code without consuming it. Returns agent ID and binding status. */
  async peek(code: string): Promise<{ agentId: string; hasBinding: boolean }> {
    const record = await this.repo.findOne({
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CODE',
        message: 'Link code is invalid, expired, or already used',
      });
    }

    const binding = await this.em.findOne(OperatorBinding, { agent: { id: record.agentId } });

    return {
      agentId: record.agentId,
      hasBinding: !!binding,
    };
  }

  /** Consume a link code (marks as used). Returns agent ID. */
  async consume(code: string): Promise<{ agentId: string }> {
    const record = await this.repo.findOne({
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CODE',
        message: 'Link code is invalid, expired, or already used',
      });
    }

    record.used = true;
    await this.em.flush();

    return { agentId: record.agentId };
  }

  /**
   * Issue a fresh operator session for a short code whose agent is already
   * bound to an operator. Used for passwordless login (the "lost password +
   * lost signed link" recovery path).
   *
   * Ordering matters: the binding check happens BEFORE flipping `used=true`,
   * so a `NO_BINDING` caller can still fall through to
   * `/v0/auth/link-code/register` with the same code.
   */
  @Transactional()
  async loginWithCode(
    code: string,
  ): Promise<{ agentId: string; userId: string; sessionToken: string }> {
    const record = await this.repo.findOne({
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!record) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CODE',
        message: 'Link code is invalid, expired, or already used',
      });
    }

    const user = await this.operatorBindingService.findBoundUser(record.agentId);
    if (!user) {
      throw new ConflictException({
        ok: false,
        error: 'NO_BINDING',
        message: 'Agent has no operator binding yet. Register instead.',
      });
    }

    record.used = true;
    const { sessionToken } = await this.userService.createSession(user);

    return { agentId: record.agentId, userId: user.id, sessionToken };
  }
}
