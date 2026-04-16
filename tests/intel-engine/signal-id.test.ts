import { describe, test, expect } from 'bun:test';
import { generateSignalId, parseSignalId } from '../../apps/intel-engine/src/signals/id-generator';

describe('generateSignalId', () => {
  test('generates sig-20260412-001 with no existing IDs', () => {
    expect(generateSignalId([], '2026-04-12')).toBe('sig-20260412-001');
  });

  test('increments to sig-20260412-003 with existing 001 and 002', () => {
    const existing = ['sig-20260412-001', 'sig-20260412-002'];
    expect(generateSignalId(existing, '2026-04-12')).toBe('sig-20260412-003');
  });

  test('starts at 001 for new date regardless of other dates IDs', () => {
    const existing = ['sig-20260411-005', 'sig-20260411-006'];
    expect(generateSignalId(existing, '2026-04-12')).toBe('sig-20260412-001');
  });

  test('handles gaps (max+1, not fill)', () => {
    const existing = ['sig-20260412-001', 'sig-20260412-005'];
    expect(generateSignalId(existing, '2026-04-12')).toBe('sig-20260412-006');
  });
});

describe('parseSignalId', () => {
  test('extracts date and sequence', () => {
    const result = parseSignalId('sig-20260412-003');
    expect(result.date).toBe('20260412');
    expect(result.sequence).toBe(3);
  });

  test('throws on bad format', () => {
    expect(() => parseSignalId('bad')).toThrow();
    expect(() => parseSignalId('sig-2026041-003')).toThrow();
    expect(() => parseSignalId('sig-20260412-03')).toThrow();
  });
});
