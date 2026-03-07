"use client"

import { useState } from "react"
import { ShoppingCart, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { addToCart } from "@/app/actions/cart.actions"

export function AddToCartButton({
    magazineId,
    title,
    price,
    className = "w-full text-[9px] uppercase font-black tracking-wider bg-white/10 hover:bg-white/20 border border-white/10 text-white py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
}: {
    magazineId: string
    title: string
    price?: number
    className?: string
}) {
    const [pending, setPending] = useState(false)

    const handleAdd = async () => {
        setPending(true)
        const toastId = toast.loading("Adding to cart...")
        try {
            const formData = new FormData()
            formData.append("magazineId", magazineId)

            const result = await addToCart(formData)

            if (result?.error) {
                toast.error(result.error, { id: toastId })
            } else {
                toast.success(`${title} added to cart!`, { id: toastId })
            }
        } catch (err) {
            toast.error("Failed to add to cart", { id: toastId })
        } finally {
            setPending(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleAdd}
            disabled={pending}
            className={className}
            suppressHydrationWarning
        >
            {pending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            ) : (
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            )}
            {price ? `₹${price} / mo` : "Cart"}
        </button>
    )
}
