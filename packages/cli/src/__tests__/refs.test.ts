import { describe, expect, test } from 'bun:test';
import { CliError } from '../errors.js';
import { parseRefList } from '../refs.js';

describe('parseRefList', () => {
  test('classifies UUIDs as asset refs and URLs as url refs', () => {
    expect(
      parseRefList('550e8400-e29b-41d4-a716-446655440000,https://example.com/file'),
    ).toEqual([
      { type: 'asset', target_id: '550e8400-e29b-41d4-a716-446655440000' },
      { type: 'url', target_id: 'https://example.com/file' },
    ]);
  });

  test('rejects non-URL, non-UUID refs', () => {
    expect(() => parseRefList('not-a-ref')).toThrow(
      new CliError('INVALID_REF', 'Invalid ref "not-a-ref". Use a full URL or an asset UUID.'),
    );
  });
});
