import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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

  // Server-side sort/filter state — used when data is paginated
  const [serverSort, setServerSort] = useState<{ id: string; desc: boolean } | null>(null)
  const [serverFilters, setServerFilters] = useState<Record<string, string>>({})
  const [allDataLoaded, setAllDataLoaded] = useState(!initialNextCursor)
  const useServerSide = !allDataLoaded

  // Starts false to match SSR (localStorage not available server-side), flips after hydration.
  const [isOperator, setIsOperator] = useState(false)
  useEffect(() => { setIsOperator(hasSession()) }, [])

  // Initial load if no SSR data
  useEffect(() => {
    if (initialRows) return
    fetchCollectionRows(asset.id, { limit: 100 }).then((res) => {
      setRows(res.rows)
      setNextCursor(res.nextCursor)
      setAllDataLoaded(!res.nextCursor)
      setLoading(false)
    })
  }, [asset.id])

  // Server-side sort/filter refetch
  const refetchWithParams = useCallback(async (
    sort: { id: string; desc: boolean } | null,
    filters: Record<string, string>,
  ) => {
    setLoading(true)
    const res = await fetchCollectionRows(asset.id, {
      limit: 100,
      sortBy: sort?.id,
      sortOrder: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    })
    setRows(res.rows)
    setNextCursor(res.nextCursor)
    setLoading(false)
  }, [asset.id])

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    const res = await fetchCollectionRows(asset.id, {
      limit: 100,
      after: nextCursor,
      sortBy: serverSort?.id,
      sortOrder: serverSort ? (serverSort.desc ? 'desc' : 'asc') : undefined,
      filters: Object.keys(serverFilters).length > 0 ? serverFilters : undefined,
    })
    setRows((prev) => [...prev, ...res.rows])
    setNextCursor(res.nextCursor)
    if (!res.nextCursor) setAllDataLoaded(true)
    setLoadingMore(false)
  }, [asset.id, nextCursor, loadingMore, serverSort, serverFilters])

  const rowsRef = useRef(rows)
  rowsRef.current = rows

  const handleCellSave = useCallback(async (rowId: string, colName: string, value: string) => {
    setEditingCell(null)
    const row = rowsRef.current.find((r) => r.id === rowId)
    if (!row || String(row.data[colName] ?? '') === value) return
    const updated = await updateCollectionRow(asset.id, rowId, { [colName]: value })
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, data: updated.data, updatedAt: updated.updatedAt } : r)))
  }, [asset.id])

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
          const display = value == null ? '' : String(value)

          // Boolean — always a checkbox, no edit mode flow
          if (col.type === 'boolean') {
            const checked = isTruthy(value)
            return (
              <input
                type="checkbox"
                checked={checked}
                disabled={!isOperator}
                onChange={() => handleCellSave(row.original.id, col.name, String(!checked))}
                className="accent-signal"
              />
            )
          }

          const isEditing = editingCell?.rowId === row.original.id && editingCell?.colName === col.name

          if (isEditing && isOperator) {
            if (col.type === 'enum' && col.values) {
              return (
                <select
                  autoFocus
                  value={editValue}
                  onChange={(e) => handleCellSave(row.original.id, col.name, e.target.value)}
                  onBlur={() => setEditingCell(null)}
                  className="w-full bg-transparent border-none outline-none text-sm"
                >
                  {col.values.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              )
            }
            if (col.type === 'date') {
              return (
                <input
                  autoFocus
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleCellSave(row.original.id, col.name, editValue)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCellSave(row.original.id, col.name, editValue) }}
                  className="w-full bg-transparent border-none outline-none text-sm"
                />
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

          // Display mode — graceful fallbacks for type mismatches
          const isUrl = col.type === 'url' && display && /^https?:\/\//.test(display)
          const formattedDate = col.type === 'date' && display ? formatDate(display) : null

          if (!isOperator) {
            if (isUrl) {
              return <a href={display} target="_blank" rel="noopener noreferrer" className="text-signal underline">{display}</a>
            }
            if (formattedDate) return <span>{formattedDate}</span>
            return <span>{display}</span>
          }

          return (
            <span
              className="cursor-text block w-full"
              onClick={() => {
                setEditingCell({ rowId: row.original.id, colName: col.name })
                // For date, convert to YYYY-MM-DD for native picker
                if (col.type === 'date' && display) {
                  const d = new Date(display)
                  setEditValue(!isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : display)
                } else {
                  setEditValue(display)
                }
              }}
            >
              {isUrl ? (
                <a href={display} target="_blank" rel="noopener noreferrer" className="text-signal underline" onClick={(e) => e.stopPropagation()}>
                  {display}
                </a>
              ) : formattedDate ? (
                formattedDate
              ) : (
                display || <span className="text-text-ghost">&mdash;</span>
              )}
            </span>
          )
        },
        filterFn: col.type === 'enum' || col.type === 'boolean' ? 'equals' : 'includesString',
      }))
    }

    return cols
  }, [schema, editingCell, editValue, isOperator, handleCellSave])

  // Server-side sorting handler — refetch instead of client-side sort
  const handleSortingChange = useCallback((updater: any) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    setSorting(next)
    if (useServerSide && next.length > 0) {
      const s = { id: next[0].id, desc: next[0].desc }
      setServerSort(s)
      refetchWithParams(s, serverFilters)
    } else if (useServerSide && next.length === 0) {
      setServerSort(null)
      refetchWithParams(null, serverFilters)
    }
  }, [sorting, useServerSide, serverFilters, refetchWithParams])

  // Server-side filter handler — debounced refetch
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current) }, [])

  const handleColumnFiltersChange = useCallback((updater: any) => {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater
    setColumnFilters(next)
    if (useServerSide) {
      const filters: Record<string, string> = {}
      for (const f of next) {
        if (f.value != null && f.value !== '') filters[f.id] = String(f.value)
      }
      setServerFilters(filters)
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current)
      filterTimeoutRef.current = setTimeout(() => refetchWithParams(serverSort, filters), 300)
    }
  }, [columnFilters, useServerSide, serverSort, refetchWithParams])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: useServerSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: useServerSide ? undefined : getFilteredRowModel(),
    manualSorting: useServerSide,
    manualFiltering: useServerSide,
    enableRowSelection: isOperator,
  })

  // Mobile sticky column helpers
  const firstDataColId = schema[0]?.name
  const stickyClass = useCallback((colId: string) => {
    if (colId === 'select') return 'sticky left-0 z-10 bg-inherit md:static md:z-auto'
    if (colId === firstDataColId) {
      const left = isOperator ? 'left-[32px]' : 'left-0'
      return `sticky ${left} z-10 bg-inherit md:static md:z-auto shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] md:shadow-none`
    }
    return ''
  }, [firstDataColId, isOperator])

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
                  <th key={header.id} className={`text-left font-medium text-text-secondary px-3 py-2 text-xs whitespace-nowrap ${stickyClass(header.id)}`} style={{ width: header.getSize() }}>
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
                if (!col) return <th key={header.id} className={`px-3 py-1 ${stickyClass(header.id)}`} />
                if (col.type === 'enum' && col.values) {
                  return (
                    <th key={header.id} className={`px-3 py-1 ${stickyClass(header.id)}`}>
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
                if (col.type === 'boolean') {
                  return (
                    <th key={header.id} className={`px-3 py-1 ${stickyClass(header.id)}`}>
                      <select
                        value={(header.column.getFilterValue() as string) ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value || undefined)}
                        className="w-full bg-transparent border border-surface-2 rounded px-1.5 py-0.5 text-xs text-text-primary outline-none"
                      >
                        <option value="">All</option>
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    </th>
                  )
                }
                return (
                  <th key={header.id} className={`px-3 py-1 ${stickyClass(header.id)}`}>
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
                  <td key={cell.id} className={`px-3 py-1.5 text-text-primary text-sm ${stickyClass(cell.column.id)}`}>
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

function isTruthy(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  const s = String(value ?? '').toLowerCase()
  return s === 'true' || s === '1' || s === 'yes'
}

function formatDate(value: string): string | null {
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString()
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
