import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { generateKeyPairSync } from 'crypto';
import { Agent } from '../../db/models/Agent';
import { User } from '../../db/models/User';
import { OperatorBinding } from '../../db/models/OperatorBinding';
import { AgentKeyPair } from '../../db/models/AgentKeyPair';
import { OperatorBindingRepository } from '../../db/models';
import { UserService } from './user.service';
import { AgentService } from './agent.service';

@Injectable()
export class OperatorBindingService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(OperatorBinding) private readonly bindingRepo: OperatorBindingRepository,
    private readonly userService: UserService,
    private readonly agentService: AgentService,
  ) {}

  async findBoundAgent(userId: string): Promise<Agent | null> {
    const binding = await this.bindingRepo.findOne({ user: { id: userId } }, { populate: ['agent'] });
    return binding?.agent ?? null;
  }

  async findBoundUser(agentId: string): Promise<User | null> {
    const binding = await this.bindingRepo.findOne({ agent: { id: agentId } }, { populate: ['user'] });
    return binding?.user ?? null;
  }

  /** Bind an existing agent to an existing user. */
  @Transactional()
  async create(agentId: string, userId: string): Promise<OperatorBinding> {
    const agent = await this.agentService.findById(agentId);
    const user = await this.userService.findById(userId);
    const binding = new OperatorBinding(agent, user);
    this.em.persist(binding);
    return binding;
  }

  /** Register a new user and bind them to an existing agent. */
  @Transactional()
  async registerAndBind(
    agentId: string,
    displayName: string,
    password: string,
    alias?: string,
  ): Promise<{ userId: string; sessionToken: string }> {
    const agent = await this.agentService.findById(agentId);
    const { user, sessionToken } = await this.userService.register(displayName, password, alias);
    const binding = new OperatorBinding(agent, user);
    this.em.persist(binding);
    return { userId: user.id, sessionToken };
  }

  /** Create a new server-side agent with keypair, bind it to a user. Returns agent ID. */
  @Transactional()
  async createServerAgentForUser(userId: string): Promise<string> {
    const user = await this.userService.findById(userId);

    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    const rawPublicKey = publicKey.export({ type: 'spki', format: 'der' }).subarray(12).toString('hex');
    const rawSecretKey = privateKey.export({ type: 'pkcs8', format: 'der' }).subarray(16).toString('hex');

    const { agent } = await this.agentService.register(rawPublicKey);

    // TODO: encrypt secret key with AES-256-GCM
    const keyPair = new AgentKeyPair(agent, rawSecretKey);
    this.em.persist(keyPair);

    const binding = new OperatorBinding(agent, user);
    this.em.persist(binding);

    return agent.id;
  }

  /**
   * Register a new user, create a server-side agent, and bind them together.
   * Used by browser-based registration (share page signup).
   */
  @Transactional()
  async registerWithServerAgent(
    displayName: string,
    password: string,
    alias?: string,
  ): Promise<{ userId: string; sessionToken: string; agentId: string }> {
    const { user, sessionToken } = await this.userService.register(displayName, password, alias);
    const agentId = await this.createServerAgentForUser(user.id);
    return { userId: user.id, sessionToken, agentId };
  }
}
