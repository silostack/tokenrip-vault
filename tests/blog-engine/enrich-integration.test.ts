import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { startBlogEngine, stopBlogEngine, type TestBlogEngine } from './setup';

let engine: TestBlogEngine;

const RAW_ARTICLE = `---
title: "Understanding Smart Contracts"
---

# Understanding Smart Contracts

Smart contracts are self-executing programs stored on a blockchain. They automatically enforce the terms of an agreement when predefined conditions are met.

## How They Work

A developer writes the contract logic in a language like Solidity, deploys it to Ethereum, and it runs autonomously. No intermediary needed.

## Use Cases

Smart contracts power DeFi protocols, NFT marketplaces, and decentralized governance systems.
`;

beforeAll(async () => {
  engine = await startBlogEngine();
});

afterAll(async () => {
  await stopBlogEngine(engine);
});

describe('Enrichment Integration', () => {
  test('publish stores article without FAQ initially', async () => {
    const res = await fetch(`${engine.url}/articles/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/markdown' },
      body: RAW_ARTICLE,
    });
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.slug).toBe('understanding-smart-contracts');

    // Article exists but has no FAQ
    const getRes = await fetch(`${engine.url}/articles/understanding-smart-contracts`);
    const article = await getRes.json();
    expect(article.frontmatter.title).toBe('Understanding Smart Contracts');
    expect(article.frontmatter.jsonLd?.faq).toBeUndefined();
  });

  test('manual enrich returns 503 when API key not configured', async () => {
    const res = await fetch(
      `${engine.url}/articles/understanding-smart-contracts/enrich`,
      { method: 'POST' },
    );
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toContain('ANTHROPIC_API_KEY');
  });

  test('buildEnrichPrompt includes article content', async () => {
    const { buildEnrichPrompt } = await import(
      '../../apps/blog-engine/src/services/enrich.service'
    );
    const { system, user } = buildEnrichPrompt(
      'Understanding Smart Contracts',
      '# Understanding Smart Contracts\n\nSmart contracts are...',
    );
    expect(system).toContain('description');
    expect(system).toContain('faq');
    expect(system).toContain('tags');
    expect(user).toContain('Smart Contracts');
  });

  test('mergeEnrichment produces valid frontmatter', async () => {
    const { mergeEnrichment } = await import(
      '../../apps/blog-engine/src/services/enrich.service'
    );

    const result = mergeEnrichment(
      { title: 'Test', slug: 'test', publishedAt: '2026-04-09' },
      {
        description: 'About smart contracts.',
        tags: ['blockchain', 'ethereum'],
        faq: [{ q: 'What are smart contracts?', a: 'Self-executing programs.' }],
        og: { type: 'article' },
      },
      { authorName: 'Tokenrip', authorType: 'Organization' },
    );

    expect(result.description).toBe('About smart contracts.');
    expect(result.tags).toEqual(['blockchain', 'ethereum']);
    expect(result.jsonLd.faq).toHaveLength(1);
    expect(result.jsonLd.article.author.name).toBe('Tokenrip');
    expect(result.og.type).toBe('article');
  });
});
