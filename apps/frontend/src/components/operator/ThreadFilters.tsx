import { Search } from 'lucide-react'
import { useRef, useCallback } from 'react'

const STATE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
] as const

const OWNERSHIP_TABS = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'Mine' },
  { value: 'participating', label: 'Participating' },
] as const

export type ThreadStateFilter = 'all' | 'open' | 'closed'
export type ThreadOwnershipFilter = 'all' | 'mine' | 'participating'

interface ThreadFiltersProps {
  stateFilter: ThreadStateFilter
  ownershipFilter: ThreadOwnershipFilter
  search: string
  onStateChange: (state: ThreadStateFilter) => void
  onOwnershipChange: (ownership: ThreadOwnershipFilter) => void
  onSearchChange: (q: string) => void
}

export function ThreadFilters({
  stateFilter,
  ownershipFilter,
  search,
  onStateChange,
  onOwnershipChange,
  onSearchChange,
}: ThreadFiltersProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onSearchChange(value), 300)
    },
    [onSearchChange],
  )

  return (
    <div className="border-b border-foreground/5 px-4 pb-3 pt-4">
      <div className="relative">
        <Search
          size={14}
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25"
        />
        <input
          type="text"
          placeholder="Search threads…"
          defaultValue={search}
          onChange={handleSearch}
          className="w-full rounded-lg border border-foreground/10 bg-foreground/[0.02] py-2 pl-9 pr-3 text-sm text-foreground/80 placeholder:text-foreground/25 outline-none transition-colors focus:border-signal-accent"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1">
          {STATE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStateChange(tab.value)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-medium tracking-wide transition-colors ${
                stateFilter === tab.value
                  ? 'bg-foreground/10 text-foreground/80'
                  : 'text-foreground/35 hover:text-foreground/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="h-3.5 w-px bg-foreground/10" />
        <div className="flex gap-1">
          {OWNERSHIP_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onOwnershipChange(tab.value)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-medium tracking-wide transition-colors ${
                ownershipFilter === tab.value
                  ? 'bg-foreground/10 text-foreground/80'
                  : 'text-foreground/35 hover:text-foreground/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
