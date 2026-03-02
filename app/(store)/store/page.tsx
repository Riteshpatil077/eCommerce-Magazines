import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Link from "next/link"
import UserSidebar from "@/app/components/user/user-sidebar"
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
    orderBy: { createdAt: "desc" },
  })

  let subscriptions: any[] = []
  if (user) {
    subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100">

     

      {/* Header */}
      <header className="relative px-8 md:px-16 pt-20 pb-14 border-b border-white/5 overflow-hidden">
        {/* Ghost watermark text */}
        <span className="pointer-events-none select-none absolute right-8 top-1/2 -translate-y-1/2 text-[10rem] md:text-[14rem] font-black text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.04)] leading-none tracking-tighter hidden md:block">
          STORE
        </span>

        <p className="flex items-center gap-3 text-[11px] tracking-[4px] uppercase text-amber-400 mb-5 font-medium">
          <span className="block w-8 h-px bg-amber-400" />
          Curated Publications
        </p>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight max-w-2xl">
          The World&apos;s Finest{" "}
          <em className="italic text-amber-400">Magazines,</em>
          <br />At Your Fingertips
        </h1>

        <p className="mt-6 text-sm text-white/30 font-light tracking-wide">
          {magazines.length} publication{magazines.length !== 1 ? "s" : ""} available
          {!user && " — Sign in to subscribe"}
        </p>
      </header>

      {/* Section label */}
      <div className="flex items-center gap-5 px-8 md:px-16 pt-10 pb-8 max-w-screen-xl mx-auto">
        <span className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] tracking-[3px] uppercase text-white/25">All Issues</span>
        <span className="h-px flex-1 bg-white/5" />
      </div>

      {/* Grid */}
      <main className="px-8 md:px-16 pb-24 max-w-screen-xl mx-auto">
        {magazines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/20">
            <span className="text-5xl mb-4">◻</span>
            <p className="font-serif text-xl">No publications yet</p>
            <p className="text-sm mt-2">Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {magazines.map((magazine, index) => {
              const isSubscribed = subscriptions.find(
                (sub) => sub.magazineId === magazine.id
              )
              const isFeatured = index === 0

              return (
                <div
                  key={magazine.id}
                  className={`group relative bg-zinc-950 overflow-hidden ${isFeatured ? "sm:col-span-2" : ""}`}
                >
                  {/* Image container */}
                  <div className={`relative overflow-hidden ${isFeatured ? "aspect-video" : "aspect-[3/4]"}`}>
                    <img
                      src={magazine.coverImage}
                      alt={magazine.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-50"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Subscribed badge */}
                    {isSubscribed && (
                      <span className="absolute top-4 right-4 bg-amber-400 text-zinc-950 text-[9px] font-semibold tracking-[2px] uppercase px-2.5 py-1 rounded-sm">
                        Subscribed
                      </span>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className={`font-serif font-bold leading-tight mb-1.5 text-stone-100 ${isFeatured ? "text-3xl" : "text-xl"}`}>
                      {magazine.title}
                    </h2>
                    <p className="text-amber-400 text-sm font-light tracking-wide mb-4">
                      ₹{magazine.price} / month
                    </p>

                    <Link
                      href={`/magazine/${magazine.id}`}
                      className={[
                        "block text-center py-2.5 text-[11px] tracking-[2.5px] uppercase font-medium rounded-sm",
                        "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                        "transition-all duration-300 ease-out",
                        isSubscribed
                          ? "bg-amber-400 text-zinc-950 hover:bg-amber-300"
                          : "bg-transparent text-stone-100 border border-white/30 hover:border-white/60 hover:bg-white/5",
                      ].join(" ")}
                    >
                      {isSubscribed ? "Read Now →" : "Subscribe"}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}