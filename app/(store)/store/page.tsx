

import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import { BookOpen, ShoppingCart, LogOut, Flame, Sparkles } from "lucide-react"
import StoreSearch from "@/app/components/user/StoreSearchProps"
import { getUserFromToken } from "@/app/lib/auth"
import { addToCart } from "@/app/actions/cart.actions"
import { unstable_cache } from "next/cache"
import Image from "next/image" // Use Next.js Image!
import LogoutButton from "@/app/components/logout-btn"
// Cache the magazine fetch for 1 hour
const getMagazines = unstable_cache(
  async () => {
    return prisma.magazine.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })
  },
  ["magazines-list"],
  { revalidate: 3600 }
)

export default async function StorePage() {
  // Start fetching magazines and user auth in parallel
  const magazinesPromise = getMagazines()
  const userPromise = getUserFromToken()

  const [magazines, user] = await Promise.all([magazinesPromise, userPromise])

  let subscribedIds = new Set<string>()
  let cartItemsCount = 0

  // Only fetch user-specific DB data if user is logged in
  if (user) {
    const [subscriptions, cartCount] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId: user.id, isActive: true, paymentStatus: "APPROVED" },
        select: { magazineId: true }
      }),
      prisma.cart.count({ where: { userId: user.id } })
    ])
    subscribedIds = new Set(subscriptions.map(s => s.magazineId))
    cartItemsCount = cartCount
  }

  const featured = magazines[0]

  return (
    <div className="bg-zinc-950 text-stone-100 min-h-screen selection:bg-amber-400 selection:text-zinc-950">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-3">

          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center transition-all group-hover:rotate-6">
              <BookOpen className="w-5 h-5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tighter hidden lg:block">Pressly</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 ml-8 mr-auto">
            <Link href="#trending" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all">
              <Flame className="w-4 h-4" />
              <span>Trending</span>
            </Link>
          </div>

          <div className="flex-1 max-w-sm px-4">
            <StoreSearch magazines={magazines} subscribedIds={subscribedIds} />
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-4">
            {user ? (
              <>
                <Link href="/dashboard/user/cart" className="relative p-2.5 rounded-xl text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all">
                  <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-zinc-950">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                <Link
                  href={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 text-xs font-black">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-white/60 hidden md:block">Account</span>
                </Link>

                <LogoutButton />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-white/40 hover:text-white px-2 transition-colors">Sign in</Link>
                <Link href="/register" className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider">
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-[68px]">
        {/* ── Hero ── */}
        {featured && (
          <section className="relative h-[80vh] w-full overflow-hidden">
          <Image
  src={featured.coverImage}
  alt={featured.title}
  fill
  priority // Tells Next.js to load this immediately (LCP optimization)
  sizes="100vw" // Helps the browser allocate memory for a full-width image
  className="object-cover object-[center_30%]"
/>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-24 left-6 md:left-16 max-w-3xl">
              <h1 className="font-serif text-5xl md:text-7xl font-normal leading-none tracking-tighter mb-8 text-white">
                {featured.title}
              </h1>
              <div className="flex items-center gap-4">
                <Link
                  href={subscribedIds.has(featured.id) ? `/dashboard/read/${featured.slug}` : `/store/${featured.slug}`}
                  className="bg-amber-400 hover:bg-white text-zinc-950 font-black px-10 py-4 rounded-2xl text-sm transition-all uppercase tracking-widest shadow-2xl"
                >
                  {subscribedIds.has(featured.id) ? "Continue Reading" : "Explore Issue"}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Sections ── */}
        <div className="py-16 space-y-20">
          <Section id="trending" title="Trending Now" magazines={magazines.slice(0, 8)} subscribedIds={subscribedIds} />
          <Section id="new" title="New Arrivals" magazines={magazines.slice(8, 16)} subscribedIds={subscribedIds} />
        </div>
      </main>
    </div>
  )
}
function Section({ title, magazines, subscribedIds }: { title: string; magazines: any[]; subscribedIds: Set<string> }) {
  if (magazines.length === 0) return null;

  return (
    <div className="px-6 md:px-12">
      <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-100 mb-8">{title}</h2>
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
        {magazines.map((mag: any) => {
          // This check looks inside the Set we created in StorePage
          const isSubscribed = subscribedIds.has(mag.id);

          return (
            <div key={mag.id} className="snap-start relative min-w-[180px] md:min-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden group bg-zinc-900 border border-white/5 transition-all hover:border-amber-400/30">
             <Image 
    src={mag.coverImage} 
    alt={mag.title}
    fill // Replaces w-full h-full
    sizes="(max-width: 768px) 180px, 240px" // Prevents downloading oversized images
    className="object-cover group-hover:scale-110 transition-transform duration-700" 
  />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

              {/* Owned Badge */}
              {isSubscribed && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-xl">
                    Owned
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                <h3 className="text-base font-serif font-bold text-white mb-1 truncate">{mag.title}</h3>

                <p className="text-xs text-amber-400 font-bold mb-4">
                  {isSubscribed ? "Access Unlocked" : `₹${mag.price} / month`}
                </p>

                {/* Button Logic */}
            {/* Button Group */}
                <div className="grid grid-cols-1 gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {isSubscribed ? (
                    <Link
                      href={`/dashboard/read/${mag.slug}`}
                      className="w-full py-2.5 bg-white text-zinc-950 text-[10px] font-black uppercase text-center rounded-lg hover:bg-stone-200 transition-colors shadow-lg block"
                    >
                      Read Magazine
                    </Link>
                  ) : (
                    <>
                      {/* ADD TO CART BUTTON */}
                     {/* Replace your current form with this */}
<form action={addToCart}>
  <input type="hidden" name="magazineId" value={mag.id} />
  <button
    type="submit"
    className="w-full py-2.5 bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase text-center rounded-lg hover:bg-zinc-700 transition-colors shadow-lg flex items-center justify-center gap-2"
  >
    <ShoppingCart className="w-3 h-3" />
    Add to Cart
  </button>
</form>

                      {/* SUBSCRIBE BUTTON */}
                      <Link
                        href={`/store/${mag.slug}`}
                        className="w-full py-2.5 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase text-center rounded-lg hover:bg-amber-300 transition-colors shadow-lg block"
                      >
                        Subscribe Now
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}