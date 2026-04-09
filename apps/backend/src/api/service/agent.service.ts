import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { randomBytes } from 'crypto';
import { Agent } from '../../db/models/Agent';
import { AgentRepository } from '../../db/models';
import { AuthService } from '../auth/auth.service';
import { publicKeyToAgentId, sha256 } from '../auth/crypto';

@Injectable()
export class AgentService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Agent) private readonly agentRepo: AgentRepository,
    private readonly authService: AuthService,
  ) {}

  @Transactional()
  async register(publicKey: string, alias?: string): Promise<{ agent: Agent; apiKey: string; operatorRegistrationUrl: string }> {
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

    if (alias !== undefined) {
      this.validateAlias(alias);
      await this.checkAliasUnique(alias);
    }

    const agent = new Agent(agentId, publicKey.toLowerCase());
    if (alias) agent.alias = alias;

    const operatorToken = `ot_${randomBytes(32).toString('hex')}`;
    agent.operatorTokenHash = sha256(operatorToken);

    this.em.persist(agent);

    const apiKey = await this.authService.createKey(agent, 'default');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3333';
    const operatorRegistrationUrl = `${frontendUrl}/operators/register?token=${operatorToken}`;

    return { agent, apiKey, operatorRegistrationUrl };
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

  async findByAlias(alias: string): Promise<Agent | null> {
    return this.agentRepo.findOne({ alias });
  }

  async resolveByIdOrAlias(target: string): Promise<string> {
    if (target.startsWith('trip1')) return target;
    const agent = await this.findByAlias(target);
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
