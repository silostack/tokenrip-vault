import { BadRequestException } from '@nestjs/common';

export interface CollectionSchemaColumn {
  name: string;
  type: 'text' | 'number' | 'date' | 'url' | 'enum' | 'boolean';
  position: number;
  values?: string[];
}

export interface ParseCsvInput {
  content: string;
  headers?: boolean;
  schema?: Array<{ name: string; type: CollectionSchemaColumn['type']; values?: string[] }>;
}

export interface ParseCsvResult {
  schema: CollectionSchemaColumn[];
  rows: Array<Record<string, unknown>>;
}

/**
 * Parse CSV text into a schema + rows.
 *
 * Modes:
 *   - schema supplied           → schema defines names + types; all CSV rows are data
 *   - headers=true (no schema)  → first CSV row = column names (text type); rest are data
 *   - neither                   → auto-generated col_1..col_N; all rows are data
 *   - both                      → 400 SCHEMA_AND_HEADERS_CONFLICT
 */
export function parseCsv(input: ParseCsvInput): ParseCsvResult {
  const { content, headers, schema } = input;

  if (schema && headers) {
    throw new BadRequestException({
      ok: false,
      error: 'SCHEMA_AND_HEADERS_CONFLICT',
      message: 'Provide either --schema or --headers, not both',
    });
  }

  const raw = parseCsvRaw(content);
  if (raw.length === 0) {
    const resolvedSchema = (schema ?? []).map((c, i) => ({ ...c, position: i }));
    return { schema: resolvedSchema, rows: [] };
  }

  let columnNames: string[];
  let resolvedSchema: CollectionSchemaColumn[];
  let dataRows: string[][];

  if (schema) {
    resolvedSchema = schema.map((c, i) => ({ ...c, position: i }));
    columnNames = resolvedSchema.map((c) => c.name);
    dataRows = raw;
  } else if (headers) {
    columnNames = raw[0].map((h, i) => (h || `col_${i + 1}`).trim());
    resolvedSchema = columnNames.map((name, i) => ({ name, type: 'text', position: i }));
    dataRows = raw.slice(1);
  } else {
    const width = raw.reduce((max, r) => Math.max(max, r.length), 0);
    columnNames = Array.from({ length: width }, (_, i) => `col_${i + 1}`);
    resolvedSchema = columnNames.map((name, i) => ({ name, type: 'text', position: i }));
    dataRows = raw;
  }

  const rows = dataRows.map((fields) => {
    const row: Record<string, unknown> = {};
    for (let i = 0; i < columnNames.length; i++) {
      row[columnNames[i]] = fields[i] ?? '';
    }
    return row;
  });

  return { schema: resolvedSchema, rows };
}

/**
 * Minimal RFC-4180-ish CSV parser: handles quoted fields, embedded commas,
 * embedded newlines inside quotes, and "" as escaped quote. Line endings:
 * \n, \r\n, or \r. Trailing empty lines are dropped.
 */
function parseCsvRaw(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      i++;
      continue;
    }
    if (ch === '\r' || ch === '\n') {
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
      if (ch === '\r' && input[i + 1] === '\n') i += 2;
      else i++;
      continue;
    }
    field += ch;
    i++;
  }

  // Flush the last field/row, unless the input ended cleanly on a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop trailing all-empty rows (e.g. trailing newline produces one).
  while (rows.length > 0 && rows[rows.length - 1].every((f) => f === '')) {
    rows.pop();
  }

  return rows;
}
