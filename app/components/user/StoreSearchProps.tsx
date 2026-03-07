// "use client"

// import { useState, useMemo, useRef, useEffect } from "react"
// import Link from "next/link"
// import { addToCart } from "@/app/actions/cart.actions"
// import { Search, X, ShoppingCart, BookOpen, SlidersHorizontal } from "lucide-react"

// interface Magazine {
//     id: string
//     title: string
//     slug: string
//     price: number
//     coverImage: string
//     description?: string | null
//     category?: string | null
// }

// interface StoreSearchProps {
//     magazines: Magazine[]
//     subscribedIds: Set<string>
// }

// export default function StoreSearch({ magazines, subscribedIds }: StoreSearchProps) {
//     const [query, setQuery] = useState("")
//     const [focused, setFocused] = useState(false)
//     const [showResults, setShowResults] = useState(false)
//     const inputRef = useRef<HTMLInputElement>(null)
//     const wrapperRef = useRef<HTMLDivElement>(null)

//     // Debounced search
//     const [debouncedQuery, setDebouncedQuery] = useState("")
//     useEffect(() => {
//         const timer = setTimeout(() => setDebouncedQuery(query), 150)
//         return () => clearTimeout(timer)
//     }, [query])

//     // Filtered results
//     const results = useMemo(() => {
//         const q = debouncedQuery.trim().toLowerCase()
//         if (!q) return []
//         return magazines
//             .filter((m) =>
//                 m.title.toLowerCase().includes(q) ||
//                 m.description?.toLowerCase().includes(q) ||
//                 m.category?.toLowerCase().includes(q)
//             )
//             .slice(0, 6)
//     }, [debouncedQuery, magazines])

//     // Close on outside click
//     useEffect(() => {
//         function handleClickOutside(e: MouseEvent) {
//             if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//                 setShowResults(false)
//                 setFocused(false)
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside)
//         return () => document.removeEventListener("mousedown", handleClickOutside)
//     }, [])

//     // Keyboard shortcut ⌘K / Ctrl+K
//     useEffect(() => {
//         function handleKey(e: KeyboardEvent) {
//             if ((e.metaKey || e.ctrlKey) && e.key === "k") {
//                 e.preventDefault()
//                 inputRef.current?.focus()
//                 setFocused(true)
//                 setShowResults(true)
//             }
//             if (e.key === "Escape") {
//                 setQuery("")
//                 setShowResults(false)
//                 setFocused(false)
//                 inputRef.current?.blur()
//             }
//         }
//         document.addEventListener("keydown", handleKey)
//         return () => document.removeEventListener("keydown", handleKey)
//     }, [])

//     const handleFocus = () => {
//         setFocused(true)
//         setShowResults(true)
//     }

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setQuery(e.target.value)
//         setShowResults(true)
//     }

//     const clearSearch = () => {
//         setQuery("")
//         inputRef.current?.focus()
//     }

//     const handleSelect = () => {
//         setQuery("")
//         setShowResults(false)
//         setFocused(false)
//     }

//     return (
//         <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">

//             {/* Search input */}
//             <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200
//         ${focused
//                     ? "bg-zinc-800 border-amber-400/40 ring-1 ring-amber-400/20 shadow-lg shadow-amber-400/5"
//                     : "bg-zinc-900 border-white/5 hover:border-white/10"
//                 }`}
//             >
//                 <Search className={`w-4 h-4 shrink-0 transition-colors duration-200 ${focused ? "text-amber-400" : "text-white/25"}`} strokeWidth={1.5} />

//                 <input
//                     ref={inputRef}
//                     type="text"
//                     value={query}
//                     onChange={handleChange}
//                     onFocus={handleFocus}
//                     placeholder="Search magazines by title, category..."
//                     suppressHydrationWarning
//                     className="flex-1 bg-transparent text-sm text-stone-100 placeholder:text-white/25 focus:outline-none"
//                 />

//                 <div className="flex items-center gap-2 shrink-0">
//                     {query ? (
//                         <button
//                             onClick={clearSearch}
//                             className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
//                         >
//                             <X className="w-3.5 h-3.5" />
//                         </button>
//                     ) : (
//                         <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-white/20 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded font-mono">
//                             ⌘K
//                         </kbd>
//                     )}
//                 </div>
//             </div>

//             {/* Dropdown results */}
//             {showResults && focused && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl z-50">

//                     {/* No query state */}
//                     {!debouncedQuery.trim() && (
//                         <div className="px-4 py-5 text-center">
//                             <SlidersHorizontal className="w-5 h-5 text-white/15 mx-auto mb-2" strokeWidth={1} />
//                             <p className="text-xs text-white/25">Start typing to search magazines</p>
//                         </div>
//                     )}

//                     {/* No results */}
//                     {debouncedQuery.trim() && results.length === 0 && (
//                         <div className="px-4 py-6 text-center">
//                             <p className="text-sm font-serif text-white/30 mb-1">No magazines found</p>
//                             <p className="text-xs text-white/20">Try a different title or category</p>
//                         </div>
//                     )}

//                     {/* Results list */}
//                     {results.length > 0 && (
//                         <>
//                             <div className="px-4 pt-3 pb-1 flex items-center justify-between">
//                                 <span className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
//                                     {results.length} result{results.length !== 1 ? "s" : ""}
//                                 </span>
//                                 <span className="text-[10px] text-white/15">Press Esc to close</span>
//                             </div>

//                             <div className="divide-y divide-white/5">
//                                 {results.map((mag) => {
//                                     const isSubscribed = subscribedIds.has(mag.id)
//                                     return (
//                                         <div key={mag.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors duration-150 group">

//                                             {/* Cover thumbnail */}
//                                             <div className="w-9 h-12 rounded-md overflow-hidden bg-zinc-800 shrink-0 border border-white/5">
//                                                 <img src={mag.coverImage} alt={mag.title} className="w-full h-full object-cover" />
//                                             </div>

//                                             {/* Info */}
//                                             <div className="flex-1 min-w-0">
//                                                 <p className="text-sm font-medium text-stone-200 truncate group-hover:text-amber-400 transition-colors duration-150">
//                                                     {mag.title}
//                                                 </p>
//                                                 <div className="flex items-center gap-2 mt-0.5">
//                                                     <span className="text-xs text-amber-400">₹{mag.price}/mo</span>
//                                                     {isSubscribed && (
//                                                         <span className="text-[9px] tracking-[1px] uppercase font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-sm">
//                                                             Subscribed
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             {/* Actions */}
//                                             <div className="flex items-center gap-1.5 shrink-0">
//                                                 <Link
//                                                     href={`/store/${mag.slug}`}
//                                                     onClick={handleSelect}
//                                                     className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-stone-100 hover:border-white/20 transition-all duration-150"
//                                                 >
//                                                     <BookOpen className="w-3 h-3" strokeWidth={2} />
//                                                     View
//                                                 </Link>

//                                                 {!isSubscribed && (
//                                                     <form action={addToCart} onSubmit={handleSelect}>
//                                                         <input type="hidden" name="magazineId" value={mag.id} />
//                                                         <button
//                                                             type="submit"
//                                                             className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors duration-150"
//                                                         >
//                                                             <ShoppingCart className="w-3 h-3" strokeWidth={2.5} />
//                                                             Cart
//                                                         </button>
//                                                     </form>
//                                                 )}

//                                                 {isSubscribed && (
//                                                     <Link
//                                                         href={`/store/${mag.slug}`}
//                                                         onClick={handleSelect}
//                                                         className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors duration-150"
//                                                     >
//                                                         Read
//                                                     </Link>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )
//                                 })}
//                             </div>

//                             {/* Footer */}
//                             <div className="px-4 py-2.5 border-t border-white/5 bg-zinc-800/30">
//                                 <p className="text-[10px] text-white/20 text-center">
//                                     Showing top {results.length} results · Press <kbd className="font-mono bg-white/5 px-1 rounded">Esc</kbd> to dismiss
//                                 </p>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }

"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { addToCart } from "@/app/actions/cart.actions"
import { Search, X, ShoppingCart, BookOpen, SlidersHorizontal } from "lucide-react"

interface Magazine {
    id: string
    title: string
    slug: string
    price: number
    coverImage: string
    description?: string | null
    category?: string | null
}

interface StoreSearchProps {
    magazines: Magazine[]
    subscribedIds: string[] // Changed from Set to string[] for Server-to-Client compatibility
}

export default function StoreSearch({ magazines, subscribedIds: subscribedIdsProp }: StoreSearchProps) {
    const [query, setQuery] = useState("")
    const [focused, setFocused] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Convert array back to Set for O(1) lookup performance
    const subscribedIds = useMemo(() => new Set(subscribedIdsProp), [subscribedIdsProp])

    // Debounced search
    const [debouncedQuery, setDebouncedQuery] = useState("")
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 150)
        return () => clearTimeout(timer)
    }, [query])

    // Filtered results
    const results = useMemo(() => {
        const q = debouncedQuery.trim().toLowerCase()
        if (!q) return []
        return magazines
            .filter((m) =>
                m.title.toLowerCase().includes(q) ||
                m.description?.toLowerCase().includes(q) ||
                m.category?.toLowerCase().includes(q)
            )
            .slice(0, 6)
    }, [debouncedQuery, magazines])

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowResults(false)
                setFocused(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Keyboard shortcut ⌘K / Ctrl+K
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                inputRef.current?.focus()
                setFocused(true)
                setShowResults(true)
            }
            if (e.key === "Escape") {
                setQuery("")
                setShowResults(false)
                setFocused(false)
                inputRef.current?.blur()
            }
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [])

    const handleFocus = () => {
        setFocused(true)
        setShowResults(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        setShowResults(true)
    }

    const clearSearch = () => {
        setQuery("")
        inputRef.current?.focus()
    }

    const handleSelect = () => {
        setQuery("")
        setShowResults(false)
        setFocused(false)
    }

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
            {/* Search input */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200
                ${focused
                    ? "bg-zinc-800 border-amber-400/40 ring-1 ring-amber-400/20 shadow-lg shadow-amber-400/5"
                    : "bg-zinc-900 border-white/5 hover:border-white/10"
                }`}
            >
                <Search className={`w-4 h-4 shrink-0 transition-colors duration-200 ${focused ? "text-amber-400" : "text-white/25"}`} strokeWidth={1.5} />

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    placeholder="Search magazines by title, category..."
                    suppressHydrationWarning
                    className="flex-1 bg-transparent text-sm text-stone-100 placeholder:text-white/25 focus:outline-none"
                />

                <div className="flex items-center gap-2 shrink-0">
                    {query ? (
                        <button
                            onClick={clearSearch}
                            className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-white/20 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded font-mono">
                            ⌘K
                        </kbd>
                    )}
                </div>
            </div>

            {/* Dropdown results */}
            {showResults && focused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl z-50">
                    {!debouncedQuery.trim() && (
                        <div className="px-4 py-5 text-center">
                            <SlidersHorizontal className="w-5 h-5 text-white/15 mx-auto mb-2" strokeWidth={1} />
                            <p className="text-xs text-white/25">Start typing to search magazines</p>
                        </div>
                    )}

                    {debouncedQuery.trim() && results.length === 0 && (
                        <div className="px-4 py-6 text-center">
                            <p className="text-sm font-serif text-white/30 mb-1">No magazines found</p>
                            <p className="text-xs text-white/20">Try a different title or category</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <>
                            <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                                <span className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
                                    {results.length} result{results.length !== 1 ? "s" : ""}
                                </span>
                                <span className="text-[10px] text-white/15">Press Esc to close</span>
                            </div>

                            <div className="divide-y divide-white/5">
                                {results.map((mag) => {
                                    // FIXED: Now works because subscribedIds is a Set again
                                    const isSubscribed = subscribedIds.has(mag.id)
                                    return (
                                        <div key={mag.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors duration-150 group">
                                            {/* Cover thumbnail */}
                                            <div className="w-9 h-12 rounded-md overflow-hidden bg-zinc-800 shrink-0 border border-white/5">
                                                <img src={mag.coverImage} alt={mag.title} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-stone-200 truncate group-hover:text-amber-400 transition-colors duration-150">
                                                    {mag.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-amber-400">₹{mag.price}/mo</span>
                                                    {isSubscribed && (
                                                        <span className="text-[9px] tracking-[1px] uppercase font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-sm">
                                                            Subscribed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <Link
                                                    href={`/store/${mag.slug}`}
                                                    onClick={handleSelect}
                                                    className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-stone-100 hover:border-white/20 transition-all duration-150"
                                                >
                                                    <BookOpen className="w-3 h-3" strokeWidth={2} />
                                                    View
                                                </Link>

                                                {!isSubscribed ? (
                                                    <form action={addToCart as any} onSubmit={handleSelect}>
                                                        <input type="hidden" name="magazineId" value={mag.id} />
                                                        <button
                                                            type="submit"
                                                            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors duration-150"
                                                        >
                                                            <ShoppingCart className="w-3 h-3" strokeWidth={2.5} />
                                                            Cart
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <Link
                                                        href={`/dashboard/read/${mag.slug}`}
                                                        onClick={handleSelect}
                                                        className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors duration-150"
                                                    >
                                                        Read
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="px-4 py-2.5 border-t border-white/5 bg-zinc-800/30">
                                <p className="text-[10px] text-white/20 text-center">
                                    Showing top {results.length} results · Press <kbd className="font-mono bg-white/5 px-1 rounded">Esc</kbd> to dismiss
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}