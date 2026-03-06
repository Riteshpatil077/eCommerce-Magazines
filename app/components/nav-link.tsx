"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

interface NavLinkProps {
    href: string
    label: string
    icon: LucideIcon
}

export default function NavLink({ href, label, icon: Icon }: NavLinkProps) {
    const pathname = usePathname()
    // This checks if the current path matches the link
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={`
        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative
        ${isActive
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[inset_0_0_12px_rgba(245,158,11,0.05)]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] border border-transparent"}
      `}
        >
            <Icon
                className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive ? "text-amber-500" : "group-hover:text-zinc-100"}`}
                strokeWidth={isActive ? 2 : 1.5}
            />

            <span className="relative z-10">{label}</span>

            {/* Premium Active Indicator */}
            {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full shadow-[4px_0_15px_rgba(245,158,11,0.4)]" />
            )}
        </Link>
    )
}