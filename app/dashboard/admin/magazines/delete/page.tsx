"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast" 

export default function DeleteMagazineButton({ id, title }: { id: string, title: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    // Keep the confirm for safety, or you could build a custom modal later
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return

    const loadingToast = toast.loading(`Deleting "${title}"...`)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/magazines/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")
      
      // SUCCESS TOAST
      toast.success("Magazine deleted successfully", { id: loadingToast })
      
      router.refresh() 
    } catch (err) {
      // ERROR TOAST
      toast.error("Error deleting magazine", { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all duration-150 disabled:opacity-50"
      title="Delete Magazine"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}