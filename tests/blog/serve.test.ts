import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';

let backend: TestBackend;
let agent: TestAgent;
let blogServer: any;
let blogUrl: string;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agent = await createTestAgent(backend.url);

  // Publish a blog post via the TokenRip API
  await fetch(`${backend.url}/v0/assets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${agent.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'markdown',
      content: '# Test Article\n\nBody content here.',
      alias: 'test-article',
      metadata: {
        post_type: 'blog_post',
        title: 'Test Article',
        description: 'A test article.',
        publish_date: '2026-04-09T09:00:00Z',
        author: 'Test',
        tags: ['test'],
        faq: [
          { q: 'What is this?', a: 'A test article.' },
        ],
      },
    }),
  });

  process.env.TOKENRIP_API_URL = backend.url;
  process.env.TOKENRIP_API_KEY = agent.apiKey;
  process.env.BLOG_BASE_PATH = '/blog';
  process.env.PORT = '0';

  const { createBlogServer } = await import('../../apps/blog/src/serve');
  blogServer = createBlogServer();
  blogUrl = `http://localhost:${blogServer.port}`;
});

afterAll(async () => {
  blogServer?.stop();
  await stopBackend(backend);
  await dropTestDatabase(dbName);
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

  test('article page has canonical URL', async () => {
    const res = await fetch(`${blogUrl}/blog/test-article`);
    const html = await res.text();
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('/blog/test-article');
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
