import matter from 'gray-matter';
import { WikiFrontmatterSchema, type WikiPage } from '../types';

function coerceDates(data: Record<string, unknown>): void {
  for (const key of Object.keys(data)) {
    if (data[key] instanceof Date) {
      data[key] = (data[key] as Date).toISOString().split('T')[0];
    }
  }
}

export function parseWikiPage(raw: string, filePath: string): WikiPage {
  const { data, content } = matter(raw);
  coerceDates(data);
  const frontmatter = WikiFrontmatterSchema.parse(data);
  return { frontmatter, body: content.trim(), filePath };
}

export function serializeWikiPage(page: WikiPage): string {
  return matter.stringify(page.body, page.frontmatter);
}
