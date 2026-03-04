import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import MagazineViewer from "@/app/components/magazineViewer";
import { getUserFromToken } from "@/app/lib/auth";

export default async function ReadMagazinePage({ params }: { params: { id: string } }) {
    // 1. In Next.js 15+, params must be awaited
    const { id } = await params;

    // 2. Authenticate the User
    const user = await getUserFromToken() as { id: string } | null;
    if (!user) redirect("/login");

    // 3. Fetch magazine using 'id' from folder name as the 'slug'
    const magazine = await prisma.magazine.findUnique({
        where: { slug: id },
    });

    // If magazine doesn't exist, go back to dashboard
    if (!magazine) redirect("/dashboard");

    // 4. Check Subscription Status
    // We check if isActive is true AND paymentStatus is APPROVED
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId: user.id,
            magazineId: magazine.id,
            isActive: true,
            paymentStatus: "APPROVED",
        },
    });

    // 5. Access Control
    if (!subscription) {
        // Redirect to the store page for this specific slug
        redirect(`/store/${id}`);
    }

    // 6. Render Flipbook
    return (
        <div className="h-screen w-full bg-zinc-950 overflow-hidden relative">
            {/* Premium Exit Button */}
            <a
                href="/dashboard"
                className="absolute top-6 left-6 z-50 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[2px] font-bold transition-all"
            >
                ← Back to Dashboard
            </a>

            {/* The Flipbook Viewer */}
            <MagazineViewer pdfUrl={magazine.pdfUrl} />
        </div>
    );
}