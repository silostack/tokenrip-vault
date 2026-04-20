import { useAtom } from 'jotai'
import { Search } from 'lucide-react'
import { useRef, useCallback } from 'react'
import { inboxSearchAtom, inboxStateFilterAtom } from '@/_jotai/operator/operator.atoms'

const STATE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
] as const

export function InboxFilters() {
  const [search, setSearch] = useAtom(inboxSearchAtom)
  const [stateFilter, setStateFilter] = useAtom(inboxStateFilterAtom)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => setSearch(value), 300)
    },
    [setSearch],
  )

  return (
    <div className="border-b border-foreground/5 px-4 pb-3 pt-4">
      <div className="relative">
        <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/25" />
        <input
          type="text"
          placeholder="Search…"
          defaultValue={search}
          onChange={handleSearch}
          className="w-full rounded-lg border border-foreground/10 bg-foreground/[0.02] py-2 pl-9 pr-3 text-sm text-foreground/80 placeholder:text-foreground/25 outline-none transition-colors focus:border-signal-accent"
        />
      </div>
      <div className="mt-3 flex gap-1">
        {STATE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStateFilter(tab.value)}
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
    </div>
  )
}
