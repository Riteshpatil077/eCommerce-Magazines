import { prisma } from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getUserFromToken } from "@/app/lib/auth";
import ClientViewerBridge from "@/app/components/ClientViewerBridge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ReadMagazinePage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;

    // 1. Get the session (id/role) from token
    const session = await getUserFromToken() as { id: string } | null;
    if (!session) redirect("/login");

    // 2. Fetch the REAL user and magazine from DB in parallel
    const [dbUser, magazine] = await Promise.all([
        prisma.user.findUnique({ where: { id: session.id } }),
        prisma.magazine.findUnique({ where: { slug: slug } })
    ]);

    if (!magazine || !dbUser) return notFound();

    // 3. Subscription Check
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId: dbUser.id,
            magazineId: magazine.id,
            paymentStatus: "APPROVED",
            isActive: true
        },
    });

    if (subscription) redirect(`/store/${slug}`);

    // Fallback name for the UI
    const displayName = dbUser.name || dbUser.email.split('@')[0] || "Reader";

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden text-white">
            <div className="flex-1 flex flex-col relative">

                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md z-20">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard/user"
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-amber-400 transition-all group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Exit Reader
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <h1 className="text-sm font-semibold text-white/90">{magazine.title}</h1>
                    </div>

                    {/* User Profile - Fixed split error by using dbUser */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-white/30 font-medium leading-none uppercase tracking-widest mb-1">Reading as</p>
                            <p className="text-xs text-white/70">{displayName}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-zinc-950 font-bold text-xs shadow-lg shadow-amber-400/10">
                            {dbUser.email[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Reader Area */}
                <main className="flex-1 bg-[#0a0a0a] relative overflow-hidden">
                    <ClientViewerBridge pdfUrl={magazine.pdfUrl} />
                </main>
            </div>
        </div>
    );
}