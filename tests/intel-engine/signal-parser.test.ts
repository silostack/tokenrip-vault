import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseSignal, serializeSignal } from '../../apps/intel-engine/src/signals/parser';

const FIXTURES_DIR = join(import.meta.dir, 'fixtures');

describe('parseSignal', () => {
  test('parses sample-signal.md fixture with correct fields', () => {
    const raw = readFileSync(join(FIXTURES_DIR, 'sample-signal.md'), 'utf-8');
    const signal = parseSignal(raw, 'signals/by-entity/langchain/sig-20260410-001.md');

    expect(signal.filePath).toBe('signals/by-entity/langchain/sig-20260410-001.md');
    expect(signal.frontmatter.id).toBe('sig-20260410-001');
    expect(signal.frontmatter.type).toBe('signal');
    expect(signal.frontmatter.signal_type).toBe('technique');
    expect(signal.frontmatter.claim).toContain('Harness hill-climbing');
    expect(signal.frontmatter.entities).toEqual(['langchain', 'langsmith']);
    expect(signal.frontmatter.concepts).toEqual(['harness-engineering', 'eval-driven-development']);
    expect(signal.frontmatter.problems).toEqual(['agent-overfitting']);
    expect(signal.frontmatter.source).toBe('Clippings/Better Harness A Recipe for Harness Hill-Climbing with Evals.md');
    expect(signal.frontmatter.source_type).toBe('clipping');
    expect(signal.frontmatter.source_date).toBe('2026-04-08');
    expect(signal.frontmatter.extracted).toBe('2026-04-10');
    expect(signal.frontmatter.confidence).toBe('high');
    expect(signal.frontmatter.corroboration.count).toBe(1);
    expect(signal.frontmatter.corroboration.supporting).toEqual([]);
    expect(signal.frontmatter.corroboration.contradicting).toEqual([]);
    expect(signal.body).toContain('Better-Harness frames agent improvement');
  });

  test('throws on invalid frontmatter (bad signal_type)', () => {
    const raw = `---
id: sig-20260410-002
type: signal
signal_type: invalid_type
claim: "Some claim"
entities:
  - foo
source: "some/source.md"
source_type: clipping
source_date: 2026-04-08
extracted: 2026-04-10
confidence: high
---

Body text.
`;
    expect(() => parseSignal(raw, 'test.md')).toThrow();
  });

  test('round-trips through parse/serialize', () => {
    const raw = readFileSync(join(FIXTURES_DIR, 'sample-signal.md'), 'utf-8');
    const signal = parseSignal(raw, 'test.md');
    const serialized = serializeSignal(signal);
    const reparsed = parseSignal(serialized, 'test.md');

    expect(reparsed.frontmatter).toEqual(signal.frontmatter);
    expect(reparsed.body).toBe(signal.body);
  });
});
