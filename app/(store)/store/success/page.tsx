import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-stone-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full" />
                    <CheckCircle2 className="w-24 h-24 text-amber-400 mx-auto relative" strokeWidth={1} />
                </div>

                <div className="space-y-3">
                    <h1 className="font-serif text-4xl font-medium tracking-tight">Order Confirmed</h1>
                    <p className="text-white/40">Your subscription is now active. Welcome to the Pressly inner circle.</p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Link href="/dashboard/user/subscriptions" className="bg-amber-400 text-zinc-950 font-black py-4 rounded-2xl hover:bg-amber-300 transition-all flex items-center justify-center gap-2 group">
                        VIEW MY SUBSCRIPTIONS
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link href="/store" className="text-white/40 hover:text-white transition-colors text-sm font-medium py-2">
                        Back to Store
                    </Link>
                </div>
            </div>
        </div>
    )
}