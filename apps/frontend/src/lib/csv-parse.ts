/**
 * Minimal RFC-4180-ish CSV parser — mirrors the backend's parser.
 * Handles quoted fields, embedded commas and newlines, "" as escaped quote,
 * and \n / \r\n / \r line endings.
 */
export function parseCsvRaw(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0

  while (i < input.length) {
    const ch = input[i]
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') { field += '"'; i += 2; continue }
        inQuotes = false; i++; continue
      }
      field += ch; i++; continue
    }
    if (ch === '"') { inQuotes = true; i++; continue }
    if (ch === ',') { row.push(field); field = ''; i++; continue }
    if (ch === '\r' || ch === '\n') {
      row.push(field); field = ''; rows.push(row); row = []
      if (ch === '\r' && input[i + 1] === '\n') i += 2; else i++
      continue
    }
    field += ch; i++
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  while (rows.length > 0 && rows[rows.length - 1].every((f) => f === '')) rows.pop()
  return rows
}
