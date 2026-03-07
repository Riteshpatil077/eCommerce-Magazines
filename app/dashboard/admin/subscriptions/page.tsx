
"use client"

import { useEffect, useState, useMemo } from "react"
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  RefreshCcw,
  Calendar,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
// 1. Import Toast components
import toast, { Toaster } from "react-hot-toast"

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

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  async function fetchSubs() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/subscriptions")
      const data = await res.json()
      setSubs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Fetch failed:", error)
      toast.error("Failed to load subscriptions") // Added toast
      setSubs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubs() }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredSubs = useMemo(() => {
    return subs
      .filter((sub) => {
        const searchStr = searchQuery.toLowerCase();
        const statusText = sub.isActive ? "active" : "revoked";
        return (
          sub.user.email.toLowerCase().includes(searchStr) ||
          sub.magazine.title.toLowerCase().includes(searchStr) ||
          sub.paymentStatus.toLowerCase().includes(searchStr) ||
          statusText.includes(searchStr)
        );
      })
      .sort((a, b) => a.user.email.localeCompare(b.user.email));
  }, [subs, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSubs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubs = filteredSubs.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === "APPROVED" || s === "SUCCESS") return "text-emerald-400 border-emerald-500/20";
    if (s === "REJECTED" || s === "FAILED") return "text-red-400 border-red-500/20";
    if (s === "PENDING") return "text-orange-400 border-orange-500/20";
    return "text-zinc-400 border-zinc-500/20";
  };

  // --- Actions with Toast ---

  async function updateSubscription(id: string, updates: any) {
    const toastId = toast.loading("Updating subscription...")
    setUpdatingId(id)
    const toastId = toast.loading("Updating subscription...") // Loading Toast
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!res.ok) throw new Error()

      await fetchSubs()
      toast.success("Updated successfully!", { id: toastId }) // Success Toast
    } catch (error) {
      toast.error("Update failed. Please try again.", { id: toastId }) // Error Toast
    } finally {
      setUpdatingId(null)
    }
  }

  const handleApprove30Days = (sub: Subscription) => {
    const currentExpiry = sub.expiryDate ? new Date(sub.expiryDate).getTime() : Date.now();
    const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
    const newExpiry = new Date(baseTime + 30 * 24 * 60 * 60 * 1000);

    updateSubscription(sub.id, {
      paymentStatus: "APPROVED",
      isActive: true,
      expiryDate: newExpiry
    });
  };

  const handleGrantInitialAccess = (sub: Subscription) => {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    updateSubscription(sub.id, {
      isActive: true,
      paymentStatus: "APPROVED",
      expiryDate: expiry
    });
  };

  async function deleteSubscription(id: string) {
    if (!confirm("Are you sure? This user will lose access immediately.")) return

    const toastId = toast.loading("Deleting record...")
    setUpdatingId(id)
    const toastId = toast.loading("Deleting...")
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
      {/* 2. Toaster component renders the messages */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b', // matches zinc-900
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-serif">
              Subscription <span className="text-amber-400 italic">Management</span>
            </h1>
            <p className="text-white/40 text-sm mt-2">Grouped by user email • Page {currentPage} of {totalPages}</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search email, magazine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>
            <button onClick={() => { fetchSubs(); toast.success("Refreshing data...") }} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-white/[0.02] text-white/30 uppercase text-[10px] tracking-[2px] font-bold">
                <tr>
                  <th className="p-5 text-left text-amber-400/60">Subscriber</th>
                  <th className="p-5 text-left">Magazine</th>
                  <th className="p-5 text-left">Payment Status</th>
                  <th className="p-5 text-left">Access</th>
                  <th className="p-5 text-left">Expiry</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {paginatedSubs.length > 0 ? (
                  paginatedSubs.map((sub, index) => {
                    const isSameAsPreviousInFiltered = (startIndex + index) > 0 &&
                      filteredSubs[startIndex + index - 1].user.email === sub.user.email;

                    return (
                      <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="p-5">
                          <div className={`flex flex-col transition-opacity ${isSameAsPreviousInFiltered ? 'opacity-20' : 'opacity-100'}`}>
                            <span className="font-medium">{sub.user.email}</span>
                            {!isSameAsPreviousInFiltered && <span className="text-[9px] text-amber-500/50 font-bold uppercase tracking-tighter">Primary Record</span>}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="text-white font-semibold group-hover:text-amber-400 transition-colors">
                            {sub.magazine.title}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="relative w-fit group/select">
                            <select
                              value={sub.paymentStatus}
                              disabled={updatingId === sub.id}
                              onChange={(e) => updateSubscription(sub.id, { paymentStatus: e.target.value })}
                              className={`appearance-none bg-white/5 border rounded-lg pl-3 pr-8 py-1.5 text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer transition-all hover:bg-white/10 disabled:opacity-50 ${getStatusColor(sub.paymentStatus)}`}
                            >
                              <option value="PENDING" className="bg-zinc-900 text-orange-400">PENDING</option>
                              <option value="APPROVED" className="bg-zinc-900 text-emerald-400">APPROVED</option>
                              <option value="REJECTED" className="bg-zinc-900 text-red-400">REJECTED</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
                          </div>
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
                            {sub.expiryDate ? (
                              <>
                                <span className="text-white/50 font-mono text-xs">
                                  {new Date(sub.expiryDate).toLocaleDateString('en-GB')}
                                </span>
                                {new Date(sub.expiryDate) < new Date() && (
                                  <span className="text-[9px] text-red-400 uppercase font-bold">Expired</span>
                                )}
                              </>
                            ) : (
                              <span className="text-white/20 text-[10px] italic">No Date Set</span>
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
                              onClick={() => {
                                if (!sub.isActive) handleGrantInitialAccess(sub);
                                else updateSubscription(sub.id, { isActive: false });
                              }}
                              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border transition-all ${sub.isActive
                                ? "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
                                : "border-amber-400/50 text-amber-400 hover:bg-amber-400 hover:text-zinc-950"
                                }`}
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
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-white/20 italic">No subscriptions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              Showing <span className="text-white font-medium">{paginatedSubs.length}</span> of <span className="text-white font-medium">{filteredSubs.length}</span> records
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-white/5 bg-white/5 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, i, arr) => (
                    <div key={page} className="flex items-center">
                      {i > 0 && arr[i - 1] !== page - 1 && <span className="px-1 text-white/20">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                          ? "bg-amber-400 text-zinc-950"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                          }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg border border-white/5 bg-white/5 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}