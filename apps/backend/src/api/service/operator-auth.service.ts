import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { agentIdToPublicKey, verifyEd25519 } from '../auth/crypto';
import { Agent } from '../../db/models/Agent';
import { User } from '../../db/models/User';
import { OperatorBinding } from '../../db/models/OperatorBinding';
import { AgentRepository, OperatorBindingRepository } from '../../db/models';
import { UserService } from './user.service';

interface OperatorTokenPayload {
  sub: string;
  iss: string;
  exp: number;
  jti: string;
}

@Injectable()
export class OperatorAuthService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Agent) private readonly agentRepo: AgentRepository,
    @InjectRepository(OperatorBinding) private readonly bindingRepo: OperatorBindingRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Verify an Ed25519-signed operator token.
   * Format: base64url(payload).base64url(signature)
   * Payload: { sub: "operator-auth", iss: "rip1...", exp: unix, jti: nonce }
   */
  verifyToken(token: string): OperatorTokenPayload {
    const dot = token.indexOf('.');
    if (dot === -1) {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Malformed operator token' });
    }

    const payloadB64 = token.slice(0, dot);
    const signatureB64 = token.slice(dot + 1);

    let payload: OperatorTokenPayload;
    try {
      payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    } catch {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Malformed operator token' });
    }

    if (payload.sub !== 'operator-auth' || !payload.iss || !payload.exp || !payload.jti) {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Invalid operator token payload' });
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException({ ok: false, error: 'TOKEN_EXPIRED', message: 'Operator token has expired' });
    }

    let publicKey: Buffer;
    try {
      publicKey = agentIdToPublicKey(payload.iss);
    } catch {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Invalid issuer agent ID' });
    }

    const signature = Buffer.from(signatureB64, 'base64url');
    const valid = verifyEd25519(Buffer.from(payloadB64), signature, publicKey);
    if (!valid) {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_TOKEN', message: 'Signature verification failed' });
    }

    return payload;
  }

  /**
   * Authenticate an operator via signed token.
   * If OperatorBinding exists: auto-login (create new session for bound user).
   * If no binding: register new user and create binding.
   */
  @Transactional()
  async authenticate(
    token: string,
    registration?: { displayName: string; password?: string; alias?: string },
  ): Promise<{ userId: string; sessionToken: string; isNewRegistration: boolean }> {
    const payload = this.verifyToken(token);

    const [agent, binding] = await Promise.all([
      this.agentRepo.findOne({ id: payload.iss }),
      this.bindingRepo.findOne({ agent: { id: payload.iss } }, { populate: ['user'] }),
    ]);
    if (!agent) {
      throw new UnauthorizedException({ ok: false, error: 'AGENT_NOT_FOUND', message: 'Issuing agent not found' });
    }

    if (binding) {
      // Auto-login: create new session for existing bound user
      const { user, sessionToken } = await this.userService.createSession(binding.user);
      return { userId: user.id, sessionToken, isNewRegistration: false };
    }

    // First-time registration: create user + binding
    if (!registration?.displayName) {
      throw new BadRequestException({
        ok: false,
        error: 'REGISTRATION_REQUIRED',
        message: 'No operator binding exists. Provide display_name to register.',
      });
    }

    const { user, sessionToken } = await this.userService.register(
      registration.displayName, registration.password ?? null, registration.alias,
    );

    const newBinding = new OperatorBinding(agent, user);
    this.em.persist(newBinding);

    return { userId: user.id, sessionToken, isNewRegistration: true };
  }

  /**
   * Bind an agent (identified by signed token) to an already-authenticated user.
   * Idempotent — safe to call if the binding already exists.
   */
  @Transactional()
  async bindExistingUser(token: string, userId: string): Promise<{ agentId: string }> {
    const payload = this.verifyToken(token);

    const [agent, existing] = await Promise.all([
      this.agentRepo.findOne({ id: payload.iss }),
      this.bindingRepo.findOne({ agent: { id: payload.iss }, user: { id: userId } }),
    ]);
    if (!agent) {
      throw new UnauthorizedException({ ok: false, error: 'AGENT_NOT_FOUND', message: 'Issuing agent not found' });
    }

    if (!existing) {
      this.em.persist(new OperatorBinding(agent, this.em.getReference(User, userId)));
    }

    return { agentId: agent.id };
  }
}
