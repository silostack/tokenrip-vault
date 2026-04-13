import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parseSignal } from '../signals/parser';
import { parseWikiPage } from '../wiki/parser';
import type { Signal, WikiPage } from '../types';

export class RepoReader {
  constructor(private repoPath: string) {}

  async readFile(relativePath: string): Promise<string> {
    return readFile(join(this.repoPath, relativePath), 'utf-8');
  }

  async readAllSignals(): Promise<Signal[]> {
    const signals: Signal[] = [];
    const dirs = ['signals/by-entity', 'signals/by-problem'];

    for (const dir of dirs) {
      const fullDir = join(this.repoPath, dir);
      let entries: string[];
      try {
        entries = await readdir(fullDir, { recursive: true }) as unknown as string[];
      } catch {
        continue; // directory doesn't exist
      }

      for (const entry of entries) {
        if (!entry.endsWith('.md')) continue;
        const basename = entry.split('/').pop() ?? entry;
        if (basename.startsWith('_')) continue;

        const filePath = join(dir, entry);
        try {
          const raw = await readFile(join(this.repoPath, filePath), 'utf-8');
          const signal = parseSignal(raw, filePath);
          signals.push(signal);
        } catch {
          // skip unparseable files silently
        }
      }
    }

    return signals;
  }

  async readAllWikiPages(): Promise<WikiPage[]> {
    const pages: WikiPage[] = [];
    const wikiDir = join(this.repoPath, 'wiki');

    let entries: string[];
    try {
      entries = await readdir(wikiDir, { recursive: true }) as unknown as string[];
    } catch {
      return pages;
    }

    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;
      const basename = entry.split('/').pop() ?? entry;
      if (basename.startsWith('.') || basename === '.gitkeep') continue;

      const filePath = join('wiki', entry);
      try {
        const raw = await readFile(join(this.repoPath, filePath), 'utf-8');
        const page = parseWikiPage(raw, filePath);
        pages.push(page);
      } catch {
        // skip unparseable files silently
      }
    }

    return pages;
  }

  async readInbox(): Promise<string[]> {
    const inboxDir = join(this.repoPath, 'sources/inbox');
    let entries: string[];
    try {
      entries = await readdir(inboxDir) as unknown as string[];
    } catch {
      return [];
    }

    const files: string[] = [];
    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;
      const fullPath = join(inboxDir, entry);
      const s = await stat(fullPath);
      if (s.isFile()) {
        files.push(join('sources/inbox', entry));
      }
    }
    return files;
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
