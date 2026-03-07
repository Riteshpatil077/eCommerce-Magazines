// @/components/admin/UserSearch.tsx
"use client"

import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition, useEffect, useState } from "react"

export default function UserSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get("query") || "")

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("query", value)
    } else {
      params.delete("query")
    }

    // Debounce: Wait 300ms before triggering the server update
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value, pathname, router, searchParams])

  return (
    <div className="relative w-full max-w-sm mb-8">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name or email..."
        suppressHydrationWarning
        className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-11 pr-10 py-2.5 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-all"
      />
      {value && (
        <button 
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-md text-white/20"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}