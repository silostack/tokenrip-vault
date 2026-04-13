import { describe, test, expect } from 'bun:test';
import { findCorroborations, type CorroborationMatch } from '../../apps/intel-engine/src/signals/corroborate';
import type { Signal } from '../../apps/intel-engine/src/types';

function makeSignal(overrides: {
  id: string;
  claim: string;
  entities: string[];
  problems?: string[];
  concepts?: string[];
}): Signal {
  return {
    frontmatter: {
      id: overrides.id,
      type: 'signal' as const,
      signal_type: 'technique',
      claim: overrides.claim,
      entities: overrides.entities,
      concepts: overrides.concepts ?? [],
      problems: overrides.problems ?? [],
      source: 'test-source.md',
      source_type: 'markdown',
      source_date: '2026-04-12',
      extracted: '2026-04-12',
      confidence: 'medium',
      corroboration: { count: 1, supporting: [], contradicting: [] },
    },
    body: 'Test signal body.',
    filePath: `signals/by-entity/test/${overrides.id}.md`,
  };
}

describe('findCorroborations', () => {
  test('finds match when signals share entity AND similar claims', () => {
    const newSignal = makeSignal({
      id: 'sig-20260412-001',
      claim: 'Using structured evals improves harness reliability significantly',
      entities: ['Evals', 'Harness'],
    });

    const existing = [
      makeSignal({
        id: 'sig-20260410-001',
        claim: 'Structured evals are key to improving harness performance and reliability',
        entities: ['Evals', 'Harness'],
      }),
    ];

    const matches = findCorroborations(newSignal, existing);
    expect(matches.length).toBe(1);
    expect(matches[0].existingSignalId).toBe('sig-20260410-001');
    expect(matches[0].sharedEntities).toContain('Evals');
    expect(matches[0].sharedEntities).toContain('Harness');
  });

  test('returns empty when no shared entities or problems', () => {
    const newSignal = makeSignal({
      id: 'sig-20260412-001',
      claim: 'Using structured evals improves harness reliability',
      entities: ['Evals'],
    });

    const existing = [
      makeSignal({
        id: 'sig-20260410-001',
        claim: 'Docker containers simplify deployment workflows',
        entities: ['Docker'],
      }),
    ];

    const matches = findCorroborations(newSignal, existing);
    expect(matches).toEqual([]);
  });

  test('returns empty when entities match but claims are completely unrelated', () => {
    const newSignal = makeSignal({
      id: 'sig-20260412-001',
      claim: 'Kubernetes orchestrates container workloads across clusters',
      entities: ['Shared-Entity'],
    });

    const existing = [
      makeSignal({
        id: 'sig-20260410-001',
        claim: 'Photosynthesis converts sunlight into chemical energy for plants',
        entities: ['Shared-Entity'],
      }),
    ];

    const matches = findCorroborations(newSignal, existing);
    expect(matches).toEqual([]);
  });

  test('all matches have type supporting', () => {
    const newSignal = makeSignal({
      id: 'sig-20260412-001',
      claim: 'Prompt caching reduces latency and cost for repeated queries',
      entities: ['Prompt-Caching'],
      problems: ['latency'],
    });

    const existing = [
      makeSignal({
        id: 'sig-20260410-001',
        claim: 'Prompt caching dramatically reduces latency for repeated API queries',
        entities: ['Prompt-Caching'],
      }),
      makeSignal({
        id: 'sig-20260410-002',
        claim: 'Caching prompts helps reduce cost and latency in production',
        problems: ['latency'],
        entities: ['Other-Entity'],
      }),
    ];

    const matches = findCorroborations(newSignal, existing);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    for (const match of matches) {
      expect(match.type).toBe('supporting');
    }
  });

  test('skips signal with same ID', () => {
    const newSignal = makeSignal({
      id: 'sig-20260412-001',
      claim: 'Evals improve harness reliability',
      entities: ['Evals'],
    });

    const existing = [
      makeSignal({
        id: 'sig-20260412-001',
        claim: 'Evals improve harness reliability',
        entities: ['Evals'],
      }),
    ];

    const matches = findCorroborations(newSignal, existing);
    expect(matches).toEqual([]);
  });

  test('finds match via shared problems even without shared entities', () => {
    const newSignal = makeSignal({
      id: 'sig-20260412-001',
      claim: 'Reducing latency requires prompt caching and edge deployment',
      entities: ['Edge-Deployment'],
      problems: ['high-latency'],
    });

    const existing = [
      makeSignal({
        id: 'sig-20260410-001',
        claim: 'Prompt caching and edge deployment reduce latency effectively',
        entities: ['Prompt-Caching'],
        problems: ['high-latency'],
      }),
    ];

    const matches = findCorroborations(newSignal, existing);
    expect(matches.length).toBe(1);
    expect(matches[0].sharedProblems).toContain('high-latency');
  });
});
