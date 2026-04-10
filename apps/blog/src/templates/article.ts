import { renderHead } from './head';
import { renderLayout } from './layout';
import { escapeHtml } from './escape';
import type { ArticleFrontmatter } from './types';

export function renderArticlePage(
  frontmatter: ArticleFrontmatter,
  markdownContent: string,
  baseUrl: string,
): string {
  const head = renderHead(frontmatter, baseUrl);
  const body = `
<main>
  <div id="markdown-source">${escapeHtml(markdownContent)}</div>
  <div id="markdown-rendered" class="hidden"></div>
</main>`;

  return renderLayout(head, body);
}
