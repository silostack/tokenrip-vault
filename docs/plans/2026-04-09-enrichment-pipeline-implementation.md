# Enrichment Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add LLM-driven enrichment to the blog engine's publish pipeline. Articles published with just a title and body get automatically enriched with FAQ Q&A, tags, polished description, and JSON-LD structured data via the Claude API.

**Architecture:** Background scanner (30s setInterval) finds articles missing `jsonLd.faq` in frontmatter, calls Claude API for structured enrichment, merges output into the file additively.

**Tech Stack:** `@anthropic-ai/sdk` for Claude API calls. Extends existing Fastify server, ArticleService, and storage layer.

**Design doc:** `docs/plans/2026-04-09-enrichment-pipeline-design.md`

---

## Task 1: Add Anthropic SDK Dependency

**Files:**
- Modify: `apps/blog-engine/package.json`
- Modify: `apps/blog-engine/.env.sample`
- Modify: `apps/blog-engine/src/config.ts`

**Step 1: Add dependency**

Add to `apps/blog-engine/package.json` dependencies:
```json
"@anthropic-ai/sdk": "^0.52.0"
```

**Step 2: Update .env.sample**

Append to `apps/blog-engine/.env.sample`:
```
# LLM enrichment (optional — enrichment disabled if ANTHROPIC_API_KEY not set)
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-5-20250514
BLOG_AUTHOR_NAME=Tokenrip
BLOG_AUTHOR_TYPE=Organization
```

**Step 3: Update config**

In `apps/blog-engine/src/config.ts`, add to the returned object:
```ts
anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250514',
blogAuthorName: process.env.BLOG_AUTHOR_NAME || 'Tokenrip',
blogAuthorType: process.env.BLOG_AUTHOR_TYPE || 'Organization',
```

**Step 4: Install**

Run: `bun install`

**Step 5: Commit**

```bash
git add apps/blog-engine/package.json apps/blog-engine/.env.sample apps/blog-engine/src/config.ts
git commit -m "feat(blog-engine): add Anthropic SDK dependency and config for enrichment"
```

---

## Task 2: Enrich Service — LLM Call + Merge Logic

**Files:**
- Create: `apps/blog-engine/src/services/enrich.service.ts`
- Create: `tests/blog-engine/enrich.test.ts`

**Step 1: Write the failing test**

Create `tests/blog-engine/enrich.test.ts`:

```ts
import { describe, test, expect, mock } from 'bun:test';
import { buildEnrichPrompt, mergeEnrichment, type EnrichmentResult } from '../../apps/blog-engine/src/services/enrich.service';

describe('buildEnrichPrompt', () => {
  test('returns system and user messages', () => {
    const { system, user } = buildEnrichPrompt('My Title', '# My Title\n\nSome content.');
    expect(system).toContain('content enrichment engine');
    expect(system).toContain('JSON');
    expect(user).toContain('My Title');
    expect(user).toContain('Some content.');
  });
});

describe('mergeEnrichment', () => {
  const enrichment: EnrichmentResult = {
    description: 'A polished description.',
    tags: ['crypto', 'regulation'],
    faq: [
      { q: 'What is this?', a: 'A test article.' },
    ],
    og: { type: 'article' },
  };

  test('fills missing fields in frontmatter', () => {
    const existing = {
      title: 'Test',
      slug: 'test',
      publishedAt: '2026-04-09T00:00:00Z',
    };

    const merged = mergeEnrichment(existing, enrichment, {
      authorName: 'Tokenrip',
      authorType: 'Organization',
    });

    expect(merged.description).toBe('A polished description.');
    expect(merged.tags).toEqual(['crypto', 'regulation']);
    expect(merged.jsonLd?.faq).toEqual(enrichment.faq);
    expect(merged.jsonLd?.article?.author?.name).toBe('Tokenrip');
    expect(merged.og?.type).toBe('article');
  });

  test('preserves existing fields (additive merge)', () => {
    const existing = {
      title: 'Test',
      slug: 'test',
      description: 'My manual description.',
      tags: ['manual-tag'],
    };

    const merged = mergeEnrichment(existing, enrichment, {
      authorName: 'Tokenrip',
      authorType: 'Organization',
    });

    // Existing values preserved
    expect(merged.description).toBe('My manual description.');
    expect(merged.tags).toEqual(['manual-tag']);
    // LLM fills in missing fields
    expect(merged.jsonLd?.faq).toEqual(enrichment.faq);
  });

  test('does not overwrite existing jsonLd.faq', () => {
    const existing = {
      title: 'Test',
      slug: 'test',
      jsonLd: {
        faq: [{ q: 'Existing?', a: 'Yes.' }],
      },
    };

    const merged = mergeEnrichment(existing, enrichment, {
      authorName: 'Tokenrip',
      authorType: 'Organization',
    });

    expect(merged.jsonLd?.faq).toEqual([{ q: 'Existing?', a: 'Yes.' }]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/blog-engine/enrich.test.ts`
Expected: FAIL — module not found

**Step 3: Implement the enrich service**

Create `apps/blog-engine/src/services/enrich.service.ts`:

```ts
import Anthropic from '@anthropic-ai/sdk';
import matter from 'gray-matter';
import { StorageService } from '../storage/storage.interface';
import { ArticleService, ArticleFrontmatter } from './article.service';

export interface EnrichmentResult {
  description: string;
  tags: string[];
  faq: Array<{ q: string; a: string }>;
  og: { type: string };
}

export interface AuthorConfig {
  authorName: string;
  authorType: string;
}

export function buildEnrichPrompt(title: string, content: string) {
  const system = `You are a content enrichment engine for a technical blog. Given an article, produce a JSON object with:

- "description": SEO-optimized summary, 1-2 sentences, max 160 characters
- "tags": array of 3-7 lowercase topic tags relevant to the article
- "faq": array of 5-10 objects with "q" (question) and "a" (answer) fields. Questions should be what a reader would naturally ask. Answers should be concise (1-3 sentences) and drawn from the article content.
- "og": { "type": "article" }

Respond with ONLY valid JSON. No markdown fencing, no explanation.`;

  const user = `# ${title}\n\n${content}`;

  return { system, user };
}

export function mergeEnrichment(
  existing: Record<string, any>,
  enrichment: EnrichmentResult,
  author: AuthorConfig,
): Record<string, any> {
  const merged = { ...existing };

  // Additive: only fill missing fields
  if (!merged.description) {
    merged.description = enrichment.description;
  }

  if (!merged.tags || merged.tags.length === 0) {
    merged.tags = enrichment.tags;
  }

  if (!merged.og) {
    merged.og = enrichment.og;
  }

  // JSON-LD: build if missing
  if (!merged.jsonLd) {
    merged.jsonLd = {};
  }

  if (!merged.jsonLd.faq) {
    merged.jsonLd.faq = enrichment.faq;
  }

  if (!merged.jsonLd.article) {
    merged.jsonLd.article = {
      type: 'Article',
      author: { name: author.authorName, type: author.authorType },
    };
  }

  return merged;
}

export class EnrichService {
  private client: Anthropic;
  private inProgress = new Set<string>();

  constructor(
    private readonly storage: StorageService,
    private readonly articleService: ArticleService,
    private readonly model: string,
    private readonly author: AuthorConfig,
    apiKey: string,
  ) {
    this.client = new Anthropic({ apiKey });
  }

  async enrichArticle(slug: string): Promise<boolean> {
    if (this.inProgress.has(slug)) return false;
    this.inProgress.add(slug);

    try {
      const article = await this.articleService.getBySlug(slug);
      if (!article) return false;

      // Already enriched
      if (article.frontmatter.jsonLd?.faq) return false;

      const { system, user } = buildEnrichPrompt(
        article.frontmatter.title,
        article.content,
      );

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        system,
        messages: [{ role: 'user', content: user }],
      });

      const text = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      const enrichment: EnrichmentResult = JSON.parse(text);
      const merged = mergeEnrichment(
        article.frontmatter,
        enrichment,
        this.author,
      );

      // Re-serialize and overwrite
      const output = matter.stringify(article.content, merged);
      await this.articleService.store(output, {
        frontmatter: merged as ArticleFrontmatter,
      });

      return true;
    } finally {
      this.inProgress.delete(slug);
    }
  }

  async scanAndEnrich(): Promise<string | null> {
    const files = await this.storage.list();

    for (const fileKey of files) {
      const buf = await this.storage.read(fileKey);
      const { data } = matter(buf.toString());

      if (data.jsonLd?.faq) continue; // Already enriched
      if (!data.slug) continue;
      if (this.inProgress.has(data.slug)) continue;

      await this.enrichArticle(data.slug);
      return data.slug; // One per tick
    }

    return null; // Nothing to enrich
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bun test tests/blog-engine/enrich.test.ts`
Expected: All 5 tests PASS (3 mergeEnrichment + 1 buildEnrichPrompt + the describe blocks)

**Step 5: Commit**

```bash
git add apps/blog-engine/src/services/enrich.service.ts tests/blog-engine/enrich.test.ts
git commit -m "feat(blog-engine): enrich service with LLM prompt builder and additive merge"
```

---

## Task 3: Wire Enrichment Into Server

**Files:**
- Modify: `apps/blog-engine/src/server.ts`
- Modify: `apps/blog-engine/src/routes/articles.ts`

**Step 1: Update server.ts to create EnrichService and start scanner**

In `apps/blog-engine/src/server.ts`, after creating `articleService`:

```ts
import { EnrichService } from './services/enrich.service';

// After articleService creation:
let enrichService: EnrichService | null = null;

if (config.anthropicApiKey) {
  enrichService = new EnrichService(
    storage,
    articleService,
    config.anthropicModel,
    { authorName: config.blogAuthorName, authorType: config.blogAuthorType },
    config.anthropicApiKey,
  );

  // Background enrichment scanner
  let scanInterval: ReturnType<typeof setInterval>;
  fastify.addHook('onReady', () => {
    scanInterval = setInterval(() => {
      enrichService!.scanAndEnrich().catch((err) => {
        console.error('enrichment scan failed:', err.message);
      });
    }, 30_000);
  });

  fastify.addHook('onClose', () => {
    if (scanInterval) clearInterval(scanInterval);
  });
}

// Pass enrichService to routes
await fastify.register(articleRoutes, { articleService, enrichService });
```

**Step 2: Add manual enrich endpoint to routes**

In `apps/blog-engine/src/routes/articles.ts`, update the opts type and add the endpoint:

```ts
import { EnrichService } from '../services/enrich.service';

export async function articleRoutes(
  fastify: FastifyInstance,
  opts: { articleService: ArticleService; enrichService: EnrichService | null },
) {
  const { articleService, enrichService } = opts;

  // ... existing routes ...

  // Manual enrichment trigger
  fastify.post<{ Params: { slug: string } }>(
    '/articles/:slug/enrich',
    async (request, reply) => {
      if (!enrichService) {
        return reply.status(503).send({
          error: 'Enrichment not available — ANTHROPIC_API_KEY not configured',
        });
      }

      const { slug } = request.params;
      const article = await articleService.getBySlug(slug);
      if (!article) {
        return reply.status(404).send({ error: 'Article not found' });
      }

      const enriched = await enrichService.enrichArticle(slug);
      return { ok: true, enriched };
    },
  );
}
```

**Step 3: Run existing tests to verify nothing broke**

Run: `bun test tests/blog-engine/`
Expected: All existing tests PASS (the enrichment scanner won't start in tests because `ANTHROPIC_API_KEY` is not set)

**Step 4: Commit**

```bash
git add apps/blog-engine/src/server.ts apps/blog-engine/src/routes/articles.ts
git commit -m "feat(blog-engine): wire enrichment scanner and manual enrich endpoint"
```

---

## Task 4: Integration Test with Mocked LLM

**Files:**
- Create: `tests/blog-engine/enrich-integration.test.ts`

**Step 1: Write integration test**

This test mocks the Anthropic SDK to verify the full enrichment flow without making real API calls.

Create `tests/blog-engine/enrich-integration.test.ts`:

```ts
import { describe, test, expect, beforeAll, afterAll, mock } from 'bun:test';
import { startBlogEngine, stopBlogEngine, type TestBlogEngine } from './setup';

// Mock the Anthropic SDK before importing enrich service
// We'll test the integration by publishing an article, then manually triggering enrichment
// with a real server but mocked LLM responses

let engine: TestBlogEngine;

const RAW_ARTICLE = `---
title: "Understanding Smart Contracts"
---

# Understanding Smart Contracts

Smart contracts are self-executing programs stored on a blockchain. They automatically enforce the terms of an agreement when predefined conditions are met.

## How They Work

A developer writes the contract logic in a language like Solidity, deploys it to Ethereum, and it runs autonomously. No intermediary needed.

## Use Cases

Smart contracts power DeFi protocols, NFT marketplaces, and decentralized governance systems.
`;

beforeAll(async () => {
  engine = await startBlogEngine();
});

afterAll(async () => {
  await stopBlogEngine(engine);
});

describe('Enrichment Integration', () => {
  test('publish stores article without FAQ initially', async () => {
    const res = await fetch(`${engine.url}/articles/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/markdown' },
      body: RAW_ARTICLE,
    });
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.slug).toBe('understanding-smart-contracts');

    // Article exists but has no FAQ
    const getRes = await fetch(`${engine.url}/articles/understanding-smart-contracts`);
    const article = await getRes.json();
    expect(article.frontmatter.title).toBe('Understanding Smart Contracts');
    expect(article.frontmatter.jsonLd?.faq).toBeUndefined();
  });

  test('manual enrich returns 503 when API key not configured', async () => {
    const res = await fetch(
      `${engine.url}/articles/understanding-smart-contracts/enrich`,
      { method: 'POST' },
    );
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toContain('ANTHROPIC_API_KEY');
  });

  test('buildEnrichPrompt includes article content', async () => {
    const { buildEnrichPrompt } = await import(
      '../../apps/blog-engine/src/services/enrich.service'
    );
    const { system, user } = buildEnrichPrompt(
      'Understanding Smart Contracts',
      '# Understanding Smart Contracts\n\nSmart contracts are...',
    );
    expect(system).toContain('description');
    expect(system).toContain('faq');
    expect(system).toContain('tags');
    expect(user).toContain('Smart Contracts');
  });

  test('mergeEnrichment produces valid frontmatter', async () => {
    const { mergeEnrichment } = await import(
      '../../apps/blog-engine/src/services/enrich.service'
    );

    const result = mergeEnrichment(
      { title: 'Test', slug: 'test', publishedAt: '2026-04-09' },
      {
        description: 'About smart contracts.',
        tags: ['blockchain', 'ethereum'],
        faq: [{ q: 'What are smart contracts?', a: 'Self-executing programs.' }],
        og: { type: 'article' },
      },
      { authorName: 'Tokenrip', authorType: 'Organization' },
    );

    expect(result.description).toBe('About smart contracts.');
    expect(result.tags).toEqual(['blockchain', 'ethereum']);
    expect(result.jsonLd.faq).toHaveLength(1);
    expect(result.jsonLd.article.author.name).toBe('Tokenrip');
    expect(result.og.type).toBe('article');
  });
});
```

**Step 2: Run test**

Run: `bun test tests/blog-engine/enrich-integration.test.ts`
Expected: All 4 tests PASS

**Step 3: Run all blog tests**

Run: `bun test tests/blog-engine/ tests/blog/`
Expected: All tests PASS (36 existing + 5 unit + 4 integration = 45 total)

**Step 4: Commit**

```bash
git add tests/blog-engine/enrich-integration.test.ts
git commit -m "test(blog-engine): enrichment integration tests with graceful degradation"
```

---

## Task 5: Update Documentation

**Files:**
- Modify: `apps/blog-engine/.env.sample`
- Modify: `apps/blog-engine/CLAUDE.md`
- Modify: `docs/architecture/blog-engine.md`
- Modify: `docs/operations/blog-setup.md`
- Modify: `docs/api/blog-engine-api.md`

**Step 1: Update CLAUDE.md**

Add enrichment section to `apps/blog-engine/CLAUDE.md`:
- Document `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `BLOG_AUTHOR_NAME`, `BLOG_AUTHOR_TYPE` env vars
- Note that enrichment is optional (disabled without API key)
- Document `POST /articles/:slug/enrich` endpoint

**Step 2: Update architecture doc**

Add enrichment pipeline section to `docs/architecture/blog-engine.md`:
- Background scanner flow
- LLM prompt structure
- Additive merge strategy
- Concurrency control

**Step 3: Update operations doc**

Add enrichment setup section to `docs/operations/blog-setup.md`:
- How to configure API key
- How to publish and watch enrichment happen
- How to manually trigger enrichment (curl example)
- Monitoring: how to check which articles need enrichment

**Step 4: Update API doc**

Add `POST /articles/:slug/enrich` endpoint to `docs/api/blog-engine-api.md`:
- Request/response format
- 503 when API key not configured
- Curl example

**Step 5: Commit**

```bash
git add apps/blog-engine/ docs/
git commit -m "docs(blog-engine): document enrichment pipeline across architecture, operations, and API docs"
```

---

## Task Summary

| # | Task | Tests | Files |
|---|---|---|---|
| 1 | Add Anthropic SDK + config | — | 3 modified |
| 2 | Enrich service (prompt, merge, LLM call, scanner) | 5 | 2 created |
| 3 | Wire into server + manual enrich endpoint | — | 2 modified |
| 4 | Integration tests | 4 | 1 created |
| 5 | Update documentation | — | 5 modified |
| | **Total** | **9** | **13 files** |
