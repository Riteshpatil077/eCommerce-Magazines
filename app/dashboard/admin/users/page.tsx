import UserSearch from "@/app/components/dashboard/UserSearch"
import { prisma } from "@/app/lib/prisma"
import { Users, UserIcon, ChevronLeft, ChevronRight } from "lucide-react"
import DeleteUserButton from "@/app/components/dashboard/DeleteUserButton"
import Link from "next/link"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  const { query, page } = await searchParams
  
  // Pagination Settings
  const currentPage = Number(page) || 1
  const pageSize = 7 // Show 7 users per page
  const skip = (currentPage - 1) * pageSize

  // Build the Filter
  const whereClause = {
    NOT: { role: "ADMIN" as const },
    ...(query && {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { email: { contains: query, mode: 'insensitive' as const } },
      ],
    }),
  }

  // Fetch Data and Total Count in parallel
  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: pageSize,
    }),
    prisma.user.count({ where: whereClause })
  ])

  const totalPages = Math.ceil(totalUsers / pageSize)

  // Helper to generate pagination URLs
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (query) params.set("query", query)
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-8 md:p-12">
      <div className="mb-10">
        <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
          <span className="block w-6 h-px bg-amber-400" />
          Admin Panel
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
          Registered <em className="italic text-amber-400">Members</em>
        </h1>
      </div>

      <UserSearch />

      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
          {totalUsers} {query ? "matching members" : "total members"}
        </span>
        
        {/* Simple Page Indicator */}
        <span className="text-[10px] uppercase tracking-widest text-white/20">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 bg-zinc-800/40 text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
          <span className="col-span-1">#</span>
          <span className="col-span-4">Member</span>
          <span className="col-span-3">Email</span>
          <span className="col-span-3">Status</span>
          <span className="col-span-1 text-right">Action</span>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <Users className="w-10 h-10 mb-3 opacity-30" strokeWidth={1} />
            <p className="font-serif text-lg">{query ? "No members match" : "No members found"}</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {users.map((user, index) => {
                const initials = user.name
                  ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                  : user.email?.[0]?.toUpperCase() ?? "?"

                return (
                  <div key={user.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors group">
                    <span className="col-span-1 text-xs text-white/20 font-mono">
                       {String(skip + index + 1).padStart(2, "0")}
                    </span>

                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950">
                        {initials}
                      </div>
                      <span className="text-sm font-medium text-stone-200 truncate">{user.name || "No name"}</span>
                    </div>

                    <div className="col-span-3">
                      <span className="text-sm text-white/40 font-light truncate block">{user.email}</span>
                    </div>

                    <div className="col-span-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[1.5px] uppercase font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400">
                        <UserIcon className="w-3 h-3" />
                        {user.role}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <DeleteUserButton userId={user.id} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-zinc-800/20 border-t border-white/5 flex items-center justify-between">
               <p className="text-[10px] text-white/20 uppercase tracking-tighter">
                 Showing {skip + 1} to {Math.min(skip + pageSize, totalUsers)} of {totalUsers}
               </p>
               
               <div className="flex items-center gap-2">
                 <Link
                    href={getPageUrl(currentPage - 1)}
                    className={`p-2 rounded-lg border border-white/5 bg-white/5 transition-all ${
                      currentPage <= 1 ? "opacity-20 pointer-events-none" : "hover:bg-white/10 text-amber-400"
                    }`}
                 >
                   <ChevronLeft className="w-4 h-4" />
                 </Link>

                 <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={getPageUrl(p)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                          p === currentPage 
                          ? "bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/10" 
                          : "text-white/40 hover:bg-white/5"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                 </div>

                 <Link
                    href={getPageUrl(currentPage + 1)}
                    className={`p-2 rounded-lg border border-white/5 bg-white/5 transition-all ${
                      currentPage >= totalPages ? "opacity-20 pointer-events-none" : "hover:bg-white/10 text-amber-400"
                    }`}
                 >
                   <ChevronRight className="w-4 h-4" />
                 </Link>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}