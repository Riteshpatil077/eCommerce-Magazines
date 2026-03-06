"use client"

import { Trash2, Loader2 } from "lucide-react"
import { deleteUser } from "@/app/lib/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteUserButton({ userId }: { userId: string }) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) return

        setIsPending(true)

        try {
            const result = await deleteUser(userId)

            if (result.success) {
                // This forces the Server Component to re-run and fetch the new user list
                router.refresh()
            } else {
                alert(result.error)
            }
        } catch (err) {
            alert("An unexpected error occurred.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    )
}