// "use client";

// import dynamic from "next/dynamic";

// // Dynamically import the heavy PDF viewer only on the client
// const MagazineViewer = dynamic(() => import("./magazineViewer"), {
//     ssr: false,
//     loading: () => (
//         <div className="flex items-center justify-center h-screen bg-zinc-950">
//             <div className="text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
//                 <p className="text-white/50">Loading viewer...</p>
//             </div>
//         </div>
//     ),
// });

// export default function ClientViewerBridge({ pdfUrl, slug,
//     fullscreen, }: { pdfUrl: string; slug: string; fullscreen?: boolean; }) {
//     return <div className="h-full w-full">
//         <MagazineViewer pdfUrl={pdfUrl} slug={slug} fullscreen={fullscreen} />
//     </div>
// }



"use client";

import dynamic from "next/dynamic";

// Dynamically import the heavy PDF viewer only on the client
const MagazineViewer = dynamic(() => import("./magazineViewer"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen bg-zinc-950">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-white/50">Loading viewer...</p>
            </div>
        </div>
    ),
});

export default function ClientViewerBridge({ pdfUrl, slug,
    fullscreen, }: { pdfUrl: string; slug: string; fullscreen?: boolean; }) {
    return <div className="h-auto w-full">
        <MagazineViewer pdfUrl={pdfUrl} slug={slug} fullscreen={fullscreen} />
    </div>
}