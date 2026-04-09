import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { Auth, AuthAgent } from '../auth/auth.decorator';
import { InboxService } from '../service/inbox.service';

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
  ) {
    if (!since) {
      throw new BadRequestException({
        ok: false,
        error: 'MISSING_FIELD',
        message: 'since query parameter is required (ISO 8601 timestamp)',
      });
    }

    const sinceDate = new Date(since);
    if (isNaN(sinceDate.getTime())) {
      throw new BadRequestException({
        ok: false,
        error: 'INVALID_FIELD',
        message: 'since must be a valid ISO 8601 timestamp',
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

    const result = await this.inboxService.getInbox(agent.id, sinceDate, {
      types: parsedTypes,
      limit: parsedLimit,
    });

    return { ok: true, data: result };
  }
}
