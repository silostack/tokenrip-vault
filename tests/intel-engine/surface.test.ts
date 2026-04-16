import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { mkdtemp, rm, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { z } from 'zod';
import { preflight } from '../../apps/intel-engine/src/preflight';
import { surface, type SurfaceParams } from '../../apps/intel-engine/src/pipelines/surface';
import type { LLMClient } from '../../apps/intel-engine/src/llm/client';
import type { SurfaceResult } from '../../apps/intel-engine/src/types';

// --- Mock LLM client ---

function createMockLLM(): LLMClient {
  return {
    async complete<T>(params: {
      system: string;
      user: string;
      schema: z.ZodType<T>;
      maxTokens?: number;
    }): Promise<T> {
      // Editorial brief
      if (params.system.includes('editorial advisor')) {
        const response = {
          candidates: [
            {
              title: 'How LangChain Practitioners Are Hill-Climbing Their Harnesses',
              angle: 'Practitioners use eval chains to iteratively improve agent harnesses rather than tuning models directly',
              signal_ids: ['sig-20260410-001', 'sig-20260410-002'],
              entities: ['langchain'],
            },
          ],
          trends: ['Eval-driven development is replacing manual prompt tuning'],
          gaps: ['No coverage for LangSmith eval infrastructure'],
        };
        return params.schema.parse(response);
      }

      throw new Error(`Unexpected LLM call with system: ${params.system.slice(0, 50)}...`);
    },
  };
}

// --- Helpers ---

const signalContent1 = `---
id: sig-20260410-001
type: signal
signal_type: technique
claim: "Harness hill-climbing with evals treats eval cases as training data for agent harness engineering."
entities:
  - langchain
concepts:
  - harness-engineering
problems:
  - agent-overfitting
source: "Clippings/harness-evals.md"
source_type: clipping
source_date: 2026-04-08
extracted: 2026-04-10
confidence: high
corroboration:
  count: 2
  supporting:
    - sig-20260410-002
  contradicting: []
---

Harness hill-climbing uses eval pass/fail signals to iteratively improve the harness layer.
`;

const signalContent2 = `---
id: sig-20260410-002
type: signal
signal_type: recommendation
claim: "Using evals as training data produces agents that generalize better than manual prompt tuning."
entities:
  - langchain
concepts:
  - evals
  - prompt-engineering
problems: []
source: "Clippings/harness-evals.md"
source_type: clipping
source_date: 2026-04-08
extracted: 2026-04-10
confidence: medium
corroboration:
  count: 1
  supporting: []
  contradicting: []
---

Eval-driven harness engineering produces more generalizable agents.
`;

const wikiPageContent = `---
title: LangChain
type: entity
tags:
  - langchain
  - framework
  - agents
created: 2026-04-08
updated: 2026-04-10
sources:
  - "Clippings/harness-evals.md"
signals:
  - sig-20260410-001
  - sig-20260410-002
status: draft
---

LangChain is a framework for building applications with LLMs.

## Practitioner Signals

- Enables harness hill-climbing by composing eval chains.

See also [[Claude Managed Agents]] for comparison.
`;

// --- Test setup ---

let tempDir: string;
let mockLLM: LLMClient;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'surface-test-'));
  await preflight(tempDir);
  mockLLM = createMockLLM();

  // Write 2 signal files in signals/by-entity/langchain/
  await mkdir(join(tempDir, 'signals/by-entity/langchain'), { recursive: true });
  await writeFile(
    join(tempDir, 'signals/by-entity/langchain/sig-20260410-001.md'),
    signalContent1,
    'utf-8',
  );
  await writeFile(
    join(tempDir, 'signals/by-entity/langchain/sig-20260410-002.md'),
    signalContent2,
    'utf-8',
  );

  // Write 1 wiki page in wiki/entities/
  await mkdir(join(tempDir, 'wiki/entities'), { recursive: true });
  await writeFile(
    join(tempDir, 'wiki/entities/langchain.md'),
    wikiPageContent,
    'utf-8',
  );
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

// --- Tests ---

describe('surface pipeline', () => {
  test('writes brief to content/briefs/YYYY-MM-DD-brief.md', async () => {
    const result = await surface({ repoPath: tempDir, llm: mockLLM });

    const today = new Date().toISOString().split('T')[0];
    expect(result.briefPath).toBe(`content/briefs/${today}-brief.md`);

    // File should exist on disk
    const fullPath = join(tempDir, result.briefPath);
    const content = await readFile(fullPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  test('brief contains story candidate title and signal IDs', async () => {
    const result = await surface({ repoPath: tempDir, llm: mockLLM });

    const content = await readFile(join(tempDir, result.briefPath), 'utf-8');
    expect(content).toContain('How LangChain Practitioners Are Hill-Climbing Their Harnesses');
    expect(content).toContain('sig-20260410-001');
    expect(content).toContain('sig-20260410-002');
  });

  test('metrics reflect correct signal and page counts', async () => {
    const result = await surface({ repoPath: tempDir, llm: mockLLM });

    expect(result.metrics.totalSignals).toBe(2);
    expect(result.metrics.totalWikiPages).toBe(1);
  });

  test('brief contains section headers', async () => {
    const result = await surface({ repoPath: tempDir, llm: mockLLM });

    const content = await readFile(join(tempDir, result.briefPath), 'utf-8');
    expect(content).toContain('## Story Candidates');
    expect(content).toContain('## Trends');
    expect(content).toContain('## Gaps');
    expect(content).toContain('## Wiki Health');
  });

  test('metrics detect orphan pages (referenced page does not exist)', async () => {
    // The wiki page references [[Claude Managed Agents]] but that page doesn't exist
    // and no other page references the langchain page -- but langchain IS referenced
    // by itself via its own body. Orphan = not referenced by any OTHER page.
    // Since there's only 1 page and no other page references it, it IS an orphan.
    const result = await surface({ repoPath: tempDir, llm: mockLLM });

    expect(result.metrics.orphanPages).toBe(1);
  });

  test('metrics detect coverage gaps (entity in signals without wiki page)', async () => {
    // Add a signal with entity "langsmith" that has no wiki page
    const langsmithSignal = `---
id: sig-20260410-003
type: signal
signal_type: technique
claim: "LangSmith provides eval infrastructure for tracking agent performance."
entities:
  - langsmith
concepts:
  - evals
problems: []
source: "Clippings/langsmith-evals.md"
source_type: clipping
source_date: 2026-04-08
extracted: 2026-04-10
confidence: medium
corroboration:
  count: 1
  supporting: []
  contradicting: []
---

LangSmith eval tracking.
`;
    await mkdir(join(tempDir, 'signals/by-entity/langsmith'), { recursive: true });
    await writeFile(
      join(tempDir, 'signals/by-entity/langsmith/sig-20260410-003.md'),
      langsmithSignal,
      'utf-8',
    );

    const result = await surface({ repoPath: tempDir, llm: mockLLM });

    expect(result.metrics.totalSignals).toBe(3);
    expect(result.metrics.coverageGaps).toBeGreaterThanOrEqual(1);
  });

  test('log.md contains surface entry', async () => {
    await surface({ repoPath: tempDir, llm: mockLLM });

    const logContent = await readFile(join(tempDir, 'log.md'), 'utf-8');
    expect(logContent).toContain('surface');
  });
});
