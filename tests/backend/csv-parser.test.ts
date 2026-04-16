import { describe, test, expect } from 'bun:test';
import { parseCsv } from '../../apps/backend/src/api/service/csv-parser';

describe('parseCsv', () => {
  test('headers=true: first row becomes column names', () => {
    const { schema, rows } = parseCsv({ content: 'name,rev\nAcme,100\nBeta,200\n', headers: true });
    expect(schema.map((c) => c.name)).toEqual(['name', 'rev']);
    expect(schema.every((c) => c.type === 'text')).toBe(true);
    expect(rows).toEqual([
      { name: 'Acme', rev: '100' },
      { name: 'Beta', rev: '200' },
    ]);
  });

  test('explicit schema: all rows are data', () => {
    const { schema, rows } = parseCsv({
      content: 'Acme,100\nBeta,200',
      schema: [{ name: 'n', type: 'text' }, { name: 'r', type: 'number' }],
    });
    expect(schema[1].type).toBe('number');
    expect(rows).toEqual([
      { n: 'Acme', r: '100' },
      { n: 'Beta', r: '200' },
    ]);
  });

  test('no schema, no headers: auto-generated col_N', () => {
    const { schema, rows } = parseCsv({ content: 'a,b,c\nd,e,f\n' });
    expect(schema.map((c) => c.name)).toEqual(['col_1', 'col_2', 'col_3']);
    expect(rows).toEqual([
      { col_1: 'a', col_2: 'b', col_3: 'c' },
      { col_1: 'd', col_2: 'e', col_3: 'f' },
    ]);
  });

  test('both schema and headers throws', () => {
    expect(() =>
      parseCsv({
        content: 'name\nAcme',
        headers: true,
        schema: [{ name: 'x', type: 'text' }],
      }),
    ).toThrow();
  });

  test('empty content yields empty rows with empty schema', () => {
    const { schema, rows } = parseCsv({ content: '' });
    expect(schema).toEqual([]);
    expect(rows).toEqual([]);
  });

  test('handles quoted fields with embedded commas', () => {
    const { rows } = parseCsv({ content: 'a,b\n"hello, world",2\n', headers: true });
    expect(rows[0]).toEqual({ a: 'hello, world', b: '2' });
  });

  test('handles embedded quotes via "" escape', () => {
    const { rows } = parseCsv({ content: 'a,b\n"she said ""hi""",x\n', headers: true });
    expect(rows[0].a).toBe('she said "hi"');
  });

  test('handles CRLF line endings', () => {
    const { rows } = parseCsv({ content: 'a,b\r\n1,2\r\n3,4\r\n', headers: true });
    expect(rows).toEqual([{ a: '1', b: '2' }, { a: '3', b: '4' }]);
  });

  test('handles embedded newlines inside quoted fields', () => {
    const { rows } = parseCsv({ content: 'a,b\n"line1\nline2",x\n', headers: true });
    expect(rows[0].a).toBe('line1\nline2');
  });

  test('fills missing trailing fields with empty string', () => {
    const { rows } = parseCsv({
      content: 'a,b,c\n1,2\n',
      headers: true,
    });
    expect(rows[0]).toEqual({ a: '1', b: '2', c: '' });
  });

  test('drops trailing empty row from final newline', () => {
    const { rows } = parseCsv({ content: 'a\n1\n2\n\n', headers: true });
    expect(rows).toEqual([{ a: '1' }, { a: '2' }]);
  });
});
