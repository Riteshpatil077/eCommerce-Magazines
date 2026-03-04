"use client"

import { useEffect, useState, useMemo } from "react"
import { CheckCircle2, XCircle, Loader2, Trash2, RefreshCcw, Calendar, Search } from "lucide-react"

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

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("")

  async function fetchSubs() {
    setLoading(true)
    const res = await fetch("/api/admin/subscriptions")
    const data = await res.json()
    setSubs(data)
    setLoading(false)
  }

  useEffect(() => { fetchSubs() }, [])

  // Optimized Search Logic (searches Email, Title, Status, and Access)
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

  // COLOR LOGIC FOR PAYMENT STATUS
  const getStatusStyles = (status: string) => {
    const s = status.toUpperCase();
    if (s === "APPROVED" || s === "SUCCESS") {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
    if (s === "REJECTED" || s === "FAILED") {
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    }
    if (s === "PENDING") {
      return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    }
    return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
  };

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
    setUpdatingId(id)
    try {
      await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" })
      await fetchSubs()
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

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-serif">
              Subscription <span className="text-amber-400 italic">Management</span>
            </h1>
            <p className="text-white/40 text-sm mt-2">Filter by email, status, or magazine</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
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
              onClick={fetchSubs}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Container */}
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

                    {/* Updated Payment Status Column */}
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
                          className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
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



// "use client"

// import { useEffect, useState, useMemo } from "react"
// import { CheckCircle2, XCircle, Loader2, Trash2, RefreshCcw, Calendar, Search, ChevronDown } from "lucide-react"

// type Subscription = {
//   id: string
//   paymentStatus: string
//   isActive: boolean
//   expiryDate: string | null
//   user: { email: string }
//   magazine: { title: string }
// }

// export default function AdminSubscriptionsPage() {
//   const [subs, setSubs] = useState<Subscription[]>([])
//   const [loading, setLoading] = useState(true)
//   const [updatingId, setUpdatingId] = useState<string | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")

//   async function fetchSubs() {
//     setLoading(true)
//     try {
//       const res = await fetch("/api/admin/subscriptions")
//       const data = await res.json()
//       setSubs(data)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { fetchSubs() }, [])

//   const filteredSubs = useMemo(() => {
//     return subs.filter((sub) => {
//       const searchStr = searchQuery.toLowerCase();
//       const statusText = sub.isActive ? "active" : "revoked";
//       const paymentText = sub.paymentStatus.toLowerCase();

//       return (
//         sub.user.email.toLowerCase().includes(searchStr) ||
//         sub.magazine.title.toLowerCase().includes(searchStr) ||
//         paymentText.includes(searchStr) ||
//         statusText.includes(searchStr)
//       );
//     });
//   }, [subs, searchQuery]);

//   // Color logic for the interactive dropdown
//   const getStatusColor = (status: string) => {
//     const s = status.toUpperCase();
//     if (s === "SUCCESS" || s === "APPROVED") return "text-emerald-400 border-emerald-500/20";
//     if (s === "FAILED" || s === "REJECTED") return "text-red-400 border-red-500/20";
//     if (s === "PENDING") return "text-orange-400 border-orange-500/20";
//     return "text-zinc-400 border-zinc-500/20";
//   };

//   async function updateSubscription(id: string, updates: any) {
//     setUpdatingId(id)
//     try {
//       await fetch(`/api/admin/subscriptions/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updates),
//       })
//       await fetchSubs()
//     } finally {
//       setUpdatingId(null)
//     }
//   }

//   async function fetchSubs() {
//     setLoading(true)
//     try {
//       const res = await fetch("/api/admin/subscriptions")
//       const data = await res.json()

//       // Ensure we only set state if data is actually an array
//       if (Array.isArray(data)) {
//         setSubs(data)
//       } else {
//         console.error("API did not return an array:", data)
//         setSubs([]) // Fallback to empty array to prevent crash
//       }
//     } catch (error) {
//       console.error("Fetch failed:", error)
//       setSubs([]) // Fallback to empty array
//     } finally {
//       setLoading(false)
//     }
//   }
//   if (loading && subs.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-zinc-950">
//         <Loader2 className="animate-spin text-amber-400" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-zinc-950 text-stone-100 p-8 font-sans">
//       <div className="max-w-7xl mx-auto">

//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
//           <div>
//             <h1 className="text-3xl font-serif">
//               Subscription <span className="text-amber-400 italic">Management</span>
//             </h1>
//             <p className="text-white/40 text-sm mt-2">Oversee payments and magazine access</p>
//           </div>

//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="relative flex-1 md:w-80">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
//               <input
//                 type="text"
//                 placeholder="Search email, status..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
//               />
//             </div>
//             <button
//               onClick={fetchSubs}
//               className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors"
//             >
//               <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
//             </button>
//           </div>
//         </div>

//         {/* Table Container */}
//         <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
//           <table className="w-full text-sm border-collapse">
//             <thead className="bg-white/[0.02] text-white/30 uppercase text-[10px] tracking-[2px] font-bold">
//               <tr>
//                 <th className="p-5 text-left">User Detail</th>
//                 <th className="p-5 text-left">Magazine</th>
//                 <th className="p-5 text-left text-amber-400/80">Update Payment</th>
//                 <th className="p-5 text-left">Access</th>
//                 <th className="p-5 text-left">Expiry Date</th>
//                 <th className="p-5 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-white/5">
//               {filteredSubs.map((sub) => (
//                 <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors group">
//                   <td className="p-5 font-medium">
//                     <div className="flex flex-col">
//                       <span>{sub.user.email}</span>
//                       <span className="text-[10px] text-white/20 font-mono tracking-tighter">{sub.id}</span>
//                     </div>
//                   </td>
//                   <td className="p-5 text-white/70">{sub.magazine.title}</td>

//                   {/* INTERACTIVE PAYMENT STATUS DROPDOWN */}
//                   <td className="p-5">
//                     <div className="relative w-fit group/select">
//                       <select
//                         value={sub.paymentStatus}
//                         disabled={updatingId === sub.id}
//                         onChange={(e) => updateSubscription(sub.id, { paymentStatus: e.target.value })}
//                         className={`appearance-none bg-white/5 border rounded-lg pl-3 pr-8 py-1.5 text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer transition-all hover:bg-white/10 disabled:opacity-50 ${getStatusColor(sub.paymentStatus)}`}
//                       >
//                         <option value="PENDING" className="bg-zinc-900 text-orange-400">PENDING</option>
//                         <option value="SUCCESS" className="bg-zinc-900 text-emerald-400">SUCCESS</option>
//                         <option value="FAILED" className="bg-zinc-900 text-red-400">FAILED</option>
//                       </select>
//                       <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none group-hover/select:text-white/40 transition-colors" />
//                     </div>
//                   </td>

//                   <td className="p-5">
//                     <div className="flex items-center gap-2">
//                       {sub.isActive ? <CheckCircle2 className="text-emerald-400 w-4 h-4" /> : <XCircle className="text-white/20 w-4 h-4" />}
//                       <span className={sub.isActive ? "text-emerald-400 font-medium" : "text-white/20"}>
//                         {sub.isActive ? "Active" : "Revoked"}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="p-5">
//                     <div className="flex flex-col gap-1">
//                       <span className="text-white/50 font-mono text-xs italic">
//                         {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "LIFETIME"}
//                       </span>
//                       {sub.expiryDate && new Date(sub.expiryDate) < new Date() && (
//                         <span className="text-[9px] text-red-400 uppercase font-bold tracking-tighter">Expired</span>
//                       )}
//                     </div>
//                   </td>

//                   <td className="p-5">
//                     <div className="flex justify-end gap-2">
//                       <button
//                         onClick={() => handleApprove30Days(sub)}
//                         disabled={updatingId === sub.id}
//                         className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-400 hover:text-zinc-950 transition-all disabled:opacity-50"
//                         title="Renew 30 Days"
//                       >
//                         <Calendar className="w-4 h-4" />
//                       </button>

//                       <button
//                         onClick={() => updateSubscription(sub.id, { isActive: !sub.isActive })}
//                         className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all ${sub.isActive
//                           ? "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
//                           : "border-amber-400/50 text-amber-400 hover:bg-amber-400 hover:text-zinc-950"
//                           }`}
//                       >
//                         {sub.isActive ? "Revoke" : "Grant"}
//                       </button>

//                       <button
//                         onClick={() => deleteSubscription(sub.id)}
//                         className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredSubs.length === 0 && (
//             <div className="p-20 text-center text-white/20 italic">
//               No matching subscriptions found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }