import type { BlogPostSummary } from './types';
import { escapeHtml as esc } from './escape';

export function renderRssFeed(
  posts: BlogPostSummary[],
  baseUrl: string,
): string {
  const items = posts
    .map((p) => {
      const m = p.metadata;
      const categories = (m.tags || [])
        .map((t) => `      <category>${esc(t)}</category>`)
        .join('\n');
      return `    <item>
      <title>${esc(m.title)}</title>
      <link>${baseUrl}/blog/${p.alias}</link>
      <guid>${baseUrl}/blog/${p.alias}</guid>
      <description>${esc(m.description || '')}</description>
      <pubDate>${new Date(m.publish_date).toUTCString()}</pubDate>
      <author>${esc(m.author)}</author>
${categories}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TokenRip Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Latest articles from TokenRip</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}
