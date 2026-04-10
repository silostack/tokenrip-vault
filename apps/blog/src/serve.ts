import { renderArticlePage } from './templates/article';
import { renderIndexPage } from './templates/index';

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  return accept.includes('text/markdown');
}

function readConfig() {
  const port = parseInt(process.env.PORT || '3600', 10);
  return {
    engineUrl: process.env.BLOG_ENGINE_URL || 'http://localhost:3500',
    basePath: process.env.BLOG_BASE_PATH || '/blog',
    baseUrl: process.env.BASE_URL || `http://localhost:${port}`,
    port,
  };
}

export function createBlogServer(port?: number) {
  const config = readConfig();
  const slugPattern = new RegExp(
    `^${config.basePath}/([a-z0-9][a-z0-9-]*)$`,
  );
  const assetsPrefix = `${config.basePath}/_assets/`;

  async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Static assets
    if (pathname.startsWith(assetsPrefix)) {
      const assetPath = pathname.slice(assetsPrefix.length);
      const file = Bun.file(`dist/client/${assetPath}`);
      if (await file.exists()) {
        return new Response(file);
      }
      return new Response('Not found', { status: 404 });
    }

    // Index page
    if (pathname === config.basePath || pathname === `${config.basePath}/`) {
      const limit = url.searchParams.get('limit') || '20';
      const offset = url.searchParams.get('offset') || '0';
      const res = await fetch(
        `${config.engineUrl}/articles?limit=${limit}&offset=${offset}`,
      );
      const json = await res.json();
      const html = renderIndexPage(json.articles, config.baseUrl);
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Article pages: /blog/:slug
    const slugMatch = pathname.match(slugPattern);
    if (slugMatch) {
      const slug = slugMatch[1];
      const res = await fetch(`${config.engineUrl}/articles/${slug}`);
      if (!res.ok) {
        return new Response('Not found', {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      const { frontmatter, content } = await res.json();

      if (wantsMarkdown(req.headers.get('accept'))) {
        return new Response(content, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            Vary: 'Accept',
          },
        });
      }

      const html = renderArticlePage(frontmatter, content, config.baseUrl);
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          Vary: 'Accept',
        },
      });
    }

    return new Response('Not found', { status: 404 });
  }

  return Bun.serve({
    port: port ?? config.port,
    fetch: handleRequest,
  });
}

if (import.meta.main) {
  const server = createBlogServer();
  console.log(`blog listening on :${server.port}`);
}
