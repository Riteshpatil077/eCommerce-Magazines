import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, BookOpen, CreditCard, TrendingUp, ArrowUpRight, Plus, LayoutDashboard, Settings, FileText } from "lucide-react"

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) redirect("/login")

  let user: any
  try {
    user = jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    redirect("/login")
  }

  if (user.role !== "ADMIN") redirect("/store")

  // Fetch Stats
  const usersCount = await prisma.user.count()
  const magazinesCount = await prisma.magazine.count()
  const subscriptionsCount = await prisma.subscription.count()

  // Fetch Recent Subscriptions for the "Recent Activity" list
  const recentSubs = await prisma.subscription.findMany({
    take: 5,
    orderBy: { id: 'desc' }, // Assuming higher ID or add createdAt if you have it
    include: { user: true, magazine: true }
  })

  const stats = [
    {
      title: "Total Users",
      value: usersCount,
      icon: Users,
      change: "+12%",
      description: "Registered accounts",
      accent: "from-violet-500/20 to-violet-500/5",
      iconBg: "bg-violet-500/10 text-violet-400",
      border: "border-violet-500/10",
    },
    {
      title: "Total Magazines",
      value: magazinesCount,
      icon: BookOpen,
      change: "+3%",
      description: "Active publications",
      accent: "from-amber-500/20 to-amber-500/5",
      iconBg: "bg-amber-500/10 text-amber-400",
      border: "border-amber-500/10",
    },
    {
      title: "Total Subscriptions",
      value: subscriptionsCount,
      icon: CreditCard,
      change: "+18%",
      description: "Active subscribers",
      accent: "from-emerald-500/20 to-emerald-500/5",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      border: "border-emerald-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-stone-100">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
              <span className="block w-6 h-px bg-amber-400" />
              Admin Panel
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
              Dashboard <em className="italic text-white/30">Overview</em>
            </h1>
            <p className="mt-2 text-sm text-white/30">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/magazines/new" className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-zinc-950 rounded-xl text-sm font-bold hover:bg-amber-300 transition-colors">
              <Plus className="w-4 h-4" />
              New Magazine
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className={`relative group rounded-2xl bg-zinc-900 border ${stat.border} overflow-hidden p-6 hover:border-white/10 transition-all duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60 pointer-events-none`} />
                <div className="relative flex items-start justify-between mb-6">
                  <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="relative">
                  <p className="font-serif text-4xl font-bold tracking-tight mb-1">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-white/40 font-light tracking-wide">{stat.description}</p>
                </div>
                <div className="relative mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs font-medium text-white/50 tracking-wide">{stat.title}</p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Navigation
          // <div className="lg:col-span-1 space-y-4">
          //   <h2 className="text-sm font-bold uppercase tracking-widest text-white/20 mb-4">Quick Actions</h2>
          //   <Link href="/admin/subscriptions" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/30 transition-all group">
          //     <div className="p-2 bg-amber-400/10 text-amber-400 rounded-lg group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors">
          //       <CreditCard className="w-5 h-5" />
          //     </div>
          //     <div>
          //       <p className="text-sm font-medium">Manage Subscriptions</p>
          //       <p className="text-[11px] text-white/30">Approve & Revoke access</p>
          //     </div>
          //   </Link>
          //   <Link href="/admin/magazines" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-400/30 transition-all group">
          //     <div className="p-2 bg-violet-400/10 text-violet-400 rounded-lg group-hover:bg-violet-400 group-hover:text-zinc-950 transition-colors">
          //       <FileText className="w-5 h-5" />
          //     </div>
          //     <div>
          //       <p className="text-sm font-medium">Magazine Library</p>
          //       <p className="text-[11px] text-white/30">Edit or remove issues</p>
          //     </div>
          //   </Link>
          // </div> */}

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/20 mb-4">Recent Activity</h2>
            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="px-6 py-4 font-bold">User</th>
                    <th className="px-6 py-4 font-bold">Magazine</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium">{sub.user.email}</p>
                        <p className="text-[10px] text-white/20 font-mono">{sub.id.slice(-6)}</p>
                      </td>
                      <td className="px-6 py-4 text-white/60">{sub.magazine.title}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter ${sub.paymentStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                          {sub.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href="/dashboard/admin/subscriptions" className="block w-full py-4 text-center text-xs text-white/20 hover:text-amber-400 transition-colors bg-white/[0.01]">
                View All Subscriptions
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}