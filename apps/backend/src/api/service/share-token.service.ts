import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { randomBytes } from 'crypto';
import { sha256 } from '../auth/crypto';
import { ShareToken } from '../../db/models/ShareToken';
import { ShareTokenRepository } from '../../db/repositories/share-token.repository';
import type { CapabilityPayload } from '../auth/crypto';

@Injectable()
export class ShareTokenService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(ShareToken) private readonly repo: ShareTokenRepository,
  ) {}

  @Transactional()
  async create(opts: {
    assetPublicId: string;
    agentId: string;
    issuedBy: string;
    perm?: string[];
    label?: string;
    expiresAt?: Date;
  }): Promise<{ token: string; record: ShareToken }> {
    const rawToken = `st_${randomBytes(32).toString('hex')}`;
    const tokenHash = sha256(rawToken);

    const record = new ShareToken();
    record.tokenHash = tokenHash;
    record.assetPublicId = opts.assetPublicId;
    record.agentId = opts.agentId;
    record.issuedBy = opts.issuedBy;
    record.perm = opts.perm ?? ['comment', 'version:create'];
    record.label = opts.label;
    record.expiresAt = opts.expiresAt;

    this.em.persist(record);

    return { token: rawToken, record };
  }

  /**
   * Validate a `st_` token and return a CapabilityPayload compatible with the
   * existing permission-checking code, or null if invalid/expired/revoked.
   */
  async validate(rawToken: string): Promise<CapabilityPayload | null> {
    const tokenHash = sha256(rawToken);
    const record = await this.repo.findOne({ tokenHash });
    if (!record) return null;
    if (record.revokedAt) return null;
    if (record.expiresAt && record.expiresAt < new Date()) return null;

    return {
      sub: `asset:${record.assetPublicId}`,
      iss: record.agentId,
      perm: record.perm,
      exp: record.expiresAt ? Math.floor(record.expiresAt.getTime() / 1000) : undefined,
    };
  }

  async findByAsset(assetPublicId: string): Promise<ShareToken[]> {
    return this.repo.find(
      { assetPublicId, revokedAt: null },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  @Transactional()
  async revoke(id: string, userId: string): Promise<boolean> {
    const record = await this.repo.findOne({ id, issuedBy: userId, revokedAt: null });
    if (!record) return false;
    record.revokedAt = new Date();
    return true;
  }
}
