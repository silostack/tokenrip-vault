import { describe, test, expect } from 'bun:test';
import { enrichArticle } from '../../apps/blog-engine/src/services/publish.service';

describe('enrichArticle', () => {
  test('generates slug from title', () => {
    const raw = `---
title: "My Great Article!"
---

# My Great Article!

Some content here.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.slug).toBe('my-great-article');
  });

  test('preserves existing slug', () => {
    const raw = `---
title: "My Article"
slug: custom-slug
---

Content.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.slug).toBe('custom-slug');
  });

  test('generates description from content if missing', () => {
    const raw = `---
title: "Test"
---

This is the first paragraph of the article. It has enough text to serve as a description for the article when displayed in listing pages.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.description).toBeTruthy();
    expect(result.frontmatter.description!.length).toBeLessThanOrEqual(200);
  });

  test('sets publishedAt if missing', () => {
    const raw = `---
title: "Test"
---

Content.
`;
    const result = enrichArticle(raw);
    expect(result.frontmatter.publishedAt).toBeTruthy();
  });

  test('produces valid markdown output with frontmatter', () => {
    const raw = `---
title: "Test"
---

Content here.
`;
    const result = enrichArticle(raw);
    expect(result.output).toContain('---');
    expect(result.output).toContain('title:');
    expect(result.output).toContain('slug:');
    expect(result.output).toContain('Content here.');
  });
});
