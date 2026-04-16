import { renderHead } from './head';
import { renderLayout } from './layout';
import { escapeHtml } from './escape';
import type { BlogPost } from './types';

export function renderArticlePage(
  post: BlogPost,
  baseUrl: string,
): string {
  const head = renderHead(post, baseUrl);
  const m = post.metadata;

  const date = m.publish_date
    ? new Date(m.publish_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const readingTime = m.reading_time ? `${m.reading_time} min read` : '';

  const tags = (m.tags || [])
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join(' ');

  const bylineParts: string[] = [];
  if (m.author) bylineParts.push(`<span>${escapeHtml(m.author)}</span>`);
  if (date)
    bylineParts.push(`<time datetime="${m.publish_date}">${date}</time>`);
  if (readingTime) bylineParts.push(`<span>${readingTime}</span>`);
  const byline = bylineParts.join('<span class="separator">&middot;</span>');

  // Strip leading H1 from markdown — we display the title in the metadata header
  const content = post.content.replace(/^\s*#\s+[^\n]+\n?/, '');

  const body = `
<main>
  <div class="article-meta">
    <a href="/blog" class="back-link">&larr; Back to blog</a>
    <h1>${escapeHtml(m.title)}</h1>
    ${byline ? `<div class="byline">${byline}</div>` : ''}
    ${tags ? `<div class="article-tags">${tags}</div>` : ''}
  </div>
  <div id="markdown-source">${escapeHtml(content)}</div>
  <div id="markdown-rendered" class="hidden"></div>
</main>`;

  return renderLayout(head, body);
}
