"use client"

import { Trash2, Loader2 } from "lucide-react"
import { deleteUser } from "@/app/lib/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
// 1. Import toast
import toast from "react-hot-toast"

export default function DeleteUserButton({ userId }: { userId: string }) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) return

        setIsPending(true)
        // 2. Start a loading toast
        const toastId = toast.loading("Processing request...")

        try {
            const result = await deleteUser(userId)

            if (result.success) {
                // 3. Update to success toast
                toast.success("User deleted successfully", { id: toastId })
                router.refresh()
            } else {
                // 4. Update to error toast with specific message
                toast.error(result.error || "Failed to delete user", { id: toastId })
            }
        } catch (err) {
            // 5. Update to generic error toast
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