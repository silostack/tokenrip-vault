import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { mkdtemp, rm, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { z } from 'zod';
import { preflight } from '../../apps/intel-engine/src/preflight';
import { publish, type PublishParams } from '../../apps/intel-engine/src/pipelines/publish';
import type { LLMClient } from '../../apps/intel-engine/src/llm/client';

// --- Mock LLM client ---

function createMockLLM(): LLMClient {
  return {
    async complete<T>(params: {
      system: string;
      user: string;
      schema: z.ZodType<T>;
      maxTokens?: number;
    }): Promise<T> {
      // Draft post (system contains "operational intelligence" but NOT "enrichment")
      if (params.system.includes('operational intelligence') && !params.system.includes('enrichment')) {
        const response = {
          title: 'How Eval-Driven Development Changes Harnesses',
          body: '# How Eval-Driven Development Changes Harnesses\n\nContent with [sig-20260412-001].',
        };
        return params.schema.parse(response);
      }

      // Enrichment (system contains "SEO" or "enrichment")
      if (params.system.includes('SEO') || params.system.includes('enrichment')) {
        const response = {
          description: 'How eval-driven development is transforming agent harness engineering.',
          tags: ['agent-harness', 'evals'],
          faq: [
            {
              q: 'What is harness engineering?',
              a: 'Iteratively improving the orchestration layer around LLMs using eval-driven feedback loops.',
            },
          ],
        };
        return params.schema.parse(response);
      }

      throw new Error(`Unexpected LLM call with system: ${params.system.slice(0, 50)}...`);
    },
  };
}

// --- Fixture data ---

const signalContent = `---
id: sig-20260412-001
type: signal
signal_type: technique
claim: "Eval-driven development treats eval cases as training data for harness engineering."
entities:
  - eval-driven-development
concepts:
  - harness-engineering
problems: []
source: "Clippings/eval-harness.md"
source_type: clipping
source_date: 2026-04-10
extracted: 2026-04-12
confidence: high
corroboration:
  count: 1
  supporting: []
  contradicting: []
---

Eval-driven development uses eval pass/fail signals to iteratively improve the harness layer.
`;

const wikiPageContent = `---
title: Eval-Driven Development
type: entity
tags:
  - eval-driven-development
  - harness-engineering
created: 2026-04-10
updated: 2026-04-12
sources:
  - "Clippings/eval-harness.md"
signals:
  - sig-20260412-001
status: draft
---

Eval-driven development is a methodology where practitioners use evaluation suites to iteratively improve agent harnesses rather than tuning models directly.

## Key Signals

- Treats eval cases as training data for harness engineering [sig-20260412-001].
`;

// --- Helpers ---

/**
 * Extract the frontmatter block as raw text between --- delimiters.
 */
function extractFrontmatterBlock(raw: string): string {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

/**
 * Extract the body (everything after the closing ---).
 */
function extractBody(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
  return match ? match[1].trim() : raw.trim();
}

// --- Test setup ---

let tempDir: string;
let mockLLM: LLMClient;

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'publish-test-'));
  await preflight(tempDir);
  mockLLM = createMockLLM();

  // Write 1 signal file
  await mkdir(join(tempDir, 'signals/by-entity/eval-driven-development'), { recursive: true });
  await writeFile(
    join(tempDir, 'signals/by-entity/eval-driven-development/sig-20260412-001.md'),
    signalContent,
    'utf-8',
  );

  // Write 1 wiki page
  await mkdir(join(tempDir, 'wiki/entities'), { recursive: true });
  await writeFile(
    join(tempDir, 'wiki/entities/eval-driven-development.md'),
    wikiPageContent,
    'utf-8',
  );
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

// --- Tests ---

describe('publish pipeline', () => {
  test('writes draft to content/blog/YYYY-MM-DD-slug.md', async () => {
    const result = await publish({
      wikiPagePath: 'wiki/entities/eval-driven-development.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const today = new Date().toISOString().split('T')[0];
    expect(result.path).toStartWith(`content/blog/${today}-`);
    expect(result.path).toEndWith('.md');
    expect(result.slug).toBe('how-eval-driven-development-changes-harnesses');

    // File should exist on disk
    const fullPath = join(tempDir, result.path);
    const content = await readFile(fullPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  test('draft contains blog-pipeline-compatible frontmatter', async () => {
    const result = await publish({
      wikiPagePath: 'wiki/entities/eval-driven-development.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const raw = await readFile(join(tempDir, result.path), 'utf-8');
    const fm = extractFrontmatterBlock(raw);

    // Check all required frontmatter fields
    expect(fm).toContain('post_type: blog_post');
    expect(fm).toContain('title: How Eval-Driven Development Changes Harnesses');
    expect(fm).toContain('slug: how-eval-driven-development-changes-harnesses');
    expect(fm).toContain('description: How eval-driven development is transforming agent harness engineering.');
    expect(fm).toContain('author: Tokenrip');
    expect(fm).toContain('reading_time:');
    expect(fm).toContain('publish_date:');
    // Tags should be present
    expect(fm).toContain('agent-harness');
    expect(fm).toContain('evals');
  });

  test('draft body contains LLM-generated content', async () => {
    const result = await publish({
      wikiPagePath: 'wiki/entities/eval-driven-development.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const raw = await readFile(join(tempDir, result.path), 'utf-8');
    const body = extractBody(raw);

    expect(body).toContain('How Eval-Driven Development Changes Harnesses');
    expect(body).toContain('[sig-20260412-001]');
  });

  test('frontmatter includes faq when non-empty', async () => {
    const result = await publish({
      wikiPagePath: 'wiki/entities/eval-driven-development.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const raw = await readFile(join(tempDir, result.path), 'utf-8');
    const fm = extractFrontmatterBlock(raw);

    expect(fm).toContain('faq');
    expect(fm).toContain('What is harness engineering?');
    expect(fm).toContain('Iteratively improving');
  });

  test('slug is correctly generated from title', async () => {
    const result = await publish({
      wikiPagePath: 'wiki/entities/eval-driven-development.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    expect(result.slug).toBe('how-eval-driven-development-changes-harnesses');
  });

  test('custom author overrides default', async () => {
    const result = await publish({
      wikiPagePath: 'wiki/entities/eval-driven-development.md',
      repoPath: tempDir,
      llm: mockLLM,
      author: 'Custom Author',
    });

    const raw = await readFile(join(tempDir, result.path), 'utf-8');
    const fm = extractFrontmatterBlock(raw);

    expect(fm).toContain('author: Custom Author');
  });

  test('log.md contains publish entry', async () => {
    await publish({
      wikiPagePath: 'wiki/entities/eval-driven-development.md',
      repoPath: tempDir,
      llm: mockLLM,
    });

    const logContent = await readFile(join(tempDir, 'log.md'), 'utf-8');
    expect(logContent).toContain('publish');
  });
});
