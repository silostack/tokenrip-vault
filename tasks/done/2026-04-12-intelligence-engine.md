# Intelligence Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `apps/intel-engine/` — a CLI + library that processes the inteliwiki knowledge base repo, ingesting sources into signals, maintaining wiki pages, surfacing editorial briefs, and producing blog-ready content.

**Architecture:** Traditional pipeline with LLM at 5 specific steps. Reads/writes markdown files in the inteliwiki repo (filesystem-based, no API calls to TokenRip). Three operations: ingest (source -> signals + wiki), surface (signals + wiki -> editorial brief), publish (wiki + signals -> blog draft). Same pattern as `apps/blog-pipeline/`.

**Tech Stack:** Bun, TypeScript, `@anthropic-ai/sdk`, `gray-matter`, `zod`

**Key Reference Files:**
- `apps/blog-pipeline/` — Same CLI + library pattern we're following
- `apps/blog-pipeline/src/services/enrich.service.ts` — LLM prompt/response pattern to match
- `apps/blog-pipeline/src/pipeline.ts` — Orchestrator pattern to match
- `/Users/si/projects/maxi/inteliwiki/` — The knowledge base repo this engine operates on
- `/Users/si/projects/maxi/inteliwiki/CLAUDE.md` — Schema describing repo structure and conventions

**Background Context:**
The inteliwiki is a separate git repo containing a structured knowledge base about the AI/agentic landscape. It has markdown files organized as sources (raw material), wiki pages (synthesized knowledge), and templates. The engine adds a **signals layer** between sources and wiki — discrete practitioner claims extracted from sources with tags, confidence, and corroboration tracking. The engine also adds a **content layer** for blog drafts and editorial briefs. The engine does NOT publish to TokenRip — it produces markdown files that the existing `apps/blog-pipeline/` CLI publishes.

---

## Task 1: Project Scaffold

**Files:**
- Create: `apps/intel-engine/package.json`
- Create: `apps/intel-engine/tsconfig.json`
- Create: `apps/intel-engine/.env.sample`
- Create: `apps/intel-engine/CLAUDE.md`
- Create: `tests/intel-engine/fixtures/sample-clipping.md`
- Create: `tests/intel-engine/fixtures/sample-signal.md`
- Create: `tests/intel-engine/fixtures/sample-wiki-page.md`
- Create: `tests/intel-engine/fixtures/sample-index.md`

**Step 1: Create package.json**

```json
{
  "name": "@tokenrip/intel-engine",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "ingest": "bun run src/cli.ts ingest",
    "surface": "bun run src/cli.ts surface",
    "publish": "bun run src/cli.ts publish"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.52.0",
    "gray-matter": "^4.0.3",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.7",
    "typescript": "^5.7.3"
  }
}
```

**Step 2: Create tsconfig.json**

Copy from `apps/blog-pipeline/tsconfig.json` exactly:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create .env.sample**

```bash
# Path to the inteliwiki knowledge base repo (required)
INTELIWIKI_PATH=/Users/si/projects/maxi/inteliwiki

# Anthropic API key for LLM calls (required)
ANTHROPIC_API_KEY=

# Model for all LLM calls (optional, defaults to claude-sonnet-4-5-20250514)
ANTHROPIC_MODEL=claude-sonnet-4-5-20250514
```

**Step 4: Create CLAUDE.md**

Write the CLAUDE.md as described in the design document — document the three pipelines, four-layer architecture, key files, environment variables, and test command. Reference `apps/blog-pipeline/CLAUDE.md` for the format.

**Step 5: Create test fixtures**

Create `tests/intel-engine/fixtures/sample-clipping.md` — a markdown file with frontmatter (title, source, author, published, tags: [clippings]) and a body about harness hill-climbing with evals. Use the first few paragraphs from `/Users/si/projects/maxi/inteliwiki/Clippings/Better Harness A Recipe for Harness Hill-Climbing with Evals.md` as reference.

Create `tests/intel-engine/fixtures/sample-signal.md` — a signal markdown file with the full signal frontmatter schema (id, type, signal_type, claim, entities, concepts, problems, source, source_type, source_date, extracted, confidence, corroboration) and a short body.

Create `tests/intel-engine/fixtures/sample-wiki-page.md` — a wiki page with frontmatter (title, type, tags, created, updated, sources, signals, status) and a short markdown body.

Create `tests/intel-engine/fixtures/sample-index.md` — an index.md with Entities and Concepts sections listing one sample page each.

**Step 6: Install dependencies**

Run: `cd apps/intel-engine && bun install`
Expected: Dependencies installed, no errors.

**Step 7: Commit**

```bash
git add apps/intel-engine/package.json apps/intel-engine/tsconfig.json apps/intel-engine/.env.sample apps/intel-engine/CLAUDE.md tests/intel-engine/
git commit -m "feat(intel-engine): scaffold project with fixtures"
```

---

## Task 2: Types, Config & Preflight

**Files:**
- Create: `apps/intel-engine/src/types.ts`
- Create: `apps/intel-engine/src/config.ts`
- Create: `apps/intel-engine/src/preflight.ts`
- Create: `tests/intel-engine/types.test.ts`
- Create: `tests/intel-engine/config.test.ts`
- Create: `tests/intel-engine/preflight.test.ts`

**Step 1: Write the failing test for types**

Create `tests/intel-engine/types.test.ts`. Test that:
- `SignalFrontmatterSchema` validates a complete valid signal object
- `SignalFrontmatterSchema` rejects invalid `signal_type` values
- `SignalFrontmatterSchema` defaults optional arrays (concepts, problems, corroboration.supporting, corroboration.contradicting) to `[]`
- `WikiFrontmatterSchema` validates a valid wiki page object
- `WikiFrontmatterSchema` defaults `signals` and `sources` to `[]`

Import from `../../apps/intel-engine/src/types`. Use `bun:test` (describe, test, expect). See `tests/blog-pipeline/enrich.test.ts` for the test pattern.

**Step 2: Run test to verify it fails**

Run: `bun test tests/intel-engine/types.test.ts`
Expected: FAIL — cannot resolve module

**Step 3: Implement types.ts**

Create `apps/intel-engine/src/types.ts` with Zod schemas and TypeScript interfaces:

**Signal schemas:**
- `SignalTypeEnum` — z.enum of: technique, frustration, recommendation, warning, comparison, experience
- `SourceTypeEnum` — z.enum of: article, clipping, markdown, own-testing
- `ConfidenceEnum` — z.enum of: low, medium, high
- `CorroborationSchema` — z.object with count (number, default 1), supporting (string[], default []), contradicting (string[], default [])
- `SignalFrontmatterSchema` — z.object with all signal frontmatter fields. `concepts`, `problems` default to `[]`.
- `Signal` interface — { frontmatter: SignalFrontmatter, body: string, filePath: string }

**Wiki schemas:**
- `WikiTypeEnum` — z.enum of: entity, concept, comparison, synthesis
- `WikiStatusEnum` — z.enum of: stub, draft, complete
- `WikiFrontmatterSchema` — z.object with title, type, tags, created, updated, sources (default []), signals (default []), status
- `WikiPage` interface — { frontmatter: WikiFrontmatter, body: string, filePath: string }

**Other types:**
- `ParsedSource` — { frontmatter: Record<string, unknown>, content: string, filePath: string, sourceType: SourceType }
- `IngestResult` — { signals: Signal[], wikiUpdates: Array<{ path: string, action: 'create' | 'update' }>, sourceMovedTo: string }
- `SurfaceResult` — { briefPath: string, metrics: { totalSignals, totalWikiPages, stalePages, signalStarvedPages, orphanPages, coverageGaps } }
- `PublishResult` — { path: string, slug: string }

**Step 4: Run test to verify it passes**

Run: `bun test tests/intel-engine/types.test.ts`
Expected: PASS

**Step 5: Write the failing test for config**

Create `tests/intel-engine/config.test.ts`. Test that:
- `loadConfig()` returns config from env vars (set INTELIWIKI_PATH and ANTHROPIC_API_KEY in beforeEach)
- `loadConfig()` throws if INTELIWIKI_PATH is missing
- `loadConfig()` throws if ANTHROPIC_API_KEY is missing
- Model defaults to `claude-sonnet-4-5-20250514` when ANTHROPIC_MODEL not set
- Custom ANTHROPIC_MODEL override works

Save/restore `process.env` in beforeEach/afterEach.

**Step 6: Run test, verify fail, implement config.ts**

`loadConfig()` reads 3 env vars: INTELIWIKI_PATH (required), ANTHROPIC_API_KEY (required), ANTHROPIC_MODEL (default: claude-sonnet-4-5-20250514). Returns `IntelEngineConfig` interface. Follow same pattern as `apps/blog-pipeline/src/config.ts`.

**Step 7: Run test, verify pass**

**Step 8: Write the failing test for preflight**

Create `tests/intel-engine/preflight.test.ts`. Test that:
- `preflight(tempDir)` creates all REQUIRED_DIRS (signals/by-entity, signals/by-problem, content/blog, content/briefs, sources/inbox/processed, sources/inbox/failed, sources/articles)
- Running preflight twice is idempotent (no errors)
- `REQUIRED_DIRS` export contains expected directories

Use `mkdtemp` for temp directory, clean up in afterEach.

**Step 9: Run test, verify fail, implement preflight.ts**

`preflight(repoPath)` creates each REQUIRED_DIRS path with `mkdir({ recursive: true })`. Export `REQUIRED_DIRS` array.

**Step 10: Run test, verify pass**

**Step 11: Run all tests so far**

Run: `bun test tests/intel-engine/`
Expected: All PASS

**Step 12: Commit**

```bash
git add apps/intel-engine/src/types.ts apps/intel-engine/src/config.ts apps/intel-engine/src/preflight.ts tests/intel-engine/types.test.ts tests/intel-engine/config.test.ts tests/intel-engine/preflight.test.ts
git commit -m "feat(intel-engine): types, config, and preflight"
```

---

## Task 3: Signal Module (Parser, ID Generator)

**Files:**
- Create: `apps/intel-engine/src/signals/parser.ts`
- Create: `apps/intel-engine/src/signals/id-generator.ts`
- Create: `tests/intel-engine/signal-parser.test.ts`
- Create: `tests/intel-engine/signal-id.test.ts`

**Step 1: Write the failing test for signal parser**

Create `tests/intel-engine/signal-parser.test.ts`. Test:
- `parseSignal(raw, filePath)` parses the sample-signal.md fixture into a Signal with correct frontmatter fields and body
- `parseSignal()` throws on invalid frontmatter (e.g., bad signal_type)
- `serializeSignal(signal)` round-trips through parse/serialize — reparsed signal matches original

Both functions use `gray-matter` for frontmatter and `SignalFrontmatterSchema` for validation.

**Step 2: Run test, verify fail**

**Step 3: Implement signal parser**

`parseSignal(raw, filePath)`: parse with gray-matter, validate data with SignalFrontmatterSchema.parse(), return { frontmatter, body: content.trim(), filePath }.

`serializeSignal(signal)`: use matter.stringify() to reconstruct markdown from frontmatter + body.

**Step 4: Run test, verify pass**

**Step 5: Write the failing test for ID generator**

Create `tests/intel-engine/signal-id.test.ts`. Test:
- `generateSignalId([], '2026-04-12')` returns `sig-20260412-001`
- `generateSignalId(['sig-20260412-001', 'sig-20260412-002'], '2026-04-12')` returns `sig-20260412-003`
- Starts at 001 for a new date even with existing IDs from other dates
- Handles gaps (takes max sequence + 1, not fills gaps)
- `parseSignalId('sig-20260412-003')` returns { date: '20260412', sequence: 3 }
- `parseSignalId('bad')` throws

**Step 6: Run test, verify fail**

**Step 7: Implement ID generator**

`generateSignalId(existingIds, dateStr)`: compact date (remove dashes), find max sequence for that date among existing IDs, return `sig-{date}-{max+1 padded to 3}`.

`parseSignalId(id)`: regex match `sig-(\d{8})-(\d{3})`, return parsed parts.

**Step 8: Run test, verify pass**

**Step 9: Commit**

```bash
git add apps/intel-engine/src/signals/ tests/intel-engine/signal-parser.test.ts tests/intel-engine/signal-id.test.ts
git commit -m "feat(intel-engine): signal parser and ID generator"
```

---

## Task 4: Signal Corroboration

**Files:**
- Create: `apps/intel-engine/src/signals/corroborate.ts`
- Create: `tests/intel-engine/corroborate.test.ts`

**Step 1: Write the failing test**

Create `tests/intel-engine/corroborate.test.ts`. Create a helper `makeSignal()` that builds a Signal with defaults. Test:
- `findCorroborations(newSignal, existingSignals)` finds a match when signals share an entity AND have similar claims (using Jaccard word similarity)
- Returns empty when no shared entities
- Returns empty when entities match but claims are completely unrelated
- All matches are type `'supporting'` in Phase 1

**Step 2: Run test, verify fail**

**Step 3: Implement corroboration**

`findCorroborations(newSignal, existingSignals, threshold = 0.25)`:
1. For each existing signal, check if entities or problems intersect
2. If overlap, compute Jaccard similarity on tokenized claims
3. If similarity >= threshold, add to matches
4. Return CorroborationMatch[] with { existingSignalId, type: 'supporting', sharedEntities, sharedProblems }

Helper functions: `intersect(a, b)`, `tokenize(text)` (lowercase, remove punctuation, filter words > 2 chars), `jaccardSimilarity(setA, setB)`.

**Step 4: Run test, verify pass**

**Step 5: Commit**

```bash
git add apps/intel-engine/src/signals/corroborate.ts tests/intel-engine/corroborate.test.ts
git commit -m "feat(intel-engine): signal corroboration with Jaccard similarity"
```

---

## Task 5: Wiki Module (Parser, Cross-References)

**Files:**
- Create: `apps/intel-engine/src/wiki/parser.ts`
- Create: `apps/intel-engine/src/wiki/cross-ref.ts`
- Create: `tests/intel-engine/wiki-parser.test.ts`
- Create: `tests/intel-engine/cross-ref.test.ts`

**Step 1: Write failing test for wiki parser**

Test `parseWikiPage(raw, filePath)` with sample-wiki-page.md fixture, `serializeWikiPage()` round-trip.

**Step 2: Run, fail, implement**

Same pattern as signal parser but uses `WikiFrontmatterSchema`.

**Step 3: Write failing test for cross-references**

Test:
- `extractWikiLinks(content)` extracts `[[wiki-link]]` patterns, deduplicates
- Returns empty for content without links
- `findAffectedPages(names, wikiIndex)` finds pages whose entities or tags overlap with given names

**Step 4: Run, fail, implement**

`extractWikiLinks`: regex `/\[\[([^\]]+)\]\]/g`, collect unique matches.
`findAffectedPages(names, wikiIndex: Map<string, {entities, tags}>)`: filter pages where entities or tags intersect names.

**Step 5: Run all, verify pass, commit**

```bash
git add apps/intel-engine/src/wiki/ tests/intel-engine/wiki-parser.test.ts tests/intel-engine/cross-ref.test.ts
git commit -m "feat(intel-engine): wiki parser and cross-reference detection"
```

---

## Task 6: Repo I/O (Reader & Writer)

**Files:**
- Create: `apps/intel-engine/src/repo/reader.ts`
- Create: `apps/intel-engine/src/repo/writer.ts`
- Create: `apps/intel-engine/src/repo/index-manager.ts`
- Create: `tests/intel-engine/repo-reader.test.ts`
- Create: `tests/intel-engine/repo-writer.test.ts`

**Step 1: Write failing test for RepoReader**

Use temp directory with mkdtemp. Write signal and wiki files to it. Test:
- `readAllSignals()` finds signal files recursively in signals/by-entity/ and signals/by-problem/
- `readAllWikiPages()` finds wiki pages recursively in wiki/
- `readFile(relativePath)` reads any file from the repo
- `readInbox()` lists .md files in sources/inbox/
- `getAllSignalIds()` returns all signal IDs
- Silently skips unparseable files

**Step 2: Run, fail, implement RepoReader**

Class with constructor(repoPath). Methods use `readdir({ recursive: true })` and the signal/wiki parsers. Catch and skip parse errors.

**Step 3: Run, verify pass**

**Step 4: Write failing test for RepoWriter**

Use temp directory with preflight. Test:
- `writeSignal(signal)` writes to `signals/by-entity/{first-entity}/{id}.md`, creates directories
- `writeWikiPage(page)` writes to the page's filePath
- `appendLog(...)` appends formatted entry to log.md (creates if missing)
- `moveToProcessed(path)` moves file from inbox to inbox/processed

**Step 5: Run, fail, implement RepoWriter**

Class with constructor(repoPath). `writeSignal`: determines directory from first entity (or first problem, or `_untagged`), creates dir, writes serialized signal. `writeWikiPage`: writes serialized page to filePath. `appendLog`: formats log entry with timestamp, appends to log.md. `moveToProcessed`: renames file. `writeContent(relativePath, content)`: writes arbitrary content.

**Step 6: Run, verify pass**

**Step 7: Implement index-manager.ts**

`rebuildIndex(repoPath, pages: WikiPage[])`: groups pages by type, sorts alphabetically, formats as markdown with title links and one-line summaries (first non-heading line of body, truncated to 120 chars), writes to index.md.

**Step 8: Commit**

```bash
git add apps/intel-engine/src/repo/ tests/intel-engine/repo-reader.test.ts tests/intel-engine/repo-writer.test.ts
git commit -m "feat(intel-engine): repo reader, writer, and index manager"
```

---

## Task 7: LLM Client & Prompt Infrastructure

**Files:**
- Create: `apps/intel-engine/src/llm/client.ts`
- Create: `apps/intel-engine/src/llm/schemas.ts`
- Create: `tests/intel-engine/llm-schemas.test.ts`

**Step 1: Write failing test for LLM response schemas**

Create `tests/intel-engine/llm-schemas.test.ts`. Test that each schema validates correct input and rejects bad input:
- `ExtractedSignalSchema` — validates { claim, signal_type, entities, concepts, problems, confidence }
- `WikiUpdateSchema` — validates { path, action, title, type, tags, body }
- `EditorialBriefSchema` — validates { candidates: [{title, angle, signal_ids, entities}], trends, gaps }
- `BlogDraftSchema` — validates { title, body }
- `EnrichmentSchema` — validates { description, tags, faq: [{q, a}] }

**Step 2: Run, fail, implement schemas.ts**

Define 5 Zod schemas plus their response wrappers (`ExtractedSignalsResponseSchema` wraps array in `{signals: [...]}`, `WikiUpdatesResponseSchema` wraps in `{updates: [...]}`).

**Step 3: Run, verify pass**

**Step 4: Implement LLM client**

Create `apps/intel-engine/src/llm/client.ts`:

Define `LLMClient` interface with one method:
```typescript
complete<T>(params: { system: string; user: string; schema: z.ZodType<T>; maxTokens?: number }): Promise<T>
```

`createLLMClient(apiKey, model)` returns an implementation that:
1. Calls `anthropic.messages.create()` with system + user messages
2. Extracts text from response
3. Strips markdown JSON fencing if present
4. Parses JSON and validates with the provided Zod schema

Follow same pattern as `apps/blog-pipeline/src/services/enrich.service.ts:enrichContent()`.

The `LLMClient` interface is important — tests inject mock implementations.

**Step 5: Commit**

```bash
git add apps/intel-engine/src/llm/client.ts apps/intel-engine/src/llm/schemas.ts tests/intel-engine/llm-schemas.test.ts
git commit -m "feat(intel-engine): LLM client and response schemas"
```

---

## Task 8: LLM Prompts

**Files:**
- Create: `apps/intel-engine/src/llm/prompts/extract-signals.ts`
- Create: `apps/intel-engine/src/llm/prompts/update-wiki.ts`
- Create: `apps/intel-engine/src/llm/prompts/editorial-brief.ts`
- Create: `apps/intel-engine/src/llm/prompts/draft-post.ts`
- Create: `apps/intel-engine/src/llm/prompts/enrich-post.ts`
- Create: `tests/intel-engine/prompts.test.ts`

**Step 1: Write failing test for all 5 prompts**

Create `tests/intel-engine/prompts.test.ts`. For each prompt builder, test that:
- It returns `{ system, user }` strings
- System prompt contains key instructions (e.g., "intelligence analyst" for extract, "wiki maintainer" for update, "editorial" for brief, "operational intelligence" for draft, "SEO" for enrich)
- User message includes the provided inputs
- For extract-signals: system includes all signal_type enum values

**Step 2: Run, fail**

**Step 3: Implement all 5 prompt files**

Each file exports a single `build*Prompt(params)` function returning `{ system: string, user: string }`. Follow the pattern from `apps/blog-pipeline/src/services/enrich.service.ts:buildEnrichPrompt()`.

**extract-signals.ts** — System: "intelligence analyst extracting practitioner signals." Explains signal schema, signal_type values, confidence levels. Asks for JSON `{signals: [...]}`. User: source path, source type, full content.

**update-wiki.ts** — System: "wiki maintainer for operational intelligence knowledge base." Explains page types, "How can I use this?" lens. Asks for JSON `{updates: [...]}`. User: new signals (id + claim + entities), existing affected pages, current index.

**editorial-brief.ts** — System: "editorial advisor." Identify 3-5 story candidates with angles backed by signal evidence. JSON `{candidates, trends, gaps}`. User: signal summaries by entity (count + top claims), stale pages, coverage gaps.

**draft-post.ts** — System: "writer for operational intelligence publication." Wirecutter positioning, "How can I use this?" lens, signal-backed claims. JSON `{title, body}`. User: wiki content, supporting signals, optional editorial angle.

**enrich-post.ts** — System: "content enrichment engine." SEO description (160 chars), tags (3-7), FAQ (3-7 Q&A). JSON only. User: title + content. Same pattern as blog-pipeline's enrich prompt.

**Step 4: Run, verify pass**

**Step 5: Commit**

```bash
git add apps/intel-engine/src/llm/prompts/ tests/intel-engine/prompts.test.ts
git commit -m "feat(intel-engine): all 5 LLM prompt templates"
```

---

## Task 9: Ingest Pipeline

**Files:**
- Create: `apps/intel-engine/src/pipelines/ingest.ts`
- Create: `tests/intel-engine/ingest.test.ts`

**Step 1: Write the failing test**

Create `tests/intel-engine/ingest.test.ts`. Uses a **mock LLM client** that returns canned responses:
- For signal extraction (system contains "intelligence analyst"): returns 2 signals with known claims, entities, confidence
- For wiki update (system contains "wiki maintainer"): returns 1 create action for a new entity page

Set up a temp repo directory with preflight, write a sample source file to inbox, write an empty index.md.

Test that `ingest({ sourcePath, repoPath, llm })`:
- Returns result with 2 signals and 1 wiki update
- Signal files exist on disk in `signals/by-entity/`
- Wiki page file exists on disk
- Source moved from inbox to inbox/processed
- log.md contains the ingest entry

**Step 2: Run, fail**

**Step 3: Implement ingest pipeline**

`ingest(params: { sourcePath, repoPath, llm: LLMClient })` orchestrates:

1. **Parse** — Read source with gray-matter, detect sourceType from path/frontmatter
2. **Extract signals** (LLM) — Build prompt with `buildExtractSignalsPrompt`, call `llm.complete` with `ExtractedSignalsResponseSchema`
3. **Build Signal objects** — Generate IDs with `generateSignalId`, build full Signal objects with frontmatter
4. **Corroborate** — Read existing signals, run `findCorroborations` for each new signal, update corroboration counts on both sides, write updated existing signals
5. **Write signals** — `writer.writeSignal` for each new signal
6. **Wiki update** (LLM) — Find affected pages by entity/tag overlap, build prompt with `buildUpdateWikiPrompt`, call `llm.complete` with `WikiUpdatesResponseSchema`
7. **Write wiki updates** — `writer.writeWikiPage` for each update, merge signal IDs into frontmatter
8. **Rebuild index** — `rebuildIndex(repoPath, allPages)`
9. **Log** — `writer.appendLog`
10. **Move source** — `writer.moveToProcessed` if source was in inbox

Source type detection: path contains 'Clippings/' or tags include 'clippings' -> 'clipping', else 'markdown' for .md files, else 'article'.

**Step 4: Run, verify pass**

**Step 5: Commit**

```bash
git add apps/intel-engine/src/pipelines/ingest.ts tests/intel-engine/ingest.test.ts
git commit -m "feat(intel-engine): ingest pipeline with mock LLM test"
```

---

## Task 10: Surface Pipeline

**Files:**
- Create: `apps/intel-engine/src/pipelines/surface.ts`
- Create: `tests/intel-engine/surface.test.ts`

**Step 1: Write the failing test**

Create `tests/intel-engine/surface.test.ts`. Mock LLM returns editorial brief with 1 story candidate. Set up temp repo with 2 signals and 1 wiki page.

Test that `surface({ repoPath, llm })`:
- Writes brief to `content/briefs/YYYY-MM-DD-brief.md`
- Brief contains story candidate title and signal IDs
- Metrics reflect correct signal/page counts

**Step 2: Run, fail**

**Step 3: Implement surface pipeline**

`surface(params: { repoPath, llm })` orchestrates:

1. **Scan** (code) — `reader.readAllSignals()` + `reader.readAllWikiPages()`, parse all frontmatter
2. **Analyze** (code) — Group signals by entity, compute:
   - Signal summaries (entity, count, top claims sorted by corroboration)
   - Stale pages (updated > 14 days ago)
   - Signal-starved pages (signals array empty)
   - Orphan pages (not referenced via `[[link]]` in any other page)
   - Coverage gaps (entities in signals that have no wiki page)
3. **Editorial brief** (LLM) — Build prompt with summaries/metrics, call with `EditorialBriefSchema`
4. **Write** — Format brief as markdown with sections (Story Candidates, Trends, Gaps, Wiki Health), write to `content/briefs/`
5. **Log** — Append to log.md

**Step 4: Run, verify pass**

**Step 5: Commit**

```bash
git add apps/intel-engine/src/pipelines/surface.ts tests/intel-engine/surface.test.ts
git commit -m "feat(intel-engine): surface pipeline with editorial briefing"
```

---

## Task 11: Publish Pipeline

**Files:**
- Create: `apps/intel-engine/src/pipelines/publish.ts`
- Create: `tests/intel-engine/publish.test.ts`

**Step 1: Write the failing test**

Create `tests/intel-engine/publish.test.ts`. Mock LLM returns:
- Draft (system contains "operational intelligence publication"): title + markdown body with signal references
- Enrichment (system contains "SEO"): description, tags, FAQ

Set up temp repo with wiki page and 2 signal files.

Test that `publish({ wikiPagePath, repoPath, llm, angle })`:
- Writes draft to `content/blog/YYYY-MM-DD-slug.md`
- Draft contains blog-pipeline-compatible frontmatter: post_type, title, slug, description, tags, publish_date, author, reading_time
- Draft body contains the LLM-generated content

**Step 2: Run, fail**

**Step 3: Implement publish pipeline**

`publish(params: { wikiPagePath, repoPath, llm, angle?, author? })` orchestrates:

1. **Gather** (code) — Read target wiki page, read all cited signals (from frontmatter.signals), also find related signals by entity overlap (up to 10 extra)
2. **Draft** (LLM) — Build prompt with wiki content + signals + angle, call with `BlogDraftSchema`
3. **Enrich** (LLM) — Build prompt with draft title + body, call with `EnrichmentSchema`
4. **Build frontmatter** — Assemble blog-pipeline-compatible frontmatter: `post_type: 'blog_post'`, title, slug (slugify title), description, publish_date (ISO now), author (default 'Tokenrip'), tags, reading_time (ceil(words/200)), optional faq
5. **Write** — Serialize with gray-matter, write to `content/blog/{date}-{slug}.md`
6. **Log** — Append to log.md

`slugify(text)`: lowercase, remove non-alphanumeric except spaces/dashes, replace spaces with dashes, collapse multiple dashes, trim dashes, max 80 chars. Same logic as `apps/blog-pipeline/src/services/publish.service.ts`.

**Step 4: Run, verify pass**

**Step 5: Commit**

```bash
git add apps/intel-engine/src/pipelines/publish.ts tests/intel-engine/publish.test.ts
git commit -m "feat(intel-engine): publish pipeline with blog-pipeline-compatible output"
```

---

## Task 12: CLI + Library Exports

**Files:**
- Create: `apps/intel-engine/src/cli.ts`
- Create: `apps/intel-engine/src/index.ts`

**Step 1: Implement CLI**

Create `apps/intel-engine/src/cli.ts`. Pattern matches `apps/blog-pipeline/src/cli.ts`:

1. Parse command from `process.argv[2]` — must be `ingest`, `surface`, or `publish`
2. Print usage and exit(1) if no valid command
3. Load config, run preflight, create LLM client
4. Route to appropriate pipeline:

For `ingest`:
- If `--inbox` flag: read all inbox files, ingest each, print summary per file
- Otherwise: ingest single source path from argv[3]
- Print: signal count, wiki update count, source moved to

For `surface`:
- No arguments needed
- Print: brief path, total signals, total pages, stale pages, coverage gaps

For `publish`:
- Wiki page path from argv[3] (required)
- `--angle` flag with next arg (optional)
- Print: draft path, slug, hint to run blog-pipeline CLI for actual publishing

**Step 2: Implement library exports**

Create `apps/intel-engine/src/index.ts`. Export:
- `ingest`, `surface`, `publish` from pipelines
- `preflight`, `loadConfig`, `createLLMClient`
- `LLMClient` type
- All key types from types.ts

**Step 3: Verify CLI prints help**

Run: `cd apps/intel-engine && bun run src/cli.ts`
Expected: Prints usage and exits with code 1

**Step 4: Commit**

```bash
git add apps/intel-engine/src/cli.ts apps/intel-engine/src/index.ts
git commit -m "feat(intel-engine): CLI entry point and library exports"
```

---

## Task 13: End-to-End Verification

**No new files.** This task tests against the real inteliwiki repo.

**Step 1: Run all unit tests**

Run: `bun test tests/intel-engine/`
Expected: All tests PASS

**Step 2: Test ingest against a real Clipping**

Copy a Clipping to the inbox, run ingest, verify signal files appear, wiki updated, source moved, log updated.

**Step 3: Test surface**

Run surface, verify brief appears in content/briefs/ with story candidates and metrics.

**Step 4: Test publish**

Pick a wiki page with signals, run publish with an angle, verify blog-ready markdown appears in content/blog/ with correct frontmatter.

**Step 5: Test blog-pipeline compatibility**

Run `bun run apps/blog-pipeline/src/cli.ts` on the published draft. Verify it publishes to TokenRip and renders on the blog frontend.

**Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix(intel-engine): adjustments from end-to-end testing"
```

---

## Verification Summary

The engine is working when this flow completes end-to-end:

```
Clipping in inbox
  -> bun run apps/intel-engine/src/cli.ts ingest sources/inbox/clipping.md
  -> signals/ files created, wiki/ pages updated, log.md appended, source moved

(after 5-10 ingests)
  -> bun run apps/intel-engine/src/cli.ts surface
  -> content/briefs/ has editorial brief with story candidates

(pick a story)
  -> bun run apps/intel-engine/src/cli.ts publish wiki/entities/some-entity.md --angle "..."
  -> content/blog/ has blog-pipeline-compatible markdown

(review the draft, then)
  -> bun run apps/blog-pipeline/src/cli.ts /path/to/inteliwiki/content/blog/draft.md
  -> Published to TokenRip, visible at localhost:3600/blog/<slug>
```
