"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { removeFromCart } from "@/app/actions/cart.actions"

export function RemoveButton({ cartId }: { cartId: string }) {
    const [pending, setPending] = useState(false)

    const handleRemove = async () => {
        setPending(true)
        const toastId = toast.loading("Removing item...")
        try {
            await removeFromCart(cartId)
            toast.success("Item removed from cart", {
                id: toastId,
                icon: '🗑️',
                style: {
                    background: '#18181b',
                    color: '#fb7185',
                    border: '1px solid rgba(251, 113, 133, 0.2)'
                }
            })
        } catch (err) {
            toast.error("Failed to remove item", { id: toastId })
        } finally {
            setPending(false)
        }
    }



    return (
        <button
            type="button"
            onClick={handleRemove}
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