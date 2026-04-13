import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { WikiPage } from '../types';

function getSummary(body: string): string {
  const lines = body.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    // Truncate to 120 chars
    if (trimmed.length > 120) {
      return trimmed.slice(0, 117) + '...';
    }
    return trimmed;
  }
  return '';
}

export async function rebuildIndex(
  repoPath: string,
  pages: WikiPage[],
): Promise<void> {
  const groups: Record<string, WikiPage[]> = {
    entity: [],
    concept: [],
    comparison: [],
    synthesis: [],
  };

  for (const page of pages) {
    const type = page.frontmatter.type;
    if (groups[type]) {
      groups[type].push(page);
    }
  }

  // Sort each group alphabetically by title
  for (const type of Object.keys(groups)) {
    groups[type].sort((a, b) =>
      a.frontmatter.title.localeCompare(b.frontmatter.title),
    );
  }

  const today = new Date().toISOString().split('T')[0];
  let md = `---\ntitle: Intelligence Wiki Index\nupdated: ${today}\n---\n`;

  const typeLabels: Record<string, string> = {
    entity: 'Entities',
    concept: 'Concepts',
    comparison: 'Comparisons',
    synthesis: 'Syntheses',
  };

  for (const [type, label] of Object.entries(typeLabels)) {
    const pagesInGroup = groups[type];
    if (pagesInGroup.length === 0) continue;

    md += `\n## ${label}\n\n`;
    for (const page of pagesInGroup) {
      const summary = getSummary(page.body);
      const summaryPart = summary ? ` — ${summary}` : '';
      md += `- [[${page.frontmatter.title}]]${summaryPart}\n`;
    }
  }

  await writeFile(join(repoPath, 'index.md'), md, 'utf-8');
}
