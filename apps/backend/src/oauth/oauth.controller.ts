import { Controller, Post, Get, Body, BadRequestException, Res, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import { Public } from '../api/auth/public.decorator';
import { OAuthService } from './oauth.service';

@Controller()
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  /** OAuth 2.0 Protected Resource Metadata (RFC 9728) — MCP clients read this first */
  @Public()
  @Get('.well-known/oauth-protected-resource')
  getResourceMetadata() {
    const apiUrl = (process.env.API_URL || 'https://api.tokenrip.com').replace(/\/+$/, '');
    return {
      resource: apiUrl,
      authorization_servers: [apiUrl],
    };
  }

  /** OAuth 2.1 Authorization Server Metadata (RFC 8414) */
  @Public()
  @Get('.well-known/oauth-authorization-server')
  getMetadata() {
    const issuer = (process.env.API_URL || 'https://api.tokenrip.com').replace(/\/+$/, '');
    const frontendUrl = (process.env.FRONTEND_URL || 'https://app.tokenrip.com').replace(/\/+$/, '');

    return {
      issuer,
      authorization_endpoint: `${frontendUrl}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      registration_endpoint: `${issuer}/register`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
    };
  }

  /**
   * OAuth 2.0 Dynamic Client Registration (RFC 7591)
   * MCP clients (e.g. Claude.ai) register here to obtain a client_id before
   * beginning the authorization code flow. We don't validate client_id downstream
   * since all auth flows go through user registration/login forms.
   */
  @Public()
  @Post('register')
  @HttpCode(201)
  dynamicClientRegistration(@Body() body: Record<string, unknown>, @Res({ passthrough: true }) res: Response) {
    const clientId = randomUUID();
    const clientIdIssuedAt = Math.floor(Date.now() / 1000);

    // Echo back accepted registration metadata alongside the issued client_id
    res.set('Cache-Control', 'no-store');
    return {
      client_id: clientId,
      client_id_issued_at: clientIdIssuedAt,
      ...(body.client_name ? { client_name: body.client_name } : {}),
      ...(body.redirect_uris ? { redirect_uris: body.redirect_uris } : {}),
      ...(body.grant_types ? { grant_types: body.grant_types } : { grant_types: ['authorization_code'] }),
      ...(body.response_types ? { response_types: body.response_types } : { response_types: ['code'] }),
      token_endpoint_auth_method: 'none',
      ...(body.scope ? { scope: body.scope } : {}),
    };
  }

  /** Register a new agent + user + operator binding, returns an auth code */
  @Public()
  @Post('oauth/register')
  async register(@Body() body: {
    displayName?: string;
    password?: string;
    agentAlias?: string;
    userAlias?: string;
    codeChallenge?: string;
    redirectUri?: string;
  }) {
    if (!body.displayName || !body.password || !body.codeChallenge || !body.redirectUri) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELDS',
        message: 'displayName, password, codeChallenge, and redirectUri are required',
      });
    }

    const { code } = await this.oauthService.register({
      displayName: body.displayName,
      password: body.password,
      agentAlias: body.agentAlias,
      userAlias: body.userAlias,
      codeChallenge: body.codeChallenge,
      redirectUri: body.redirectUri,
    });

    return { ok: true, code };
  }

  /** Log in an existing user, returns an auth code */
  @Public()
  @Post('oauth/login')
  async login(@Body() body: {
    alias?: string;
    password?: string;
    codeChallenge?: string;
    redirectUri?: string;
  }) {
    if (!body.alias || !body.password || !body.codeChallenge || !body.redirectUri) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELDS',
        message: 'alias, password, codeChallenge, and redirectUri are required',
      });
    }

    const { code } = await this.oauthService.login({
      alias: body.alias,
      password: body.password,
      codeChallenge: body.codeChallenge,
      redirectUri: body.redirectUri,
    });

    return { ok: true, code };
  }

  /** Link an existing CLI agent to the OAuth flow via short code */
  @Public()
  @Post('oauth/link-agent')
  async linkAgent(@Body() body: {
    code?: string;
    displayName?: string;
    password?: string;
    userAlias?: string;
    codeChallenge?: string;
    redirectUri?: string;
  }) {
    if (!body.code || !body.codeChallenge || !body.redirectUri) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELDS',
        message: 'code, codeChallenge, and redirectUri are required',
      });
    }

    const { code } = await this.oauthService.linkAgent({
      code: body.code,
      displayName: body.displayName,
      password: body.password,
      userAlias: body.userAlias,
      codeChallenge: body.codeChallenge,
      redirectUri: body.redirectUri,
    });

    return { ok: true, code };
  }

  /** Exchange auth code for access token (OAuth 2.1 token endpoint) */
  @Public()
  @Post('oauth/token')
  async token(@Body() body: {
    grant_type?: string;
    code?: string;
    code_verifier?: string;
    redirect_uri?: string;
  }) {
    if (body.grant_type !== 'authorization_code') {
      throw new BadRequestException({
        ok: false,
        error: 'UNSUPPORTED_GRANT_TYPE',
        message: 'Only authorization_code grant type is supported',
      });
    }

    if (!body.code || !body.code_verifier || !body.redirect_uri) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELDS',
        message: 'code, code_verifier, and redirect_uri are required',
      });
    }

    const result = await this.oauthService.exchangeCode({
      code: body.code,
      codeVerifier: body.code_verifier,
      redirectUri: body.redirect_uri,
    });

    return {
      access_token: result.accessToken,
      token_type: result.tokenType,
      expires_in: 31536000,
    };
  }

  /** Link CLI to an existing MCP-registered agent (downloads server-side keypair) */
  @Public()
  @Post('oauth/cli-link')
  async cliLink(@Body() body: {
    alias?: string;
    password?: string;
  }) {
    if (!body.alias || !body.password) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELDS',
        message: 'alias and password are required',
      });
    }

    const result = await this.oauthService.cliLink(body.alias, body.password);

    return {
      ok: true,
      data: {
        agent_id: result.agentId,
        public_key: result.publicKey,
        secret_key: result.secretKey,
        api_key: result.apiKey,
      },
    };
  }

  /** Check alias availability (for frontend inline validation) */
  @Public()
  @Post('oauth/check-alias')
  async checkAlias(@Body() body: { agentAlias?: string; userAlias?: string }) {
    const result: Record<string, boolean> = {};

    if (body.agentAlias) {
      try {
        result.agentAliasAvailable = await this.oauthService.checkAgentAliasAvailable(body.agentAlias);
      } catch {
        result.agentAliasAvailable = false;
      }
    }

    if (body.userAlias) {
      try {
        result.userAliasAvailable = await this.oauthService.checkUserAliasAvailable(body.userAlias);
      } catch {
        result.userAliasAvailable = false;
      }
    }

    return { ok: true, ...result };
  }
}
