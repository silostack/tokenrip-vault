import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { Auth, AuthAgent, AuthUser } from '../auth/auth.decorator';
import { SearchService, SearchFilters, parseSince } from '../service/search.service';
import { OperatorBindingService } from '../service/operator-binding.service';

function parseSearchQuery(query: Record<string, string | undefined>): SearchFilters {
  let since: Date | undefined;
  try {
    since = parseSince(query.since);
  } catch {
    throw new BadRequestException({
      ok: false,
      error: 'INVALID_FIELD',
      message: 'since must be a valid ISO 8601 timestamp or integer (days back)',
    });
  }

  let limit: number | undefined;
  if (query.limit !== undefined) {
    limit = parseInt(query.limit, 10);
    if (isNaN(limit)) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_FIELD',
        message: 'limit must be a valid integer',
      });
    }
  }

  let offset: number | undefined;
  if (query.offset !== undefined) {
    offset = parseInt(query.offset, 10);
    if (isNaN(offset)) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_FIELD',
        message: 'offset must be a valid integer',
      });
    }
  }

  if (query.type !== undefined && query.type !== 'thread' && query.type !== 'asset') {
    throw new BadRequestException({
      ok: false,
      error: 'INVALID_FIELD',
      message: 'type must be "thread" or "asset"',
    });
  }

  if (query.state !== undefined && query.state !== 'open' && query.state !== 'closed') {
    throw new BadRequestException({
      ok: false,
      error: 'INVALID_FIELD',
      message: 'state must be "open" or "closed"',
    });
  }

  return {
    q: query.q,
    type: query.type as 'thread' | 'asset' | undefined,
    since,
    limit,
    offset,
    state: query.state as 'open' | 'closed' | undefined,
    intent: query.intent,
    ref: query.ref,
    asset_type: query.asset_type,
  };
}

@Controller('v0')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly bindingService: OperatorBindingService,
  ) {}

  @Auth('agent')
  @Get('search')
  async agentSearch(
    @AuthAgent() agent: { id: string },
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('state') state?: string,
    @Query('intent') intent?: string,
    @Query('ref') ref?: string,
    @Query('asset_type') asset_type?: string,
  ) {
    const filters = parseSearchQuery({ q, type, since, limit, offset, state, intent, ref, asset_type });
    const result = await this.searchService.searchForAgent(agent.id, filters);
    return { ok: true, data: result };
  }

  @Auth('user')
  @Get('operator/search')
  async operatorSearch(
    @AuthUser() user: { id: string },
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('since') since?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('state') state?: string,
    @Query('intent') intent?: string,
    @Query('ref') ref?: string,
    @Query('asset_type') asset_type?: string,
  ) {
    const agent = await this.bindingService.findBoundAgent(user.id);
    if (!agent) {
      throw new BadRequestException({
        ok: false,
        error: 'NO_BINDING',
        message: 'No agent binding found for this user',
      });
    }

    const filters = parseSearchQuery({ q, type, since, limit, offset, state, intent, ref, asset_type });
    const result = await this.searchService.searchForOperator(agent.id, user.id, filters);
    return { ok: true, data: result };
  }
}
