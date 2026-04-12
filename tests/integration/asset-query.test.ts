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

  // Seed three blog posts with different metadata
  await publishPost('first-post', {
    post_type: 'blog_post',
    title: 'First Post',
    description: 'The first post.',
    publish_date: '2026-04-09T10:00:00Z',
    author: 'Simon',
    tags: ['intro', 'blog'],
  });

  await publishPost('second-post', {
    post_type: 'blog_post',
    title: 'Second Post',
    description: 'The second post.',
    publish_date: '2026-04-10T10:00:00Z',
    author: 'Simon',
    tags: ['agentic', 'blog'],
  });

  await publishPost('third-post', {
    post_type: 'blog_post',
    title: 'Third Post',
    description: 'The third post.',
    publish_date: '2026-04-11T10:00:00Z',
    author: 'Simon',
    tags: ['agentic', 'mcp'],
  });

  // Seed one non-blog asset
  await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${agent.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'text', content: 'Not a blog post' }),
  });
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

async function publishPost(alias: string, metadata: Record<string, unknown>) {
  const res = await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${agent.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'markdown',
      content: `# ${metadata.title}\n\nContent for ${alias}.`,
      alias,
      metadata,
    }),
  });
  if (res.status !== 201) {
    throw new Error(`Failed to publish ${alias}: ${res.status} ${await res.text()}`);
  }
}

function query(body: Record<string, unknown>) {
  return fetch(`${backend.url}/v0/assets/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${agent.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /v0/assets/query', () => {
  test('query by metadata containment returns matching assets', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' } });
    expect(res.status).toBe(201);
    const json = await res.json() as any;
    expect(json.ok).toBe(true);
    expect(json.assets).toHaveLength(3);
    expect(json.pagination.total).toBe(3);
  });

  test('query excludes non-matching assets', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' } });
    const json = await res.json() as any;
    const aliases = json.assets.map((a: any) => a.alias);
    expect(aliases).not.toContain(null); // The text asset has no alias
  });

  test('query by tag returns matching assets', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, tag: 'agentic' });
    const json = await res.json() as any;
    expect(json.assets).toHaveLength(2);
    const aliases = json.assets.map((a: any) => a.alias);
    expect(aliases).toContain('second-post');
    expect(aliases).toContain('third-post');
  });

  test('query by tag that matches one post', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, tag: 'mcp' });
    const json = await res.json() as any;
    expect(json.assets).toHaveLength(1);
    expect(json.assets[0].alias).toBe('third-post');
  });

  test('sort by -publish_date (descending)', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, sort: '-publish_date' });
    const json = await res.json() as any;
    expect(json.assets).toHaveLength(3);
    expect(json.assets[0].alias).toBe('third-post');
    expect(json.assets[1].alias).toBe('second-post');
    expect(json.assets[2].alias).toBe('first-post');
  });

  test('sort by publish_date (ascending)', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, sort: 'publish_date' });
    const json = await res.json() as any;
    expect(json.assets[0].alias).toBe('first-post');
    expect(json.assets[2].alias).toBe('third-post');
  });

  test('pagination with limit', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, sort: '-publish_date', limit: 2 });
    const json = await res.json() as any;
    expect(json.assets).toHaveLength(2);
    expect(json.pagination.total).toBe(3);
    expect(json.pagination.limit).toBe(2);
    expect(json.pagination.offset).toBe(0);
  });

  test('pagination with offset', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, sort: '-publish_date', limit: 2, offset: 2 });
    const json = await res.json() as any;
    expect(json.assets).toHaveLength(1);
    expect(json.assets[0].alias).toBe('first-post');
    expect(json.pagination.offset).toBe(2);
  });

  test('response includes metadata but not content', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, limit: 1 });
    const json = await res.json() as any;
    const asset = json.assets[0];
    expect(asset.metadata).toBeDefined();
    expect(asset.metadata.post_type).toBe('blog_post');
    expect(asset.publicId).toBeDefined();
    expect(asset.alias).toBeDefined();
    // Content should NOT be in the listing
    expect(asset.content).toBeUndefined();
  });

  test('query requires auth', async () => {
    const res = await fetch(`${backend.url}/v0/assets/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metadata: { post_type: 'blog_post' } }),
    });
    expect(res.status).toBe(401);
  });

  test('empty metadata filter returns all published assets', async () => {
    const res = await query({});
    const json = await res.json() as any;
    // Should include all 4 published assets (3 blog + 1 text)
    expect(json.pagination.total).toBe(4);
  });

  test('query with nonexistent tag returns empty', async () => {
    const res = await query({ metadata: { post_type: 'blog_post' }, tag: 'nonexistent-xyz' });
    const json = await res.json() as any;
    expect(json.assets).toHaveLength(0);
    expect(json.pagination.total).toBe(0);
  });
});
