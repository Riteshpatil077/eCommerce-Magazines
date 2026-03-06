





// // testing perfect working code
// import { prisma } from "@/app/lib/prisma"
// import Link from "next/link"
// import { BookOpen, ShoppingCart, LogOut, Flame, Sparkles } from "lucide-react"
// import StoreSearch from "@/app/components/user/StoreSearchProps"
// import { addToCart } from "@/app/actions/cart.actions"
// import { unstable_cache } from "next/cache"
// import Image from "next/image"
// import LogoutButton from "@/app/components/logout-btn"

// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"
// import MagazineSlider from "@/app/components/user/MagazineSlider"



// // Cache the magazine fetch for 1 hour
// const getMagazines = unstable_cache(
//   async () => {
//     return prisma.magazine.findMany({
//       where: { isActive: true },
//       orderBy: { createdAt: "desc" },
//     })
//   },
//   ["magazines-list"],
//   { revalidate: 120 }
// )

// export default async function StorePage() {
//   // 1. Setup Auth (Same as your Profile Page)
//   const cookieStore = await cookies()
//   const token = cookieStore.get("token")?.value
//   let user = null

//   if (token) {
//     try {
//       const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
//       // This fetch ensures we get the NAME from the database
//       user = await prisma.user.findUnique({
//         where: { id: decoded.id },
//       })
//     } catch (err) {
//       console.error("Auth error:", err)
//     }
//   }

//   // 2. Fetch magazines
//   const magazines = await getMagazines()

//   let subscribedIds = new Set<string>()
//   let cartItemsCount = 0

//   // 3. Fetch User-specific data (Cart and Subscriptions)
//   if (user) {
//     const [subscriptions, cartCount] = await Promise.all([
//       prisma.subscription.findMany({
//         where: { userId: user.id, isActive: true, paymentStatus: "APPROVED" },
//         select: { magazineId: true }
//       }),
//       prisma.cart.count({ where: { userId: user.id } })
//     ])

//     subscribedIds = new Set(subscriptions.map(s => s.magazineId))
//     cartItemsCount = cartCount
//   }

//   const featured = magazines?.[0] ?? null

//   return (
//     <div className="bg-zinc-950 text-stone-100 min-h-screen selection:bg-amber-400 selection:text-zinc-950">
//       {/* ── Navbar ── */}
//       <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
//         <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-3">

//           <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
//             <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center transition-all group-hover:rotate-6">
//               <BookOpen className="w-5 h-5 text-zinc-950" strokeWidth={2.5} />
//             </div>
//             <span className="font-serif text-xl font-bold tracking-tighter hidden lg:block">
//               Pressly
//             </span>
//           </Link>

//           <div className="hidden md:flex items-center gap-1 ml-8 mr-auto">
//             <Link href="#trending" className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all">
//               <Flame className="w-4 h-4" />
//               <span>Trending</span>
//             </Link>
//           </div>

//           <div className="flex-1 max-w-sm px-4">
//             <StoreSearch magazines={magazines} subscribedIds={[...subscribedIds]} />
//           </div>

//           <div className="flex items-center gap-2 md:gap-4 ml-4">
//             {user ? (
//               <>
//                 <Link href="/dashboard/user/cart" className="relative p-2.5 rounded-xl text-white/40 hover:text-amber-400 hover:bg-white/5 transition-all">
//                   <ShoppingCart className="w-5 h-5" strokeWidth={2} />
//                   {cartItemsCount > 0 && (
//                     <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-zinc-950">
//                       {cartItemsCount}
//                     </span>
//                   )}
//                 </Link>

//                 <Link
//                   href={user.role === "ADMIN" ? "/dashboard/admin/profile" : "/dashboard/user/profile"}
//                   className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 text-xs font-black uppercase">
//                     {user?.name?.[0] || user.email?.[0] || 'U'}
//                   </div >
//                   <span className="text-xs font-medium text-white/60 hidden md:block">Account</span>
//                 </Link >

//                 <LogoutButton />
//               </>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <Link href="/login" className="text-sm font-medium text-white/40 hover:text-white px-2 transition-colors">
//                   Sign in
//                 </Link>
//                 <Link href="/register" className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider">
//                   Join
//                 </Link>
//               </div>
//             )
//             }
//           </div >

//         </div >
//       </nav >


//       <main className="pt-[68px]">
//         {
//           featured && (
//             <section className="relative h-[80vh] w-full overflow-hidden">

//               <Image
//                 src={featured.coverImage}
//                 alt={featured.title}
//                 fill
//                 priority
//                 sizes="100vw"
//                 className="object-cover object-[center_30%]"
//                 unoptimized
//               />

//               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

//               <div className="absolute bottom-24 left-6 md:left-16 max-w-3xl">

//                 <h1 className="font-serif text-5xl md:text-7xl font-normal leading-none tracking-tighter mb-8 text-white">
//                   {featured.title}
//                 </h1>

//                 <div className="flex items-center gap-4">
//                   <Link
//                     href={subscribedIds.has(featured.id) ? `/dashboard/read/${featured.slug}` : `/store/${featured.slug}`}
//                     className="bg-amber-400 hover:bg-white text-zinc-950 font-black px-10 py-4 rounded-2xl text-sm transition-all uppercase tracking-widest shadow-2xl"
//                   >
//                     {subscribedIds.has(featured.id) ? "Continue Reading" : "Explore Issue"}
//                   </Link>
//                 </div>

//               </div>

//             </section>
//           )
//         }

//         <div className="py-16 space-y-20">
//           <div className="py-16 space-y-20">
//             <MagazineSlider
//               id="trending"
//               title="Trending Now"
//               magazines={magazines.slice(0, 8)}
//               subscribedIds={subscribedIds}
//             />
//             <MagazineSlider
//               id="new"
//               title="New Arrivals"
//               magazines={magazines.slice(8, 16)}
//               subscribedIds={subscribedIds}
//             />
//           </div>
//         </div>

//       </main >
//     </div >
//   )
// }



// function Section({ id, title, magazines, subscribedIds }: { id: string; title: string; magazines: any[]; subscribedIds: Set<string> }) {

//   const mags = magazines || []

//   return (
//     <div id={id} className="px-6 md:px-12 scroll-mt-24">

//       <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-100 mb-8">
//         {title}
//       </h2>

//       <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">

//         {
//           mags.length > 0 ? (
//             mags.map((mag) => {

//               const isSubscribed = subscribedIds.has(mag.id)

//               return (
//                 <div key={mag.id} className="snap-start relative min-w-[180px] md:min-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden group bg-zinc-900 border border-white/5 transition-all hover:border-amber-400/30">

//                   <Image
//                     src={mag.coverImage}
//                     alt={mag.title}
//                     fill
//                     sizes="(max-width: 768px) 180px, 240px"
//                     className="object-cover group-hover:scale-110 transition-transform duration-700"
//                     unoptimized
//                   />

//                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

//                   {isSubscribed && (
//                     <div className="absolute top-4 right-4 z-20">
//                       <div className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-xl">
//                         Owned
//                       </div>
//                     </div>
//                   )}

//                   <div className="absolute inset-x-0 bottom-0 p-5 z-10">

//                     <h3 className="text-base font-serif font-bold text-white mb-1 truncate">
//                       {mag.title}
//                     </h3>

//                     <p className="text-xs text-amber-400 font-bold mb-4">
//                       {isSubscribed ? "Access Unlocked" : `₹${mag.price}`}
//                     </p>

//                     <div className="grid grid-cols-1 gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">

//                       {isSubscribed ? (
//                         <Link href={`/dashboard/read/${mag.slug}`} className="w-full py-2.5 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase text-center rounded-lg block">
//                           Read Magazine
//                         </Link>
//                       ) : (
//                         <>
//                           <form action={addToCart}>
//                             <input type="hidden" name="magazineId" value={mag.id} />
//                             <button type="submit" className="w-full py-2.5 bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase text-center rounded-lg flex items-center justify-center gap-2">
//                               <ShoppingCart className="w-3 h-3" /> Add to Cart
//                             </button>
//                           </form>

//                           <Link href={`/store/${mag.slug}`} className="w-full py-2.5 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase text-center rounded-lg block">
//                             Subscribe Now
//                           </Link>
//                         </>
//                       )}

//                     </div>

//                   </div>
//                 </div>
//               )

//             })
//           ) : (
//             <div className="w-full py-10 text-center border border-dashed border-white/5 rounded-2xl text-white/20">
//               No magazines found in this section.
//             </div>
//           )}

//       </div>

//     </div>
//   )
// }
import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import { BookOpen, ShoppingCart, Flame } from "lucide-react"
import { addToCart } from "@/app/actions/cart.actions"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import LogoutButton from "@/app/components/logout-btn"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import StoreSearch from "@/app/components/user/StoreSearchProps"
import MagazineGrid from "@/app/components/store/Magazinegrid"

// Lean select + 2-min cache — never re-fetches 1000 rows on every request
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
    } catch {}
  }

  // All three fetches in parallel
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

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
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
                {!subSet.has(featured.id) && (
                  <form action={addToCart}>
                    <input type="hidden" name="magazineId" value={featured.id} />
                    <button type="submit" className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-stone-100 px-6 py-3.5 rounded-2xl text-sm transition-all">
                      <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
                      ₹{featured.price} / mo
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Section header ── */}
        <div id="trending" className="px-6 md:px-16 pt-14 pb-2 max-w-screen-xl mx-auto">
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-2 font-medium">
            <span className="w-5 h-px bg-amber-400 block" />
            All Publications
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
            Browse <em className="italic text-amber-400">{magazines.length.toLocaleString()}</em> Magazines
          </h2>
        </div>

        {/* ── Client grid — search, sort, infinite scroll ── */}
        <MagazineGrid magazines={magazines} subscribedIds={subscribedIds} />

      </main>
    </div>
  )
}