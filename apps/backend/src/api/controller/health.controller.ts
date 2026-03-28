import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller('v0/health')
@Public()
export class HealthController {
  @Get()
  check() {
    return { ok: true };
  }
}
