
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Users, CreditCard, Settings, LogOut, PlusCircle } from "lucide-react"

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

  if (
    decoded.role === "USER" &&
    children?.toString().includes("admin")
  ) {
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
    { href: "/dashboard/user/billing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/user/cart", label: "Cart", icon: CreditCard },
  ]

  const navItems = isAdmin ? adminNav : userNav

  return (
    <div className="flex min-h-screen bg-zinc-950 text-stone-100">

      {/* Sidebar */}
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

        {/* Role badge */}
        <div className="px-6 pt-6 pb-2">
          <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase font-semibold px-2.5 py-1 rounded-full
            ${isAdmin ? "bg-violet-500/10 text-violet-400" : "bg-amber-500/10 text-amber-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-violet-400" : "bg-amber-400"}`} />
            {isAdmin ? "Admin" : "Member"}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-stone-100 hover:bg-white/5 transition-all duration-150 group"
            >
              <Icon className="w-4 h-4 shrink-0 group-hover:text-amber-400 transition-colors duration-150" strokeWidth={1.5} />
              {label}
            </Link>
          ))}

          {/* Admin quick action */}
          {isAdmin && (
            <>
              <div className="h-px bg-white/5 my-3 mx-1" />
              <Link
                href="/dashboard/admin/magazines/add"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400 hover:bg-amber-400/10 transition-all duration-150 group"
              >
                <PlusCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                Add Magazine
              </Link>
            </>
          )}
        </nav>

        {/* Bottom user section */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 text-xs font-bold shrink-0">
              {decoded.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-200 truncate">{decoded.email}</p>
              <p className="text-[10px] text-white/30 capitalize">{decoded.role?.toLowerCase()}</p>
            </div>
          </div>

          <LogoutButton />

        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-5 py-4 bg-zinc-950/90 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center">
            <BookOpen className="w-3 h-3 text-zinc-950" strokeWidth={2.5} />
          </div>
          <span className="font-serif text-base font-bold">Pressly</span>
        </Link>
        <span className={`text-[10px] tracking-[2px] uppercase font-semibold px-2 py-0.5 rounded-full
          ${isAdmin ? "bg-violet-500/10 text-violet-400" : "bg-amber-500/10 text-amber-400"}`}>
          {isAdmin ? "Admin" : "Member"}
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-16">
        {children}
      </main>
    </div>
  )
}



// import UserSidebar from "@/app/components/user/UserSidebar";
// import UserNavbar from "@/app/components/user/UserNavbar";

// export default function UserLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
      
//       {/* Sidebar */}
//       <UserSidebar />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <UserNavbar />
//         <main className="p-6">{children}</main>
//       </div>

//     </div>
//   );
// }