import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { Agent } from '../../db/models/Agent';
import { AuthService } from '../auth/auth.service';
import { publicKeyToAgentId } from '../auth/crypto';

@Injectable()
export class AgentService {
  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService,
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

    const existing = await this.em.findOne(Agent, { id: agentId });
    if (existing) {
      throw new ConflictException({
        ok: false,
        error: 'AGENT_EXISTS',
        message: 'An agent with this public key is already registered',
      });
    }

    if (alias !== undefined) {
      this.validateAlias(alias);
      await this.checkAliasUnique(alias);
    }

    const agent = new Agent(agentId, publicKey.toLowerCase());
    if (alias) agent.alias = alias;

    this.em.persist(agent);

    const apiKey = await this.authService.createKey(agent, 'default');

    return { agent, apiKey };
  }

  async findById(id: string): Promise<Agent> {
    const agent = await this.em.findOne(Agent, { id });
    if (!agent) {
      throw new NotFoundException({
        ok: false,
        error: 'AGENT_NOT_FOUND',
        message: 'Agent not found',
      });
    }
    return agent;
  }

  @Transactional()
  async updateAlias(agentId: string, alias: string | null): Promise<Agent> {
    const agent = await this.findById(agentId);

    if (alias !== null) {
      this.validateAlias(alias);
      await this.checkAliasUnique(alias, agentId);
      agent.alias = alias;
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

  private validateAlias(alias: string): void {
    if (!alias.endsWith('.ai')) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'Agent alias must end with .ai',
      });
    }
    if (alias.length < 4) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'Agent alias must be at least 4 characters (including .ai)',
      });
    }
    if (!/^[a-z0-9][a-z0-9-]*\.ai$/.test(alias)) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'Agent alias must be lowercase alphanumeric with optional hyphens, ending in .ai',
      });
    }
  }

  private async checkAliasUnique(alias: string, excludeAgentId?: string): Promise<void> {
    const existing = await this.em.findOne(Agent, { alias });
    if (existing && existing.id !== excludeAgentId) {
      throw new ConflictException({
        ok: false,
        error: 'ALIAS_TAKEN',
        message: `Alias "${alias}" is already taken`,
      });
    }
  }
}
