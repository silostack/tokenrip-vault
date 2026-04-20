import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { Auth, AuthAgent } from '../auth/auth.decorator';
import { InboxService } from '../service/inbox.service';
import { parseSince } from '../service/search.service';

@Controller('v0/inbox')
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Auth('agent')
  @Get()
  async getInbox(
    @AuthAgent() agent: { id: string },
    @Query('since') since: string | undefined,
    @Query('types') types: string | undefined,
    @Query('limit') limit: string | undefined,
    @Query('q') q: string | undefined,
    @Query('state') state: string | undefined,
    @Query('type') type: string | undefined,
    @Query('kind') kind: string | undefined,
    @Query('team') team: string | undefined,
  ) {
    let sinceDate: Date | undefined;
    try {
      sinceDate = parseSince(since);
    } catch {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_FIELD',
        message: 'since must be a valid ISO 8601 timestamp or integer (days back)',
      });
    }

    if (!sinceDate) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'since query parameter is required (ISO 8601 timestamp or integer days)',
      });
    }

    const parsedTypes = types ? types.split(',').map((t) => t.trim()) : undefined;
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;

    if (parsedLimit !== undefined && isNaN(parsedLimit)) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_FIELD',
        message: 'limit must be a valid integer',
      });
    }

    // Resolve type from: type param, kind alias, or legacy types param
    const resolvedType = type ?? kind;

    const result = await this.inboxService.getInbox(agent.id, sinceDate, {
      types: parsedTypes,
      limit: parsedLimit,
      q: q || undefined,
      state: state || undefined,
      type: resolvedType || undefined,
      team: team || undefined,
    });

    return { ok: true, data: result };
  }
}
