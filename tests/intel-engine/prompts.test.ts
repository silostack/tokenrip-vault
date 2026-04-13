import { describe, test, expect } from 'bun:test';
import { buildExtractSignalsPrompt } from '../../apps/intel-engine/src/llm/prompts/extract-signals';
import { buildUpdateWikiPrompt } from '../../apps/intel-engine/src/llm/prompts/update-wiki';
import { buildEditorialBriefPrompt } from '../../apps/intel-engine/src/llm/prompts/editorial-brief';
import { buildDraftPostPrompt } from '../../apps/intel-engine/src/llm/prompts/draft-post';
import { buildEnrichPostPrompt } from '../../apps/intel-engine/src/llm/prompts/enrich-post';

describe('buildExtractSignalsPrompt', () => {
  const params = {
    content: 'Cursor is great for refactoring but struggles with large files.',
    sourcePath: 'sources/inbox/cursor-review.md',
    sourceType: 'clipping',
  };

  test('returns { system, user } strings', () => {
    const result = buildExtractSignalsPrompt(params);
    expect(typeof result.system).toBe('string');
    expect(typeof result.user).toBe('string');
  });

  test('system contains "intelligence analyst"', () => {
    const { system } = buildExtractSignalsPrompt(params);
    expect(system).toContain('intelligence analyst');
  });

  test('system includes all signal_type enum values', () => {
    const { system } = buildExtractSignalsPrompt(params);
    const signalTypes = ['technique', 'frustration', 'recommendation', 'warning', 'comparison', 'experience'];
    for (const t of signalTypes) {
      expect(system).toContain(`"${t}"`);
    }
  });

  test('user message includes provided inputs', () => {
    const { user } = buildExtractSignalsPrompt(params);
    expect(user).toContain(params.sourcePath);
    expect(user).toContain(params.sourceType);
    expect(user).toContain(params.content);
  });
});

describe('buildUpdateWikiPrompt', () => {
  const params = {
    signals: [
      { id: 'sig-20250401-001', claim: 'Cursor excels at refactoring', entities: ['Cursor'] },
    ],
    existingPages: [
      { path: 'wiki/entities/cursor.md', content: '# Cursor\nAn AI code editor.' },
    ],
    indexContent: '# Index\n- [Cursor](wiki/entities/cursor.md)',
  };

  test('returns { system, user } strings', () => {
    const result = buildUpdateWikiPrompt(params);
    expect(typeof result.system).toBe('string');
    expect(typeof result.user).toBe('string');
  });

  test('system contains "wiki maintainer"', () => {
    const { system } = buildUpdateWikiPrompt(params);
    expect(system).toContain('wiki maintainer');
  });

  test('user message includes signals, pages, and index', () => {
    const { user } = buildUpdateWikiPrompt(params);
    expect(user).toContain('sig-20250401-001');
    expect(user).toContain('Cursor excels at refactoring');
    expect(user).toContain('wiki/entities/cursor.md');
    expect(user).toContain('# Index');
  });
});

describe('buildEditorialBriefPrompt', () => {
  const params = {
    signalSummaries: [
      { entity: 'Cursor', count: 5, topClaims: ['Great for refactoring', 'Struggles with large files'] },
    ],
    stalePages: ['wiki/entities/copilot.md'],
    coverageGaps: ['Windsurf'],
  };

  test('returns { system, user } strings', () => {
    const result = buildEditorialBriefPrompt(params);
    expect(typeof result.system).toBe('string');
    expect(typeof result.user).toBe('string');
  });

  test('system contains "editorial"', () => {
    const { system } = buildEditorialBriefPrompt(params);
    expect(system).toContain('editorial');
  });

  test('user message includes summaries, stale pages, and gaps', () => {
    const { user } = buildEditorialBriefPrompt(params);
    expect(user).toContain('Cursor');
    expect(user).toContain('5 signals');
    expect(user).toContain('Great for refactoring');
    expect(user).toContain('wiki/entities/copilot.md');
    expect(user).toContain('Windsurf');
  });
});

describe('buildDraftPostPrompt', () => {
  const params = {
    wikiContent: '# Cursor\nAn AI code editor used by many developers.',
    signals: [
      { id: 'sig-20250401-001', claim: 'Cursor excels at refactoring' },
      { id: 'sig-20250401-002', claim: 'Cursor struggles with large files' },
    ],
    angle: 'Refactoring workflows in AI editors',
  };

  test('returns { system, user } strings', () => {
    const result = buildDraftPostPrompt(params);
    expect(typeof result.system).toBe('string');
    expect(typeof result.user).toBe('string');
  });

  test('system contains "operational intelligence"', () => {
    const { system } = buildDraftPostPrompt(params);
    expect(system).toContain('operational intelligence');
  });

  test('user message includes wiki content, signals, and angle', () => {
    const { user } = buildDraftPostPrompt(params);
    expect(user).toContain('Cursor');
    expect(user).toContain('sig-20250401-001');
    expect(user).toContain('sig-20250401-002');
    expect(user).toContain('Refactoring workflows in AI editors');
  });

  test('user message excludes angle section when not provided', () => {
    const noAngle = { ...params, angle: undefined };
    const { user } = buildDraftPostPrompt(noAngle);
    expect(user).not.toContain('Editorial Angle');
  });
});

describe('buildEnrichPostPrompt', () => {
  const params = {
    title: 'Cursor vs Copilot: A Practitioner Comparison',
    content: 'This article compares Cursor and Copilot for everyday coding tasks.',
  };

  test('returns { system, user } strings', () => {
    const result = buildEnrichPostPrompt(params);
    expect(typeof result.system).toBe('string');
    expect(typeof result.user).toBe('string');
  });

  test('system contains "SEO"', () => {
    const { system } = buildEnrichPostPrompt(params);
    expect(system).toContain('SEO');
  });

  test('user message includes title and content', () => {
    const { user } = buildEnrichPostPrompt(params);
    expect(user).toContain(params.title);
    expect(user).toContain(params.content);
  });
});
