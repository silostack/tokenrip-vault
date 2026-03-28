import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('keys')
  async createKey(@Body() body: { name: string }) {
    if (!body?.name) {
      throw new BadRequestException({ ok: false, error: 'MISSING_FIELD', message: 'name is required' });
    }

    const apiKey = await this.authService.createKey(body.name);
    return { ok: true, data: { apiKey } };
  }

  @Post('revoke')
  async revoke(@Headers('authorization') auth: string) {
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException({ ok: false, error: 'MISSING_API_KEY', message: 'Authorization header required' });
    }
    const rawKey = auth.slice(7);
    try {
      await this.authService.revokeKey(rawKey);
    } catch {
      throw new UnauthorizedException({ ok: false, error: 'INVALID_API_KEY', message: 'Key not found' });
    }
    return { ok: true };
  }
}
