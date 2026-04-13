import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseWikiPage, serializeWikiPage } from '../../apps/intel-engine/src/wiki/parser';

const FIXTURE_PATH = join(import.meta.dir, 'fixtures', 'sample-wiki-page.md');

describe('parseWikiPage', () => {
  test('parses fixture with valid frontmatter and body', () => {
    const raw = readFileSync(FIXTURE_PATH, 'utf-8');
    const page = parseWikiPage(raw, 'wiki/claude-managed-agents.md');

    expect(page.frontmatter.title).toBe('Claude Managed Agents');
    expect(page.frontmatter.type).toBe('entity');
    expect(page.frontmatter.tags).toEqual(['anthropic', 'managed-agents', 'tool-use']);
    expect(page.frontmatter.created).toBe('2026-04-08');
    expect(page.frontmatter.updated).toBe('2026-04-10');
    expect(page.frontmatter.sources).toEqual([
      'Clippings/Claude Tool Use and Managed Agents.md',
    ]);
    expect(page.frontmatter.signals).toEqual([]);
    expect(page.frontmatter.status).toBe('draft');
    expect(page.filePath).toBe('wiki/claude-managed-agents.md');
    expect(page.body).toContain('Claude Managed Agents is Anthropic');
    expect(page.body).toContain('## How can I use this?');
  });

  test('coerces YAML date objects to strings', () => {
    const raw = readFileSync(FIXTURE_PATH, 'utf-8');
    const page = parseWikiPage(raw, 'wiki/test.md');

    // created/updated should be strings, not Date objects
    expect(typeof page.frontmatter.created).toBe('string');
    expect(typeof page.frontmatter.updated).toBe('string');
  });

  test('throws on invalid frontmatter', () => {
    const raw = `---
title: Missing Fields
---

Some content.
`;
    expect(() => parseWikiPage(raw, 'wiki/bad.md')).toThrow();
  });
});

describe('serializeWikiPage', () => {
  test('round-trips through parse and serialize', () => {
    const raw = readFileSync(FIXTURE_PATH, 'utf-8');
    const page = parseWikiPage(raw, 'wiki/claude-managed-agents.md');
    const serialized = serializeWikiPage(page);
    const reparsed = parseWikiPage(serialized, 'wiki/claude-managed-agents.md');

    expect(reparsed.frontmatter).toEqual(page.frontmatter);
    expect(reparsed.body).toBe(page.body);
  });
});
