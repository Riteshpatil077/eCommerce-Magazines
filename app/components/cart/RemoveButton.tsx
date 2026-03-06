"use client"

import { useFormStatus } from "react-dom"
import { Trash2, Loader2 } from "lucide-react"

export function RemoveButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 text-white/20 hover:text-rose-400 transition-colors py-2 px-3 rounded-lg hover:bg-rose-400/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
            <span className="text-xs font-bold uppercase tracking-tighter">
                {pending ? "Removing..." : "Remove"}
            </span>
        </button>
    )
}