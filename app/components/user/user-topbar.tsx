"use client"

import { Bell } from "lucide-react"
import LogoutButton from "../loguot-btn"


export default function UserTopbar() {
  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-4">
      <h2 className="text-lg font-semibold">User Dashboard</h2>

      <div className="flex items-center gap-4">
        <Bell />
        <LogoutButton />
      </div>
    </header>
  )
}