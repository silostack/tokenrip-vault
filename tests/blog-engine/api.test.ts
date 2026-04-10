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
