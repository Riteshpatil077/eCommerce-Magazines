"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function StatusToggle({ id, initialStatus }: { id: string; initialStatus: boolean }) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/magazines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        setIsActive(!isActive);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 text-[10px] tracking-[1.5px] uppercase font-semibold px-2.5 py-1 rounded-full transition-all duration-200
        ${isActive 
          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
          : "bg-zinc-700/60 text-white/30 hover:bg-zinc-700/80"}`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-white/20"}`} />
      )}
      {isActive ? "Active" : "Inactive"}
    </button>
  );
}