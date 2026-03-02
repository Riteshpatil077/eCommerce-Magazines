"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard/user" },
    { name: "My Subscriptions", href: "/dashboard/user/subscriptions" },
    { name: "Profile", href: "/dashboard/user/profile" },
  ];

  return (
    <div className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-6 text-xl font-bold border-b">
        User Panel
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}