import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller('api/health')
@Public()
export class HealthController {
  @Get()
  check() {
    return { ok: true };
  }
}
