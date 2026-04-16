import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { mkdtemp, rm, writeFile, readFile, readdir, stat, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { z } from 'zod';
import { preflight } from '../../apps/intel-engine/src/preflight';
import { ingest, type IngestParams } from '../../apps/intel-engine/src/pipelines/ingest';
import type { LLMClient } from '../../apps/intel-engine/src/llm/client';
import type { IngestResult } from '../../apps/intel-engine/src/types';

// --- Mock LLM client ---

function createMockLLM(): LLMClient {
  return {
    async complete<T>(params: {
      system: string;
      user: string;
      schema: z.ZodType<T>;
      maxTokens?: number;
    }): Promise<T> {
      // Signal extraction
      if (params.system.includes('intelligence analyst')) {
        const response = {
          signals: [
            {
              claim: 'LangChain enables harness hill-climbing by composing eval chains that test agent behavior iteratively',
              signal_type: 'technique',
              entities: ['langchain'],
              concepts: ['harness engineering', 'evals'],
              problems: ['agent overfitting'],
              confidence: 'high',
            },
            {
              claim: 'Using evals as training data for harness engineering produces agents that generalize better than manual prompt tuning',
              signal_type: 'recommendation',
              entities: ['langchain'],
              concepts: ['evals', 'prompt engineering'],
              problems: [],
              confidence: 'medium',
            },
          ],
        };
        return params.schema.parse(response);
      }

      // Wiki update
      if (params.system.includes('wiki maintainer')) {
        const response = {
          updates: [
            {
              path: 'wiki/entities/langchain.md',
              action: 'create',
              title: 'LangChain',
              type: 'entity',
              tags: ['langchain', 'framework', 'agents'],
              body: '# LangChain\n\nLangChain is a framework for building applications with LLMs.\n\n## Practitioner Signals\n\n- Enables harness hill-climbing by composing eval chains.',
            },
          ],
        };
        return params.schema.parse(response);
      }

      throw new Error(`Unexpected LLM call with system: ${params.system.slice(0, 50)}...`);
    },
  };
}

// --- Test setup ---

let tempDir: string;
let mockLLM: LLMClient;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'ingest-test-'));
  await preflight(tempDir);
  mockLLM = createMockLLM();

  // Write sample source file to inbox
  const sourceContent = `---
title: "Better Harness: A Recipe for Harness Hill-Climbing with Evals"
source: "https://example.com/harness-evals"
author:
  - "@vtrivedy10"
published: 2026-04-08
tags:
  - "clippings"
---

We can build better agents by building better harnesses. Evals are training data for harness engineering. Each eval case contributes a signal that guides the next proposed edit to the harness.

LangChain enables composing eval chains that test agent behavior iteratively, producing agents that generalize instead of overfit.
`;
  await writeFile(join(tempDir, 'sources/inbox/harness-evals.md'), sourceContent, 'utf-8');

  // Write empty index.md
  const indexContent = `---
title: Intelligence Wiki Index
updated: 2026-04-12
---

## Entities

## Concepts
`;
  await writeFile(join(tempDir, 'index.md'), indexContent, 'utf-8');

  // Ensure wiki directory exists
  await mkdir(join(tempDir, 'wiki/entities'), { recursive: true });
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

// --- Tests ---

describe('ingest pipeline', () => {
  test('returns result with 2 signals and 1 wiki update', async () => {
    const result = await ingest({
      sourcePath: 'sources/inbox/harness-evals.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    expect(result.signals).toHaveLength(2);
    expect(result.wikiUpdates).toHaveLength(1);
    expect(result.wikiUpdates[0].action).toBe('create');
    expect(result.wikiUpdates[0].path).toBe('wiki/entities/langchain.md');
  });

  test('signal files exist on disk in signals/by-entity/', async () => {
    const result = await ingest({
      sourcePath: 'sources/inbox/harness-evals.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    for (const signal of result.signals) {
      const entity = signal.frontmatter.entities[0];
      const filePath = join(tempDir, 'signals/by-entity', entity, `${signal.frontmatter.id}.md`);
      const s = await stat(filePath);
      expect(s.isFile()).toBe(true);

      // Verify content is parseable
      const content = await readFile(filePath, 'utf-8');
      expect(content).toContain(signal.frontmatter.claim);
    }
  });

  test('wiki page exists on disk', async () => {
    const result = await ingest({
      sourcePath: 'sources/inbox/harness-evals.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const wikiPath = join(tempDir, 'wiki/entities/langchain.md');
    const s = await stat(wikiPath);
    expect(s.isFile()).toBe(true);

    const content = await readFile(wikiPath, 'utf-8');
    expect(content).toContain('LangChain');
  });

  test('source moved from inbox to inbox/processed/', async () => {
    const result = await ingest({
      sourcePath: 'sources/inbox/harness-evals.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    // Original should be gone
    let exists = true;
    try {
      await stat(join(tempDir, 'sources/inbox/harness-evals.md'));
    } catch {
      exists = false;
    }
    expect(exists).toBe(false);

    // Should be in processed
    const processed = await stat(join(tempDir, 'sources/inbox/processed/harness-evals.md'));
    expect(processed.isFile()).toBe(true);

    expect(result.sourceMovedTo).toContain('processed');
  });

  test('log.md contains ingest entry', async () => {
    await ingest({
      sourcePath: 'sources/inbox/harness-evals.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const logContent = await readFile(join(tempDir, 'log.md'), 'utf-8');
    expect(logContent).toContain('ingest');
    expect(logContent).toContain('harness-evals.md');
  });

  test('signals have correct frontmatter fields', async () => {
    const result = await ingest({
      sourcePath: 'sources/inbox/harness-evals.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const sig = result.signals[0];
    expect(sig.frontmatter.id).toMatch(/^sig-\d{8}-\d{3}$/);
    expect(sig.frontmatter.type).toBe('signal');
    expect(sig.frontmatter.source).toBe('sources/inbox/harness-evals.md');
    expect(sig.frontmatter.source_type).toBe('clipping');
    expect(sig.frontmatter.entities).toContain('langchain');
    expect(sig.frontmatter.confidence).toBeDefined();
  });

  test('source type detected as clipping from tags', async () => {
    const result = await ingest({
      sourcePath: 'sources/inbox/harness-evals.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    expect(result.signals[0].frontmatter.source_type).toBe('clipping');
  });

  test('source type detected as clipping from path containing Clippings/', async () => {
    // Write source to a Clippings path (not inbox)
    await mkdir(join(tempDir, 'Clippings'), { recursive: true });
    const sourceContent = `---
title: "Some article"
source: "https://example.com"
---

Some content about testing.
`;
    await writeFile(join(tempDir, 'Clippings/test-article.md'), sourceContent, 'utf-8');

    const result = await ingest({
      sourcePath: 'Clippings/test-article.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    expect(result.signals[0].frontmatter.source_type).toBe('clipping');
    // Non-inbox source should NOT be moved
    const s = await stat(join(tempDir, 'Clippings/test-article.md'));
    expect(s.isFile()).toBe(true);
  });
});
