import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  PlusCircle,
  ExternalLink,
  Edit3,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import DeleteMagazineButton from "./delete/page"
import SearchInput from "@/app/components/dashboard/SearchInput"

export default async function MagazinesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const params = await searchParams;
  const query = params.q || "";
  const currentPage = Math.max(1, Number(params.page) || 1);
  const pageSize = 5;

  const searchFilter = {
    OR: [
      { title: { contains: query, mode: 'insensitive' as const } },
      { id: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  // Parallel fetching to improve LCP and reduce server wait time
  const [totalMagazines, magazines] = await Promise.all([
    prisma.magazine.count({ where: searchFilter }),
    prisma.magazine.findMany({
      where: searchFilter,
      select: {
        id: true,
        title: true,
        price: true,
        stock: true,
        isActive: true,
        coverImage: true,
        pdfUrl: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    })
  ]);

  const totalPages = Math.ceil(totalMagazines / pageSize);

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-8 md:p-12">
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
          className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm px-5 py-3 rounded-xl transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Add Magazine
        </Link>
      </div>

      <SearchInput />

      <div className="flex items-center gap-3 mb-8">
        <span className="text-[10px] font-bold tracking-widest uppercase text-white/30 bg-white/5 border border-white/5 px-4 py-2 rounded-full">
          {totalMagazines} Found
        </span>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr className="text-[10px] tracking-[2px] uppercase text-white/25 font-bold">
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Publication</th>
                <th className="px-6 py-4 text-left">Pricing</th>
                <th className="px-6 py-4 text-left">Inventory</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {magazines.map((mag, index) => (
                <tr key={mag.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 text-xs text-white/20 font-mono">
                    {String((currentPage - 1) * pageSize + (index + 1)).padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-14 rounded overflow-hidden bg-zinc-800 border border-white/5 shrink-0 shadow-md">
                        {mag.coverImage ? (
                          <Image 
                            src={mag.coverImage} 
                            alt={mag.title} 
                            fill 
                            sizes="40px"
                            className="object-cover transition-opacity duration-300" 
                          />
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

                  <td className="px-6 py-4 font-mono">
                    <span className="text-amber-400 text-xs mr-0.5">₹</span>
                    <span className="text-stone-300">{mag.price}</span>
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

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {mag.pdfUrl && (
                        <a href={mag.pdfUrl} target="_blank" className="p-2 text-white/30 hover:text-emerald-400 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link href={`/dashboard/admin/magazines/edit/${mag.id}`} className="p-2 text-white/30 hover:text-amber-400 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <DeleteMagazineButton id={mag.id} title={mag.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-5 bg-white/[0.01] border-t border-white/5">
            <p className="text-[11px] text-white/20 uppercase tracking-[1px]">
              Page <span className="text-amber-400 font-bold">{currentPage}</span> of {totalPages}
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={`?q=${query}&page=${currentPage - 1}`}
                scroll={false}
                className={`p-2 rounded-lg border border-white/10 transition-all ${currentPage <= 1 ? "opacity-20 pointer-events-none" : "hover:bg-white/5 hover:border-white/20 text-white active:scale-90"}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

              <Link
                href={`?q=${query}&page=${currentPage + 1}`}
                scroll={false}
                className={`p-2 rounded-lg border border-white/10 transition-all ${currentPage >= totalPages ? "opacity-20 pointer-events-none" : "hover:bg-white/5 hover:border-white/20 text-white active:scale-90"}`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Ensure this is defined so it's available to the MagazinesPage map function
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span 
      suppressHydrationWarning 
      className={`inline-flex items-center gap-1.5 text-[9px] tracking-[1.5px] uppercase font-bold px-2.5 py-1 rounded-md border ${
        active 
          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
          : "bg-zinc-800 text-white/20 border-white/5"
      }`}
    >
      <span className={`w-1 h-1 rounded-full ${active ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  )
}