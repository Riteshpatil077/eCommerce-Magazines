import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import { BookOpen, PlusCircle, ExternalLink, Edit3, AlertCircle } from "lucide-react"
import DeleteMagazineButton from "./delete/page"
import SearchInput from "@/app/components/dashboard/SearchInput"
 // Import the new component

export default async function MagazinesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const query = (await searchParams).q || ""

  // FETCH: Filtered data across MULTIPLE fields
  const magazines = await prisma.magazine.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { id: { contains: query, mode: 'insensitive' } },
        // Add more fields here if needed, e.g.:
        // { description: { contains: query, mode: 'insensitive' } }
      ],
    },
    select: {
      id: true,
      title: true,
      price: true,
      stock: true,
      isActive: true,
      coverImage: true,
      pdfUrl: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  const active = magazines.filter((m) => m.isActive).length
  const inactive = magazines.length - active

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-8 md:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
            <span className="block w-6 h-px bg-amber-400" />
            Catalog Management
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
            All <em className="italic text-amber-400">Magazines</em>
          </h1>
        </div>

        <Link
          href="/dashboard/admin/magazines/add"
          className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
        >
          <PlusCircle className="w-4 h-4" />
          Add Magazine
        </Link>
      </div>

      {/* SEARCH INPUT */}
      <SearchInput />

      {/* Summary Stats */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[10px] font-bold tracking-widest uppercase text-white/30 bg-white/5 border border-white/5 px-4 py-2 rounded-full">
          {magazines.length} Total
        </span>
        <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/10 px-4 py-2 rounded-full">
          {active} Active
        </span>
        {inactive > 0 && (
          <span className="text-[10px] font-bold tracking-widest uppercase text-red-400 bg-red-400/10 border border-red-400/10 px-4 py-2 rounded-full">
            {inactive} Deactive
          </span>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr className="text-[10px] tracking-[2px] uppercase text-white/25 font-bold">
                <th className="px-6 py-4 text-left font-medium">#</th>
                <th className="px-6 py-4 text-left font-medium">Publication</th>
                <th className="px-6 py-4 text-left font-medium">Pricing</th>
                <th className="px-6 py-4 text-left font-medium">Inventory</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {magazines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20">
                    <div className="flex flex-col items-center justify-center text-white/20">
                      <BookOpen className="w-10 h-10 mb-3 opacity-30" strokeWidth={1} />
                      <p className="font-serif text-lg text-white/40">
                        {query ? `No matches for "${query}"` : "No records found"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                magazines.map((mag, index) => (
                  <tr key={mag.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4 text-xs text-white/20 font-mono">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 rounded overflow-hidden bg-zinc-800 border border-white/5 shrink-0 shadow-md">
                          {mag.coverImage ? (
                            <img src={mag.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-white/10" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-stone-200 group-hover:text-amber-400 transition-colors">
                          {mag.title}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-stone-300 font-mono">
                        <span className="text-amber-400 text-xs mr-0.5">₹</span>{mag.price}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${mag.stock <= 5 ? "text-red-400" : "text-emerald-400"}`}>
                          {mag.stock}
                        </span>
                        {mag.stock <= 5 && mag.stock > 0 && <AlertCircle className="w-3 h-3 text-red-400" />}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge active={mag.isActive} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {mag.pdfUrl && (
                          <a
                            href={mag.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-white/30 hover:text-emerald-400 hover:bg-emerald-400/5 rounded-lg transition-all"
                            title="Open Publication"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <Link
                          href={`/dashboard/admin/magazines/edit/${mag.id}`}
                          className="p-2 text-white/30 hover:text-amber-400 hover:bg-amber-400/5 rounded-lg transition-all"
                          title="Edit Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <DeleteMagazineButton id={mag.id} title={mag.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] tracking-[1.5px] uppercase font-bold px-2.5 py-1 rounded-md border ${
      active ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" : "bg-zinc-800 text-white/20 border-white/5"
    }`}>
      <span className={`w-1 h-1 rounded-full ${active ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
      {active ? "Active" : "Deactive"}
    </span>
  )
}