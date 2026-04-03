import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { Public } from '../auth/public.decorator';

const specPath = resolve(__dirname, '../../openapi.json');
let cachedSpec: string | null = null;

@Controller('v0')
export class OpenapiController {
  @Public()
  @Get('openapi.json')
  getSpec(@Res() res: Response) {
    if (!cachedSpec) {
      cachedSpec = readFileSync(specPath, 'utf-8');
    }
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.send(cachedSpec);
  }
}
