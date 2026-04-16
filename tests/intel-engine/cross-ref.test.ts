import { describe, test, expect } from 'bun:test';
import {
  extractWikiLinks,
  findAffectedPages,
  type PageIndex,
} from '../../apps/intel-engine/src/wiki/cross-ref';

describe('extractWikiLinks', () => {
  test('finds [[wiki links]] in content', () => {
    const content = 'See [[Claude]] for details. Also related to [[Anthropic]].';
    const links = extractWikiLinks(content);
    expect(links).toEqual(['Claude', 'Anthropic']);
  });

  test('deduplicates repeated links', () => {
    const content = '[[Claude]] is great. Did I mention [[Claude]]? Also [[Anthropic]].';
    const links = extractWikiLinks(content);
    expect(links).toEqual(['Claude', 'Anthropic']);
  });

  test('returns empty array for no links', () => {
    const content = 'No wiki links here at all.';
    const links = extractWikiLinks(content);
    expect(links).toEqual([]);
  });

  test('handles links with spaces', () => {
    const content = 'See [[Managed Agents]] and [[Tool Use]].';
    const links = extractWikiLinks(content);
    expect(links).toEqual(['Managed Agents', 'Tool Use']);
  });
});

describe('findAffectedPages', () => {
  const wikiIndex = new Map<string, PageIndex>([
    [
      'wiki/claude.md',
      { entities: ['Claude', 'Anthropic'], tags: ['llm', 'tool-use'] },
    ],
    [
      'wiki/gpt.md',
      { entities: ['GPT-4', 'OpenAI'], tags: ['llm', 'chatbot'] },
    ],
    [
      'wiki/agents.md',
      { entities: ['Managed Agents'], tags: ['tool-use', 'orchestration'] },
    ],
  ]);

  test('finds pages by entity overlap', () => {
    const affected = findAffectedPages(['Claude'], wikiIndex);
    expect(affected).toEqual(['wiki/claude.md']);
  });

  test('finds pages by tag overlap', () => {
    const affected = findAffectedPages(['orchestration'], wikiIndex);
    expect(affected).toEqual(['wiki/agents.md']);
  });

  test('finds multiple pages with shared tag', () => {
    const affected = findAffectedPages(['tool-use'], wikiIndex);
    expect(affected).toEqual(['wiki/claude.md', 'wiki/agents.md']);
  });

  test('excludes non-matching pages', () => {
    const affected = findAffectedPages(['nonexistent'], wikiIndex);
    expect(affected).toEqual([]);
  });

  test('matching is case-insensitive', () => {
    const affected = findAffectedPages(['claude'], wikiIndex);
    expect(affected).toEqual(['wiki/claude.md']);
  });
});
