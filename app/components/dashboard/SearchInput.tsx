"use client"

import { Search, X, Loader2 } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useEffect, useState } from "react"

export default function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [value, setValue] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (value) {
      params.set("q", value)
    } else {
      params.delete("q")
    }

    // Wait 300ms after user stops typing to update results
    const timeout = setTimeout(() => {
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 300)

    return () => clearTimeout(timeout)
  }, [value, pathname, router, searchParams])

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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by publication title..."
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all placeholder:text-white/10"
      />

      {value && !isPending && (
        <button 
          onClick={() => setValue("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}