"use client"

import { Bell, User } from "lucide-react"
import LogoutButton from "@/components/logout-button"

export default function Topbar() {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-4">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />
        <User className="cursor-pointer" />
        <LogoutButton />
      </div>
    </header>
  )
}