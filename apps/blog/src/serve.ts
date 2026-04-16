import { renderArticlePage } from './templates/article';
import { renderIndexPage } from './templates/index';
import { renderRssFeed } from './templates/rss';
import { renderSitemap } from './templates/sitemap';
import { BlogApiClient } from './api-client';

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  return accept.includes('text/markdown');
}

function readConfig() {
  const port = parseInt(process.env.PORT || '3600', 10);
  return {
    tokenripUrl: process.env.TOKENRIP_API_URL || 'http://localhost:3434',
    tokenripApiKey: process.env.TOKENRIP_API_KEY || '',
    basePath: process.env.BLOG_BASE_PATH || '/blog',
    baseUrl: process.env.BASE_URL || `http://localhost:${port}`,
    port,
  };
}

export function createBlogServer(port?: number) {
  const config = readConfig();
  const client = new BlogApiClient(config.tokenripUrl, config.tokenripApiKey);
  const slugPattern = new RegExp(
    `^${config.basePath}/([a-z0-9][a-z0-9-]*)$`,
  );
  const assetsPrefix = `${config.basePath}/_assets/`;
  const tagPrefix = `${config.basePath}/tag/`;

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
      const limit = parseInt(url.searchParams.get('limit') || '20', 10);
      const offset = parseInt(url.searchParams.get('offset') || '0', 10);
      const { posts } = await client.listPosts({ limit, offset });
      const html = renderIndexPage(posts, config.baseUrl);
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Tag pages: /blog/tag/:tag
    if (pathname.startsWith(tagPrefix)) {
      const tag = pathname.slice(tagPrefix.length).replace(/\/$/, '');
      if (tag) {
        const { posts } = await client.listPosts({ tag, limit: 100 });
        const html = renderIndexPage(posts, config.baseUrl);
        return new Response(html, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    }

    // RSS feed
    if (pathname === `${config.basePath}/rss.xml`) {
      const { posts } = await client.listPosts({ limit: 20 });
      const xml = renderRssFeed(posts, config.baseUrl);
      return new Response(xml, {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
      });
    }

    // Sitemap
    if (pathname === `${config.basePath}/sitemap.xml`) {
      const { posts } = await client.listPosts({ limit: 1000 });
      const xml = renderSitemap(posts, config.baseUrl);
      return new Response(xml, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
      });
    }

    // Article pages: /blog/:slug
    const slugMatch = pathname.match(slugPattern);
    if (slugMatch) {
      const slug = slugMatch[1];
      const post = await client.getPost(slug);
      if (!post) {
        return new Response('Not found', {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        });
      }

      if (wantsMarkdown(req.headers.get('accept'))) {
        return new Response(post.content, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            Vary: 'Accept',
          },
        });
      }

      const html = renderArticlePage(post, config.baseUrl);
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
