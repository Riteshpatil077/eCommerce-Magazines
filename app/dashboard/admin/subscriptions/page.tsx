"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

type Subscription = {
  id: string
  paymentStatus: string
  isActive: boolean
  expiryDate: string | null
  createdAt: string
  user: {
    email: string
  }
  magazine: {
    title: string
  }
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

  useEffect(() => {
    fetchSubs()
  }, [])

  async function updateSubscription(id: string, updates: any) {
    setUpdatingId(id)
    await fetch(`/api/admin/subscriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    await fetchSubs()
    setUpdatingId(null)
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
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-serif mb-8">
          Subscription <span className="text-amber-400 italic">Management</span>
        </h1>

        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-white/50 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Magazine</th>
                <th className="p-4 text-left">Payment</th>
                <th className="p-4 text-left">Active</th>
                <th className="p-4 text-left">Expiry</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id} className="border-t border-white/5">

                  <td className="p-4">{sub.user.email}</td>

                  <td className="p-4">{sub.magazine.title}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sub.paymentStatus === "SUCCESS"
                          ? "bg-green-500/10 text-green-400"
                          : sub.paymentStatus === "FAILED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {sub.paymentStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    {sub.isActive ? (
                      <CheckCircle2 className="text-green-400 w-5 h-5" />
                    ) : (
                      <XCircle className="text-red-400 w-5 h-5" />
                    )}
                  </td>

                  <td className="p-4">
                    {sub.expiryDate
                      ? new Date(sub.expiryDate).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="p-4 flex gap-2">

                    <button
                      onClick={() =>
                        updateSubscription(sub.id, {
                          isActive: !sub.isActive,
                        })
                      }
                      className="px-3 py-1 text-xs bg-amber-400 text-zinc-950 rounded-lg hover:bg-amber-300 transition"
                    >
                      {updatingId === sub.id ? "..." : "Toggle"}
                    </button>

                    <button
                      onClick={() =>
                        updateSubscription(sub.id, {
                          paymentStatus: "SUCCESS",
                          isActive: true,
                          expiryDate: new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000
                          ),
                        })
                      }
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
                    >
                      Approve 30d
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {subs.length === 0 && (
            <div className="p-8 text-center text-white/30">
              No subscriptions found.
            </div>
          )}

        </div>
      </div>
    </div>
  )
}