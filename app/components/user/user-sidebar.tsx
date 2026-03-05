"use client"

import Link from "next/link"
import { LayoutDashboard, BookOpen, User } from "lucide-react"
import { usePathname } from "next/navigation"

export default function UserSidebar() {
  const pathname = usePathname()

  const menu = [
    { name: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
    { name: "My Subscriptions", href: "/dashboard/user/subscriptions", icon: BookOpen },
    { name: "Profile", href: "/dashboard/user/profile", icon: User },
  ]

  return (
    <aside className="w-64 bg-white shadow-lg p-6">
      <h1 className="text-xl font-bold mb-6">User Panel</h1>
      <nav className="space-y-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${pathname === item.href
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-200"
              }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

// "use client"

// import Link from "next/link"
// import { LayoutDashboard, BookOpen, User, LogOut } from "lucide-react"
// import { usePathname } from "next/navigation"

// const menu = [
//   { name: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
//   { name: "My Subscriptions", href: "/dashboard/user/subscriptions", icon: BookOpen },
//   { name: "Profile", href: "/dashboard/user/profile", icon: User },
// ]

// export default function UserSidebar() {
//   const pathname = usePathname()

//   return (
//     <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen border-r border-white/5 bg-zinc-900/50">

//       {/* Logo */}
//       <div className="px-6 py-7 border-b border-white/5">
//         <Link href="/" className="flex items-center gap-2.5 group">
//           <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
//             <BookOpen className="w-3.5 h-3.5 text-zinc-950" strokeWidth={2.5} />
//           </div>
//           <span className="font-serif text-lg font-bold tracking-tight text-stone-100">
//             Pressly
//           </span>
//         </Link>
//       </div>

//       {/* Role badge */}
//       <div className="px-6 pt-6 pb-2">
//         <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">
//           <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
//           Member
//         </span>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5">
//         {menu.map(({ name, href, icon: Icon }) => {
//           const isActive = pathname === href
//           return (
//             <Link
//               key={name}
//               href={href}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group
//                 ${isActive
//                   ? "bg-amber-400/10 text-amber-400 font-medium"
//                   : "text-white/40 hover:text-stone-100 hover:bg-white/5"
//                 }`}
//             >
//               <Icon
//                 className={`w-4 h-4 shrink-0 transition-colors duration-150
//                   ${isActive ? "text-amber-400" : "group-hover:text-amber-400"}`}
//                 strokeWidth={1.5}
//               />
//               {name}
//               {isActive && (
//                 <span className="ml-auto w-1 h-1 rounded-full bg-amber-400" />
//               )}
//             </Link>
//           )
//         })}
//       </nav>

//       {/* Sign out */}
//       <div className="p-4 border-t border-white/5">
//         <Link
//           href="/api/auth/logout"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/25 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 group"
//         >
//           <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
//           Sign out
//         </Link>
//       </div>
//     </aside>
//   )
// }