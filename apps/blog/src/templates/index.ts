import { renderLayout } from './layout';
import { escapeHtml as esc } from './escape';
import type { ArticleListItem } from './types';

export function renderIndexPage(
  articles: ArticleListItem[],
  baseUrl: string,
): string {
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Blog</title>',
    '<meta name="description" content="Latest articles">',
  ].join('\n');

  const list = articles
    .map((a) => {
      const date = a.publishedAt
        ? new Date(a.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '';
      const tags = a.tags
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join(' ');
      return `
      <article>
        <h2><a href="${baseUrl}/blog/${a.slug}">${esc(a.title)}</a></h2>
        ${date ? `<time datetime="${a.publishedAt}">${date}</time>` : ''}
        ${a.description ? `<p>${esc(a.description)}</p>` : ''}
        ${tags ? `<div class="tags">${tags}</div>` : ''}
      </article>`;
    })
    .join('\n');

  const body = `
<main>
  <h1>Blog</h1>
  <div class="article-list">
    ${list || '<p>No articles yet.</p>'}
  </div>
</main>`;

  return renderLayout(head, body);
}
