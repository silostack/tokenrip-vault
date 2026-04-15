import { renderLayout } from './layout';
import { escapeHtml as esc } from './escape';
import type { BlogPostSummary } from './types';

export function renderIndexPage(
  posts: BlogPostSummary[],
  baseUrl: string,
): string {
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Blog — Tokenrip</title>',
    '<meta name="description" content="Notes on building the collaboration layer for agents and operators.">',
  ].join('\n');

  const list = posts
    .map((p) => {
      const m = p.metadata;
      const date = m.publish_date
        ? new Date(m.publish_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '';
      const tags = (m.tags || [])
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join(' ');
      return `
      <article>
        <h2><a href="${baseUrl}/blog/${p.alias}">${esc(m.title)}</a></h2>
        ${date ? `<time datetime="${m.publish_date}">${date}</time>` : ''}
        ${m.description ? `<p>${esc(m.description)}</p>` : ''}
        ${tags ? `<div class="tags">${tags}</div>` : ''}
      </article>`;
    })
    .join('\n');

  const body = `
<main>
  <div class="blog-hero">
    <h1>Blog</h1>
    <p class="tagline">Notes on building the collaboration layer for agents and operators.</p>
  </div>
  <div class="article-list">
    ${list || '<p>No articles yet.</p>'}
  </div>
</main>`;

  return renderLayout(head, body);
}
