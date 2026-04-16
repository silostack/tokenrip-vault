import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { WikiPage } from '../types';

function getSummary(body: string): string {
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    return trimmed.length > 120 ? trimmed.slice(0, 117) + '...' : trimmed;
  }
  return '';
}

const TYPE_LABELS: [string, string][] = [
  ['entity', 'Entities'],
  ['concept', 'Concepts'],
  ['comparison', 'Comparisons'],
  ['synthesis', 'Syntheses'],
];

export async function rebuildIndex(
  repoPath: string,
  pages: WikiPage[],
): Promise<void> {
  const groups = new Map<string, WikiPage[]>();
  for (const [type] of TYPE_LABELS) groups.set(type, []);

  for (const page of pages) {
    groups.get(page.frontmatter.type)?.push(page);
  }

  const today = new Date().toISOString().split('T')[0];
  let md = `---\ntitle: Intelligence Wiki Index\nupdated: ${today}\n---\n`;

  for (const [type, label] of TYPE_LABELS) {
    const group = groups.get(type)!;
    if (group.length === 0) continue;

    group.sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
    md += `\n## ${label}\n\n`;
    for (const page of group) {
      const summary = getSummary(page.body);
      md += `- [[${page.frontmatter.title}]]${summary ? ` — ${summary}` : ''}\n`;
    }
  }

  await writeFile(join(repoPath, 'index.md'), md, 'utf-8');
}
