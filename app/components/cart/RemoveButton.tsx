"use client"

import { useFormStatus } from "react-dom"
import { Trash2, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"

export function RemoveButton() {
    const { pending } = useFormStatus()
    // We use a ref to track the previous state so we only toast once when finishing
    const wasPending = useRef(false)

    useEffect(() => {
        // If it was pending and now it's not, the item was removed
        if (wasPending.current && !pending) {
            toast.success("Item removed from cart", {
                icon: '🗑️',
                style: {
                    background: '#18181b',
                    color: '#fb7185', // rose-400 to match your hover color
                    border: '1px solid rgba(251, 113, 133, 0.2)'
                }
            })
        }
        // Update the ref for the next render
        wasPending.current = pending
    }, [pending])

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 text-white/20 hover:text-rose-400 transition-colors py-2 px-3 rounded-lg hover:bg-rose-400/5 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-bold uppercase tracking-tighter">
                {pending ? "Removing..." : "Remove"}
            </span>
        </button>
    )
}