import { describe, expect, test } from 'bun:test';
import {
  ExtractedSignalSchema,
  ExtractedSignalsResponseSchema,
  WikiUpdateSchema,
  WikiUpdatesResponseSchema,
  StoryCandidateSchema,
  EditorialBriefSchema,
  BlogDraftSchema,
  EnrichmentSchema,
} from '../../apps/intel-engine/src/llm/schemas';

// --- ExtractedSignalSchema ---

describe('ExtractedSignalSchema', () => {
  test('validates correct input', () => {
    const input = {
      claim: 'Cursor is faster than Copilot for refactoring',
      signal_type: 'comparison',
      entities: ['Cursor', 'Copilot'],
      concepts: ['refactoring'],
      problems: [],
      confidence: 'high',
    };
    const result = ExtractedSignalSchema.parse(input);
    expect(result.claim).toBe(input.claim);
    expect(result.signal_type).toBe('comparison');
    expect(result.entities).toEqual(['Cursor', 'Copilot']);
    expect(result.concepts).toEqual(['refactoring']);
    expect(result.confidence).toBe('high');
  });

  test('applies defaults for concepts and problems', () => {
    const input = {
      claim: 'GPT-4 handles long context well',
      signal_type: 'experience',
      entities: ['GPT-4'],
      confidence: 'medium',
    };
    const result = ExtractedSignalSchema.parse(input);
    expect(result.concepts).toEqual([]);
    expect(result.problems).toEqual([]);
  });

  test('rejects missing claim', () => {
    const input = {
      signal_type: 'technique',
      entities: ['foo'],
      confidence: 'low',
    };
    expect(() => ExtractedSignalSchema.parse(input)).toThrow();
  });

  test('rejects missing signal_type', () => {
    const input = {
      claim: 'some claim',
      entities: ['foo'],
      confidence: 'low',
    };
    expect(() => ExtractedSignalSchema.parse(input)).toThrow();
  });

  test('rejects invalid signal_type', () => {
    const input = {
      claim: 'some claim',
      signal_type: 'invalid_type',
      entities: ['foo'],
      confidence: 'low',
    };
    expect(() => ExtractedSignalSchema.parse(input)).toThrow();
  });

  test('rejects missing entities', () => {
    const input = {
      claim: 'some claim',
      signal_type: 'technique',
      confidence: 'low',
    };
    expect(() => ExtractedSignalSchema.parse(input)).toThrow();
  });

  test('rejects missing confidence', () => {
    const input = {
      claim: 'some claim',
      signal_type: 'technique',
      entities: ['foo'],
    };
    expect(() => ExtractedSignalSchema.parse(input)).toThrow();
  });

  test('rejects invalid confidence', () => {
    const input = {
      claim: 'some claim',
      signal_type: 'technique',
      entities: ['foo'],
      confidence: 'very_high',
    };
    expect(() => ExtractedSignalSchema.parse(input)).toThrow();
  });
});

// --- ExtractedSignalsResponseSchema ---

describe('ExtractedSignalsResponseSchema', () => {
  test('validates wrapped signals array', () => {
    const input = {
      signals: [
        {
          claim: 'Test claim',
          signal_type: 'recommendation',
          entities: ['Tool'],
          confidence: 'medium',
        },
      ],
    };
    const result = ExtractedSignalsResponseSchema.parse(input);
    expect(result.signals).toHaveLength(1);
    expect(result.signals[0].claim).toBe('Test claim');
  });

  test('rejects missing signals field', () => {
    expect(() => ExtractedSignalsResponseSchema.parse({})).toThrow();
  });
});

// --- WikiUpdateSchema ---

describe('WikiUpdateSchema', () => {
  test('validates correct input', () => {
    const input = {
      path: 'wiki/cursor.md',
      action: 'create' as const,
      title: 'Cursor',
      type: 'entity' as const,
      tags: ['ai', 'editor'],
      body: '# Cursor\n\nAn AI-powered editor.',
    };
    const result = WikiUpdateSchema.parse(input);
    expect(result.path).toBe('wiki/cursor.md');
    expect(result.action).toBe('create');
    expect(result.type).toBe('entity');
  });

  test('rejects missing path', () => {
    const input = {
      action: 'create',
      title: 'Cursor',
      type: 'entity',
      tags: ['ai'],
      body: 'content',
    };
    expect(() => WikiUpdateSchema.parse(input)).toThrow();
  });

  test('rejects invalid action', () => {
    const input = {
      path: 'wiki/cursor.md',
      action: 'delete',
      title: 'Cursor',
      type: 'entity',
      tags: ['ai'],
      body: 'content',
    };
    expect(() => WikiUpdateSchema.parse(input)).toThrow();
  });

  test('rejects missing title', () => {
    const input = {
      path: 'wiki/cursor.md',
      action: 'update',
      type: 'entity',
      tags: ['ai'],
      body: 'content',
    };
    expect(() => WikiUpdateSchema.parse(input)).toThrow();
  });

  test('rejects invalid wiki type', () => {
    const input = {
      path: 'wiki/cursor.md',
      action: 'create',
      title: 'Cursor',
      type: 'glossary',
      tags: ['ai'],
      body: 'content',
    };
    expect(() => WikiUpdateSchema.parse(input)).toThrow();
  });

  test('rejects missing tags', () => {
    const input = {
      path: 'wiki/cursor.md',
      action: 'create',
      title: 'Cursor',
      type: 'entity',
      body: 'content',
    };
    expect(() => WikiUpdateSchema.parse(input)).toThrow();
  });

  test('rejects missing body', () => {
    const input = {
      path: 'wiki/cursor.md',
      action: 'create',
      title: 'Cursor',
      type: 'entity',
      tags: ['ai'],
    };
    expect(() => WikiUpdateSchema.parse(input)).toThrow();
  });
});

// --- WikiUpdatesResponseSchema ---

describe('WikiUpdatesResponseSchema', () => {
  test('validates wrapped updates array', () => {
    const input = {
      updates: [
        {
          path: 'wiki/cursor.md',
          action: 'create',
          title: 'Cursor',
          type: 'entity',
          tags: ['ai'],
          body: 'content',
        },
      ],
    };
    const result = WikiUpdatesResponseSchema.parse(input);
    expect(result.updates).toHaveLength(1);
  });

  test('rejects missing updates field', () => {
    expect(() => WikiUpdatesResponseSchema.parse({})).toThrow();
  });
});

// --- StoryCandidateSchema ---

describe('StoryCandidateSchema', () => {
  test('validates correct input', () => {
    const input = {
      title: 'AI Editors Compared',
      angle: 'Which AI editor saves the most time for refactoring?',
      signal_ids: ['sig-20260410-001', 'sig-20260410-002'],
      entities: ['Cursor', 'Copilot'],
    };
    const result = StoryCandidateSchema.parse(input);
    expect(result.title).toBe(input.title);
    expect(result.signal_ids).toHaveLength(2);
  });

  test('applies default for entities', () => {
    const input = {
      title: 'AI Editors Compared',
      angle: 'Some angle',
      signal_ids: ['sig-20260410-001'],
    };
    const result = StoryCandidateSchema.parse(input);
    expect(result.entities).toEqual([]);
  });

  test('rejects missing title', () => {
    const input = {
      angle: 'Some angle',
      signal_ids: ['sig-20260410-001'],
    };
    expect(() => StoryCandidateSchema.parse(input)).toThrow();
  });

  test('rejects missing angle', () => {
    const input = {
      title: 'Some title',
      signal_ids: ['sig-20260410-001'],
    };
    expect(() => StoryCandidateSchema.parse(input)).toThrow();
  });

  test('rejects missing signal_ids', () => {
    const input = {
      title: 'Some title',
      angle: 'Some angle',
    };
    expect(() => StoryCandidateSchema.parse(input)).toThrow();
  });
});

// --- EditorialBriefSchema ---

describe('EditorialBriefSchema', () => {
  test('validates correct input', () => {
    const input = {
      candidates: [
        {
          title: 'AI Editors Compared',
          angle: 'Refactoring speed',
          signal_ids: ['sig-20260410-001'],
          entities: ['Cursor'],
        },
      ],
      trends: ['AI coding tools convergence'],
      gaps: ['No data on Windsurf'],
    };
    const result = EditorialBriefSchema.parse(input);
    expect(result.candidates).toHaveLength(1);
    expect(result.trends).toHaveLength(1);
    expect(result.gaps).toHaveLength(1);
  });

  test('applies defaults for trends and gaps', () => {
    const input = {
      candidates: [
        {
          title: 'AI Editors',
          angle: 'Speed',
          signal_ids: ['sig-001'],
        },
      ],
    };
    const result = EditorialBriefSchema.parse(input);
    expect(result.trends).toEqual([]);
    expect(result.gaps).toEqual([]);
  });

  test('rejects missing candidates', () => {
    expect(() => EditorialBriefSchema.parse({})).toThrow();
  });
});

// --- BlogDraftSchema ---

describe('BlogDraftSchema', () => {
  test('validates correct input', () => {
    const input = {
      title: 'Why Cursor Wins at Refactoring',
      body: '# Why Cursor Wins\n\nContent here...',
    };
    const result = BlogDraftSchema.parse(input);
    expect(result.title).toBe(input.title);
    expect(result.body).toBe(input.body);
  });

  test('rejects missing title', () => {
    expect(() => BlogDraftSchema.parse({ body: 'content' })).toThrow();
  });

  test('rejects missing body', () => {
    expect(() => BlogDraftSchema.parse({ title: 'title' })).toThrow();
  });
});

// --- EnrichmentSchema ---

describe('EnrichmentSchema', () => {
  test('validates correct input', () => {
    const input = {
      description: 'A comparison of AI coding editors.',
      tags: ['ai', 'coding', 'editors'],
      faq: [
        { q: 'Which AI editor is fastest?', a: 'Cursor for refactoring.' },
      ],
    };
    const result = EnrichmentSchema.parse(input);
    expect(result.description).toBe(input.description);
    expect(result.tags).toHaveLength(3);
    expect(result.faq).toHaveLength(1);
    expect(result.faq[0].q).toBe('Which AI editor is fastest?');
  });

  test('applies default for faq', () => {
    const input = {
      description: 'A comparison.',
      tags: ['ai'],
    };
    const result = EnrichmentSchema.parse(input);
    expect(result.faq).toEqual([]);
  });

  test('rejects missing description', () => {
    expect(() => EnrichmentSchema.parse({ tags: ['ai'] })).toThrow();
  });

  test('rejects missing tags', () => {
    expect(() =>
      EnrichmentSchema.parse({ description: 'desc' }),
    ).toThrow();
  });

  test('rejects invalid faq structure', () => {
    const input = {
      description: 'desc',
      tags: ['ai'],
      faq: [{ question: 'wrong key', answer: 'wrong key' }],
    };
    expect(() => EnrichmentSchema.parse(input)).toThrow();
  });
});
