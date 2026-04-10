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
