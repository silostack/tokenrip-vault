import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { createHash, randomBytes } from 'crypto';
import { ApiKey } from '../../db/models/ApiKey';
import { Agent } from '../../db/models/Agent';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  async createKey(agent: Agent, name: string): Promise<string> {
    const rawKey = `tr_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const record = new ApiKey(keyHash, name, agent);
    this.em.persist(record);

    return rawKey;
  }

  @Transactional()
  async validateKey(rawKey: string): Promise<{ apiKeyId: string; agentId: string } | null> {
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const record = await this.em.findOne(ApiKey, { keyHash }, { populate: ['agent'] });
    if (!record || record.revokedAt) return null;

    record.lastUsedAt = new Date();

    return { apiKeyId: record.id, agentId: record.agent.id };
  }

  async revokeAllKeys(agentId: string): Promise<void> {
    const keys = await this.em.find(ApiKey, {
      agent: { id: agentId },
      revokedAt: null,
    });
    for (const key of keys) {
      key.revokedAt = new Date();
    }
  }
}
