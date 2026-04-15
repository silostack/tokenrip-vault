import { useState, useEffect, useMemo, useCallback } from 'react'
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
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Trash2, ChevronDown } from 'lucide-react'
import type { AssetMetadata } from '@/lib/api'
import type { CollectionSchema, CollectionRow } from '@/lib/collection'
import { fetchCollectionRows, updateCollectionRow, deleteCollectionRows } from '@/lib/collection'
import { hasSession } from '@/lib/session'

interface Props {
  asset: AssetMetadata
  initialRows?: CollectionRow[]
  initialNextCursor?: string | null
}

export function CollectionViewer({ asset, initialRows, initialNextCursor }: Props) {
  const schema = useMemo(() => {
    const meta = asset.metadata as Record<string, unknown> | undefined
    return ((meta?.schema as CollectionSchema[]) ?? []).sort((a, b) => a.position - b.position)
  }, [asset.metadata])

  const [rows, setRows] = useState<CollectionRow[]>(initialRows ?? [])
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor ?? null)
  const [loading, setLoading] = useState(!initialRows)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [editingCell, setEditingCell] = useState<{ rowId: string; colName: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const isOperator = useMemo(() => hasSession(), [])

  // Initial load if no SSR data
  useEffect(() => {
    if (initialRows) return
    fetchCollectionRows(asset.id, { limit: 100 }).then((res) => {
      setRows(res.rows)
      setNextCursor(res.nextCursor)
      setLoading(false)
    })
  }, [asset.id])

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    const res = await fetchCollectionRows(asset.id, { limit: 100, after: nextCursor })
    setRows((prev) => [...prev, ...res.rows])
    setNextCursor(res.nextCursor)
    setLoadingMore(false)
  }, [asset.id, nextCursor, loadingMore])

  const handleCellSave = useCallback(async (rowId: string, colName: string, value: string) => {
    setEditingCell(null)
    const row = rows.find((r) => r.id === rowId)
    if (!row || String(row.data[colName] ?? '') === value) return
    const updated = await updateCollectionRow(asset.id, rowId, { [colName]: value })
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, data: updated.data, updatedAt: updated.updatedAt } : r)))
  }, [asset.id, rows])

  const getSelectedIds = useCallback((): string[] => {
    return Object.keys(rowSelection).filter((k) => rowSelection[k]).map((idx) => rows[Number(idx)]?.id).filter(Boolean)
  }, [rows, rowSelection])

  const handleBulkDelete = useCallback(async () => {
    const ids = getSelectedIds()
    if (!ids.length) return
    await deleteCollectionRows(asset.id, ids)
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)))
    setRowSelection({})
  }, [asset.id, getSelectedIds])

  const handleExport = useCallback((format: 'csv' | 'json', selectedOnly: boolean) => {
    const selectedIds = selectedOnly ? getSelectedIds() : null
    const exportRows = selectedIds ? rows.filter((r) => selectedIds.includes(r.id)) : rows

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportRows.map((r) => r.data), null, 2)], { type: 'application/json' })
      downloadBlob(blob, `${asset.title || 'collection'}.json`)
    } else {
      const headers = schema.map((c) => c.name)
      const csvRows = [headers.join(','), ...exportRows.map((r) => headers.map((h) => csvEscape(String(r.data[h] ?? ''))).join(','))]
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
      downloadBlob(blob, `${asset.title || 'collection'}.csv`)
    }
  }, [rows, getSelectedIds, schema, asset.title])

  const columnHelper = createColumnHelper<CollectionRow>()

  const columns = useMemo(() => {
    const cols = []

    if (isOperator) {
      cols.push(columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="accent-signal"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="accent-signal"
          />
        ),
        size: 32,
      }))
    }

    for (const col of schema) {
      cols.push(columnHelper.accessor((row) => row.data[col.name], {
        id: col.name,
        header: col.name,
        cell: ({ row, getValue }) => {
          const value = getValue()
          const isEditing = editingCell?.rowId === row.original.id && editingCell?.colName === col.name

          if (isEditing && isOperator) {
            if (col.type === 'enum' && col.values) {
              return (
                <select
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleCellSave(row.original.id, col.name, editValue)}
                  className="w-full bg-transparent border-none outline-none text-sm"
                >
                  {col.values.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              )
            }
            return (
              <input
                autoFocus
                type={col.type === 'number' ? 'number' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleCellSave(row.original.id, col.name, editValue)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCellSave(row.original.id, col.name, editValue) }}
                className="w-full bg-transparent border-none outline-none text-sm"
              />
            )
          }

          const display = value == null ? '' : String(value)

          if (!isOperator) {
            if (col.type === 'url' && display) {
              return <a href={display} target="_blank" rel="noopener noreferrer" className="text-signal underline">{display}</a>
            }
            return <span>{display}</span>
          }

          return (
            <span
              className="cursor-text block w-full"
              onClick={() => {
                setEditingCell({ rowId: row.original.id, colName: col.name })
                setEditValue(display)
              }}
            >
              {col.type === 'url' && display ? (
                <a href={display} target="_blank" rel="noopener noreferrer" className="text-signal underline" onClick={(e) => e.stopPropagation()}>
                  {display}
                </a>
              ) : (
                display || <span className="text-text-ghost">&mdash;</span>
              )}
            </span>
          )
        },
        filterFn: col.type === 'enum' ? 'equals' : 'includesString',
      }))
    }

    return cols
  }, [schema, editingCell, editValue, isOperator, handleCellSave])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: isOperator,
  })

  const selectedCount = Object.values(rowSelection).filter(Boolean).length

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-text-secondary">Loading collection...</div>
  }

  if (!rows.length) {
    return <div className="flex items-center justify-center py-24 text-text-secondary">No rows yet</div>
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-1">
        <div className="text-xs text-text-secondary">
          {rows.length} row{rows.length !== 1 ? 's' : ''}
          {selectedCount > 0 && <span className="ml-2 text-text-primary">{selectedCount} selected</span>}
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && isOperator && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-2 py-1 text-xs text-status-error hover:bg-status-error/10 rounded"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
          <div className="relative group">
            <button className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary rounded hover:bg-surface-1">
              <Download size={12} /> Export <ChevronDown size={10} />
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-0.5 bg-background border border-surface-2 rounded shadow-lg z-10 min-w-[140px]">
              <button onClick={() => handleExport('csv', false)} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-surface-1">CSV (all)</button>
              <button onClick={() => handleExport('json', false)} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-surface-1">JSON (all)</button>
              {selectedCount > 0 && (
                <>
                  <button onClick={() => handleExport('csv', true)} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-surface-1">CSV (selected)</button>
                  <button onClick={() => handleExport('json', true)} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-surface-1">JSON (selected)</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-surface-1">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left font-medium text-text-secondary px-3 py-2 text-xs whitespace-nowrap" style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <div>
                        <button
                          className="flex items-center gap-1 hover:text-text-primary"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <SortIcon sorted={header.column.getIsSorted()} headerId={header.id} />
                        </button>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
            {/* Filter row */}
            <tr className="border-b border-surface-1 bg-surface-0">
              {table.getHeaderGroups()[0]?.headers.map((header) => {
                const col = schema.find((c) => c.name === header.id)
                if (!col) return <th key={header.id} className="px-3 py-1" />
                if (col.type === 'enum' && col.values) {
                  return (
                    <th key={header.id} className="px-3 py-1">
                      <select
                        value={(header.column.getFilterValue() as string) ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value || undefined)}
                        className="w-full bg-transparent border border-surface-2 rounded px-1.5 py-0.5 text-xs text-text-primary outline-none"
                      >
                        <option value="">All</option>
                        {col.values.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </th>
                  )
                }
                return (
                  <th key={header.id} className="px-3 py-1">
                    <input
                      type="text"
                      placeholder="Filter..."
                      value={(header.column.getFilterValue() as string) ?? ''}
                      onChange={(e) => header.column.setFilterValue(e.target.value || undefined)}
                      className="w-full bg-transparent border border-surface-2 rounded px-1.5 py-0.5 text-xs text-text-primary outline-none placeholder:text-text-ghost"
                    />
                  </th>
                )
              })}
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

      {/* Load more */}
      {nextCursor && (
        <div className="flex justify-center py-3 border-t border-surface-1">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-1 rounded border border-surface-2"
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}

function SortIcon({ sorted, headerId }: { sorted: false | 'asc' | 'desc'; headerId: string }) {
  if (sorted === 'asc') return <ArrowUp size={12} />
  if (sorted === 'desc') return <ArrowDown size={12} />
  if (headerId !== 'select') return <ArrowUpDown size={12} className="text-text-ghost" />
  return null
}

function csvEscape(str: string): string {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
