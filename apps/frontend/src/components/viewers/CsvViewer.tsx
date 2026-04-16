import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Save, RotateCcw } from 'lucide-react'
import { parseCsvRaw } from '@/lib/csv-parse'
import { hasSession } from '@/lib/session'
import api from '@/utils/api'

interface Props {
  assetId: string
  content: string
  downloadUrl: string
  downloadFilename?: string
}

type Row = { __idx: number } & Record<string, string>

/**
 * CSV viewer. Parses CSV client-side into a sortable/filterable table.
 *
 * Operators (session present) can edit cells inline. Edits update local state
 * only — nothing is persisted until the operator clicks "Save version", at which
 * point all current rows are serialized back to CSV and posted as a new asset
 * version. This avoids creating a version per cell edit.
 */
export function CsvViewer({ assetId, content, downloadUrl, downloadFilename }: Props) {
  // Parse CSV once per content change. First row is treated as headers.
  const parsed = useMemo(() => {
    const raw = parseCsvRaw(content)
    if (raw.length === 0) return { headers: [] as string[], initialRows: [] as Row[] }
    const headers = raw[0].map((h, i) => h.trim() || `col_${i + 1}`)
    const initialRows = raw.slice(1).map((fields, idx) => {
      const row = { __idx: idx } as Row
      for (let i = 0; i < headers.length; i++) row[headers[i]] = fields[i] ?? ''
      return row
    })
    return { headers, initialRows }
  }, [content])

  const [rows, setRows] = useState<Row[]>(parsed.initialRows)
  useEffect(() => { setRows(parsed.initialRows) }, [parsed.initialRows])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Operator edit mode — starts false (matches SSR), flips after hydration if session present.
  const [isOperator, setIsOperator] = useState(false)
  useEffect(() => { setIsOperator(hasSession()) }, [])

  const isDirty = useMemo(() => {
    if (rows.length !== parsed.initialRows.length) return true
    for (let i = 0; i < rows.length; i++) {
      for (const h of parsed.headers) {
        if (rows[i][h] !== parsed.initialRows[i]?.[h]) return true
      }
    }
    return false
  }, [rows, parsed.initialRows, parsed.headers])

  const dirtyCount = useMemo(() => {
    let n = 0
    for (let i = 0; i < rows.length; i++) {
      for (const h of parsed.headers) {
        if (rows[i][h] !== parsed.initialRows[i]?.[h]) n++
      }
    }
    return n
  }, [rows, parsed.initialRows, parsed.headers])

  const handleCellSave = useCallback((rowIdx: number, col: string, value: string) => {
    setEditingCell(null)
    setRows((prev) => prev.map((r) => (r.__idx === rowIdx ? { ...r, [col]: value } : r)))
  }, [])

  const handleReset = useCallback(() => {
    setRows(parsed.initialRows)
    setEditingCell(null)
    setSaveError(null)
  }, [parsed.initialRows])

  const handleSaveVersion = useCallback(async () => {
    if (saving || !isDirty) return
    setSaving(true)
    setSaveError(null)
    try {
      const csv = serializeToCsv(parsed.headers, rows)
      await api.post(`/v0/assets/${assetId}/versions`, { type: 'csv', content: csv })
      // Refresh the page so the loader picks up the new version.
      if (typeof window !== 'undefined') window.location.reload()
    } catch (err: any) {
      setSaveError(err?.response?.data?.message ?? 'Save failed')
      setSaving(false)
    }
  }, [assetId, parsed.headers, rows, saving, isDirty])

  const columnHelper = createColumnHelper<Row>()
  const columns = useMemo(() => {
    return parsed.headers.map((name) =>
      columnHelper.accessor((row) => row[name], {
        id: name,
        header: name,
        cell: ({ row, getValue }) => {
          const value = String(getValue() ?? '')
          const isEditing = editingCell?.rowIdx === row.original.__idx && editingCell?.col === name

          if (isEditing && isOperator) {
            return (
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleCellSave(row.original.__idx, name, editValue)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCellSave(row.original.__idx, name, editValue)
                  if (e.key === 'Escape') setEditingCell(null)
                }}
                className="w-full bg-transparent border-none outline-none text-sm"
              />
            )
          }

          const isUrl = /^https?:\/\//.test(value)
          const display = (
            isUrl ? (
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-signal underline" onClick={(e) => e.stopPropagation()}>{value}</a>
            ) : (
              value || <span className="text-text-ghost">&mdash;</span>
            )
          )

          if (!isOperator) return display

          return (
            <span
              className="cursor-text block w-full"
              onClick={() => {
                setEditingCell({ rowIdx: row.original.__idx, col: name })
                setEditValue(value)
              }}
            >
              {display}
            </span>
          )
        },
        filterFn: 'includesString',
      }),
    )
  }, [parsed.headers, editingCell, editValue, isOperator, handleCellSave])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (parsed.headers.length === 0) {
    return <div className="flex items-center justify-center py-24 text-text-secondary">Empty CSV</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-1 gap-3 flex-wrap">
        <div className="text-xs text-text-secondary">
          {rows.length} row{rows.length !== 1 ? 's' : ''}
          {isDirty && (
            <span className="ml-2 text-status-warning">{dirtyCount} unsaved change{dirtyCount !== 1 ? 's' : ''}</span>
          )}
          {saveError && <span className="ml-2 text-status-error">{saveError}</span>}
        </div>
        <div className="flex items-center gap-2">
          {isOperator && isDirty && (
            <>
              <button
                onClick={handleReset}
                disabled={saving}
                className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary rounded hover:bg-surface-1 disabled:opacity-50"
              >
                <RotateCcw size={12} /> Reset
              </button>
              <button
                onClick={handleSaveVersion}
                disabled={saving}
                className="flex items-center gap-1 px-2 py-1 text-xs text-status-success hover:bg-status-success/10 rounded disabled:opacity-50"
              >
                <Save size={12} /> {saving ? 'Saving...' : 'Save version'}
              </button>
            </>
          )}
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary rounded hover:bg-surface-1"
          >
            <Download size={12} /> Download
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-surface-1">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left font-medium text-text-secondary px-3 py-2 text-xs whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <button
                        className="flex items-center gap-1 hover:text-text-primary"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortIcon sorted={header.column.getIsSorted()} />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
            <tr className="border-b border-surface-1 bg-surface-0">
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <th key={header.id} className="px-3 py-1">
                  <input
                    type="text"
                    placeholder="Filter..."
                    value={(header.column.getFilterValue() as string) ?? ''}
                    onChange={(e) => header.column.setFilterValue(e.target.value || undefined)}
                    className="w-full bg-transparent border border-surface-2 rounded px-1.5 py-0.5 text-xs text-text-primary outline-none placeholder:text-text-ghost"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-surface-0 hover:bg-surface-0/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-1.5 text-text-primary text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') return <ArrowUp size={12} />
  if (sorted === 'desc') return <ArrowDown size={12} />
  return <ArrowUpDown size={12} className="text-text-ghost" />
}

function csvEscape(s: string): string {
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/** Serialize rows back to CSV. Emits headers + data rows preserving __idx-insertion order. */
function serializeToCsv(headers: string[], rows: Row[]): string {
  const lines = [headers.map(csvEscape).join(',')]
  const ordered = [...rows].sort((a, b) => a.__idx - b.__idx)
  for (const r of ordered) {
    lines.push(headers.map((h) => csvEscape(String(r[h] ?? ''))).join(','))
  }
  return lines.join('\n') + '\n'
}
