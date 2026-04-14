import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { randomInt } from 'crypto';
import { LinkCode } from '../../db/models/LinkCode';
import { LinkCodeRepository } from '../../db/models';
import { OperatorBinding } from '../../db/models/OperatorBinding';

@Injectable()
export class LinkCodeService {
  constructor(
    @InjectRepository(LinkCode) private readonly repo: LinkCodeRepository,
    private readonly em: EntityManager,
  ) {}

  /** Generate a 6-digit link code for an agent. Max 3 active codes per agent. */
  async create(agentId: string): Promise<{ code: string; expiresAt: Date }> {
    const now = new Date();

    // Enforce max 3 active (unused + unexpired) codes per agent
    const activeCount = await this.repo.count({
      agentId,
      used: false,
      expiresAt: { $gt: now },
    });
    if (activeCount >= 3) {
      throw new BadRequestException({
        ok: false,
        error: 'TOO_MANY_CODES',
        message: 'Maximum 3 active link codes. Wait for existing codes to expire.',
      });
    }

    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

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
}
