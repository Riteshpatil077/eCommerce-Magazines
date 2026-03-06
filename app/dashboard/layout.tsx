
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Users, CreditCard, PlusCircle, User, ChevronDown } from "lucide-react"

import LogoutButton from "../components/logout-btn"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) redirect("/login")

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

  // Admin route protection
  if (decoded.role === "USER" && children?.toString().includes("admin")) {
    redirect("/dashboard/user")
  }

  const isAdmin = decoded.role === "ADMIN"

  const adminNav = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/magazines", label: "Magazines", icon: BookOpen },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  ]

  const userNav = [
    { href: "/dashboard/user", label: "My Library", icon: BookOpen },
    { href: "/store", label: "Browse Store", icon: LayoutDashboard },
    { href: "/store/checkout", label: "Billing", icon: CreditCard },
    { href: "/dashboard/user/cart", label: "Cart", icon: CreditCard },
  ]

  const navItems = isAdmin ? adminNav : userNav
  const userInitial = decoded.email?.[0]?.toUpperCase() ?? "U"

  return (
    <div className="flex min-h-screen bg-zinc-950 text-stone-100">

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/5 bg-zinc-900/50">

        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-stone-100">
              Pressly
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          <p className="px-4 mb-2 text-[10px] uppercase tracking-[2px] text-white/20 font-bold">Menu</p>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-stone-100 hover:bg-white/5 transition-all group"
            >
              <Icon className="w-4 h-4 shrink-0 group-hover:text-amber-400 transition-colors" strokeWidth={1.5} />
              {label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="h-px bg-white/5 my-4 mx-2" />
              <p className="px-4 mb-2 text-[10px] uppercase tracking-[2px] text-white/20 font-bold">Actions</p>
              <Link
                href="/dashboard/admin/magazines/add"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-400/10 transition-all group"
              >
                <PlusCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                Add Magazine
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header - Desktop & Mobile */}
        <header className="h-16 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">

          {/* Mobile Logo (Shown only on small screens) */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-base font-bold">Pressly</span>
          </div>

          {/* Page Indicator (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3">
            <span className={`text-[10px] tracking-[2px] uppercase font-bold px-2.5 py-1 rounded-md border
              ${isAdmin ? "bg-violet-500/5 text-violet-400 border-violet-500/10" : "bg-amber-500/5 text-amber-400 border-amber-500/10"}`}>
              {isAdmin ? "Admin Space" : "Member Portal"}
            </span>
          </div>

          {/* User Profile Section (Right Side) */}
          <div className="flex items-center gap-4">
            <div className="group relative">
              <button suppressHydrationWarning className="flex items-center gap-3 p-1.5 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                <div className="flex flex-col items-end hidden sm:block">
                  <p className="text-xs font-medium text-stone-200 leading-none">{decoded.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-white/30 mt-1 capitalize">{decoded.role?.toLowerCase()}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 text-xs font-bold ring-2 ring-zinc-950">
                  {userInitial}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors" />
              </button>

              {/* Dropdown Menu (Appears on Hover) */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Account</p>
                    <p className="text-xs text-white/60 truncate">{decoded.email}</p>
                  </div>

                  <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>

                  <div className="h-px bg-white/5 my-1" />

                  <div className="px-1 py-1">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}



