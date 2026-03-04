import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Link from "next/link"
import { addToCart } from "@/app/actions/cart.actions"
import { BookOpen, ShoppingCart, LogOut, LayoutDashboard } from "lucide-react"
import StoreSearch from "@/app/components/user/StoreSearchProps"

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return null
  }
}

export default async function StorePage() {
  const user: any = await getUserFromToken()

  const magazines = await prisma.magazine.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })

  let subscriptions: any[] = []
  if (user) {
    subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id, isActive: true },
    })
  }

  const subscribedIds = new Set(subscriptions.map((sub) => sub.magazineId))
  const featured = magazines[0]

  return (
    <div className="bg-zinc-950 text-stone-100 min-h-screen selection:bg-amber-400 selection:text-zinc-950">

      {/* ── Fixed Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight hidden sm:block">Pressly</span>
          </Link>

          {/* Center Search - Moved into the flex flow */}
          <div className="flex-1 max-w-md px-6">
            <StoreSearch
              magazines={magazines}
              subscribedIds={subscribedIds}
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 text-sm text-white/40 mr-4">
              <Link href="/store" className="text-amber-400 font-medium">Store</Link>
              <Link href="#trending" className="hover:text-stone-100 transition-colors">Trending</Link>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/cart" className="relative p-2 rounded-xl text-white/30 hover:text-stone-100 hover:bg-white/5 transition-all">
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                </Link>

                <div className="h-4 w-px bg-white/10" />

                <Link
                  href={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"}
                  className="flex items-center gap-2 px-1 rounded-xl text-sm text-white/40 hover:text-stone-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 text-xs font-bold">
                    {user.email?.[0]?.toUpperCase() ?? "U"}
                  </div>
                </Link>

                <Link href="/api/auth/logout" className="p-2 text-white/20 hover:text-red-400 transition-colors" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hidden sm:block text-sm text-white/40 hover:text-stone-100 transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm px-5 py-2 rounded-xl transition-all">
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main Content Area (pt-20 fixes the navbar overlap) ── */}
      <main className="pt-16">

        {/* ── Hero Section (Fixed "Spread" Image) ── */}
        {featured && (
          <section className="relative h-[70vh] md:h-[85vh] w-full bg-zinc-900">
            {/* Image with better cropping constraints */}
            <img
              src={featured.coverImage}
              alt={featured.title}
              className="w-full h-full object-cover object-[center_20%]"
            />

            {/* Layered Gradients for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/20 to-transparent" />

            <div className="absolute bottom-20 left-6 md:left-16 max-w-2xl">
              <p className="flex items-center gap-2 text-[10px] tracking-[4px] uppercase text-amber-400 mb-4 font-bold">
                <span className="block w-8 h-px bg-amber-400" />
                Featured Publication
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-normal leading-tight tracking-tighter mb-4 text-stone-100">
                {featured.title}
              </h1>
              {featured.description && (
                <p className="text-base text-white/60 mb-8 font-light leading-relaxed max-w-md line-clamp-3">
                  {featured.description}
                </p>
              )}

              <div className="flex items-center gap-4">
                <Link
                  href={`/store/${featured.slug}`}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-transform active:scale-95"
                >
                  <BookOpen className="w-4 h-4" strokeWidth={2.5} />
                  {subscribedIds.has(featured.id) ? "Read Edition" : "Explore Issue"}
                </Link>

                {!subscribedIds.has(featured.id) && (
                  <form action={addToCart}>
                    <input type="hidden" name="magazineId" value={featured.id} />
                    <button type="submit" className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl text-sm transition-all active:scale-95">
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      ₹{featured.price} <span className="text-white/40">/mo</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Content Sections ── */}
        <div className="space-y-10 py-10">
          <div id="trending">
            <Section title="Trending Now" magazines={magazines.slice(0, 8)} subscribedIds={subscribedIds} />
          </div>
          <div id="new" className="pb-20">
            <Section title="New Releases" magazines={magazines.slice(8, 16)} subscribedIds={subscribedIds} />
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({ title, magazines, subscribedIds }: {
  title: string
  magazines: any[]
  subscribedIds: Set<string>
}) {
  if (magazines.length === 0) return null

  return (
    <div className="px-6 md:px-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-100">{title}</h2>
        <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
        <span className="text-xs font-mono text-white/20 uppercase tracking-widest">{magazines.length} Issues</span>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
        {magazines.map((mag: any) => {
          const isSubscribed = subscribedIds.has(mag.id)
          return (
            <div key={mag.id} className="snap-start relative min-w-[180px] md:min-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden group bg-zinc-900 border border-white/5 transition-all hover:border-amber-400/30">
              {/* Image Container */}
              <div className="absolute inset-0">
                <img src={mag.coverImage} alt={mag.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Status Badge */}
              {isSubscribed && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-md shadow-xl uppercase tracking-tighter">
                    Owned
                  </div>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                <h3 className="text-base font-serif font-bold text-white mb-1 truncate">{mag.title}</h3>
                <p className="text-xs text-amber-400 font-bold mb-4">₹{mag.price} / mo</p>

                <div className="grid grid-cols-1 gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Link href={`/store/${mag.slug}`} className="w-full py-2.5 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase text-center rounded-lg hover:bg-amber-300 transition-colors">
                    {isSubscribed ? "Open Reader" : "Subscribe"}
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}