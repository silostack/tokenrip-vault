# Blog Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a self-contained, agentic-first blog system as two new monorepo apps (`apps/blog-engine/` and `apps/blog/`).

**Architecture:** Fastify backend owns storage + SQLite index + publishing API. Bun frontend serves SSR head (meta/JSON-LD from frontmatter) with raw markdown in the body, rendered styled by client JS. Markdown files with rich frontmatter are the source of truth.

**Tech Stack:** Fastify, better-sqlite3, gray-matter (backend). Bun HTTP server, React, react-markdown, remark-gfm, rehype-highlight, Vite (frontend).

**Design doc:** `docs/plans/2026-04-09-blog-engine-design.md`

---

## Task 1: Blog Engine — Scaffold Project

**Files:**
- Create: `apps/blog-engine/package.json`
- Create: `apps/blog-engine/tsconfig.json`
- Create: `apps/blog-engine/.env.sample`
- Create: `apps/blog-engine/src/main.ts` (placeholder)
- Create: `apps/blog-engine/CLAUDE.md`

**Step 1: Create package.json**

```json
{
  "name": "blog-engine",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "reindex": "tsx src/reindex.ts"
  },
  "dependencies": {
    "fastify": "^5.3.3",
    "better-sqlite3": "^11.9.1",
    "gray-matter": "^4.0.3",
    "dotenv": "^16.5.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "@types/node": "^22.10.7",
    "tsx": "^4.19.4",
    "typescript": "^5.7.3"
  }
}
```

**Step 2: Create tsconfig.json**

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

```
PORT=3500
NODE_ENV=development

# Storage provider: "local" (S3 support coming later)
STORAGE_PROVIDER=local
STORAGE_PATH=./articles

# SQLite database path (disposable — rebuild with reindex)
SQLITE_PATH=./data/blog.sqlite

# Blog engine API URL (used by blog frontend)
BLOG_ENGINE_URL=http://localhost:3500
```

**Step 4: Create placeholder main.ts**

```ts
// apps/blog-engine/src/main.ts
import 'dotenv/config';
import { buildServer } from './server';

const port = parseInt(process.env.PORT || '3500', 10);

async function start() {
  const server = await buildServer();
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`blog-engine listening on :${port}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Step 5: Create CLAUDE.md**

Write a CLAUDE.md documenting the commands (`bun install`, `bun run dev`, `bun run build`, `bun run start`, `bun run reindex`), architecture overview (Fastify server owning article storage, SQLite index, publishing pipeline), and pointing to the design doc.

**Step 6: Install dependencies**

Run: `cd apps/blog-engine && bun install`

**Step 7: Commit**

```bash
git add apps/blog-engine/
git commit -m "feat(blog-engine): scaffold project with Fastify + SQLite + gray-matter"
```

---

## Task 2: Blog Engine — Storage Interface + Local Implementation

**Files:**
- Create: `apps/blog-engine/src/storage/storage.interface.ts`
- Create: `apps/blog-engine/src/storage/local-storage.ts`
- Create: `tests/blog-engine/storage.test.ts`

**Step 1: Write the failing test**

Create `tests/blog-engine/storage.test.ts`:

```ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { LocalStorage } from '../../apps/blog-engine/src/storage/local-storage';

let storage: LocalStorage;
let tmpDir: string;

beforeAll(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-storage-'));
  storage = new LocalStorage(tmpDir);
});

afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('LocalStorage', () => {
  test('save and read a file', async () => {
    const data = Buffer.from('# Hello World\n\nTest article.');
    await storage.save('test-article.md', data);
    const result = await storage.read('test-article.md');
    expect(result.toString()).toBe('# Hello World\n\nTest article.');
  });

  test('exists returns true for saved file', async () => {
    expect(await storage.exists('test-article.md')).toBe(true);
  });

  test('exists returns false for missing file', async () => {
    expect(await storage.exists('nope.md')).toBe(false);
  });

  test('list returns all .md files', async () => {
    await storage.save('second.md', Buffer.from('content'));
    const files = await storage.list();
    expect(files).toContain('test-article.md');
    expect(files).toContain('second.md');
  });

  test('list only returns .md files', async () => {
    await storage.save('image.png', Buffer.from('fake'));
    const files = await storage.list();
    expect(files).not.toContain('image.png');
  });

  test('delete removes a file', async () => {
    await storage.delete('second.md');
    expect(await storage.exists('second.md')).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/blog-engine/storage.test.ts`
Expected: FAIL — module not found

**Step 3: Create storage interface**

Create `apps/blog-engine/src/storage/storage.interface.ts`:

```ts
export interface StorageService {
  save(key: string, data: Buffer): Promise<void>;
  read(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
}
```

**Step 4: Create local storage implementation**

Create `apps/blog-engine/src/storage/local-storage.ts`:

```ts
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { StorageService } from './storage.interface';

export class LocalStorage implements StorageService {
  constructor(private readonly basePath: string) {}

  private resolve(key: string): string {
    return path.join(this.basePath, key);
  }

  async save(key: string, data: Buffer): Promise<void> {
    const filePath = this.resolve(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
  }

  async read(key: string): Promise<Buffer> {
    return fs.readFile(this.resolve(key));
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    await fs.unlink(this.resolve(key));
  }

  async list(): Promise<string[]> {
    const entries = await fs.readdir(this.basePath);
    return entries.filter((f) => f.endsWith('.md'));
  }
}
```

**Step 5: Run test to verify it passes**

Run: `bun test tests/blog-engine/storage.test.ts`
Expected: All 6 tests PASS

**Step 6: Commit**

```bash
git add apps/blog-engine/src/storage/ tests/blog-engine/storage.test.ts
git commit -m "feat(blog-engine): storage interface + local filesystem implementation"
```

---

## Task 3: Blog Engine — SQLite Index Module

**Files:**
- Create: `apps/blog-engine/src/db/index.ts`
- Create: `tests/blog-engine/db.test.ts`

**Step 1: Write the failing test**

Create `tests/blog-engine/db.test.ts`:

```ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { ArticleIndex } from '../../apps/blog-engine/src/db';

let db: ArticleIndex;
let tmpDir: string;

beforeAll(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-db-'));
  db = new ArticleIndex(path.join(tmpDir, 'blog.sqlite'));
});

afterAll(async () => {
  db.close();
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('ArticleIndex', () => {
  test('upsert and get an article', () => {
    db.upsert({
      slug: 'test-article',
      title: 'Test Article',
      description: 'A test.',
      publishedAt: '2026-04-09T09:00:00Z',
      image: null,
      tags: ['test', 'demo'],
      fileKey: 'test-article.md',
    });

    const article = db.get('test-article');
    expect(article).not.toBeNull();
    expect(article!.title).toBe('Test Article');
    expect(article!.tags).toEqual(['test', 'demo']);
  });

  test('list returns articles ordered by publishedAt desc', () => {
    db.upsert({
      slug: 'older-article',
      title: 'Older',
      description: null,
      publishedAt: '2026-01-01T00:00:00Z',
      image: null,
      tags: [],
      fileKey: 'older-article.md',
    });

    const list = db.list({ limit: 10, offset: 0 });
    expect(list.length).toBe(2);
    expect(list[0].slug).toBe('test-article');
  });

  test('list supports pagination', () => {
    const page = db.list({ limit: 1, offset: 1 });
    expect(page.length).toBe(1);
    expect(page[0].slug).toBe('older-article');
  });

  test('tags returns tag counts', () => {
    const tags = db.tags();
    expect(tags).toContainEqual({ tag: 'test', count: 1 });
    expect(tags).toContainEqual({ tag: 'demo', count: 1 });
  });

  test('remove deletes from index', () => {
    db.remove('older-article');
    expect(db.get('older-article')).toBeNull();
  });

  test('clear drops all rows', () => {
    db.clear();
    const list = db.list({ limit: 100, offset: 0 });
    expect(list.length).toBe(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/blog-engine/db.test.ts`
Expected: FAIL — module not found

**Step 3: Implement the SQLite index module**

Create `apps/blog-engine/src/db/index.ts`:

```ts
import Database from 'better-sqlite3';

export interface ArticleRow {
  slug: string;
  title: string;
  description: string | null;
  publishedAt: string | null;
  image: string | null;
  tags: string[];
  fileKey: string;
  indexedAt?: string;
}

export interface TagCount {
  tag: string;
  count: number;
}

export class ArticleIndex {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.init();
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        published_at TEXT,
        image TEXT,
        tags TEXT NOT NULL DEFAULT '[]',
        file_key TEXT NOT NULL,
        indexed_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_published_at
        ON articles(published_at DESC);
    `);
  }

  upsert(article: Omit<ArticleRow, 'indexedAt'>) {
    const stmt = this.db.prepare(`
      INSERT INTO articles
        (slug, title, description, published_at, image, tags, file_key, indexed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        published_at = excluded.published_at,
        image = excluded.image,
        tags = excluded.tags,
        file_key = excluded.file_key,
        indexed_at = excluded.indexed_at
    `);
    stmt.run(
      article.slug,
      article.title,
      article.description,
      article.publishedAt,
      article.image,
      JSON.stringify(article.tags),
      article.fileKey,
      new Date().toISOString(),
    );
  }

  get(slug: string): ArticleRow | null {
    const row = this.db
      .prepare('SELECT * FROM articles WHERE slug = ?')
      .get(slug) as any;
    if (!row) return null;
    return this.mapRow(row);
  }

  list({ limit, offset }: { limit: number; offset: number }): ArticleRow[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM articles ORDER BY published_at DESC LIMIT ? OFFSET ?',
      )
      .all(limit, offset) as any[];
    return rows.map(this.mapRow);
  }

  tags(): TagCount[] {
    const rows = this.db
      .prepare('SELECT tags FROM articles')
      .all() as { tags: string }[];

    const counts = new Map<string, number>();
    for (const row of rows) {
      const tags: string[] = JSON.parse(row.tags);
      for (const tag of tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return Array.from(counts.entries()).map(([tag, count]) => ({
      tag,
      count,
    }));
  }

  remove(slug: string) {
    this.db.prepare('DELETE FROM articles WHERE slug = ?').run(slug);
  }

  clear() {
    this.db.exec('DELETE FROM articles');
  }

  close() {
    this.db.close();
  }

  private mapRow(row: any): ArticleRow {
    return {
      slug: row.slug,
      title: row.title,
      description: row.description,
      publishedAt: row.published_at,
      image: row.image,
      tags: JSON.parse(row.tags),
      fileKey: row.file_key,
      indexedAt: row.indexed_at,
    };
  }
}
```

**Step 4: Run test to verify it passes**

Run: `bun test tests/blog-engine/db.test.ts`
Expected: All 6 tests PASS

**Step 5: Commit**

```bash
git add apps/blog-engine/src/db/ tests/blog-engine/db.test.ts
git commit -m "feat(blog-engine): SQLite article index with upsert, list, tags, clear"
```

---

## Task 4: Blog Engine — Article Service

**Files:**
- Create: `apps/blog-engine/src/services/article.service.ts`
- Create: `tests/blog-engine/article-service.test.ts`
- Create: `tests/fixtures/sample-article.md`

**Step 1: Create test fixture**

Create `tests/fixtures/sample-article.md`:

```markdown
---
title: "Test Article"
slug: test-article
description: "A test article for the blog engine."
publishedAt: 2026-04-09T09:00:00Z
tags: [test, demo]
jsonLd:
  article:
    type: Article
    author: { name: "Tokenrip", type: Organization }
  faq:
    - q: "What is this?"
      a: "A test article."
og:
  type: article
---

# Test Article

This is the body of the test article.

## Section Two

More content here.
```

**Step 2: Write the failing test**

Create `tests/blog-engine/article-service.test.ts`:

```ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { ArticleService } from '../../apps/blog-engine/src/services/article.service';
import { LocalStorage } from '../../apps/blog-engine/src/storage/local-storage';
import { ArticleIndex } from '../../apps/blog-engine/src/db';

let service: ArticleService;
let tmpDir: string;

beforeAll(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-article-'));
  const storagePath = path.join(tmpDir, 'articles');
  await fs.mkdir(storagePath, { recursive: true });

  const storage = new LocalStorage(storagePath);
  const index = new ArticleIndex(path.join(tmpDir, 'blog.sqlite'));
  service = new ArticleService(storage, index);
});

afterAll(async () => {
  service.close();
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('ArticleService', () => {
  test('store and retrieve an article', async () => {
    const fixture = await fs.readFile(
      path.join(__dirname, '../fixtures/sample-article.md'),
      'utf-8',
    );

    await service.store(fixture);

    const article = await service.getBySlug('test-article');
    expect(article).not.toBeNull();
    expect(article!.frontmatter.title).toBe('Test Article');
    expect(article!.frontmatter.slug).toBe('test-article');
    expect(article!.frontmatter.jsonLd.faq).toHaveLength(1);
    expect(article!.content).toContain('# Test Article');
    expect(article!.content).toContain('## Section Two');
  });

  test('list returns stored articles', async () => {
    const list = await service.list({ limit: 10, offset: 0 });
    expect(list).toHaveLength(1);
    expect(list[0].slug).toBe('test-article');
    expect(list[0].title).toBe('Test Article');
  });

  test('reindex rebuilds the index from storage', async () => {
    service.clearIndex();
    const emptyList = await service.list({ limit: 10, offset: 0 });
    expect(emptyList).toHaveLength(0);

    await service.reindex();
    const list = await service.list({ limit: 10, offset: 0 });
    expect(list).toHaveLength(1);
    expect(list[0].slug).toBe('test-article');
  });

  test('delete removes article from storage and index', async () => {
    await service.deleteBySlug('test-article');
    const article = await service.getBySlug('test-article');
    expect(article).toBeNull();

    const list = await service.list({ limit: 10, offset: 0 });
    expect(list).toHaveLength(0);
  });
});
```

**Step 3: Run test to verify it fails**

Run: `bun test tests/blog-engine/article-service.test.ts`
Expected: FAIL — module not found

**Step 4: Implement the article service**

Create `apps/blog-engine/src/services/article.service.ts`:

```ts
import matter from 'gray-matter';
import { StorageService } from '../storage/storage.interface';
import { ArticleIndex, ArticleRow } from '../db';

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description?: string;
  publishedAt?: string;
  image?: string;
  tags?: string[];
  jsonLd?: {
    article?: Record<string, any>;
    faq?: Array<{ q: string; a: string }>;
  };
  og?: Record<string, any>;
  [key: string]: any;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
}

export class ArticleService {
  constructor(
    private readonly storage: StorageService,
    private readonly index: ArticleIndex,
  ) {}

  async store(raw: string): Promise<string> {
    const { data } = matter(raw);
    const frontmatter = data as ArticleFrontmatter;

    if (!frontmatter.slug) {
      throw new Error('Article frontmatter must include a slug');
    }

    const fileKey = `${frontmatter.slug}.md`;
    await this.storage.save(fileKey, Buffer.from(raw));

    this.index.upsert({
      slug: frontmatter.slug,
      title: frontmatter.title,
      description: frontmatter.description || null,
      publishedAt: frontmatter.publishedAt || null,
      image: frontmatter.image || null,
      tags: frontmatter.tags || [],
      fileKey,
    });

    return frontmatter.slug;
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const fileKey = `${slug}.md`;
    const exists = await this.storage.exists(fileKey);
    if (!exists) return null;

    const buf = await this.storage.read(fileKey);
    const { data, content } = matter(buf.toString());
    return { frontmatter: data as ArticleFrontmatter, content };
  }

  async list(opts: { limit: number; offset: number }): Promise<ArticleRow[]> {
    return this.index.list(opts);
  }

  async tags() {
    return this.index.tags();
  }

  async deleteBySlug(slug: string): Promise<void> {
    const fileKey = `${slug}.md`;
    if (await this.storage.exists(fileKey)) {
      await this.storage.delete(fileKey);
    }
    this.index.remove(slug);
  }

  async reindex(): Promise<number> {
    this.index.clear();
    const files = await this.storage.list();
    let count = 0;

    for (const fileKey of files) {
      const buf = await this.storage.read(fileKey);
      const { data } = matter(buf.toString());
      const fm = data as ArticleFrontmatter;

      if (!fm.slug) continue;

      this.index.upsert({
        slug: fm.slug,
        title: fm.title,
        description: fm.description || null,
        publishedAt: fm.publishedAt || null,
        image: fm.image || null,
        tags: fm.tags || [],
        fileKey,
      });
      count++;
    }
    return count;
  }

  clearIndex() {
    this.index.clear();
  }

  close() {
    this.index.close();
  }
}
```

**Step 5: Run test to verify it passes**

Run: `bun test tests/blog-engine/article-service.test.ts`
Expected: All 4 tests PASS

**Step 6: Commit**

```bash
git add apps/blog-engine/src/services/ tests/blog-engine/article-service.test.ts tests/fixtures/sample-article.md
git commit -m "feat(blog-engine): article service with store, get, list, delete, reindex"
```

---

## Task 5: Blog Engine — Fastify Server + API Routes

**Files:**
- Create: `apps/blog-engine/src/server.ts`
- Create: `apps/blog-engine/src/routes/articles.ts`
- Create: `apps/blog-engine/src/config.ts`
- Create: `tests/blog-engine/api.test.ts`
- Create: `tests/blog-engine/setup.ts`

**Step 1: Write the test setup helper**

Create `tests/blog-engine/setup.ts`:

```ts
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { buildServer } from '../../apps/blog-engine/src/server';
import type { FastifyInstance } from 'fastify';

export interface TestBlogEngine {
  server: FastifyInstance;
  url: string;
  tmpDir: string;
}

export async function startBlogEngine(): Promise<TestBlogEngine> {
  const tmpDir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'blog-engine-test-'),
  );
  const storagePath = path.join(tmpDir, 'articles');
  const sqlitePath = path.join(tmpDir, 'blog.sqlite');
  await fs.mkdir(storagePath, { recursive: true });

  process.env.STORAGE_PATH = storagePath;
  process.env.SQLITE_PATH = sqlitePath;

  const server = await buildServer();
  await server.listen({ port: 0 });

  const address = server.addresses()[0];
  const url = `http://localhost:${address.port}`;

  return { server, url, tmpDir };
}

export async function stopBlogEngine(engine: TestBlogEngine) {
  await engine.server.close();
  await fs.rm(engine.tmpDir, { recursive: true, force: true });
}
```

**Step 2: Write the failing API test**

Create `tests/blog-engine/api.test.ts`:

```ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import {
  startBlogEngine,
  stopBlogEngine,
  type TestBlogEngine,
} from './setup';

let engine: TestBlogEngine;

const SAMPLE_ARTICLE = `---
title: "Test Article"
slug: test-article
description: "A test article."
publishedAt: 2026-04-09T09:00:00Z
tags: [test]
jsonLd:
  faq:
    - q: "What is this?"
      a: "A test."
---

# Test Article

Body content here.
`;

beforeAll(async () => {
  engine = await startBlogEngine();
});

afterAll(async () => {
  await stopBlogEngine(engine);
});

describe('Blog Engine API', () => {
  test('POST /articles/publish stores an article', async () => {
    const res = await fetch(`${engine.url}/articles/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/markdown' },
      body: SAMPLE_ARTICLE,
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.slug).toBe('test-article');
  });

  test('GET /articles/:slug returns frontmatter + content', async () => {
    const res = await fetch(`${engine.url}/articles/test-article`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.frontmatter.title).toBe('Test Article');
    expect(json.frontmatter.jsonLd.faq).toHaveLength(1);
    expect(json.content).toContain('# Test Article');
  });

  test('GET /articles returns article list', async () => {
    const res = await fetch(
      `${engine.url}/articles?limit=10&offset=0`,
    );
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.articles).toHaveLength(1);
    expect(json.articles[0].slug).toBe('test-article');
  });

  test('GET /articles/tags returns tag counts', async () => {
    const res = await fetch(`${engine.url}/articles/tags`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.tags).toContainEqual({ tag: 'test', count: 1 });
  });

  test('POST /articles/reindex rebuilds the index', async () => {
    const res = await fetch(`${engine.url}/articles/reindex`, {
      method: 'POST',
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.count).toBe(1);
  });

  test('DELETE /articles/:slug removes article', async () => {
    const res = await fetch(`${engine.url}/articles/test-article`, {
      method: 'DELETE',
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);

    const getRes = await fetch(
      `${engine.url}/articles/test-article`,
    );
    expect(getRes.status).toBe(404);
  });
});
```

**Step 3: Run test to verify it fails**

Run: `bun test tests/blog-engine/api.test.ts`
Expected: FAIL — module not found

**Step 4: Create config module**

Create `apps/blog-engine/src/config.ts`:

```ts
export function getConfig() {
  return {
    port: parseInt(process.env.PORT || '3500', 10),
    storagePath: process.env.STORAGE_PATH || './articles',
    sqlitePath: process.env.SQLITE_PATH || './data/blog.sqlite',
    storageProvider: process.env.STORAGE_PROVIDER || 'local',
  };
}
```

**Step 5: Create article routes**

Create `apps/blog-engine/src/routes/articles.ts`:

```ts
import { FastifyInstance } from 'fastify';
import { ArticleService } from '../services/article.service';

export async function articleRoutes(
  fastify: FastifyInstance,
  opts: { articleService: ArticleService },
) {
  const { articleService } = opts;

  // Static routes must come before parameterized routes
  fastify.get('/articles/tags', async () => {
    const tags = await articleService.tags();
    return { tags };
  });

  fastify.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/articles',
    async (request) => {
      const limit = parseInt(request.query.limit || '20', 10);
      const offset = parseInt(request.query.offset || '0', 10);
      const articles = await articleService.list({ limit, offset });
      return { articles };
    },
  );

  fastify.get<{ Params: { slug: string } }>(
    '/articles/:slug',
    async (request, reply) => {
      const { slug } = request.params;
      const article = await articleService.getBySlug(slug);
      if (!article) {
        return reply.status(404).send({ error: 'Article not found' });
      }
      return {
        frontmatter: article.frontmatter,
        content: article.content,
      };
    },
  );

  fastify.post('/articles/publish', async (request, reply) => {
    const body = request.body as string;
    if (!body) {
      return reply
        .status(400)
        .send({ error: 'Request body is required' });
    }

    try {
      const slug = await articleService.store(body);
      return { ok: true, slug };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/articles/reindex', async () => {
    const count = await articleService.reindex();
    return { ok: true, count };
  });

  fastify.delete<{ Params: { slug: string } }>(
    '/articles/:slug',
    async (request) => {
      const { slug } = request.params;
      await articleService.deleteBySlug(slug);
      return { ok: true };
    },
  );
}
```

**Step 6: Create server builder**

Create `apps/blog-engine/src/server.ts`:

```ts
import Fastify from 'fastify';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getConfig } from './config';
import { LocalStorage } from './storage/local-storage';
import { ArticleIndex } from './db';
import { ArticleService } from './services/article.service';
import { articleRoutes } from './routes/articles';

export async function buildServer() {
  const config = getConfig();
  const fastify = Fastify({ logger: false });

  fs.mkdirSync(config.storagePath, { recursive: true });
  fs.mkdirSync(path.dirname(config.sqlitePath), { recursive: true });

  const storage = new LocalStorage(config.storagePath);
  const index = new ArticleIndex(config.sqlitePath);
  const articleService = new ArticleService(storage, index);

  // Parse text/markdown as raw string
  fastify.addContentTypeParser(
    'text/markdown',
    { parseAs: 'string' },
    (_req, body, done) => {
      done(null, body);
    },
  );

  await fastify.register(articleRoutes, { articleService });

  fastify.addHook('onClose', () => {
    articleService.close();
  });

  return fastify;
}
```

**Step 7: Run test to verify it passes**

Run: `bun test tests/blog-engine/api.test.ts`
Expected: All 6 tests PASS

Note: If the `/articles/tags` route returns 404 or unexpected data, check that it is registered **before** `/articles/:slug` in the route file. Fastify matches in registration order for parameterized routes.

**Step 8: Commit**

```bash
git add apps/blog-engine/src/ tests/blog-engine/setup.ts tests/blog-engine/api.test.ts
git commit -m "feat(blog-engine): Fastify server with full article CRUD API"
```

---

## Task 6: Blog Engine — Reindex CLI Entry Point

**Files:**
- Create: `apps/blog-engine/src/reindex.ts`

**Step 1: Implement reindex script**

Create `apps/blog-engine/src/reindex.ts`:

```ts
import 'dotenv/config';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getConfig } from './config';
import { LocalStorage } from './storage/local-storage';
import { ArticleIndex } from './db';
import { ArticleService } from './services/article.service';

async function main() {
  const config = getConfig();

  fs.mkdirSync(config.storagePath, { recursive: true });
  fs.mkdirSync(path.dirname(config.sqlitePath), { recursive: true });

  const storage = new LocalStorage(config.storagePath);
  const index = new ArticleIndex(config.sqlitePath);
  const service = new ArticleService(storage, index);

  console.log(`Reindexing from ${config.storagePath}...`);
  const count = await service.reindex();
  console.log(`Indexed ${count} article(s).`);

  service.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Step 2: Verify it runs**

Run: `cd apps/blog-engine && STORAGE_PATH=./articles SQLITE_PATH=./data/blog.sqlite npx tsx src/reindex.ts`
Expected: `Reindexing from ./articles... Indexed 0 article(s).`

**Step 3: Commit**

```bash
git add apps/blog-engine/src/reindex.ts
git commit -m "feat(blog-engine): reindex CLI entry point"
```

---

## Task 7: Blog Frontend — Scaffold Project

**Files:**
- Create: `apps/blog/package.json`
- Create: `apps/blog/tsconfig.json`
- Create: `apps/blog/vite.config.ts`
- Create: `apps/blog/CLAUDE.md`
- Create: `apps/blog/.env.sample`

**Step 1: Create package.json**

```json
{
  "name": "blog",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "bun run --watch src/serve.ts",
    "build:client": "vite build",
    "start": "bun run src/serve.ts"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1",
    "rehype-highlight": "^7.0.2",
    "highlight.js": "^11.11.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.5.2",
    "typescript": "^5.7.3",
    "vite": "^6.3.5"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create vite.config.ts**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: 'src/client/entry.tsx',
      output: {
        entryFileNames: 'blog.js',
        assetFileNames: 'blog.[ext]',
      },
    },
  },
});
```

**Step 4: Create .env.sample**

```
PORT=3600
BLOG_ENGINE_URL=http://localhost:3500
BLOG_BASE_PATH=/blog
BASE_URL=http://localhost:3600
```

**Step 5: Create CLAUDE.md**

Write a CLAUDE.md documenting the commands (`bun install`, `bun run dev`, `bun run build:client`, `bun run start`), architecture overview (Bun HTTP server fetching from blog-engine API, SSR head + raw markdown body + client JS rendering), and pointing to the design doc.

**Step 6: Install dependencies**

Run: `cd apps/blog && bun install`

**Step 7: Commit**

```bash
git add apps/blog/
git commit -m "feat(blog): scaffold frontend project with Vite + React markdown stack"
```

---

## Task 8: Blog Frontend — Client-Side Markdown Renderer

**Files:**
- Create: `apps/blog/src/client/entry.tsx`
- Create: `apps/blog/src/client/MarkdownRenderer.tsx`

**Step 1: Create the markdown renderer component**

Same libraries as `apps/frontend/src/components/viewers/MarkdownViewer.tsx`.

Create `apps/blog/src/client/MarkdownRenderer.tsx`:

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="markdown-body prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
```

**Step 2: Create the client entry point**

Finds raw markdown in the page, hides it, and renders the styled version.

Create `apps/blog/src/client/entry.tsx`:

```tsx
import { createRoot } from 'react-dom/client';
import { MarkdownRenderer } from './MarkdownRenderer';

function mount() {
  const source = document.getElementById('markdown-source');
  const target = document.getElementById('markdown-rendered');

  if (!source || !target) return;

  const markdown = source.textContent || '';

  // Hide raw markdown visually, keep for agents/screen readers
  source.setAttribute('aria-hidden', 'true');
  source.classList.add('sr-only');
  target.classList.remove('hidden');

  const root = createRoot(target);
  root.render(<MarkdownRenderer content={markdown} />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
```

**Step 3: Build the client bundle**

Run: `cd apps/blog && bun run build:client`
Expected: `dist/client/blog.js` is generated

**Step 4: Commit**

```bash
git add apps/blog/src/client/
git commit -m "feat(blog): client-side markdown renderer with react-markdown"
```

---

## Task 9: Blog Frontend — HTML Templates

**Files:**
- Create: `apps/blog/src/templates/types.ts`
- Create: `apps/blog/src/templates/head.ts`
- Create: `apps/blog/src/templates/layout.ts`
- Create: `apps/blog/src/templates/article.ts`
- Create: `apps/blog/src/templates/index.ts`

**Step 1: Create shared types**

Create `apps/blog/src/templates/types.ts`:

```ts
export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description?: string;
  publishedAt?: string;
  image?: string;
  tags?: string[];
  jsonLd?: {
    article?: {
      type?: string;
      author?: { name: string; type?: string };
    };
    faq?: Array<{ q: string; a: string }>;
  };
  og?: { type?: string; image?: string; [key: string]: any };
  [key: string]: any;
}

export interface ArticleListItem {
  slug: string;
  title: string;
  description: string | null;
  publishedAt: string | null;
  image: string | null;
  tags: string[];
}
```

**Step 2: Create the head renderer**

Assembles `<head>` content from frontmatter: title, description, OG tags, JSON-LD (Article + FAQPage schemas).

Create `apps/blog/src/templates/head.ts`:

```ts
import type { ArticleFrontmatter } from './types';

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildJsonLd(fm: ArticleFrontmatter, baseUrl: string): string {
  const scripts: string[] = [];

  const article: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description || '',
    datePublished: fm.publishedAt || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${fm.slug}`,
    },
  };
  if (fm.image) article.image = fm.image;
  if (fm.jsonLd?.article?.author) {
    article.author = {
      '@type': fm.jsonLd.article.author.type || 'Organization',
      name: fm.jsonLd.article.author.name,
    };
  }
  scripts.push(
    `<script type="application/ld+json">${JSON.stringify(article)}</script>`,
  );

  if (fm.jsonLd?.faq && fm.jsonLd.faq.length > 0) {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: fm.jsonLd.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };
    scripts.push(
      `<script type="application/ld+json">${JSON.stringify(faq)}</script>`,
    );
  }

  return scripts.join('\n');
}

export function renderHead(
  fm: ArticleFrontmatter,
  baseUrl: string,
): string {
  const title = esc(fm.title);
  const desc = fm.description ? esc(fm.description) : '';
  const ogType = fm.og?.type || 'article';
  const ogImage = fm.og?.image || fm.image || '';

  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${title}</title>`,
    desc && `<meta name="description" content="${desc}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:type" content="${esc(ogType)}">`,
    desc && `<meta property="og:description" content="${desc}">`,
    ogImage && `<meta property="og:image" content="${esc(ogImage)}">`,
    `<meta property="og:url" content="${baseUrl}/blog/${fm.slug}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    desc && `<meta name="twitter:description" content="${desc}">`,
    ogImage && `<meta name="twitter:image" content="${esc(ogImage)}">`,
    buildJsonLd(fm, baseUrl),
  ]
    .filter(Boolean)
    .join('\n');
}
```

**Step 3: Create layout wrapper**

Create `apps/blog/src/templates/layout.ts`:

```ts
export function renderLayout(head: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head}
<link rel="stylesheet" href="/blog/_assets/blog.css">
</head>
<body>
${body}
<script type="module" src="/blog/_assets/blog.js"></script>
</body>
</html>`;
}
```

**Step 4: Create article page template**

Create `apps/blog/src/templates/article.ts`:

```ts
import { renderHead } from './head';
import { renderLayout } from './layout';
import type { ArticleFrontmatter } from './types';

function escapeContent(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderArticlePage(
  frontmatter: ArticleFrontmatter,
  markdownContent: string,
  baseUrl: string,
): string {
  const head = renderHead(frontmatter, baseUrl);
  const body = `
<main>
  <div id="markdown-source">${escapeContent(markdownContent)}</div>
  <div id="markdown-rendered" class="hidden"></div>
</main>`;

  return renderLayout(head, body);
}
```

**Step 5: Create index page template**

Create `apps/blog/src/templates/index.ts`:

```ts
import { renderLayout } from './layout';
import type { ArticleListItem } from './types';

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderIndexPage(
  articles: ArticleListItem[],
  baseUrl: string,
): string {
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Blog</title>',
    '<meta name="description" content="Latest articles">',
  ].join('\n');

  const list = articles
    .map((a) => {
      const date = a.publishedAt
        ? new Date(a.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '';
      const tags = a.tags
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join(' ');
      return `
      <article>
        <h2><a href="${baseUrl}/blog/${a.slug}">${esc(a.title)}</a></h2>
        ${date ? `<time datetime="${a.publishedAt}">${date}</time>` : ''}
        ${a.description ? `<p>${esc(a.description)}</p>` : ''}
        ${tags ? `<div class="tags">${tags}</div>` : ''}
      </article>`;
    })
    .join('\n');

  const body = `
<main>
  <h1>Blog</h1>
  <div class="article-list">
    ${list || '<p>No articles yet.</p>'}
  </div>
</main>`;

  return renderLayout(head, body);
}
```

**Step 6: Commit**

```bash
git add apps/blog/src/templates/
git commit -m "feat(blog): HTML templates with SSR head, JSON-LD, article + index pages"
```

---

## Task 10: Blog Frontend — Bun HTTP Server

**Files:**
- Create: `apps/blog/src/serve.ts`
- Create: `tests/blog/serve.test.ts`

**Step 1: Write the failing test**

Create `tests/blog/serve.test.ts`:

```ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import {
  startBlogEngine,
  stopBlogEngine,
  type TestBlogEngine,
} from '../blog-engine/setup';

let engine: TestBlogEngine;
let blogServer: any;
let blogUrl: string;

const SAMPLE_ARTICLE = `---
title: "Test Article"
slug: test-article
description: "A test article."
publishedAt: 2026-04-09T09:00:00Z
tags: [test]
jsonLd:
  article:
    type: Article
    author: { name: "Test", type: Organization }
  faq:
    - q: "What is this?"
      a: "A test article."
og:
  type: article
---

# Test Article

Body content here.
`;

beforeAll(async () => {
  engine = await startBlogEngine();

  await fetch(`${engine.url}/articles/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/markdown' },
    body: SAMPLE_ARTICLE,
  });

  process.env.BLOG_ENGINE_URL = engine.url;
  process.env.BLOG_BASE_PATH = '/blog';
  process.env.PORT = '0';

  const { createBlogServer } = await import(
    '../../apps/blog/src/serve'
  );
  blogServer = createBlogServer();
  blogUrl = `http://localhost:${blogServer.port}`;
});

afterAll(async () => {
  blogServer?.stop();
  await stopBlogEngine(engine);
});

describe('Blog Frontend', () => {
  test('GET /blog returns index page', async () => {
    const res = await fetch(`${blogUrl}/blog`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<title>Blog</title>');
    expect(html).toContain('Test Article');
    expect(html).toContain('/blog/test-article');
  });

  test('GET /blog/:slug returns article with SSR head', async () => {
    const res = await fetch(`${blogUrl}/blog/test-article`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<title>Test Article</title>');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('FAQPage');
    expect(html).toContain('og:title');
    expect(html).toContain('# Test Article');
  });

  test('Accept: text/markdown returns raw markdown', async () => {
    const res = await fetch(`${blogUrl}/blog/test-article`, {
      headers: { Accept: 'text/markdown' },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/markdown');
    const body = await res.text();
    expect(body).toContain('# Test Article');
    expect(body).not.toContain('<html');
  });

  test('GET /blog/nonexistent returns 404', async () => {
    const res = await fetch(`${blogUrl}/blog/nonexistent`);
    expect(res.status).toBe(404);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/blog/serve.test.ts`
Expected: FAIL — module not found

**Step 3: Implement the Bun HTTP server**

Create `apps/blog/src/serve.ts`:

```ts
import { renderArticlePage } from './templates/article';
import { renderIndexPage } from './templates/index';

const ENGINE_URL = process.env.BLOG_ENGINE_URL || 'http://localhost:3500';
const BASE_PATH = process.env.BLOG_BASE_PATH || '/blog';
const PORT = parseInt(process.env.PORT || '3600', 10);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  return accept.includes('text/markdown');
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Static assets
  if (pathname.startsWith(`${BASE_PATH}/_assets/`)) {
    const assetPath = pathname.replace(`${BASE_PATH}/_assets/`, '');
    const file = Bun.file(`dist/client/${assetPath}`);
    if (await file.exists()) {
      return new Response(file);
    }
    return new Response('Not found', { status: 404 });
  }

  // Index page
  if (pathname === BASE_PATH || pathname === `${BASE_PATH}/`) {
    const limit = url.searchParams.get('limit') || '20';
    const offset = url.searchParams.get('offset') || '0';
    const res = await fetch(
      `${ENGINE_URL}/articles?limit=${limit}&offset=${offset}`,
    );
    const json = await res.json();
    const html = renderIndexPage(json.articles, BASE_URL);
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Article pages: /blog/:slug
  const slugMatch = pathname.match(
    new RegExp(`^${BASE_PATH}/([a-z0-9][a-z0-9-]*)$`),
  );
  if (slugMatch) {
    const slug = slugMatch[1];
    const res = await fetch(`${ENGINE_URL}/articles/${slug}`);
    if (!res.ok) {
      return new Response('Not found', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const { frontmatter, content } = await res.json();

    // Content negotiation: raw markdown for agents
    if (wantsMarkdown(req.headers.get('accept'))) {
      return new Response(content, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          Vary: 'Accept',
        },
      });
    }

    // HTML for browsers
    const html = renderArticlePage(frontmatter, content, BASE_URL);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        Vary: 'Accept',
      },
    });
  }

  return new Response('Not found', { status: 404 });
}

export function createBlogServer(port?: number) {
  return Bun.serve({
    port: port ?? PORT,
    fetch: handleRequest,
  });
}

// Run if invoked directly
if (import.meta.main) {
  const server = createBlogServer();
  console.log(`blog listening on :${server.port}`);
}
```

**Step 4: Run test to verify it passes**

Run: `bun test tests/blog/serve.test.ts`
Expected: All 4 tests PASS

**Step 5: Commit**

```bash
git add apps/blog/src/serve.ts tests/blog/serve.test.ts
git commit -m "feat(blog): Bun HTTP server with SSR head, content negotiation, routing"
```

---

## Task 11: Blog Frontend — Styles

**Files:**
- Create: `apps/blog/public/blog.css`

**Step 1: Create the stylesheet**

Port `.markdown-body` styles from `apps/frontend/src/app/globals.css`. Add blog layout and sr-only utility. Reference the existing file for the full set of syntax highlighting token colors.

Key sections to include: reset/base, sr-only/hidden utilities, article-list styles for index page, and the full `.markdown-body` ruleset (typography, headings, blockquotes, code blocks with Tokyo Night theme, tables, links, images, lists, hr, animation).

See `apps/frontend/src/app/globals.css` for the complete `.markdown-body` CSS to port over.

**Step 2: Build and verify**

Run: `cd apps/blog && bun run build:client`
Expected: `dist/client/blog.js` and `dist/client/blog.css` exist in output

**Step 3: Commit**

```bash
git add apps/blog/public/
git commit -m "feat(blog): markdown body styles ported from main frontend"
```

---

## Task 12: Publishing Pipeline — Basic Enrichment

**Files:**
- Create: `apps/blog-engine/src/services/publish.service.ts`
- Modify: `apps/blog-engine/src/routes/articles.ts` — use enrichment in publish route
- Create: `tests/blog-engine/publish.test.ts`

**Step 1: Write the failing test**

Create `tests/blog-engine/publish.test.ts`:

```ts
import { describe, test, expect } from 'bun:test';
import { enrichArticle } from '../../apps/blog-engine/src/services/publish.service';

describe('enrichArticle', () => {
  test('generates slug from title', () => {
    const raw = `---
title: "My Great Article!"
---

# My Great Article!

Some content here.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.slug).toBe('my-great-article');
  });

  test('preserves existing slug', () => {
    const raw = `---
title: "My Article"
slug: custom-slug
---

Content.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.slug).toBe('custom-slug');
  });

  test('generates description from content if missing', () => {
    const raw = `---
title: "Test"
---

This is the first paragraph of the article. It has enough text to serve as a description for the article when displayed in listing pages.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.description).toBeTruthy();
    expect(result.frontmatter.description!.length).toBeLessThanOrEqual(200);
  });

  test('sets publishedAt if missing', () => {
    const raw = `---
title: "Test"
---

Content.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.publishedAt).toBeTruthy();
  });

  test('produces valid markdown output with frontmatter', () => {
    const raw = `---
title: "Test"
---

Content here.
`;
    const result = enrichArticle(raw);
    expect(result.output).toContain('---');
    expect(result.output).toContain('title:');
    expect(result.output).toContain('slug:');
    expect(result.output).toContain('Content here.');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `bun test tests/blog-engine/publish.test.ts`
Expected: FAIL — module not found

**Step 3: Implement the publish service**

Create `apps/blog-engine/src/services/publish.service.ts`:

```ts
import matter from 'gray-matter';

export interface EnrichResult {
  frontmatter: {
    title: string;
    slug: string;
    description?: string;
    publishedAt?: string;
    tags?: string[];
    [key: string]: any;
  };
  content: string;
  output: string;
}

export function enrichArticle(raw: string): EnrichResult {
  const { data, content } = matter(raw);

  if (!data.slug && data.title) {
    data.slug = slugify(data.title);
  }

  if (!data.description && content.trim()) {
    data.description = extractExcerpt(content, 160);
  }

  if (!data.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }

  const output = matter.stringify(content, data);

  return {
    frontmatter: data as EnrichResult['frontmatter'],
    content,
    output,
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractExcerpt(content: string, maxLength: number): string {
  const lines = content
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'));
  const paragraph = lines[0] || '';
  if (paragraph.length <= maxLength) return paragraph;
  return paragraph.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}
```

**Step 4: Run test to verify it passes**

Run: `bun test tests/blog-engine/publish.test.ts`
Expected: All 5 tests PASS

**Step 5: Update the publish route to use enrichment**

In `apps/blog-engine/src/routes/articles.ts`, add import at top:

```ts
import { enrichArticle } from '../services/publish.service';
```

Then in the `POST /articles/publish` handler, change from storing `body` directly to:

```ts
const enriched = enrichArticle(body);
const slug = await articleService.store(enriched.output);
return { ok: true, slug };
```

**Step 6: Run API tests to verify enrichment integrates correctly**

Run: `bun test tests/blog-engine/api.test.ts`
Expected: All 6 tests still PASS

**Step 7: Commit**

```bash
git add apps/blog-engine/src/services/publish.service.ts apps/blog-engine/src/routes/articles.ts tests/blog-engine/publish.test.ts
git commit -m "feat(blog-engine): publish pipeline with slug generation, excerpt, timestamp enrichment"
```

---

## Task 13: End-to-End Smoke Test

**Files:**
- Create: `tests/blog-engine/e2e.test.ts`

**Step 1: Write the e2e test**

This boots both apps, publishes a raw article (no slug, no description), and verifies the full flow.

Create `tests/blog-engine/e2e.test.ts`:

```ts
import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import {
  startBlogEngine,
  stopBlogEngine,
  type TestBlogEngine,
} from './setup';

let engine: TestBlogEngine;
let blogServer: any;
let blogUrl: string;

const RAW_ARTICLE = `---
title: "Understanding Bitcoin Layer 2 Solutions"
tags: [bitcoin, layer2]
---

# Understanding Bitcoin Layer 2 Solutions

Bitcoin's base layer processes roughly seven transactions per second. Layer 2 solutions like the Lightning Network address this limitation by moving transactions off-chain while maintaining the security guarantees of the main chain.

## How Lightning Works

Lightning creates payment channels between parties. These channels allow unlimited transactions between participants without touching the main chain.

## Conclusion

Layer 2 solutions are essential for Bitcoin's scalability roadmap.
`;

beforeAll(async () => {
  engine = await startBlogEngine();

  process.env.BLOG_ENGINE_URL = engine.url;
  process.env.BLOG_BASE_PATH = '/blog';
  process.env.PORT = '0';

  const { createBlogServer } = await import('../../apps/blog/src/serve');
  blogServer = createBlogServer();
  blogUrl = `http://localhost:${blogServer.port}`;
});

afterAll(async () => {
  blogServer?.stop();
  await stopBlogEngine(engine);
});

describe('Blog E2E', () => {
  test('publish raw article enriches slug + description', async () => {
    const res = await fetch(`${engine.url}/articles/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/markdown' },
      body: RAW_ARTICLE,
    });
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.slug).toBe('understanding-bitcoin-layer-2-solutions');
  });

  test('frontend serves article with SSR head + markdown body', async () => {
    const slug = 'understanding-bitcoin-layer-2-solutions';
    const res = await fetch(`${blogUrl}/blog/${slug}`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain(
      '<title>Understanding Bitcoin Layer 2 Solutions</title>',
    );
    expect(html).toContain('og:title');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('# Understanding Bitcoin Layer 2 Solutions');
    expect(html).toContain('## How Lightning Works');
  });

  test('agent gets raw markdown via content negotiation', async () => {
    const slug = 'understanding-bitcoin-layer-2-solutions';
    const res = await fetch(`${blogUrl}/blog/${slug}`, {
      headers: { Accept: 'text/markdown' },
    });
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('# Understanding Bitcoin Layer 2 Solutions');
    expect(body).not.toContain('<html');
    expect(body).not.toContain('<!DOCTYPE');
  });

  test('index page lists the published article', async () => {
    const res = await fetch(`${blogUrl}/blog`);
    const html = await res.text();
    expect(html).toContain('Understanding Bitcoin Layer 2 Solutions');
    expect(html).toContain(
      '/blog/understanding-bitcoin-layer-2-solutions',
    );
  });

  test('reindex rebuilds from storage', async () => {
    const res = await fetch(`${engine.url}/articles/reindex`, {
      method: 'POST',
    });
    const json = await res.json();
    expect(json.count).toBe(1);
  });
});
```

**Step 2: Run the test**

Run: `bun test tests/blog-engine/e2e.test.ts`
Expected: All 5 tests PASS

**Step 3: Run all blog tests together**

Run: `bun test tests/blog-engine/ tests/blog/`
Expected: All tests PASS (36 total across 7 test files)

**Step 4: Commit**

```bash
git add tests/blog-engine/e2e.test.ts
git commit -m "test(blog): end-to-end smoke test for publish-to-serve flow"
```

---

## Task Summary

| # | Task | Tests | Files |
|---|---|---|---|
| 1 | Blog Engine — scaffold | — | 5 created |
| 2 | Storage interface + local impl | 6 | 3 created |
| 3 | SQLite index module | 6 | 2 created |
| 4 | Article service | 4 | 3 created |
| 5 | Fastify server + API routes | 6 | 5 created |
| 6 | Reindex CLI | — | 1 created |
| 7 | Blog Frontend — scaffold | — | 5 created |
| 8 | Client markdown renderer | — | 2 created |
| 9 | HTML templates | — | 5 created |
| 10 | Bun HTTP server | 4 | 2 created |
| 11 | Styles | — | 1 created |
| 12 | Publish pipeline enrichment | 5 | 2 created, 1 modified |
| 13 | E2E smoke test | 5 | 1 created |
| | **Total** | **36** | **37 files** |
