import { ArrowLeft, MapPin, Phone, User, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { processOrder } from "@/app/actions/checkout.actions"
// Toaster is globally imported in layout

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-stone-100 p-6 md:p-12 selection:bg-amber-400 selection:text-zinc-950">
            <div className="max-w-[800px] mx-auto pt-20">

                {/* Back Navigation */}
                <Link href="/dashboard/user/cart" className="inline-flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Back to Cart</span>
                </Link>

                <div className="mb-10">
                    <h1 className="font-serif text-4xl md:text-5xl mb-2 tracking-tight">Billing Details</h1>
                    <p className="text-white/40">Enter your shipping information to complete the order.</p>
                </div>

                {/* Billing Form */}
                <form action={processOrder} className="space-y-6 bg-zinc-900/40 border border-white/5 p-8 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name Input */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-[2px] text-white/40 font-bold flex items-center gap-2">
                                <User className="w-3 h-3 text-amber-400" /> Full Name
                            </label>
                            <input name="name" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-400/50 outline-none transition-all placeholder:text-white/10" />
                        </div>

                        {/* Address Input */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] uppercase tracking-[2px] text-white/40 font-bold flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-amber-400" /> Shipping Address
                            </label>
                            <input name="address" required placeholder="123 Luxury Ave, Suite 4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-400/50 outline-none transition-all placeholder:text-white/10" />
                        </div>

                        {/* Contact Inputs */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[2px] text-white/40 font-bold flex items-center gap-2">
                                <Phone className="w-3 h-3 text-amber-400" /> Phone Number
                            </label>
                            <input name="phone" required type="tel" placeholder="+91 00000 00000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-400/50 outline-none transition-all placeholder:text-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[2px] text-white/40 font-bold">Postal Code</label>
                            <input name="zip" required placeholder="400001" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-400/50 outline-none transition-all placeholder:text-white/10" />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <button type="submit" className="w-full bg-amber-400 text-zinc-950 font-black py-4 rounded-2xl hover:bg-amber-300 transition-all active:scale-[0.98] shadow-xl shadow-amber-400/10 flex items-center justify-center gap-3">
                            <ShieldCheck className="w-5 h-5" />
                            CONFIRM & PAY NOW
                        </button>
                    </div>
                </form>

                <p className="text-[10px] text-center text-white/20 mt-8 uppercase tracking-[3px] font-bold">
                    Encrypted & Secure Checkout
                </p>
            </div>
        </div>
    )
}