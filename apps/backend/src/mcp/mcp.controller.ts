import { Controller, Post, Get, Delete, Req, Res, Logger, Inject, OnModuleDestroy } from '@nestjs/common';
import { Request, Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'crypto';
import { Public } from '../api/auth/public.decorator';
import { AuthService } from '../api/auth/auth.service';
import { createMcpServer, McpServices, MCP_SERVICES } from './mcp.server';

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes idle timeout
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // sweep every 5 minutes

interface SessionEntry {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
}

@Controller('mcp')
export class McpController implements OnModuleDestroy {
  private readonly logger = new Logger(McpController.name);
  private readonly sessions = new Map<string, SessionEntry>();
  private readonly cleanupTimer: ReturnType<typeof setInterval>;

  constructor(
    private readonly authService: AuthService,
    @Inject(MCP_SERVICES) private readonly mcpServices: McpServices,
  ) {
    this.cleanupTimer = setInterval(() => this.cleanupIdleSessions(), CLEANUP_INTERVAL_MS);
  }

  onModuleDestroy() {
    clearInterval(this.cleanupTimer);
    for (const [, entry] of this.sessions) {
      entry.transport.close?.();
    }
    this.sessions.clear();
  }

  @Public()
  @Post()
  async handlePost(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    const existing = sessionId ? this.sessions.get(sessionId) : undefined;
    if (sessionId && existing) {
      existing.lastActivity = Date.now();
      await existing.transport.handleRequest(req, res, req.body);
      return;
    }

    if (sessionId) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // New session — authenticate and create transport + server
    const agentId = await this.resolveAgentId(req);
    if (!agentId) {
      const apiUrl = (process.env.API_URL || 'https://api.tokenrip.com').replace(/\/+$/, '');
      res
        .status(401)
        .set('WWW-Authenticate', `Bearer resource_metadata="${apiUrl}/.well-known/oauth-protected-resource"`)
        .json({ error: 'Valid API key required (Authorization: Bearer tr_...)' });
      return;
    }

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
    });

    const server = createMcpServer(this.mcpServices, agentId);
    await server.connect(transport);

    transport.onclose = () => {
      const sid = transport.sessionId;
      if (sid) {
        this.sessions.delete(sid);
        this.logger.debug(`MCP session closed: ${sid}`);
      }
    };

    await transport.handleRequest(req, res, req.body);

    if (transport.sessionId) {
      this.sessions.set(transport.sessionId, { transport, lastActivity: Date.now() });
      this.logger.debug(`MCP session created: ${transport.sessionId}`);
    }
  }

  @Public()
  @Get()
  async handleGet(@Req() req: Request, @Res() res: Response) {
    const entry = this.getSession(req);
    if (!entry) { res.status(404).json({ error: 'Session not found' }); return; }
    entry.lastActivity = Date.now();
    await entry.transport.handleRequest(req, res);
  }

  @Public()
  @Delete()
  async handleDelete(@Req() req: Request, @Res() res: Response) {
    const entry = this.getSession(req);
    if (!entry) { res.status(404).json({ error: 'Session not found' }); return; }
    await entry.transport.handleRequest(req, res);
  }

  private getSession(req: Request): SessionEntry | undefined {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    return sessionId ? this.sessions.get(sessionId) : undefined;
  }

  private cleanupIdleSessions() {
    const now = Date.now();
    for (const [sessionId, entry] of this.sessions) {
      if (now - entry.lastActivity > SESSION_TTL_MS) {
        entry.transport.close?.();
        this.sessions.delete(sessionId);
        this.logger.debug(`MCP session expired: ${sessionId}`);
      }
    }
  }

  private async resolveAgentId(req: Request): Promise<string | null> {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return null;

    const rawKey = authHeader.slice(7);
    if (rawKey.startsWith('ut_')) return null;

    const result = await this.authService.validateKey(rawKey);
    return result?.agentId ?? null;
  }
}
