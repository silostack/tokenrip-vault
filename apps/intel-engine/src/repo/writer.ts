import { mkdir, writeFile, appendFile, rename, readFile } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { serializeSignal } from '../signals/parser';
import { serializeWikiPage } from '../wiki/parser';
import type { Signal, WikiPage } from '../types';

const LOG_HEADER = '# Operations Log\n\n| Timestamp | Operation | Source | Action | Pages Affected |\n|---|---|---|---|---|\n';

export class RepoWriter {
  constructor(private repoPath: string) {}

  async writeSignal(signal: Signal): Promise<string> {
    const { entities, problems, id } = signal.frontmatter;
    let subDir: string;
    if (entities.length > 0) {
      subDir = join('signals/by-entity', entities[0]);
    } else if (problems.length > 0) {
      subDir = join('signals/by-problem', problems[0]);
    } else {
      subDir = 'signals/by-entity/_untagged';
    }

    const relativePath = join(subDir, `${id}.md`);
    const fullPath = join(this.repoPath, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, serializeSignal(signal), 'utf-8');
    return relativePath;
  }

  async writeWikiPage(page: WikiPage): Promise<void> {
    const fullPath = join(this.repoPath, page.filePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, serializeWikiPage(page), 'utf-8');
  }

  async appendLog(
    operation: string,
    source: string,
    action: string,
    pagesAffected: string[],
    notes?: string,
  ): Promise<void> {
    const logPath = join(this.repoPath, 'log.md');
    const pagesStr = pagesAffected.length > 0 ? pagesAffected.join(', ') : 'none';
    let entry = `| ${new Date().toISOString()} | ${operation} | ${source} | ${action} | ${pagesStr} |`;
    if (notes) entry += ` ${notes} |`;
    entry += '\n';

    let existing = '';
    try {
      existing = await readFile(logPath, 'utf-8');
    } catch {
      // file doesn't exist yet
    }

    if (existing) {
      await appendFile(logPath, entry, 'utf-8');
    } else {
      await writeFile(logPath, LOG_HEADER + entry, 'utf-8');
    }
  }

  async moveToProcessed(relativePath: string): Promise<void> {
    const destDir = join(this.repoPath, 'sources/inbox/processed');
    await mkdir(destDir, { recursive: true });
    await rename(
      join(this.repoPath, relativePath),
      join(destDir, basename(relativePath)),
    );
  }

  async writeContent(relativePath: string, content: string): Promise<void> {
    const fullPath = join(this.repoPath, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, 'utf-8');
  }
}
