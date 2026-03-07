"use client"

import { useEffect, useState, useMemo } from "react"
import { CheckCircle2, XCircle, Loader2, Trash2, RefreshCcw, Calendar, Search } from "lucide-react"
import toast from "react-hot-toast" // ✅ Added toast import

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
  const [searchQuery, setSearchQuery] = useState("")

  async function fetchSubs(isRefresh = false) {
    try {
      if (!isRefresh) setLoading(true)
      const res = await fetch("/api/admin/subscriptions")

      if (!res.ok) throw new Error("Failed to fetch")

      const text = await res.text()
      if (!text) {
        setSubs([])
        return
      }

      const data = JSON.parse(text)
      setSubs(data)
      if (isRefresh) toast.success("Data synchronized") // ✅ Success toast on refresh
    } catch (error) {
      console.error("Fetch Error:", error)
      toast.error("Could not load subscriptions") // ✅ Error toast
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubs() }, [])

  const filteredSubs = useMemo(() => {
    return subs.filter((sub) => {
      const searchStr = searchQuery.toLowerCase();
      const statusText = sub.isActive ? "active" : "revoked";
      const paymentText = sub.paymentStatus.toLowerCase();

      return (
        sub.user.email.toLowerCase().includes(searchStr) ||
        sub.magazine.title.toLowerCase().includes(searchStr) ||
        paymentText.includes(searchStr) ||
        statusText.includes(searchStr)
      );
    });
  }, [subs, searchQuery]);

  const getStatusStyles = (status: string) => {
    const s = status.toUpperCase();
    if (s === "APPROVED" || s === "SUCCESS") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (s === "REJECTED" || s === "FAILED") return "bg-red-500/10 text-red-400 border border-red-500/20";
    if (s === "PENDING") return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
  };

  async function updateSubscription(id: string, updates: any) {
    const toastId = toast.loading("Updating record...") // ✅ Loading toast
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!res.ok) throw new Error()

      await fetchSubs()
      toast.success("Update successful", { id: toastId }) // ✅ Replace loading with success
    } catch (error) {
      toast.error("Failed to update", { id: toastId }) // ✅ Replace loading with error
    } finally {
      setUpdatingId(null)
    }
  }

  const handleApprove30Days = (sub: Subscription) => {
    const currentExpiry = sub.expiryDate ? new Date(sub.expiryDate).getTime() : Date.now();
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

    const toastId = toast.loading("Deleting subscription...") // ✅ Loading toast
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()

      await fetchSubs()
      toast.success("Subscription deleted", { id: toastId })
    } catch (error) {
      toast.error("Delete failed", { id: toastId })
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading && subs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-8">

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-serif">
              Subscription <span className="text-amber-400 italic">Management</span>
            </h1>
            <p className="text-white/40 text-sm mt-2">Filter by email, status, or magazine</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search email, paid, pending..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>

            <button
              onClick={() => fetchSubs(true)} // Pass true to show success toast
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
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
              {filteredSubs.length > 0 ? (
                filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-5 font-medium">
                      <div className="flex flex-col">
                        <span>{sub.user.email}</span>
                        <span className="text-[10px] text-white/20 font-mono">{sub.id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="p-5 text-white/70">{sub.magazine.title}</td>

                    <td className="p-5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(sub.paymentStatus)}`}>
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
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-white/50 font-mono text-xs">
                          {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString('en-GB') : "LIFETIME"}
                        </span>
                        {sub.expiryDate && new Date(sub.expiryDate) < new Date() && (
                          <span className="text-[9px] text-red-400 uppercase font-bold">Expired</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove30Days(sub)}
                          disabled={updatingId === sub.id}
                          className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                          title="Add 30 Days"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>

                        <button
                          disabled={updatingId === sub.id}
                          onClick={() => updateSubscription(sub.id, { isActive: !sub.isActive })}
                          className={`px-3 py-1 text-xs rounded-lg border transition ${sub.isActive
                            ? "border-white/10 text-white hover:bg-white/5"
                            : "border-amber-400/50 text-amber-400 hover:bg-amber-400 hover:text-zinc-950"
                            }`}
                        >
                          {sub.isActive ? "Revoke" : "Grant"}
                        </button>

                        <button
                          onClick={() => deleteSubscription(sub.id)}
                          disabled={updatingId === sub.id}
                          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-white/20 italic">
                    No subscriptions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}