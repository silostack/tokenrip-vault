import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { randomBytes } from 'crypto';
import { sha256 } from './crypto';
import { ApiKey } from '../../db/models/ApiKey';
import { Agent } from '../../db/models/Agent';
import { User } from '../../db/models/User';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  async createKey(agent: Agent, name: string): Promise<string> {
    const rawKey = `tr_${randomBytes(32).toString('hex')}`;
    const keyHash = sha256(rawKey);

    const record = new ApiKey(keyHash, name, agent);
    this.em.persist(record);

    return rawKey;
  }

  @Transactional()
  async validateKey(rawKey: string): Promise<{ apiKeyId: string; agentId: string } | null> {
    const keyHash = sha256(rawKey);
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

  async revokeKeysByName(agentId: string, name: string): Promise<void> {
    const keys = await this.em.find(ApiKey, {
      agent: { id: agentId },
      name,
      revokedAt: null,
    });
    for (const key of keys) {
      key.revokedAt = new Date();
    }
  }

  async validateSessionToken(rawToken: string): Promise<{ userId: string } | null> {
    const hash = sha256(rawToken);
    const user = await this.em.findOne(User, { sessionTokenHash: hash });
    if (!user) return null;
    return { userId: user.id };
  }

}
