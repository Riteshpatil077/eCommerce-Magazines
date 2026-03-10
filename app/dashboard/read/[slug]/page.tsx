import { prisma } from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getUserFromToken } from "@/app/lib/auth";
import ClientViewerBridge from "@/app/components/ClientViewerBridge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { pdfjs } from "react-pdf";
export default async function ReadMagazinePage(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Add this
}) {
    const { slug } = await props.params;
    const sParams = await props.searchParams;
    const isFullscreen = sParams.fullscreen === "true"; // Check for fullscreen flag

    const session = await getUserFromToken() as { id: string } | null;
    if (!session) redirect("/login");

    const [dbUser, magazine] = await Promise.all([
        prisma.user.findUnique({ where: { id: session.id } }),
        prisma.magazine.findUnique({ where: { slug: slug } })
    ]);

    if (!magazine || !dbUser) return notFound();

    const subscription = await prisma.subscription.findFirst({
        where: {
            userId: dbUser.id,
            magazineId: magazine.id,
            paymentStatus: "APPROVED",
            isActive: true
        },
    });

    if (!subscription) return redirect(`/store/${slug}`);    // Fallback name for the UI
    const displayName = dbUser.name || dbUser.email.split('@')[0] || "Reader";

    return (
        /* Use h-screen and flex-col to lock the header at the top */
        <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden text-white">

            {/* HIDE HEADER IF IN FULLSCREEN MODE */}
            {!isFullscreen && (
                <header className="h-16 flex-none flex items-center justify-between px-8 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md z-20">
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
                </header>
            )}

            <main className="flex-1 relative w-full overflow-hidden bg-[#0a0a0a]">
                <ClientViewerBridge pdfUrl={magazine.pdfUrl} slug={slug} fullscreen={isFullscreen} />
            </main>
        </div>
    );
}