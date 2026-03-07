"use client"

import { subscribeAction } from "@/app/actions/subscription.actions"
import { CreditCard, ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"

export default function SubscribeForm({ magazineId, price }: { magazineId: string, price: number }) {
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true)
        const toastId = toast.loading("Processing subscription...")
        try {
            await subscribeAction(formData)
        } catch (e) {
            toast.error("Something went wrong. Please try again.", { id: toastId })
            setIsPending(false)
        }
    }

    return (
        <form action={handleSubmit} suppressHydrationWarning>
            <input type="hidden" name="magazineId" value={magazineId} suppressHydrationWarning />
            <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                suppressHydrationWarning
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                        Processing...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-4 h-4" strokeWidth={2} />
                        Subscribe for ₹{price} / month
                        <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform duration-150" />
                    </>
                )}
            </button>
        </form>
    )
}
