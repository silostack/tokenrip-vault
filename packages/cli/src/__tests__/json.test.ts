import { describe, expect, test } from 'bun:test';
import { CliError } from '../errors.js';
import { parseJsonObjectArrayOption, parseJsonObjectOption, parseJsonOption } from '../json.js';

describe('json option parsing', () => {
  test('parses generic JSON values', () => {
    expect(parseJsonOption('{"ok":true}', '--data')).toEqual({ ok: true });
  });

  test('rejects invalid JSON with a CLI error', () => {
    expect(() => parseJsonOption('{bad', '--data')).toThrow(
      new CliError('INVALID_JSON', '--data must be valid JSON'),
    );
  });

  test('requires objects for object options', () => {
    expect(() => parseJsonObjectOption('[]', '--metadata')).toThrow(
      new CliError('INVALID_JSON', '--metadata must be a JSON object'),
    );
  });

  test('accepts an object or array of objects for object array options', () => {
    expect(parseJsonObjectArrayOption('{"name":"one"}', '--file')).toEqual([{ name: 'one' }]);
    expect(parseJsonObjectArrayOption('[{"name":"one"},{"name":"two"}]', '--file')).toEqual([
      { name: 'one' },
      { name: 'two' },
    ]);
  });
});
