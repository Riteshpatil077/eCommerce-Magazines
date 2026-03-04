import UserSearch from "@/app/components/dashboard/UserSearch"
import { prisma } from "@/app/lib/prisma"
import { Users, ShieldCheck, UserIcon } from "lucide-react"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const { query } = await searchParams

  // Optimized Search: Filtering happens in the Database, not the browser
  const users = await prisma.user.findMany({
    where: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    } : {},
    orderBy: { createdAt: 'desc' }
  })

  const admins = users.filter((u) => u.role === "ADMIN").length
  const members = users.length - admins

  return (
   <div className="min-h-screen bg-zinc-950 text-stone-100 p-8 md:p-12">
      {/* Header unchanged ... */}
      <div className="mb-10">
        <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
          <span className="block w-6 h-px bg-amber-400" />
          Admin Panel
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
          All <em className="italic text-amber-400">Users</em>
        </h1>
      </div>

      {/* New Search Component */}
      <UserSearch />

      {/* Summary pills */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-white/40 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
          {users.length} {query ? "found" : "total"}
        </span>
        {/* ... other pills ... */}
      </div>

      {/* Table Section */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
        {/* Column headers ... */}
        <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 bg-zinc-800/40 text-[10px] tracking-[2px] uppercase text-white/25 font-medium">
           <span className="col-span-1">#</span>
           <span className="col-span-4">User</span>
           <span className="col-span-4">Email</span>
           <span className="col-span-3">Role</span>
        </div>

        {/* Rows */}
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <Users className="w-10 h-10 mb-3 opacity-30" strokeWidth={1} />
            <p className="font-serif text-lg">{query ? "No results match your search" : "No users found"}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map((user, index) => {
              const isAdmin = user.role === "ADMIN"
              // ... initials logic ...
              const initials = user.name
                ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                : user.email?.[0]?.toUpperCase() ?? "?"

              return (
                <div key={user.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors group">
                  <span className="col-span-1 text-xs text-white/20 font-mono">{String(index + 1).padStart(2, "0")}</span>
                  
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isAdmin ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white" : "bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950"}`}>
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-stone-200 truncate">{user.name || "No name"}</span>
                  </div>

                  <div className="col-span-4">
                    <span className="text-sm text-white/40 font-light truncate block">{user.email}</span>
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[1.5px] uppercase font-semibold px-2.5 py-1 rounded-full ${isAdmin ? "bg-violet-500/10 text-violet-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}