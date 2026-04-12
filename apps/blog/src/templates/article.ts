import { renderHead } from './head';
import { renderLayout } from './layout';
import { escapeHtml } from './escape';
import type { BlogPost } from './types';

export function renderArticlePage(
  post: BlogPost,
  baseUrl: string,
): string {
  const head = renderHead(post, baseUrl);
  const body = `
<main>
  <div id="markdown-source">${escapeHtml(post.content)}</div>
  <div id="markdown-rendered" class="hidden"></div>
</main>`;

  return renderLayout(head, body);
}
