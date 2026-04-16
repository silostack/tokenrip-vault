import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

let backend: TestBackend;
let agent: TestAgent;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agent = await createTestAgent(backend.url);
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

function post(path: string, body: Record<string, unknown>) {
  return fetch(`${backend.url}${path}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${agent.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function patch(path: string, body: Record<string, unknown>) {
  return fetch(`${backend.url}${path}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${agent.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function get(path: string) {
  return fetch(`${backend.url}${path}`);
}

describe('alias on create', () => {
  test('publish with alias stores it', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# Test\n\nContent',
      alias: 'my-test-post',
    });
    expect(res.status).toBe(201);
    const json = await res.json() as any;
    expect(json.ok).toBe(true);
    expect(json.data.alias).toBe('my-test-post');
  });

  test('lookup by alias returns the asset', async () => {
    const res = await get('/v0/assets/my-test-post');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.ok).toBe(true);
    expect(json.data.alias).toBe('my-test-post');
    expect(json.data.type).toBe('markdown');
  });

  test('lookup by alias returns content', async () => {
    const res = await get('/v0/assets/my-test-post/content');
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('# Test\n\nContent');
  });

  test('lookup by publicId still works', async () => {
    // First get the publicId from alias lookup
    const aliasRes = await get('/v0/assets/my-test-post');
    const aliasJson = await aliasRes.json() as any;
    const publicId = aliasJson.data.id;

    const res = await get(`/v0/assets/${publicId}`);
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.data.alias).toBe('my-test-post');
  });

  test('publish without alias works (alias is null)', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# No Alias',
    });
    expect(res.status).toBe(201);
    const json = await res.json() as any;
    expect(json.data.alias).toBeNull();
  });

  test('publish with duplicate alias returns 500', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# Duplicate',
      alias: 'my-test-post',
    });
    // Unique constraint violation — NestJS wraps as 500 unless we catch it
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('publish with invalid alias format returns 400', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# Bad Alias',
      alias: 'BAD ALIAS!',
    });
    expect(res.status).toBe(400);
    const json = await res.json() as any;
    expect(json.error).toBe('INVALID_ALIAS');
  });

  test('publish with reserved word alias returns 400', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# Reserved',
      alias: 'assets',
    });
    expect(res.status).toBe(400);
    const json = await res.json() as any;
    expect(json.error).toBe('INVALID_ALIAS');
    expect(json.message).toContain('reserved');
  });

  test('publish with too-short alias returns 400', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# Short',
      alias: 'ab',
    });
    expect(res.status).toBe(400);
    const json = await res.json() as any;
    expect(json.error).toBe('INVALID_ALIAS');
  });

  test('nonexistent alias returns 404', async () => {
    const res = await get('/v0/assets/nonexistent-slug-xyz');
    expect(res.status).toBe(404);
  });
});

describe('alias on update (PATCH)', () => {
  let assetPublicId: string;

  test('create asset without alias', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# Patchable',
      title: 'Patchable Post',
    });
    const json = await res.json() as any;
    assetPublicId = json.data.id;
    expect(json.data.alias).toBeNull();
  });

  test('PATCH to add alias', async () => {
    const res = await patch(`/v0/assets/${assetPublicId}`, {
      alias: 'patched-alias',
    });
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.ok).toBe(true);
    expect(json.data.alias).toBe('patched-alias');
  });

  test('alias lookup works after PATCH', async () => {
    const res = await get('/v0/assets/patched-alias');
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.data.id).toBe(assetPublicId);
  });

  test('PATCH to change alias', async () => {
    const res = await patch(`/v0/assets/${assetPublicId}`, {
      alias: 'new-alias-name',
    });
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.data.alias).toBe('new-alias-name');
  });

  test('old alias returns 404 after change', async () => {
    const res = await get('/v0/assets/patched-alias');
    expect(res.status).toBe(404);
  });

  test('new alias works', async () => {
    const res = await get('/v0/assets/new-alias-name');
    expect(res.status).toBe(200);
  });

  test('PATCH to update metadata', async () => {
    const res = await patch(`/v0/assets/${assetPublicId}`, {
      metadata: { post_type: 'blog_post', title: 'Updated Title' },
    });
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.data.metadata.post_type).toBe('blog_post');
  });

  test('metadata persists on GET', async () => {
    const res = await get(`/v0/assets/${assetPublicId}`);
    const json = await res.json() as any;
    expect(json.data.metadata.post_type).toBe('blog_post');
    expect(json.data.metadata.title).toBe('Updated Title');
  });
});

describe('alias with metadata on create', () => {
  test('publish with alias and metadata', async () => {
    const res = await post('/v0/assets', {
      type: 'markdown',
      content: '# Blog Post\n\nSome content here.',
      alias: 'blog-post-one',
      metadata: {
        post_type: 'blog_post',
        title: 'Blog Post One',
        description: 'A test blog post.',
        publish_date: '2026-04-11T10:00:00Z',
        author: 'Simon',
        tags: ['test', 'blog'],
      },
    });
    expect(res.status).toBe(201);
    const json = await res.json() as any;
    expect(json.data.alias).toBe('blog-post-one');
  });

  test('metadata returned in GET response', async () => {
    const res = await get('/v0/assets/blog-post-one');
    const json = await res.json() as any;
    expect(json.data.metadata.post_type).toBe('blog_post');
    expect(json.data.metadata.tags).toEqual(['test', 'blog']);
    expect(json.data.metadata.author).toBe('Simon');
  });
});
