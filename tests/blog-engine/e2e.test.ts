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
