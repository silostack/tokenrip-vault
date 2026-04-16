import { describe, test, expect } from 'bun:test';
import {
  SignalFrontmatterSchema,
  WikiFrontmatterSchema,
  SignalTypeEnum,
  SourceTypeEnum,
  ConfidenceEnum,
  WikiTypeEnum,
  WikiStatusEnum,
} from '../../apps/intel-engine/src/types';

describe('SignalFrontmatterSchema', () => {
  const validSignal = {
    id: 'sig-20260410-001',
    type: 'signal',
    signal_type: 'technique',
    claim: 'Harness hill-climbing treats eval cases as training data.',
    entities: ['langchain', 'langsmith'],
    source: 'Clippings/some-article.md',
    source_type: 'clipping',
    source_date: '2026-04-08',
    extracted: '2026-04-10',
    confidence: 'high',
  };

  test('validates a complete valid signal object', () => {
    const result = SignalFrontmatterSchema.parse({
      ...validSignal,
      concepts: ['harness-engineering'],
      problems: ['agent-overfitting'],
      corroboration: { count: 2, supporting: ['sig-20260410-002'], contradicting: [] },
    });
    expect(result.id).toBe('sig-20260410-001');
    expect(result.signal_type).toBe('technique');
    expect(result.corroboration.count).toBe(2);
    expect(result.corroboration.supporting).toEqual(['sig-20260410-002']);
  });

  test('rejects invalid signal_type values', () => {
    expect(() =>
      SignalFrontmatterSchema.parse({ ...validSignal, signal_type: 'invalid-type' })
    ).toThrow();
  });

  test('defaults optional arrays to []', () => {
    const result = SignalFrontmatterSchema.parse(validSignal);
    expect(result.concepts).toEqual([]);
    expect(result.problems).toEqual([]);
    expect(result.corroboration.count).toBe(1);
    expect(result.corroboration.supporting).toEqual([]);
    expect(result.corroboration.contradicting).toEqual([]);
  });
});

describe('WikiFrontmatterSchema', () => {
  const validWiki = {
    title: 'LangChain',
    type: 'entity',
    tags: ['framework', 'orchestration'],
    created: '2026-04-10',
    updated: '2026-04-10',
    status: 'draft',
  };

  test('validates a valid wiki page object', () => {
    const result = WikiFrontmatterSchema.parse({
      ...validWiki,
      sources: ['source1.md'],
      signals: ['sig-20260410-001'],
    });
    expect(result.title).toBe('LangChain');
    expect(result.type).toBe('entity');
    expect(result.sources).toEqual(['source1.md']);
    expect(result.signals).toEqual(['sig-20260410-001']);
  });

  test('defaults signals and sources to []', () => {
    const result = WikiFrontmatterSchema.parse(validWiki);
    expect(result.sources).toEqual([]);
    expect(result.signals).toEqual([]);
  });
});

describe('Enums', () => {
  test('SignalTypeEnum has expected values', () => {
    expect(SignalTypeEnum.options).toEqual([
      'technique', 'frustration', 'recommendation', 'warning', 'comparison', 'experience',
    ]);
  });

  test('SourceTypeEnum has expected values', () => {
    expect(SourceTypeEnum.options).toEqual([
      'article', 'clipping', 'markdown', 'own-testing',
    ]);
  });

  test('ConfidenceEnum has expected values', () => {
    expect(ConfidenceEnum.options).toEqual(['low', 'medium', 'high']);
  });

  test('WikiTypeEnum has expected values', () => {
    expect(WikiTypeEnum.options).toEqual(['entity', 'concept', 'comparison', 'synthesis']);
  });

  test('WikiStatusEnum has expected values', () => {
    expect(WikiStatusEnum.options).toEqual(['stub', 'draft', 'complete']);
  });
});
