import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBackend, stopBackend, type TestBackend } from '../setup/backend';
import { generateTestDbName, createTestDatabase, dropTestDatabase } from '../setup/database';
import { createTestAgent, type TestAgent } from '../setup/agent';
import { publishBlogPost, type PipelineConfig } from '../../apps/blog-pipeline/src/pipeline';

let backend: TestBackend;
let agent: TestAgent;
let config: PipelineConfig;
const dbName = generateTestDbName();

beforeAll(async () => {
  await createTestDatabase(dbName);
  backend = await startBackend(dbName);
  agent = await createTestAgent(backend.url);
  config = {
    tokenripUrl: backend.url,
    tokenripApiKey: agent.apiKey,
    anthropicApiKey: '', // no LLM enrichment in tests
    anthropicModel: 'claude-sonnet-4-5-20250514',
    author: { authorName: 'Tokenrip', authorType: 'Organization' },
  };
});

afterAll(async () => {
  await stopBackend(backend);
  await dropTestDatabase(dbName);
});

describe('publishBlogPost', () => {
  test('publishes a new blog post', async () => {
    const markdown = `---
title: "Test Pipeline Post"
tags: [test, pipeline]
---

# Test Pipeline Post

This is a test blog post published through the pipeline.
`;

    const result = await publishBlogPost(markdown, config);
    expect(result.slug).toBe('test-pipeline-post');
    expect(result.publicId).toBeDefined();
    expect(result.updated).toBe(false);
  });

  test('published post is accessible by alias', async () => {
    const res = await fetch(`${backend.url}/v0/assets/test-pipeline-post`);
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.data.alias).toBe('test-pipeline-post');
    expect(json.data.metadata.post_type).toBe('blog_post');
    expect(json.data.metadata.title).toBe('Test Pipeline Post');
    expect(json.data.metadata.tags).toEqual(['test', 'pipeline']);
  });

  test('published post has correct metadata', async () => {
    const res = await fetch(`${backend.url}/v0/assets/test-pipeline-post`);
    const json = await res.json() as any;
    expect(json.data.metadata.author).toBe('Tokenrip');
    expect(json.data.metadata.publish_date).toBeDefined();
    expect(json.data.metadata.reading_time).toBeGreaterThanOrEqual(1);
    expect(json.data.metadata.description).toBeTruthy();
  });

  test('published post content is readable', async () => {
    const res = await fetch(`${backend.url}/v0/assets/test-pipeline-post/content`);
    const text = await res.text();
    expect(text).toContain('test blog post published through the pipeline');
  });

  test('updates existing post when slug matches', async () => {
    const markdown = `---
title: "Test Pipeline Post"
slug: test-pipeline-post
tags: [test, pipeline, updated]
---

# Test Pipeline Post

This is the UPDATED content.
`;

    const result = await publishBlogPost(markdown, config);
    expect(result.slug).toBe('test-pipeline-post');
    expect(result.updated).toBe(true);
  });

  test('updated post has new content', async () => {
    const res = await fetch(`${backend.url}/v0/assets/test-pipeline-post/content`);
    const text = await res.text();
    expect(text).toContain('UPDATED content');
  });

  test('updated post has new metadata', async () => {
    const res = await fetch(`${backend.url}/v0/assets/test-pipeline-post`);
    const json = await res.json() as any;
    expect(json.data.metadata.tags).toEqual(['test', 'pipeline', 'updated']);
  });

  test('publishes post with explicit slug', async () => {
    const markdown = `---
title: "Custom Slug Post"
slug: my-custom-slug
---

# Custom Slug Post

Content here.
`;

    const result = await publishBlogPost(markdown, config);
    expect(result.slug).toBe('my-custom-slug');
  });

  test('publishes post without frontmatter (title from H1)', async () => {
    const markdown = `# Auto Title Post

This post has no frontmatter. The title comes from the H1.
`;

    const result = await publishBlogPost(markdown, config);
    expect(result.slug).toBe('auto-title-post');
  });

  test('queryable after publishing', async () => {
    const res = await fetch(`${backend.url}/v0/assets/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${agent.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metadata: { post_type: 'blog_post' },
        sort: '-publish_date',
      }),
    });
    const json = await res.json() as any;
    // Should have all published posts
    expect(json.pagination.total).toBeGreaterThanOrEqual(3);
  });
});
