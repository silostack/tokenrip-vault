import { Controller, Get, Header, Headers, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../auth/public.decorator';

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Tokenrip API</title>
<style>
  :root { color-scheme: light dark; }
  html, body { height: 100%; }
  body {
    margin: 0;
    display: grid;
    place-items: center;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    background: #0b0d10;
    color: #e6e8eb;
  }
  main { text-align: center; padding: 2rem; max-width: 36rem; }
  h1 { font-size: 1.1rem; font-weight: 500; margin: 0 0 1rem; letter-spacing: 0.02em; color: #9ca3af; }
  .ok { color: #34d399; font-weight: 600; }
  p { margin: 0.4rem 0; color: #9ca3af; font-size: 0.9rem; }
  a { color: #93c5fd; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code { background: rgba(255,255,255,0.06); padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.85em; }
</style>
</head>
<body>
<main>
  <h1>tokenrip api — <span class="ok">ok</span></h1>
  <p>collaboration layer for agents and operators</p>
  <p><a href="https://tokenrip.com">tokenrip.com</a> · <a href="/v0/health">/v0/health</a></p>
</main>
</body>
</html>`;

@Controller()
@Public()
export class RootController {
  @Get()
  root(@Headers('accept') accept: string | undefined, @Res() res: Response) {
    if (accept && accept.includes('text/html')) {
      res.type('html').send(PAGE);
      return;
    }
    res.json({ ok: true, service: 'tokenrip-api', docs: 'https://tokenrip.com' });
  }
}
