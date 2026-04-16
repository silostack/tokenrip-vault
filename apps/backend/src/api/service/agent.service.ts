import { Injectable, BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Agent } from '../../db/models/Agent';
import { AgentRepository } from '../../db/models';
import { AuthService } from '../auth/auth.service';
import { AnalyticsService } from '../../analytics/analytics.service';
import { publicKeyToAgentId, verifyEd25519 } from '../auth/crypto';

@Injectable()
export class AgentService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Agent) private readonly agentRepo: AgentRepository,
    private readonly authService: AuthService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Transactional()
  async register(publicKey: string, alias?: string): Promise<{ agent: Agent; apiKey: string }> {
    if (!/^[0-9a-f]{64}$/i.test(publicKey)) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_PUBLIC_KEY',
        message: 'public_key must be a 64-character hex-encoded Ed25519 public key',
      });
    }

    const agentId = publicKeyToAgentId(publicKey.toLowerCase());

    const existing = await this.agentRepo.findOne({ id: agentId });
    if (existing) {
      throw new ConflictException({
        ok: false,
        error: 'AGENT_EXISTS',
        message: 'An agent with this public key is already registered',
      });
    }

    let normalizedAlias: string | undefined;
    if (alias !== undefined) {
      normalizedAlias = this.normalizeAlias(alias);
      await this.checkAliasUnique(normalizedAlias);
    }

    const agent = new Agent(agentId, publicKey.toLowerCase());
    if (normalizedAlias) agent.alias = normalizedAlias;

    this.em.persist(agent);

    const apiKey = await this.authService.createKey(agent, 'default');

    this.analyticsService.track('agent_created', {
      distinct_id: agent.id,
      alias: normalizedAlias ?? null,
    });

    return { agent, apiKey };
  }

  async findById(id: string): Promise<Agent> {
    const agent = await this.agentRepo.findOne({ id });
    if (!agent) {
      throw new NotFoundException({
        ok: false,
        error: 'AGENT_NOT_FOUND',
        message: 'Agent not found',
      });
    }
    return agent;
  }

  async findByIds(ids: string[]): Promise<Agent[]> {
    if (ids.length === 0) return [];
    return this.agentRepo.find({ id: { $in: ids } });
  }

  async findByAlias(alias: string): Promise<Agent | null> {
    return this.agentRepo.findOne({ alias });
  }

  async resolveByIdOrAlias(target: string): Promise<string> {
    if (target.startsWith('trip1')) return target;
    const normalized = target.endsWith('.ai') ? target : `${target}.ai`;
    const agent = await this.findByAlias(normalized);
    if (!agent) {
      throw new NotFoundException({
        ok: false,
        error: 'AGENT_NOT_FOUND',
        message: `Agent not found: ${target}`,
      });
    }
    return agent.id;
  }

  @Transactional()
  async updateAlias(agentId: string, alias: string | null): Promise<Agent> {
    const agent = await this.findById(agentId);

    if (alias !== null) {
      const normalized = this.normalizeAlias(alias);
      await this.checkAliasUnique(normalized, agentId);
      agent.alias = normalized;
    } else {
      agent.alias = undefined;
    }

    return agent;
  }

  @Transactional()
  async updateMetadata(agentId: string, metadata: Record<string, unknown>): Promise<Agent> {
    const agent = await this.findById(agentId);
    agent.metadata = metadata;
    return agent;
  }

  async revokeAndRegenerateKey(agentId: string): Promise<string> {
    const agent = await this.findById(agentId);
    return this.em.transactional(async () => {
      await this.authService.revokeAllKeys(agentId);
      return this.authService.createKey(agent, 'default');
    });
  }

  /**
   * Recover API key via Ed25519 signed token.
   * Token format: base64url(payload).base64url(signature)
   * Payload: { sub: "key-recovery", iss: "trip1...", exp: unix, jti: nonce }
   */
  async recoverKey(token: string): Promise<string> {
    const dot = token.indexOf('.');
    if (dot === -1) {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Malformed recovery token' });
    }

    const payloadB64 = token.slice(0, dot);
    const signatureB64 = token.slice(dot + 1);

    let payload: { sub: string; iss: string; exp: number; jti: string };
    try {
      payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    } catch {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Malformed recovery token' });
    }

    if (payload.sub !== 'key-recovery' || !payload.iss || !payload.exp || !payload.jti) {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Invalid recovery token payload' });
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException({ ok: false, error: 'TOKEN_EXPIRED', message: 'Recovery token has expired' });
    }

    const agent = await this.agentRepo.findOne({ id: payload.iss });
    if (!agent) {
      throw new UnauthorizedException({ ok: false, error: 'AGENT_NOT_FOUND', message: 'Issuing agent not found' });
    }

    const publicKey = Buffer.from(agent.publicKey, 'hex');
    const signature = Buffer.from(signatureB64, 'base64url');
    const valid = verifyEd25519(Buffer.from(payloadB64), signature, publicKey);
    if (!valid) {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Signature verification failed' });
    }

    return this.em.transactional(async () => {
      await this.authService.revokeAllKeys(agent.id);
      return this.authService.createKey(agent, 'default');
    });
  }

  private normalizeAlias(alias: string): string {
    const base = alias.endsWith('.ai') ? alias.slice(0, -3) : alias;
    this.validateAlias(base);
    return `${base}.ai`;
  }

  private validateAlias(base: string): void {
    if (base.length < 1) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'Agent alias must be at least 1 character',
      });
    }
    if (!/^[a-z0-9][a-z0-9_-]*$/.test(base)) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'Agent alias must be lowercase alphanumeric with optional hyphens or underscores',
      });
    }
  }

  private async checkAliasUnique(alias: string, excludeAgentId?: string): Promise<void> {
    const existing = await this.agentRepo.findOne({ alias });
    if (existing && existing.id !== excludeAgentId) {
      throw new ConflictException({
        ok: false,
        error: 'ALIAS_TAKEN',
        message: `Alias "${alias}" is already taken`,
      });
    }
  }
}
