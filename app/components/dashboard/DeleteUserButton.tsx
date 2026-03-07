"use client"

import { Trash2, Loader2 } from "lucide-react"
import { deleteUser } from "@/app/lib/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function DeleteUserButton({ userId }: { userId: string }) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) return

        const toastId = toast.loading("Deleting user...")
        setIsPending(true)

        try {
            const result = await deleteUser(userId)

            if (result.success) {
                toast.success("User deleted successfully", { id: toastId })
                router.refresh()
            } else {
                toast.error(result.error || "Failed to delete user", { id: toastId })
            }
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId })
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