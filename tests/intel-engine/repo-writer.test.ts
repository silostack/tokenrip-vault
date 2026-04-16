import { describe, test, expect, afterEach } from 'bun:test';
import { mkdtemp, rm, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeFile, mkdir } from 'node:fs/promises';
import { RepoWriter } from '../../apps/intel-engine/src/repo/writer';
import { preflight } from '../../apps/intel-engine/src/preflight';
import { parseSignal } from '../../apps/intel-engine/src/signals/parser';
import { parseWikiPage } from '../../apps/intel-engine/src/wiki/parser';
import type { Signal, WikiPage } from '../../apps/intel-engine/src/types';

function makeSignal(overrides: Partial<Signal['frontmatter']> = {}): Signal {
  return {
    frontmatter: {
      id: 'sig-20260410-001',
      type: 'signal',
      signal_type: 'technique',
      claim: 'Test claim for signal writing.',
      entities: ['langchain'],
      concepts: ['harness-engineering'],
      problems: [],
      source: 'test-source.md',
      source_type: 'clipping',
      source_date: '2026-04-08',
      extracted: '2026-04-10',
      confidence: 'high',
      corroboration: { count: 1, supporting: [], contradicting: [] },
      ...overrides,
    },
    body: 'Signal body content.',
    filePath: '',
  };
}

function makeWikiPage(overrides: Partial<WikiPage['frontmatter']> = {}): WikiPage {
  return {
    frontmatter: {
      title: 'Test Page',
      type: 'entity',
      tags: ['test'],
      created: '2026-04-08',
      updated: '2026-04-10',
      sources: [],
      signals: [],
      status: 'draft',
      ...overrides,
    },
    body: 'Wiki page body content.',
    filePath: 'wiki/test-page.md',
  };
}

describe('RepoWriter', () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test('writeSignal writes to signals/by-entity/{entity}/{id}.md', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));
    await preflight(tempDir);

    const writer = new RepoWriter(tempDir);
    const signal = makeSignal();
    const path = await writer.writeSignal(signal);

    expect(path).toBe('signals/by-entity/langchain/sig-20260410-001.md');

    const content = await readFile(join(tempDir, path), 'utf-8');
    const parsed = parseSignal(content, path);
    expect(parsed.frontmatter.id).toBe('sig-20260410-001');
    expect(parsed.frontmatter.claim).toBe('Test claim for signal writing.');
    expect(parsed.body).toBe('Signal body content.');
  });

  test('writeSignal uses by-problem when no entities', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));
    await preflight(tempDir);

    const writer = new RepoWriter(tempDir);
    const signal = makeSignal({
      entities: [],
      problems: ['mcp-reliability'],
    });
    const path = await writer.writeSignal(signal);

    expect(path).toBe('signals/by-problem/mcp-reliability/sig-20260410-001.md');
    const s = await stat(join(tempDir, path));
    expect(s.isFile()).toBe(true);
  });

  test('writeSignal uses _untagged when no entities or problems', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));
    await preflight(tempDir);

    const writer = new RepoWriter(tempDir);
    const signal = makeSignal({ entities: [], problems: [] });
    const path = await writer.writeSignal(signal);

    expect(path).toBe('signals/by-entity/_untagged/sig-20260410-001.md');
  });

  test('writeWikiPage writes to the page filePath', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));
    await preflight(tempDir);
    await mkdir(join(tempDir, 'wiki'), { recursive: true });

    const writer = new RepoWriter(tempDir);
    const page = makeWikiPage();
    await writer.writeWikiPage(page);

    const content = await readFile(join(tempDir, 'wiki/test-page.md'), 'utf-8');
    const parsed = parseWikiPage(content, 'wiki/test-page.md');
    expect(parsed.frontmatter.title).toBe('Test Page');
    expect(parsed.body).toBe('Wiki page body content.');
  });

  test('appendLog creates log.md with header if missing', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));
    await preflight(tempDir);

    const writer = new RepoWriter(tempDir);
    await writer.appendLog('ingest', 'test-source.md', 'created', ['wiki/test.md']);

    const content = await readFile(join(tempDir, 'log.md'), 'utf-8');
    expect(content).toContain('# Operations Log');
    expect(content).toContain('| ingest |');
    expect(content).toContain('test-source.md');
    expect(content).toContain('wiki/test.md');
  });

  test('appendLog appends to existing log.md', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));
    await preflight(tempDir);

    const writer = new RepoWriter(tempDir);
    await writer.appendLog('ingest', 'source1.md', 'created', ['wiki/a.md']);
    await writer.appendLog('ingest', 'source2.md', 'updated', ['wiki/b.md'], 'with notes');

    const content = await readFile(join(tempDir, 'log.md'), 'utf-8');
    const lines = content.split('\n').filter((l) => l.startsWith('|'));
    // header row + separator + 2 entries
    expect(lines.length).toBeGreaterThanOrEqual(4);
    expect(content).toContain('source2.md');
    expect(content).toContain('with notes');
  });

  test('moveToProcessed moves file from inbox to inbox/processed', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));
    await preflight(tempDir);
    await writeFile(join(tempDir, 'sources/inbox/source.md'), 'content');

    const writer = new RepoWriter(tempDir);
    await writer.moveToProcessed('sources/inbox/source.md');

    // Original should be gone
    let exists = true;
    try {
      await stat(join(tempDir, 'sources/inbox/source.md'));
    } catch {
      exists = false;
    }
    expect(exists).toBe(false);

    // Should be in processed
    const content = await readFile(
      join(tempDir, 'sources/inbox/processed/source.md'),
      'utf-8',
    );
    expect(content).toBe('content');
  });

  test('writeContent writes arbitrary content and creates parent dirs', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-writer-'));

    const writer = new RepoWriter(tempDir);
    await writer.writeContent('content/blog/my-post.md', '# Hello World');

    const content = await readFile(
      join(tempDir, 'content/blog/my-post.md'),
      'utf-8',
    );
    expect(content).toBe('# Hello World');
  });
});
