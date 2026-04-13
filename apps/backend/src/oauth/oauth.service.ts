import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { randomBytes, createHash, generateKeyPairSync } from 'crypto';
import { sha256, publicKeyToAgentId } from '../api/auth/crypto';
import { AgentService } from '../api/service/agent.service';
import { UserService } from '../api/service/user.service';
import { AuthService } from '../api/auth/auth.service';
import { Agent } from '../db/models/Agent';
import { AgentKeyPair } from '../db/models/AgentKeyPair';
import { OAuthCode } from '../db/models/OAuthCode';
import { OperatorBinding } from '../db/models/OperatorBinding';

export interface OAuthRegistrationInput {
  displayName: string;
  password: string;
  agentAlias?: string;
  userAlias?: string;
  codeChallenge: string;
  redirectUri: string;
}

export interface OAuthLoginInput {
  alias: string;
  password: string;
  codeChallenge: string;
  redirectUri: string;
}

export interface TokenExchangeInput {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

@Injectable()
export class OAuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly agentService: AgentService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Transactional()
  async register(input: OAuthRegistrationInput): Promise<{ code: string }> {
    // Generate Ed25519 keypair server-side
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    const rawPublicKey = publicKey.export({ type: 'spki', format: 'der' }).subarray(12).toString('hex');
    const rawSecretKey = privateKey.export({ type: 'pkcs8', format: 'der' }).subarray(16).toString('hex');

    // Register agent via AgentService (handles alias validation + uniqueness)
    const { agent, apiKey } = await this.agentService.register(rawPublicKey, input.agentAlias);

    // Store server-managed keypair
    const keyPair = new AgentKeyPair(agent, this.encryptSecretKey(rawSecretKey));
    this.em.persist(keyPair);

    // Register user via UserService (handles alias validation + uniqueness)
    const { user } = await this.userService.register(input.displayName, input.password, input.userAlias);

    // Create operator binding
    const binding = new OperatorBinding(agent, user);
    this.em.persist(binding);

    // Create OAuth auth code
    const code = this.createAuthCode(agent.id, input.codeChallenge, input.redirectUri);
    return { code };
  }

  @Transactional()
  async login(input: OAuthLoginInput): Promise<{ code: string }> {
    const { user } = await this.userService.login(input.alias, input.password);

    const binding = await this.em.findOne(OperatorBinding, { user }, { populate: ['agent'] });
    if (!binding) {
      throw new UnauthorizedException({
        ok: false,
        error: 'NO_AGENT_BOUND',
        message: 'No agent is bound to this user account',
      });
    }

    const code = this.createAuthCode(binding.agent.id, input.codeChallenge, input.redirectUri);
    return { code };
  }

  @Transactional()
  async exchangeCode(input: TokenExchangeInput): Promise<{ accessToken: string; tokenType: string }> {
    const codeHash = sha256(input.code);
    const record = await this.em.findOne(OAuthCode, { codeHash });

    if (!record || record.used || record.expiresAt < new Date()) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CODE',
        message: 'Authorization code is invalid or expired',
      });
    }

    if (record.redirectUri !== input.redirectUri) {
      throw new BadRequestException({
        ok: false,
        error: 'REDIRECT_MISMATCH',
        message: 'Redirect URI does not match',
      });
    }

    // Verify PKCE: S256 = BASE64URL(SHA256(code_verifier))
    const expectedChallenge = createHash('sha256')
      .update(input.codeVerifier)
      .digest('base64url');

    if (expectedChallenge !== record.codeChallenge) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CODE_VERIFIER',
        message: 'PKCE code verifier does not match',
      });
    }

    record.used = true;

    // Revoke existing MCP OAuth keys and issue a fresh one
    const apiKey = await this.agentService.revokeAndRegenerateKey(record.agentId);
    return { accessToken: apiKey, tokenType: 'bearer' };
  }

  async checkAgentAliasAvailable(alias: string): Promise<boolean> {
    const existing = await this.agentService.findByAlias(
      alias.endsWith('.ai') ? alias : `${alias}.ai`,
    );
    return !existing;
  }

  async checkUserAliasAvailable(alias: string): Promise<boolean> {
    // Delegate validation to UserService by attempting the check
    // If alias format is invalid, UserService.register would throw
    const existing = await this.em.findOne('User', { alias });
    return !existing;
  }

  private createAuthCode(agentId: string, codeChallenge: string, redirectUri: string): string {
    const rawCode = randomBytes(32).toString('hex');
    const oauthCode = new OAuthCode(
      sha256(rawCode),
      agentId,
      codeChallenge,
      redirectUri,
      new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
    );
    this.em.persist(oauthCode);
    return rawCode;
  }

  private encryptSecretKey(secretKeyHex: string): string {
    // TODO: Implement AES-256-GCM encryption with key from SECRET_KEY_ENCRYPTION_KEY env
    return secretKeyHex;
  }
}
