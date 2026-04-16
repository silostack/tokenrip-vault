# Intelligence Engine — CLI & Library Reference

The intelligence engine has no HTTP API. It operates as a CLI and an importable library. This document covers both interfaces and the data types they use.

## CLI

### `ingest <source-path>`

Extract signals from a source file and update the wiki.

```bash
bun run apps/intel-engine/src/cli.ts ingest <source-path>
```

| Argument | Type | Description |
|---|---|---|
| `source-path` | string | Path to source file, relative to inteliwiki root |

```bash
bun run apps/intel-engine/src/cli.ts ingest sources/inbox/better-harness-article.md
# Ingested: sources/inbox/better-harness-article.md
#   16 signals extracted
#   5 wiki updates
#   Source moved to: sources/inbox/processed/better-harness-article.md
```

### `ingest --inbox`

Batch-ingest all `.md` files in `sources/inbox/`.

```bash
bun run apps/intel-engine/src/cli.ts ingest --inbox
# Processing 3 files from inbox...
#   sources/inbox/article-1.md: 5 signals, 2 wiki updates
#   sources/inbox/article-2.md: 3 signals, 1 wiki updates
#   sources/inbox/article-3.md: 8 signals, 3 wiki updates
```

### `surface`

Generate an editorial brief from the current knowledge base state.

```bash
bun run apps/intel-engine/src/cli.ts surface
# Brief: content/briefs/2026-04-13-brief.md
# Metrics:
#   Total signals: 16
#   Total wiki pages: 7
#   Stale pages: 0
#   Coverage gaps: 0
```

### `publish <wiki-page-path> [--angle "..."]`

Draft a blog post from a wiki page.

```bash
bun run apps/intel-engine/src/cli.ts publish wiki/concepts/eval-driven-harness-optimization.md \
  --angle "eval-driven harness improvement as the new ML training paradigm for agents"
# Draft: content/blog/2026-04-13-eval-driven-harness-optimization-the-practitioners-framework.md
# Slug: eval-driven-harness-optimization-the-practitioners-framework
# Publish with: bun run apps/blog-pipeline/src/cli.ts /path/to/inteliwiki/content/blog/2026-04-13-eval-driven-harness-optimization-the-practitioners-framework.md
```

| Argument | Type | Description |
|---|---|---|
| `wiki-page-path` | string | Path to wiki page, relative to inteliwiki root |
| `--angle` | string (optional) | Editorial direction to guide the LLM draft |

---

## Library Exports

All pipelines and infrastructure are importable from `@tokenrip/intel-engine`:

```typescript
import {
  // Pipelines
  ingest,
  surface,
  publish,

  // LLM
  createLLMClient,
  type LLMClient,

  // Repo I/O
  RepoReader,
  RepoWriter,
  rebuildIndex,

  // Signals
  parseSignal,
  serializeSignal,
  generateSignalId,
  parseSignalId,
  findCorroborations,

  // Wiki
  parseWikiPage,
  serializeWikiPage,
  extractWikiLinks,
  findAffectedPages,

  // Config
  loadConfig,
  preflight,

  // Types
  type Signal,
  type WikiPage,
  type IngestResult,
  type SurfaceResult,
  type PublishResult,
} from '@tokenrip/intel-engine';
```

### `ingest(params)`

```typescript
async function ingest(params: {
  sourcePath: string;   // relative to inteliwiki root
  repoPath: string;     // absolute path to inteliwiki repo
  llm: LLMClient;
}): Promise<IngestResult>
```

Returns:

```typescript
interface IngestResult {
  signals: Signal[];
  wikiUpdates: Array<{ path: string; action: 'create' | 'update' }>;
  sourceMovedTo: string;
}
```

### `surface(params)`

```typescript
async function surface(params: {
  repoPath: string;
  llm: LLMClient;
}): Promise<SurfaceResult>
```

Returns:

```typescript
interface SurfaceResult {
  briefPath: string;
  metrics: {
    totalSignals: number;
    totalWikiPages: number;
    stalePages: number;
    signalStarvedPages: number;
    orphanPages: number;
    coverageGaps: number;
  };
}
```

### `publish(params)`

```typescript
async function publish(params: {
  wikiPagePath: string;  // relative to inteliwiki root
  repoPath: string;
  llm: LLMClient;
  angle?: string;
  author?: string;        // default: 'Tokenrip'
}): Promise<PublishResult>
```

Returns:

```typescript
interface PublishResult {
  path: string;
  slug: string;
}
```

### `createLLMClient(apiKey, model)`

```typescript
function createLLMClient(apiKey: string, model: string): LLMClient

interface LLMClient {
  complete<T>(params: {
    system: string;
    user: string;
    schema: z.ZodType<T>;
    maxTokens?: number;     // default: 4096
  }): Promise<T>;
}
```

### Usage example

```typescript
import { ingest, surface, publish, createLLMClient, preflight } from '@tokenrip/intel-engine';

const repoPath = '/path/to/inteliwiki';
const llm = createLLMClient('sk-ant-api03-...', 'claude-haiku-4-5-20251001');

await preflight(repoPath);

// Ingest a source
const ingestResult = await ingest({
  sourcePath: 'sources/inbox/article.md',
  repoPath,
  llm,
});
console.log(`${ingestResult.signals.length} signals extracted`);

// Generate editorial brief
const surfaceResult = await surface({ repoPath, llm });
console.log(`Brief at: ${surfaceResult.briefPath}`);

// Draft a blog post
const publishResult = await publish({
  wikiPagePath: 'wiki/entities/claude-code.md',
  repoPath,
  llm,
  angle: 'memory architecture for long autonomous runs',
});
console.log(`Draft at: ${publishResult.path}`);
```

---

## Data Types

### Signal

```typescript
interface Signal {
  frontmatter: {
    id: string;                          // sig-YYYYMMDD-NNN
    type: 'signal';
    signal_type: 'technique' | 'frustration' | 'recommendation'
                | 'warning' | 'comparison' | 'experience';
    claim: string;
    entities: string[];
    concepts: string[];
    problems: string[];
    source: string;                      // source file path
    source_type: 'article' | 'clipping' | 'markdown' | 'own-testing';
    source_date: string;                 // YYYY-MM-DD
    extracted: string;                   // YYYY-MM-DD
    confidence: 'low' | 'medium' | 'high';
    corroboration: {
      count: number;
      supporting: string[];              // signal IDs
      contradicting: string[];           // signal IDs
    };
  };
  body: string;
  filePath: string;
}
```

### WikiPage

```typescript
interface WikiPage {
  frontmatter: {
    title: string;
    type: 'entity' | 'concept' | 'comparison' | 'synthesis';
    tags: string[];
    created: string;                     // YYYY-MM-DD
    updated: string;                     // YYYY-MM-DD
    sources: string[];                   // source file paths
    signals: string[];                   // signal IDs
    status: 'stub' | 'draft' | 'complete';
  };
  body: string;
  filePath: string;
}
```

### Blog Draft Frontmatter

Output of the publish pipeline, compatible with `apps/blog-pipeline/`:

```typescript
{
  post_type: 'blog_post';
  title: string;
  slug: string;                          // max 80 chars, lowercase, hyphenated
  description: string;                   // SEO description, max 160 chars
  publish_date: string;                  // ISO 8601 timestamp
  author: string;                        // default: 'Tokenrip'
  tags: string[];                        // 3-7 lowercase tags
  reading_time: number;                  // minutes, ceil(words / 200), min 1
  faq?: Array<{ q: string; a: string }>; // 3-7 Q&A pairs
}
```

---

## LLM Calls

The engine makes 5 distinct LLM calls across the three pipelines. Each call sends a system prompt + user message and expects Zod-validated JSON back.

| Pipeline | Call | Input | Output | Max tokens |
|---|---|---|---|---|
| Ingest | Extract signals | Source content + metadata | Array of signal objects | 4096 |
| Ingest | Update wiki | New signals + affected pages + index | Array of wiki update objects | 4096 |
| Surface | Editorial brief | Signal summaries + stale pages + gaps | Story candidates + trends + gaps | 4096 |
| Publish | Draft post | Wiki content + signals + angle | Title + body | 4096 |
| Publish | Enrich | Title + content | Description + tags + FAQ | 4096 |

All responses are parsed as JSON with markdown fencing stripped. Zod schemas enforce structure and type safety. Failed validation throws with the specific field that didn't match.
