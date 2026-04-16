import type { BlogPostSummary } from './types';

export function renderSitemap(
  posts: BlogPostSummary[],
  baseUrl: string,
): string {
  const urls = posts
    .map((p) => {
      const lastmod = p.updatedAt || p.metadata.publish_date;
      return `  <url>
    <loc>${baseUrl}/blog/${p.alias}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
