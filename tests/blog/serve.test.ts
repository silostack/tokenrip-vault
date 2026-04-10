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
