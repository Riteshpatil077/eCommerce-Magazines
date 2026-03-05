"use client"

import { Search, X, Loader2 } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useEffect, useState } from "react"

export default function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // 1. Critical for Hydration: Only show the "real" value once mounted
  const [mounted, setMounted] = useState(false)
  const [value, setValue] = useState(searchParams.get("q") || "")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Skip the first update to avoid redundant routing on mount
    if (!mounted) return;

    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set("q", value)
      params.set("page", "1") // Reset to page 1 on new search
    } else {
      params.delete("q")
    }

    const timeout = setTimeout(() => {
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 300)

    return () => clearTimeout(timeout)
    // We only want to trigger this when 'value' changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, pathname, router])

  return (
    <div className="relative group max-w-md mb-8">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        {isPending ? (
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-white/20 group-focus-within:text-amber-400 " />
        )}
      </div>
      
      <input
        type="text"
        // 2. Suppress the warning caused by browser extensions/form filler
        suppressHydrationWarning
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by publication title..."
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all placeholder:text-white/10"
      />

      {value && !isPending && (
        <button 
          type="button"
          onClick={() => setValue("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}