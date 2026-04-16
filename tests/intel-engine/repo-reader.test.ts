import { describe, test, expect, afterEach } from 'bun:test';
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { RepoReader } from '../../apps/intel-engine/src/repo/reader';

const SAMPLE_SIGNAL = `---
id: sig-20260410-001
type: signal
signal_type: technique
claim: "Harness hill-climbing with evals treats eval cases as training data."
entities:
  - langchain
  - langsmith
concepts:
  - harness-engineering
problems:
  - agent-overfitting
source: "Clippings/Better Harness.md"
source_type: clipping
source_date: 2026-04-08
extracted: 2026-04-10
confidence: high
corroboration:
  count: 1
  supporting: []
  contradicting: []
---

Body of the signal.
`;

const SAMPLE_SIGNAL_2 = `---
id: sig-20260410-002
type: signal
signal_type: frustration
claim: "MCP servers crash under load."
entities: []
concepts: []
problems:
  - mcp-reliability
source: "Clippings/MCP Issues.md"
source_type: clipping
source_date: 2026-04-09
extracted: 2026-04-10
confidence: medium
corroboration:
  count: 1
  supporting: []
  contradicting: []
---

MCP server stability problems.
`;

const SAMPLE_WIKI = `---
title: Claude Managed Agents
type: entity
tags:
  - anthropic
  - managed-agents
created: 2026-04-08
updated: 2026-04-10
sources: []
signals: []
status: draft
---

Claude Managed Agents is Anthropic's framework for orchestrating multiple Claude instances.

## How can I use this?

Use managed agents when a single prompt cannot handle the full scope of a task.
`;

describe('RepoReader', () => {
  let tempDir: string;

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  test('readFile reads a file from the repo', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await writeFile(join(tempDir, 'test.txt'), 'hello world');

    const reader = new RepoReader(tempDir);
    const content = await reader.readFile('test.txt');
    expect(content).toBe('hello world');
  });

  test('readAllSignals finds signals recursively in by-entity and by-problem', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'signals/by-entity/langchain'), { recursive: true });
    await mkdir(join(tempDir, 'signals/by-problem/mcp-reliability'), { recursive: true });
    await writeFile(
      join(tempDir, 'signals/by-entity/langchain/sig-20260410-001.md'),
      SAMPLE_SIGNAL,
    );
    await writeFile(
      join(tempDir, 'signals/by-problem/mcp-reliability/sig-20260410-002.md'),
      SAMPLE_SIGNAL_2,
    );

    const reader = new RepoReader(tempDir);
    const signals = await reader.readAllSignals();
    expect(signals).toHaveLength(2);

    const ids = signals.map((s) => s.frontmatter.id).sort();
    expect(ids).toEqual(['sig-20260410-001', 'sig-20260410-002']);
  });

  test('readAllSignals skips files starting with _', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'signals/by-entity/langchain'), { recursive: true });
    await writeFile(
      join(tempDir, 'signals/by-entity/langchain/sig-20260410-001.md'),
      SAMPLE_SIGNAL,
    );
    await writeFile(
      join(tempDir, 'signals/by-entity/langchain/_template.md'),
      'should be skipped',
    );

    const reader = new RepoReader(tempDir);
    const signals = await reader.readAllSignals();
    expect(signals).toHaveLength(1);
    expect(signals[0].frontmatter.id).toBe('sig-20260410-001');
  });

  test('readAllSignals silently skips unparseable files', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'signals/by-entity/langchain'), { recursive: true });
    await writeFile(
      join(tempDir, 'signals/by-entity/langchain/sig-20260410-001.md'),
      SAMPLE_SIGNAL,
    );
    await writeFile(
      join(tempDir, 'signals/by-entity/langchain/bad-signal.md'),
      '---\ntitle: not a signal\n---\nno valid frontmatter',
    );

    const reader = new RepoReader(tempDir);
    const signals = await reader.readAllSignals();
    expect(signals).toHaveLength(1);
  });

  test('readAllWikiPages finds wiki pages recursively', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'wiki'), { recursive: true });
    await writeFile(join(tempDir, 'wiki/claude-managed-agents.md'), SAMPLE_WIKI);

    const reader = new RepoReader(tempDir);
    const pages = await reader.readAllWikiPages();
    expect(pages).toHaveLength(1);
    expect(pages[0].frontmatter.title).toBe('Claude Managed Agents');
  });

  test('readAllWikiPages skips dot-files and .gitkeep', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'wiki'), { recursive: true });
    await writeFile(join(tempDir, 'wiki/claude-managed-agents.md'), SAMPLE_WIKI);
    await writeFile(join(tempDir, 'wiki/.gitkeep'), '');
    await writeFile(join(tempDir, 'wiki/.hidden.md'), 'hidden');

    const reader = new RepoReader(tempDir);
    const pages = await reader.readAllWikiPages();
    expect(pages).toHaveLength(1);
  });

  test('readAllWikiPages silently skips unparseable files', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'wiki'), { recursive: true });
    await writeFile(join(tempDir, 'wiki/claude-managed-agents.md'), SAMPLE_WIKI);
    await writeFile(join(tempDir, 'wiki/bad-page.md'), 'just some text, no frontmatter');

    const reader = new RepoReader(tempDir);
    const pages = await reader.readAllWikiPages();
    expect(pages).toHaveLength(1);
  });

  test('readInbox lists .md files in sources/inbox (not subdirectories)', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'sources/inbox/processed'), { recursive: true });
    await writeFile(join(tempDir, 'sources/inbox/new-source.md'), 'content');
    await writeFile(join(tempDir, 'sources/inbox/another.md'), 'content');
    await writeFile(join(tempDir, 'sources/inbox/not-md.txt'), 'content');
    await writeFile(join(tempDir, 'sources/inbox/processed/old.md'), 'content');

    const reader = new RepoReader(tempDir);
    const inbox = await reader.readInbox();
    expect(inbox).toHaveLength(2);
    expect(inbox.sort()).toEqual([
      'sources/inbox/another.md',
      'sources/inbox/new-source.md',
    ]);
  });

  test('getAllSignalIds returns all signal IDs', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await mkdir(join(tempDir, 'signals/by-entity/langchain'), { recursive: true });
    await writeFile(
      join(tempDir, 'signals/by-entity/langchain/sig-20260410-001.md'),
      SAMPLE_SIGNAL,
    );

    const reader = new RepoReader(tempDir);
    const ids = await reader.getAllSignalIds();
    expect(ids).toEqual(['sig-20260410-001']);
  });

  test('fileExists returns true for existing files', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));
    await writeFile(join(tempDir, 'exists.md'), 'content');

    const reader = new RepoReader(tempDir);
    expect(await reader.fileExists('exists.md')).toBe(true);
    expect(await reader.fileExists('nope.md')).toBe(false);
  });

  test('readAllSignals returns empty when directories do not exist', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));

    const reader = new RepoReader(tempDir);
    const signals = await reader.readAllSignals();
    expect(signals).toHaveLength(0);
  });

  test('readInbox returns empty when inbox does not exist', async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'intel-reader-'));

    const reader = new RepoReader(tempDir);
    const inbox = await reader.readInbox();
    expect(inbox).toHaveLength(0);
  });
});
