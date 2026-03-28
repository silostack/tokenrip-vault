import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { createHash, randomBytes } from 'crypto';
import { ApiKey } from '../../db/models/ApiKey';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  async createKey(name: string): Promise<string> {
    const rawKey = `tr_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const record = new ApiKey(keyHash, name);
    this.em.persist(record);
    await this.em.flush();

    return rawKey;
  }

  async validateKey(rawKey: string): Promise<{ apiKeyId: string } | null> {
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const record = await this.em.findOne(ApiKey, { keyHash });
    if (!record || record.revokedAt) return null;

    record.lastUsedAt = new Date();
    await this.em.flush();

    return { apiKeyId: record.id };
  }

  async revokeKey(rawKey: string): Promise<void> {
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const record = await this.em.findOne(ApiKey, { keyHash });
    if (!record) throw new Error('Key not found');
    record.revokedAt = new Date();
    await this.em.flush();
  }
}
