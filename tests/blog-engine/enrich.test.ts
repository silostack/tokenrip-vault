import { describe, test, expect, mock } from 'bun:test';
import { buildEnrichPrompt, mergeEnrichment, type EnrichmentResult } from '../../apps/blog-engine/src/services/enrich.service';

describe('buildEnrichPrompt', () => {
  test('returns system and user messages', () => {
    const { system, user } = buildEnrichPrompt('My Title', '# My Title\n\nSome content.');
    expect(system).toContain('content enrichment engine');
    expect(system).toContain('JSON');
    expect(user).toContain('My Title');
    expect(user).toContain('Some content.');
  });
});

describe('mergeEnrichment', () => {
  const enrichment: EnrichmentResult = {
    description: 'A polished description.',
    tags: ['crypto', 'regulation'],
    faq: [
      { q: 'What is this?', a: 'A test article.' },
    ],
    og: { type: 'article' },
  };

  test('fills missing fields in frontmatter', () => {
    const existing = {
      title: 'Test',
      slug: 'test',
      publishedAt: '2026-04-09T00:00:00Z',
    };

    const merged = mergeEnrichment(existing, enrichment, {
      authorName: 'Tokenrip',
      authorType: 'Organization',
    });

    expect(merged.description).toBe('A polished description.');
    expect(merged.tags).toEqual(['crypto', 'regulation']);
    expect(merged.jsonLd?.faq).toEqual(enrichment.faq);
    expect(merged.jsonLd?.article?.author?.name).toBe('Tokenrip');
    expect(merged.og?.type).toBe('article');
  });

  test('preserves existing fields (additive merge)', () => {
    const existing = {
      title: 'Test',
      slug: 'test',
      description: 'My manual description.',
      tags: ['manual-tag'],
    };

    const merged = mergeEnrichment(existing, enrichment, {
      authorName: 'Tokenrip',
      authorType: 'Organization',
    });

    // Existing values preserved
    expect(merged.description).toBe('My manual description.');
    expect(merged.tags).toEqual(['manual-tag']);
    // LLM fills in missing fields
    expect(merged.jsonLd?.faq).toEqual(enrichment.faq);
  });

  test('does not overwrite existing jsonLd.faq', () => {
    const existing = {
      title: 'Test',
      slug: 'test',
      jsonLd: {
        faq: [{ q: 'Existing?', a: 'Yes.' }],
      },
    };

    const merged = mergeEnrichment(existing, enrichment, {
      authorName: 'Tokenrip',
      authorType: 'Organization',
    });

    expect(merged.jsonLd?.faq).toEqual([{ q: 'Existing?', a: 'Yes.' }]);
  });
});
