import { mkdir, writeFile, appendFile, rename, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { serializeSignal } from '../signals/parser';
import { serializeWikiPage } from '../wiki/parser';
import type { Signal, WikiPage } from '../types';

export class RepoWriter {
  constructor(private repoPath: string) {}

  async writeSignal(signal: Signal): Promise<string> {
    let subDir: string;
    if (signal.frontmatter.entities.length > 0) {
      subDir = join('signals/by-entity', signal.frontmatter.entities[0]);
    } else if (signal.frontmatter.problems.length > 0) {
      subDir = join('signals/by-problem', signal.frontmatter.problems[0]);
    } else {
      subDir = join('signals/by-entity', '_untagged');
    }

    const relativePath = join(subDir, `${signal.frontmatter.id}.md`);
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
    const timestamp = new Date().toISOString();
    const pagesStr = pagesAffected.length > 0 ? pagesAffected.join(', ') : 'none';
    let entry = `| ${timestamp} | ${operation} | ${source} | ${action} | ${pagesStr} |`;
    if (notes) {
      entry += ` ${notes} |`;
    }
    entry += '\n';

    // Create log file with header if it doesn't exist
    let exists = true;
    try {
      await access(logPath);
    } catch {
      exists = false;
    }

    if (!exists) {
      const header =
        '# Operations Log\n\n| Timestamp | Operation | Source | Action | Pages Affected |\n|---|---|---|---|---|\n';
      await writeFile(logPath, header + entry, 'utf-8');
    } else {
      await appendFile(logPath, entry, 'utf-8');
    }
  }

  async moveToProcessed(relativePath: string): Promise<void> {
    const sourcePath = join(this.repoPath, relativePath);
    const filename = relativePath.split('/').pop()!;
    const destDir = join(this.repoPath, 'sources/inbox/processed');
    await mkdir(destDir, { recursive: true });
    const destPath = join(destDir, filename);
    await rename(sourcePath, destPath);
  }

  async writeContent(relativePath: string, content: string): Promise<void> {
    const fullPath = join(this.repoPath, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, 'utf-8');
  }
}
