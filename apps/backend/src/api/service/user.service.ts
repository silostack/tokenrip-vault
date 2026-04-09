import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { randomBytes } from 'crypto';
import { sha256 } from '../auth/crypto';
import { User } from '../../db/models/User';
import { UserRepository } from '../../db/models';
import { hashPassword, verifyPassword } from '../auth/password';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User) private readonly userRepo: UserRepository,
  ) {}

  @Transactional()
  async createAnonymous(): Promise<User> {
    const user = new User();
    this.em.persist(user);
    return user;
  }

  @Transactional()
  async register(
    displayName: string,
    password: string | null,
    alias?: string,
  ): Promise<{ user: User; sessionToken: string }> {
    if (alias) {
      this.validateAlias(alias);
      await this.checkAliasUnique(alias);
    }

    const user = new User();
    user.displayName = displayName;
    user.registered = true;
    if (password) user.passwordHash = await hashPassword(password);
    if (alias) user.alias = alias;

    const sessionToken = this.generateSessionToken();
    user.sessionTokenHash = sha256(sessionToken);

    this.em.persist(user);

    return { user, sessionToken };
  }

  @Transactional()
  async login(alias: string, password: string): Promise<{ user: User; sessionToken: string }> {
    const user = await this.userRepo.findOne({ alias });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid alias or password',
      });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException({
        ok: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid alias or password',
      });
    }

    const sessionToken = this.generateSessionToken();
    user.sessionTokenHash = sha256(sessionToken);

    return { user, sessionToken };
  }

  @Transactional()
  async createSession(user: User): Promise<{ user: User; sessionToken: string }> {
    const sessionToken = this.generateSessionToken();
    user.sessionTokenHash = sha256(sessionToken);
    return { user, sessionToken };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ id });
    if (!user) {
      throw new NotFoundException({
        ok: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }
    return user;
  }

  private generateSessionToken(): string {
    return `ut_${randomBytes(32).toString('hex')}`;
  }

  private validateAlias(alias: string): void {
    if (alias.endsWith('.ai')) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'User alias must not end with .ai',
      });
    }
    if (alias.length < 3) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'Alias must be at least 3 characters',
      });
    }
    if (!/^[a-z0-9][a-z0-9-]*$/.test(alias)) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_ALIAS',
        message: 'Alias must be lowercase alphanumeric with optional hyphens',
      });
    }
  }

  private async checkAliasUnique(alias: string): Promise<void> {
    const existing = await this.userRepo.findOne({ alias });
    if (existing) {
      throw new BadRequestException({
        ok: false,
        error: 'ALIAS_TAKEN',
        message: `Alias "${alias}" is already taken`,
      });
    }
  }
}
