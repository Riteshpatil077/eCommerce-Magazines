"use client"

import { logoutAction } from "@/app/actions/auth.actions" 
import { LogOut } from "lucide-react"

export default function LogoutButton() {
  return (
    <form action={logoutAction} className="w-full">
      <button 
        type="submit"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 group"
      >
        <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
        <span>Logout</span>
      </button>
    </form>
  )
}