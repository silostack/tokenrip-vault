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
