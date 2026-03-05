import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { notFound, redirect } from "next/navigation"
import { subscribeAction } from "@/app/actions/subscription.actions"
import Link from "next/link"
import { ArrowLeft, BookOpen, Lock, CreditCard, CheckCircle } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

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

export default async function MagazinePage({ params }: PageProps) {
  const { slug } = await params
  const user: any = await getUserFromToken()
  if (!user) redirect("/login")

  const magazine = await prisma.magazine.findUnique({ where: { slug } })
  if (!magazine) return notFound()

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      magazineId: magazine.id,
      paymentStatus: "APPROVED",
      isActive: true,
    },
  })

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100">

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <Link
          href="/store"
          className="flex items-center gap-2 text-white/30 hover:text-white/70 text-sm transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Store
        </Link>

        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-3 h-3 text-zinc-950" strokeWidth={2.5} />
          </div>
          <span className="font-serif text-base font-bold">Pressly</span>
        </Link>

        {subscription && (
          <span className="flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            <CheckCircle className="w-3 h-3" strokeWidth={2} />
            Subscribed
          </span>
        )}
        {!subscription && <div className="w-24" />}
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">

        {/* Magazine header */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          {/* Cover */}
          <div className="shrink-0 w-36 md:w-44">
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
              <img
                src={magazine.coverImage}
                alt={magazine.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-end">
            <p className="text-[11px] tracking-[3px] uppercase text-amber-400 font-medium mb-3 flex items-center gap-2">
              <span className="block w-5 h-px bg-amber-400" />
              Publication
            </p>
            <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight leading-tight mb-3">
              {magazine.title}
            </h1>
            <p className="text-2xl font-serif text-amber-400 font-light mb-4">
              ₹{magazine.price}
              <span className="text-sm text-white/30 font-sans ml-1">/ month</span>
            </p>
            {subscription ? (
              <span className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4" strokeWidth={2} />
                You have full access to this magazine
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-white/30 font-light">
                <Lock className="w-4 h-4" strokeWidth={1.5} />
                Subscribe to unlock full access
              </span>
            )}
          </div>
        </div>

        {/* Content area */}
        {subscription ? (
          /* PDF Reader */
          <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-zinc-800/40">
              <p className="text-xs text-white/30 font-light tracking-wide">
                Reading — <span className="text-stone-300">{magazine.title}</span>
              </p>
              <a
                href={magazine.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[1px] text-amber-400 hover:text-amber-300 transition-colors duration-150"
              >
                Open in new tab ↗
              </a>
            </div>
            <iframe
              src={magazine.pdfUrl}
              className="w-full h-[75vh]"
            />
          </div>
        ) : (
          /* Subscribe gate */
          <div className="relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
            {/* Blurred preview hint */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/60 to-zinc-900 pointer-events-none z-10" />

            {/* Locked content overlay */}
            <div className="relative z-20 flex flex-col items-center text-center px-8 py-20">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
              </div>

              <h2 className="font-serif text-2xl font-normal mb-2">
                This issue is <em className="italic text-amber-400">locked</em>
              </h2>
              <p className="text-sm text-white/35 max-w-sm mb-8 font-light leading-relaxed">
                Subscribe to <span className="text-stone-300">{magazine.title}</span> to get instant access to this and all future issues.
              </p>

              {/* Perks */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 text-xs text-white/30">
                {["Instant access", "All future issues", "Cancel anytime"].map((perk) => (
                  <span key={perk} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60" strokeWidth={2} />
                    {perk}
                  </span>
                ))}
              </div>

              <form action={subscribeAction}>
                <input type="hidden" name="magazineId" value={magazine.id} />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-8 py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 group"
                >
                  <CreditCard className="w-4 h-4" strokeWidth={2} />
                  Subscribe for ₹{magazine.price} / month
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform duration-150" />
                </button>
              </form>

              <p className="text-[11px] text-white/20 mt-4">
                Secure payment · Cancel anytime
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



// //working code
// import { prisma } from "@/app/lib/prisma"
// import { cookies } from "next/headers"
// import jwt from "jsonwebtoken"
// import { notFound, redirect } from "next/navigation"
// import { subscribeAction } from "@/app/actions/subscription.actions"

// interface PageProps {
//   params: Promise<{ slug: string }>
// }

// async function getUserFromToken() {
//   const cookieStore = await cookies()
//   const token = cookieStore.get("token")?.value

//   if (!token) return null

//   try {
//     return jwt.verify(token, process.env.JWT_SECRET!)
//   } catch {
//     return null
//   }
// }

// export default async function MagazinePage({ params }: PageProps) {
//   const { slug } = await params
//   const user: any = await getUserFromToken()

//   if (!user) redirect("/login")
//   console.log("Slug received:", slug)
//   const magazine = await prisma.magazine.findUnique({
//     where: { slug },
//   })

//   if (!magazine) return notFound()

//   const subscription = await prisma.subscription.findFirst({
//     where: {
//       userId: user.id,
//       magazineId: magazine.id,
//       paymentStatus: "APPROVED",
//     },
//   })

//   return (
//     <div className="min-h-screen bg-gray-50 p-10">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

//         <h1 className="text-3xl font-bold mb-4">
//           {magazine.title}
//         </h1>

//         {subscription ? (
//           <iframe
//             src={magazine.pdfUrl}
//             className="w-full h-[600px] rounded-lg"
//           />
//         ) : (
//           <div>
//             <p className="mb-4 text-gray-600">
//               You need to subscribe to access this magazine.
//             </p>

//             <form action={subscribeAction}>
//               <input
//                 type="hidden"
//                 name="magazineId"
//                 value={magazine.id}
//               />
//               <button
//                 type="submit"
//                 className="bg-black text-white px-6 py-2 rounded-lg"
//               >
//                 Subscribe for ₹{magazine.price}
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



// import { prisma } from "@/app/lib/prisma"
// import { notFound } from "next/navigation"

// interface PageProps {
//   params: Promise<{
//     slug: string
//   }>
// }

// export default async function MagazinePage({ params }: PageProps) {
//   const { slug } = await params
//   const magazine = await prisma.magazine.findUnique({
//     where: { slug },
//   })

//   if (!magazine) return notFound()

//   return (
//     <div>
//       <h1>{magazine.title}</h1>
//       <p>{magazine.description}</p>
//       <p>₹{magazine.price}</p>
//     </div>
//   )
// }



