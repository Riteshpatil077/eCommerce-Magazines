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

