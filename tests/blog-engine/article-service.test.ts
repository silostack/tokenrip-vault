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
