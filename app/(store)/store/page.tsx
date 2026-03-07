import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import { BookOpen, ShoppingCart, Flame } from "lucide-react"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import LogoutButton from "@/app/components/logout-btn"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import StoreSearch from "@/app/components/user/StoreSearchProps"
import MagazineGrid from "@/app/components/store/Magazinegrid"
import { AddToCartButton } from "@/app/components/cart/AddToCartButton"


const getMagazines = unstable_cache(
  async () => prisma.magazine.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      coverImage: true,
      description: true,
      stock: true,
      createdAt: true,
    },
  }),
  ["magazines-list"],
  { revalidate: 120 }
)

export default async function StorePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  let user = null

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
      user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true },
      })
    } catch { }
  }

  const [magazines, subscriptions, cartItemsCount] = await Promise.all([
    getMagazines(),
    user
      ? prisma.subscription.findMany({
        where: { userId: user.id, isActive: true, paymentStatus: "APPROVED" },
        select: { magazineId: true },
      })
      : Promise.resolve([]),
    user ? prisma.cart.count({ where: { userId: user.id } }) : Promise.resolve(0),
  ])

  const subscribedIds = subscriptions.map((s: any) => s.magazineId)
  const subSet = new Set(subscribedIds)
  const featured = magazines[0] ?? null

  return (
    <div className="bg-zinc-950 text-stone-100 min-h-screen selection:bg-amber-400 selection:text-zinc-950">

      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        {/* ... Navbar Content Unchanged ... */}
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-3 gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center transition-all group-hover:rotate-6">
              <BookOpen className="w-5 h-5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tighter hidden lg:block">Pressly</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3 ml-2">
            {user ? (
              <>
                <Link href="/dashboard/user/cart" className="relative p-2.5 rounded-xl text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all">
                  <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-zinc-950">
                      {cartItemsCount > 9 ? "9+" : cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link
                  href={user.role === "ADMIN" ? "/dashboard/admin/profile" : "/dashboard/user/profile"}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 text-xs font-black uppercase">
                    {user?.name?.[0] || user.email?.[0] || "U"}
                  </div>
                  <span className="text-xs font-medium text-white/60 hidden md:block">Account</span>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-white/40 hover:text-white px-2 transition-colors">Sign in</Link>
                <Link href="/register" className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider">Join</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-[65px]">
        {/* ── Hero ── */}
        {featured && (
          <section className="relative h-[80vh] w-full overflow-hidden">
            <Image src={featured.coverImage} alt={featured.title} fill priority sizes="100vw" className="object-cover object-[center_30%]" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent" />

            <div className="absolute bottom-20 left-6 md:left-16 max-w-2xl">
              <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-4 font-medium">
                <span className="w-5 h-px bg-amber-400 block" />
                Featured Issue
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-normal leading-none tracking-tighter mb-6 text-white">
                {featured.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={subSet.has(featured.id) ? `/dashboard/read/${featured.slug}` : `/store/${featured.slug}`}
                  className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black px-8 py-3.5 rounded-2xl text-sm transition-all uppercase tracking-widest"
                >
                  {subSet.has(featured.id) ? "Continue Reading" : "Explore Issue"}
                </Link>

                {!subSet.has(featured.id) && (featured.stock && featured.stock > 0) ? (
                  <AddToCartButton
                    magazineId={featured.id}
                    title={featured.title}
                    price={featured.price}
                    className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-stone-100 px-6 py-3.5 rounded-2xl text-sm transition-all"
                  />
                ) : !subSet.has(featured.id) ? (
                  <button disabled className="flex items-center gap-2 border border-white/5 bg-zinc-900/50 text-white/40 px-6 py-3.5 rounded-2xl text-sm cursor-not-allowed uppercase tracking-widest font-bold">
                    Out of Stock
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        )}

        <div id="trending" className="px-6 md:px-16 pt-14 pb-2 max-w-screen-xl mx-auto">
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-2 font-medium">
            <span className="w-5 h-px bg-amber-400 block" />
            All Publications
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
            Browse <em className="italic text-amber-400">{magazines.length.toLocaleString()}</em> Magazines
          </h2>
        </div>

        <MagazineGrid magazines={magazines} subscribedIds={subscribedIds} />
      </main>
    </div>
  )
}