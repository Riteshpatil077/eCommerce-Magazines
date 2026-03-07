// "use client"

// import { logoutAction } from "@/app/actions/auth.actions"
// import { LogOut } from "lucide-react"

// export default function LogoutButton() {
//   return (
//     <form action={logoutAction} className="w-full">
//       <button
//         suppressHydrationWarning
//         type="submit"
//         className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 group"
//       >
//         <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
//         <span>Logout</span>
//       </button>
//     </form>
//   )
// }


"use client"

import { logoutAction } from "@/app/actions/auth.actions"
import { LogOut, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"

function LogoutContent() {
  const { pending } = useFormStatus()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      toast.success("Logged out successfully", {
        icon: '👋',
        style: {
          background: '#18181b',
          color: '#fafaf9',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      })
    }
    wasPending.current = pending
  }, [pending])

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 group disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
      )}
      <span>{pending ? "Logging out..." : "Logout"}</span>
    </button>
  )
}

export default function LogoutButton() {
  return (
    <form action={logoutAction} className="w-full">
      <LogoutContent />
    </form>
  )
}