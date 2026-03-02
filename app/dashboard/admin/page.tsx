
import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import { Users, BookOpen, CreditCard, TrendingUp, ArrowUpRight, Plus } from "lucide-react"

export default async function AdminDashboard() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value 

  if (!token) {
    redirect("/login")
  }

  let user: any

  try {
    user = jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    redirect("/login")
  }

  if (user.role !== "ADMIN") {
    redirect("/store")
  }


  const users = await prisma.user.count()
  const magazines = await prisma.magazine.count()
  const payments = await prisma.subscription.count()

  const stats = [
    {
      title: "Total Users",
      value: users,
      icon: Users,
      change: "+12%",
      description: "Registered accounts",
      accent: "from-violet-500/20 to-violet-500/5",
      iconBg: "bg-violet-500/10 text-violet-400",
      border: "border-violet-500/10",
    },
    {
      title: "Total Magazines",
      value: magazines,
      icon: BookOpen,
      change: "+3%",
      description: "Active publications",
      accent: "from-amber-500/20 to-amber-500/5",
      iconBg: "bg-amber-500/10 text-amber-400",
      border: "border-amber-500/10",
    },
    {
      title: "Total Subscriptions",
      value: payments,
      icon: CreditCard,
      change: "+18%",
      description: "Active subscribers",
      accent: "from-emerald-500/20 to-emerald-500/5",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      border: "border-emerald-500/10",
    },
  ]


  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
            <span className="block w-6 h-px bg-amber-400" />
            Admin Panel
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-stone-100 tracking-tight">
            Dashboard <em className="italic text-white/30">Overview</em>
          </h1>
          <p className="mt-2 text-sm text-white/30">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className={`relative group rounded-2xl bg-zinc-900 border ${stat.border} overflow-hidden p-6 hover:border-white/10 transition-all duration-300`}
            >
              {/* Gradient glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-60 pointer-events-none`} />

              {/* Top row */}
              <div className="relative flex items-start justify-between mb-6">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>

              {/* Value */}
              <div className="relative">
                <p className="font-serif text-4xl font-bold text-stone-100 tracking-tight mb-1">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-white/40 font-light tracking-wide">{stat.description}</p>
              </div>

              {/* Bottom label */}
              <div className="relative mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-xs font-medium text-white/50 tracking-wide">{stat.title}</p>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors duration-200" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}