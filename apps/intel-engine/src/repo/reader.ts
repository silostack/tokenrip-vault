import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { parseSignal } from '../signals/parser';
import { parseWikiPage } from '../wiki/parser';
import type { Signal, WikiPage } from '../types';

async function listMdFiles(dir: string, opts?: { recursive?: boolean }): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(dir, { recursive: opts?.recursive }) as unknown as string[];
  } catch {
    return [];
  }
  return entries.filter((e) => e.endsWith('.md'));
}

export class RepoReader {
  constructor(private repoPath: string) {}

  async readFile(relativePath: string): Promise<string> {
    return readFile(join(this.repoPath, relativePath), 'utf-8');
  }

  async readAllSignals(): Promise<Signal[]> {
    const signals: Signal[] = [];

    for (const dir of ['signals/by-entity', 'signals/by-problem']) {
      const files = await listMdFiles(join(this.repoPath, dir), { recursive: true });
      for (const entry of files) {
        const basename = entry.split('/').pop() ?? entry;
        if (basename.startsWith('_')) continue;

        const filePath = join(dir, entry);
        try {
          const raw = await readFile(join(this.repoPath, filePath), 'utf-8');
          signals.push(parseSignal(raw, filePath));
        } catch {
          // skip unparseable files
        }
      }
    }

    return signals;
  }

  async readAllWikiPages(): Promise<WikiPage[]> {
    const pages: WikiPage[] = [];
    const files = await listMdFiles(join(this.repoPath, 'wiki'), { recursive: true });

    for (const entry of files) {
      const basename = entry.split('/').pop() ?? entry;
      if (basename.startsWith('.') || basename === '.gitkeep') continue;

      const filePath = join('wiki', entry);
      try {
        const raw = await readFile(join(this.repoPath, filePath), 'utf-8');
        pages.push(parseWikiPage(raw, filePath));
      } catch {
        // skip unparseable files
      }
    }

    return pages;
  }

  async readInbox(): Promise<string[]> {
    const inboxDir = join(this.repoPath, 'sources/inbox');
    const files = await listMdFiles(inboxDir);
    const result: string[] = [];

    for (const entry of files) {
      const s = await stat(join(inboxDir, entry));
      if (s.isFile()) result.push(join('sources/inbox', entry));
    }

    return result;
  }

  async getAllSignalIds(): Promise<string[]> {
    const signals = await this.readAllSignals();
    return signals.map((s) => s.frontmatter.id);
  }

  async fileExists(relativePath: string): Promise<boolean> {
    try {
      await stat(join(this.repoPath, relativePath));
      return true;
    } catch {
      return false;
    }
  }
}
