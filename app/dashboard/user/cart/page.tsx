
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import Link from "next/link"
import { removeFromCart } from "@/app/actions/cart.actions"
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Box } from "lucide-react"
// import { processCheckout } from "@/app/actions/checkout.actions"

async function getUser() {
    const token = (await cookies()).get("token")?.value
    if (!token) return null
    try {
        return jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
        return null
    }
}

export default async function CartPage() {
    const user: any = await getUser()
    if (!user) redirect("/login")

    const cartItems = await prisma.cart.findMany({
        where: { userId: user.id },
        include: { magazine: true },
    })

    const totalAmount = cartItems.reduce((acc, item) => acc + item.magazine.price, 0)

    return (
        <div className="min-h-screen bg-zinc-950 text-stone-100 selection:bg-amber-400 selection:text-zinc-950">
            {/* Header / Nav Offset */}
            <div className="pt-24 pb-12 px-6 md:px-12 max-w-[1200px] mx-auto">

                <Link href="/store" className="inline-flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Back to Store</span>
                </Link>

                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight">🛒 Add To Cart</h1>
                        <p className="text-white/40 mt-2">🛒 {cartItems.length} items in your selection</p>
                    </div>
                    <ShoppingBag className="w-12 h-12 text-white/5 hidden sm:block" />
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-8 h-8 text-white/20" />
                        </div>
                        <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
                        <p className="text-white/40 mb-8">Looks like you haven't added any magazines yet.</p>
                        <Link href="/store" className="bg-amber-400 text-zinc-950 font-bold px-8 py-3 rounded-xl hover:bg-amber-300 transition-all">
                            Browse Collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-6 flex gap-6 items-center transition-all hover:bg-zinc-900/60 hover:border-white/10"
                                >
                                    {/* Magazine Cover Preview */}
                                    <div className="w-20 h-28 md:w-24 md:h-32 bg-zinc-800 rounded-lg overflow-hidden shrink-0 shadow-xl">
                                        <img
                                            src={item.magazine.coverImage}
                                            alt={item.magazine.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h2 className="font-serif text-lg md:text-xl font-medium truncate mb-1">
                                                    {item.magazine.title}
                                                </h2>

                                                {/* Stock Status Section */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Box className="w-3.5 h-3.5 text-amber-400/60" />
                                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${item.magazine.stock > 0 ? "text-emerald-400" : "text-rose-400"
                                                        }`}>
                                                        {item.magazine.stock > 0
                                                            ? `${item.magazine.stock} Units in Stock`
                                                            : "Out of Stock"}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="font-mono text-lg text-amber-400 font-bold">₹{item.magazine.price}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xs text-white/30 font-medium">Monthly Subscription</span>

                                            <form action={removeFromCart.bind(null, item.id)}>
                                                <button
                                                    type="submit"
                                                    className="flex items-center gap-2 text-white/20 hover:text-rose-400 transition-colors py-2 px-3 rounded-lg hover:bg-rose-400/5"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-tighter">Remove</span>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <h3 className="font-serif text-2xl mb-6">Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-white/40 text-sm">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="font-mono">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-white/40 text-sm">
                                        <span>Processing Fee</span>
                                        <span className="text-emerald-400 font-mono">FREE</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex justify-between items-end">
                                        <span className="text-lg font-medium">Total</span>
                                        <span className="text-2xl font-mono text-amber-400 font-bold">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/store/checkout"
                                    className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-amber-400/10"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    CHECKOUT NOW
                                </Link>

                                <p className="text-[10px] text-center text-white/20 mt-6 uppercase tracking-[2px] font-bold">
                                    Secure SSL Encryption Included
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}