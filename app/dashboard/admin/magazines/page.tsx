import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import { BookOpen, PlusCircle, MoreHorizontal } from "lucide-react"

export default async function MagazinesPage() {
  const magazines = await prisma.magazine.findMany()

  const active = magazines.filter((m) => m.isActive).length
  const inactive = magazines.length - active

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-8 md:p-12">

      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
            <span className="block w-6 h-px bg-amber-400" />
            Admin Panel
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
            All <em className="italic text-amber-400">Magazines</em>
          </h1>
        </div>

        <Link
          href="/dashboard/admin/magazines/add"
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          Add Magazine
        </Link>
      </div>

      {/* Summary pills */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-white/40 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
          {magazines.length} total
        </span>
        <span className="text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/10 px-3 py-1.5 rounded-full">
          {active} active
        </span>
        {inactive > 0 && (
          <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/10 px-3 py-1.5 rounded-full">
            {inactive} inactive
          </span>
        )}
      </div>

      {/* Table card */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-12 px-6 py-3 border-b border-white/5 bg-zinc-800/40">
          <span className="col-span-1 text-[10px] tracking-[2px] uppercase text-white/25 font-medium">#</span>
          <span className="col-span-5 text-[10px] tracking-[2px] uppercase text-white/25 font-medium">Title</span>
          <span className="col-span-2 text-[10px] tracking-[2px] uppercase text-white/25 font-medium">Price</span>
          <span className="col-span-2 text-[10px] tracking-[2px] uppercase text-white/25 font-medium">Status</span>
          <span className="col-span-2 text-[10px] tracking-[2px] uppercase text-white/25 font-medium text-right">Actions</span>
        </div>

        {/* Rows */}
        {magazines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <BookOpen className="w-10 h-10 mb-3 opacity-30" strokeWidth={1} />
            <p className="font-serif text-lg">No magazines yet</p>
            <p className="text-xs mt-1">Add your first publication</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {magazines.map((mag, index) => (
              <div
                key={mag.id}
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors duration-150 group"
              >
                {/* Index */}
                <span className="col-span-1 text-xs text-white/20 font-mono">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Title + cover thumbnail */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-12 rounded-md overflow-hidden bg-zinc-800 shrink-0 border border-white/5">
                    {mag.coverImage ? (
                      <img
                        src={mag.coverImage}
                        alt={mag.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5 text-white/20" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-stone-200 truncate group-hover:text-amber-400 transition-colors duration-150">
                    {mag.title}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <span className="text-sm text-stone-300 font-light">
                    <span className="text-amber-400 text-xs">₹</span>{mag.price}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[1.5px] uppercase font-semibold px-2.5 py-1 rounded-full
                    ${mag.isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-700/60 text-white/30"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${mag.isActive ? "bg-emerald-400" : "bg-white/20"}`} />
                    {mag.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Link
              href={`/dashboard/admin/magazines/edit/${mag.id}`}
                    className="text-[11px] tracking-wide text-white/30 hover:text-amber-400 hover:bg-amber-400/5 px-3 py-1.5 rounded-lg border border-transparent hover:border-amber-400/10 transition-all duration-150"
                  >
                    Edit
                  </Link>
                  <button className="p-1.5 text-white/20 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all duration-150">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {magazines.length > 0 && (
          <div className="px-6 py-3 border-t border-white/5 bg-zinc-800/20 flex items-center justify-between">
            <p className="text-xs text-white/20">
              Showing {magazines.length} of {magazines.length} publications
            </p>
            <p className="text-[10px] text-white/15 tracking-wide uppercase">
              Last updated just now
            </p>
          </div>
        )}
      </div>
    </div>
  )
}