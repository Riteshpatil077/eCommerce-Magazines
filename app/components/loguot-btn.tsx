"use client"

import { logoutAction } from "@/app/actions/auth.actions"

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="text-red-600">Logout</button>
    </form>
  )
}