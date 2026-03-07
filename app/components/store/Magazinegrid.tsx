"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import { ShoppingCart, BookOpen, Search, X, SlidersHorizontal, ChevronDown } from "lucide-react"

interface Magazine {
  id: string
  title: string
  slug: string
  price: number
  coverImage: string
  description?: string | null
  category?: string | null
  stock?: number
  createdAt: string | Date
}

interface MagazineGridProps {
  magazines: Magazine[]
  subscribedIds: string[]
}

const PAGE_SIZE = 24

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "az"

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  az: "A → Z",
}

export default function MagazineGrid({ magazines, subscribedIds }: MagazineGridProps) {
  const subSet = useMemo(() => new Set(subscribedIds), [subscribedIds])
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [sort, setSort] = useState<SortOption>("newest")
  const [showSort, setShowSort] = useState(false)
  const [page, setPage] = useState(1)
  const loaderRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQuery(query); setPage(1) }, 200)
    return () => clearTimeout(t)
  }, [query])

  // Reset page on sort change
  useEffect(() => { setPage(1) }, [sort])

  // Filtered + sorted list
  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim()
    let list = q
      ? magazines.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
      )
      : [...magazines]

    switch (sort) {
      case "oldest": list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break
      case "price-asc": list.sort((a, b) => a.price - b.price); break
      case "price-desc": list.sort((a, b) => b.price - a.price); break
      case "az": list.sort((a, b) => a.title.localeCompare(b.title)); break
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return list
  }, [debouncedQuery, sort, magazines])

  // Paginated slice — only render what's needed
  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])
  const hasMore = visible.length < filtered.length

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    if (hasMore) setPage(p => p + 1)
  }, [hasMore])

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore()
    }, { rootMargin: "300px" })
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  // ⌘K shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") { setQuery(""); inputRef.current?.blur() }
    }
    addEventListener("keydown", fn)
    return () => removeEventListener("keydown", fn)
  }, [])

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="sticky top-[65px] z-40 bg-zinc-950/90 backdrop-blur-md border-b border-white/5 px-6 md:px-16 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search magazines..."
              className="w-full bg-zinc-900 border border-white/5 focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/15 rounded-xl pl-10 pr-9 py-2.5 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none transition-all duration-200"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSort(s => !s)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 border border-white/5 hover:border-white/10 rounded-xl text-xs text-white/40 hover:text-stone-100 transition-all duration-150"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="hidden sm:block">{SORT_LABELS[sort]}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${showSort ? "rotate-180" : ""}`} />
            </button>

            {showSort && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/5 rounded-xl overflow-hidden shadow-2xl z-50">
                {(Object.keys(SORT_LABELS) as SortOption[]).map(key => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setShowSort(false) }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors duration-100
                      ${sort === key ? "text-amber-400 bg-amber-400/5" : "text-white/40 hover:text-stone-100 hover:bg-white/5"}`}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Count */}
          <div className="shrink-0 hidden sm:flex items-center gap-1.5 text-xs text-white/20">
            <span className="font-medium text-white/40">{filtered.length.toLocaleString()}</span>
            <span>magazines</span>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-6 md:px-16 py-10 max-w-screen-xl mx-auto">

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/20">
            <BookOpen className="w-10 h-10 mb-4 opacity-20" strokeWidth={1} />
            <p className="font-serif text-xl mb-1">No magazines found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {visible.map((mag, i) => {
                const isSubscribed = subSet.has(mag.id)
                return (
                  <MagazineCard
                    key={mag.id}
                    mag={mag}
                    isSubscribed={isSubscribed}
                    priority={i < 12}
                  />
                )
              })}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={loaderRef} className="flex justify-center py-12">
              {hasMore ? (
                <div className="flex items-center gap-3 text-xs text-white/20">
                  <div className="w-4 h-4 border-2 border-white/10 border-t-amber-400 rounded-full animate-spin" />
                  Loading more...
                </div>
              ) : filtered.length > PAGE_SIZE ? (
                <p className="text-xs text-white/15">
                  All {filtered.length.toLocaleString()} magazines loaded
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Individual card — memoized to prevent unnecessary re-renders ── */
import { memo } from "react"
import { AddToCartButton } from "../cart/AddToCartButton"

const MagazineCard = memo(function MagazineCard({
  mag,
  isSubscribed,
  priority,
}: {
  mag: Magazine
  isSubscribed: boolean
  priority: boolean
}) {



  return (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden group bg-zinc-900 border border-white/5 hover:border-amber-400/20 transition-all duration-300">

      {/* Image — native lazy loading */}
      <img
        src={mag.coverImage}
        alt={mag.title}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-300" />

      {/* Subscribed badge */}
      {isSubscribed && (
        <span className="absolute top-2 right-2 z-10 bg-amber-400 text-zinc-950 text-[8px] font-black px-1.5 py-0.5 rounded-sm tracking-wider uppercase">
          Owned
        </span>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-3 z-10">
        <h3 className="text-xs font-serif font-bold text-stone-100 truncate mb-0.5 leading-tight">
          {mag.title}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-amber-400 font-medium pb-0">
            {isSubscribed ? "Access Unlocked" : `₹${mag.price}/mo`}
          </p>
          <p className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${mag.stock && mag.stock > 0 ? "bg-amber-400/10 text-amber-400" : "bg-red-500/10 text-red-500"}`}>
            {(mag.stock && mag.stock > 0) ? `${mag.stock} Left` : "Out of Stock"}
          </p>
        </div>

        {/* Hover actions */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-250">
          {isSubscribed ? (
            <Link
              href={`/dashboard/read/${mag.slug}`}
              className="block text-[9px] uppercase font-black tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 py-1.5 text-center rounded-lg transition-colors"
            >
              Read Now
            </Link>
          ) : (mag.stock && mag.stock > 0) ? (
            <>
              <AddToCartButton magazineId={mag.id} title={mag.title} />
              <Link
                href={`/store/${mag.slug}`}
                className="block text-[9px] uppercase font-black tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 py-1.5 text-center rounded-lg transition-colors"
              >
                Subscribe
              </Link>
            </>
          ) : (
            <button
              disabled
              className="block text-[9px] uppercase font-black tracking-wider bg-zinc-800 text-white/50 py-1.5 text-center rounded-lg cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  )
})