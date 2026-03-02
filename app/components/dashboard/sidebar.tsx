"use client"

import Link from "next/link"
import { LayoutDashboard, BookOpen, Users, CreditCard } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  const menu = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Magazines", href: "/dashboard/admin/magazines", icon: BookOpen },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
  ]

  return (
    <aside className="w-64 bg-white shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      <nav className="space-y-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === item.href
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