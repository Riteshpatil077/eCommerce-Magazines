"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Loader2, Trash2, RefreshCcw, Calendar } from "lucide-react"

type Subscription = {
  id: string
  paymentStatus: string
  isActive: boolean
  expiryDate: string | null
  user: { email: string }
  magazine: { title: string }
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function fetchSubs() {
    const res = await fetch("/api/admin/subscriptions")
    const data = await res.json()
    setSubs(data)
    setLoading(false)
  }

  useEffect(() => { fetchSubs() }, [])

  async function updateSubscription(id: string, updates: any) {
    setUpdatingId(id)
    try {
      await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      await fetchSubs()
    } finally {
      setUpdatingId(null)
    }
  }

  // CUMULATIVE APPROVAL LOGIC
  const handleApprove30Days = (sub: Subscription) => {
    const currentExpiry = sub.expiryDate ? new Date(sub.expiryDate).getTime() : Date.now();
    // If current expiry is in the future, add 30 days to it. Otherwise, add to today.
    const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
    const newExpiry = new Date(baseTime + 30 * 24 * 60 * 60 * 1000);

    updateSubscription(sub.id, { 
      paymentStatus: "SUCCESS", 
      isActive: true, 
      expiryDate: newExpiry 
    });
  }

  async function deleteSubscription(id: string) {
    if (!confirm("Are you sure? This user will lose access immediately.")) return
    setUpdatingId(id)
    try {
      await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" })
      await fetchSubs()
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-amber-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif">
              Subscription <span className="text-amber-400 italic">Management</span>
            </h1>
            <p className="text-white/40 text-sm mt-2">Manage user access and payment approvals</p>
          </div>
          <button 
            onClick={fetchSubs}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <RefreshCcw className={`w-5 h-5 ${updatingId ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-white/[0.02] text-white/30 uppercase text-[10px] tracking-[2px] font-bold">
              <tr>
                <th className="p-5 text-left">User Detail</th>
                <th className="p-5 text-left">Magazine</th>
                <th className="p-5 text-left">Payment</th>
                <th className="p-5 text-left">Access</th>
                <th className="p-5 text-left">Expiry Date</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {subs.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-5 font-medium">{sub.user.email}</td>
                  <td className="p-5 text-white/70">{sub.magazine.title}</td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      sub.paymentStatus === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" :
                      sub.paymentStatus === "FAILED" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {sub.paymentStatus}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                       {sub.isActive ? <CheckCircle2 className="text-emerald-400 w-4 h-4" /> : <XCircle className="text-white/20 w-4 h-4" />}
                       <span className={sub.isActive ? "text-emerald-400" : "text-white/20"}>
                        {sub.isActive ? "Active" : "Revoked"}
                       </span>
                    </div>
                  </td>
                  <td className="p-5 text-white/50 font-mono text-xs">
                    {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString('en-GB') : "LIFETIME"}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      {/* CUMULATIVE APPROVE BUTTON */}
                      <button
                        onClick={() => handleApprove30Days(sub)}
                        disabled={updatingId === sub.id}
                        className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                        title="Add 30 Days"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => updateSubscription(sub.id, { isActive: !sub.isActive })}
                        className="px-3 py-1 text-xs bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
                      >
                        {sub.isActive ? "Revoke" : "Grant"}
                      </button>

                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}