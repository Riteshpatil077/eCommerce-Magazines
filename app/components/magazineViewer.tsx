// "use client";

import { TestTubeDiagonal } from "lucide-react";

// import React, { useState, useRef } from 'react';
// import HTMLFlipBook from 'react-pageflip';
// import { pdfjs, Document, Page } from 'react-pdf';
// import { Loader2, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// interface Props {
//     pdfUrl: string;
// }

// const PageContent = React.forwardRef<HTMLDivElement, { pageNumber: number }>((props, ref) => {
//     return (
//         <div className="bg-white shadow-inner overflow-hidden" ref={ref}>
//             <Page
//                 pageNumber={props.pageNumber}
//                 width={550} // Increased base width
//                 renderAnnotationLayer={false}
//                 renderTextLayer={false}
//                 className="pdf-page-canvas"
//             />
//         </div>
//     );
// });

// PageContent.displayName = "PageContent";

// export default function MagazineViewer({ pdfUrl }: Props) {
//     const [numPages, setNumPages] = useState<number>(0);
//     const [currentPage, setCurrentPage] = useState(0);
//     const bookRef = useRef<any>(null);

//     function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//         setNumPages(numPages);
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] overflow-hidden">
//             <Document
//                 file={pdfUrl}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 loading={
//                     <div className="flex flex-col items-center gap-4">
//                         <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
//                         <p className="text-white/40 font-medium">Rendering Publication...</p>
//                     </div>
//                 }
//             >
//                 {numPages > 0 && (
//                     <div className="relative group flex flex-col items-center">

//                         {/* THE BOOK */}
//                         <HTMLFlipBook
//                             ref={bookRef}
//                             width={550}
//                             height={750}
//                             size="stretch"
//                             minWidth={315}
//                             maxWidth={1000}
//                             minHeight={420}
//                             maxHeight={1350}
//                             drawShadow={true}
//                             flippingTime={800}
//                             usePortrait={false} // Forces double page spread on desktop
//                             startPage={0}
//                             onFlip={(e) => setCurrentPage(e.data)}
//                             className="magazine-book shadow-[0_0_50px_rgba(0,0,0,0.8)]"
//                             style={{ backgroundColor: 'transparent' }}
//                         >
//                             {[...Array(numPages).keys()].map((n) => (
//                                 <PageContent key={n} pageNumber={n + 1} />
//                             ))}
//                         </HTMLFlipBook>

//                         {/* PROFESSIONAL NAVIGATION CONTROLS */}
//                         <div className="mt-10 flex items-center gap-6">
//                             <button
//                                 onClick={() => bookRef.current.pageFlip().flipPrev()}
//                                 className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90"
//                             >
//                                 <ChevronLeft className="w-6 h-6" />
//                             </button>

//                             <div className="flex flex-col items-center gap-1">
//                                 <div className="bg-zinc-800/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-2xl">
//                                     <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">
//                                         Page {currentPage + 1} <span className="text-white/20 mx-2">/</span> {numPages}
//                                     </span>
//                                 </div>
//                                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
//                                     <div
//                                         className="h-full bg-amber-400 transition-all duration-300"
//                                         style={{ width: `${((currentPage + 1) / numPages) * 100}%` }}
//                                     />
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={() => bookRef.current.pageFlip().flipNext()}
//                                 className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90"
//                             >
//                                 <ChevronRight className="w-6 h-6" />
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </Document>

//             <style jsx global>{`
//                 .magazine-book {
//                     margin: 0 auto;
//                 }
//                 canvas {
//                     margin: 0 auto;
//                 }
//                 /* Remove the weird white border around the PDF canvas */
//                 .pdf-page-canvas canvas {
//                     display: block;
//                     user-select: none;
//                 }
//             `}</style>
//         </div>
//     );
// }


// //working code
// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import HTMLFlipBook from 'react-pageflip';
// import { pdfjs, Document, Page } from 'react-pdf';
// import { Loader2, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// const PageContent = React.forwardRef<HTMLDivElement, { pageNumber: number; width: number }>((props, ref) => {
//     return (
//         <div className="bg-white flex justify-center shadow-2xl" ref={ref}>
//             <Page
//                 pageNumber={props.pageNumber}
//                 width={props.width} // Dynamic width matching the book
//                 renderAnnotationLayer={false}
//                 renderTextLayer={false}
//                 className="shadow-lg"
//             />
//         </div>
//     );
// });
// PageContent.displayName = "PageContent";

// export default function MagazineViewer({ pdfUrl }: { pdfUrl: string }) {
//     const [numPages, setNumPages] = useState<number>(0);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [dimensions, setDimensions] = useState({ width: 550, height: 750 });
//     const bookRef = useRef<any>(null);

//     // Dynamic Scaling to prevent clipping
//     useEffect(() => {
//         const handleResize = () => {
//             const availableHeight = window.innerHeight - 200; // Leave space for UI
//             const calculatedWidth = Math.min(window.innerWidth * 0.4, availableHeight * 0.7);
//             setDimensions({
//                 width: calculatedWidth,
//                 height: calculatedWidth * 1.41, // Maintain A4 Ratio
//             });
//         };
//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     return (
//         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#0c0c0c] p-4 overflow-hidden">
//             <Document
//                 file={pdfUrl}
//                 onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                 loading={<Loader2 className="w-10 h-10 animate-spin text-amber-500" />}
//             >
//                 {numPages > 0 && (
//                     <div className="flex flex-col items-center gap-8">
//                         {/* THE BOOK CONTAINER */}
//                         <div className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
//                             <HTMLFlipBook
//                                 ref={bookRef}
//                                 width={dimensions.width}
//                                 height={dimensions.height}
//                                 size="stretch"
//                                 minWidth={300}
//                                 maxWidth={800}
//                                 minHeight={400}
//                                 maxHeight={1200}
//                                 drawShadow={true}
//                                 flippingTime={1000}
//                                 usePortrait={false}
//                                 startPage={0}
//                                 onFlip={(e) => setCurrentPage(e.data)}
//                                 className="magazine-book"
//                                 style={{ backgroundColor: 'transparent' }}
//                             >
//                                 {[...Array(numPages).keys()].map((n) => (
//                                     <PageContent
//                                         key={n}
//                                         pageNumber={n + 1}
//                                         width={dimensions.width} // Critical: PDF matches Book
//                                     />
//                                 ))}
//                             </HTMLFlipBook>
//                         </div>

//                         {/* PROFESSIONAL NAVIGATION BAR */}
//                         <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl shadow-2xl">
//                             <button
//                                 onClick={() => bookRef.current.pageFlip().flipPrev()}
//                                 className="p-2 hover:bg-white/5 rounded-full transition-colors"
//                             >
//                                 <ChevronLeft className="w-6 h-6 text-white/70" />
//                             </button>

//                             <div className="flex flex-col items-center px-4 border-x border-white/10">
//                                 <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Progress</span>
//                                 <div className="text-sm font-mono text-amber-400 font-bold">
//                                     {currentPage + 1} <span className="text-white/20 mx-1">/</span> {numPages}
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={() => bookRef.current.pageFlip().flipNext()}
//                                 className="p-2 hover:bg-white/5 rounded-full transition-colors"
//                             >
//                                 <ChevronRight className="w-6 h-6 text-white/70" />
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </Document>

//             <style jsx global>{`
//                 .magazine-book {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                 }
//                 canvas {
//                     max-width: 100%;
//                     height: auto !important;
//                 }
//             `}</style>
//         </div>
//     );
// }


"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { pdfjs, Document, Page } from 'react-pdf';
import { Loader2, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

// Initialize PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

/**
 * PageContent Component
 * Uses forwardRef to allow react-pageflip to measure positions.
 */
const PageContent = React.forwardRef<HTMLDivElement, { pageNumber: number; width: number }>((props, ref) => {
    return (
        <div className="bg-white flex justify-center shadow-2xl" ref={ref}>
            <Page
                pageNumber={props.pageNumber}
                width={props.width}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="shadow-lg"
                loading={<div className="bg-zinc-800 animate-pulse" style={{ width: props.width, height: props.width * 1.41 }} />}
            />
        </div>
    );
});
PageContent.displayName = "PageContent";

export default function MagazineViewer({ pdfUrl }: { pdfUrl: string }) {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 550, height: 750 });

    const bookRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Dynamic Scaling logic
    useEffect(() => {
        const handleResize = () => {
            const availableHeight = window.innerHeight - 250;
            const calculatedWidth = Math.min(window.innerWidth * 0.42, availableHeight * 0.7);
            setDimensions({
                width: calculatedWidth,
                height: calculatedWidth * 1.41,
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // SOUND LOGIC: Resets and plays sfx on every flip
    const playFlipSound = useCallback(() => {
        if (!isMuted && audioRef.current) {
            audioRef.current.currentTime = 0; // Reset to start for rapid flipping
            audioRef.current.play().catch(() => {
                /* Browsers may block audio until first user interaction */
            });
        }
    }, [isMuted]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#0c0c0c] p-4 overflow-hidden relative">

            {/* HIDDEN AUDIO ELEMENT */}
            <audio
                ref={audioRef}
                src="https://assets.mixkit.co/active_storage/sfx/2384/2384-preview.mp3"
                preload="auto"
            />

            <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<Loader2 className="w-10 h-10 animate-spin text-amber-500" />}
            >
                {numPages > 0 && (
                    <div className="flex flex-col items-center gap-8">
                        {/* THE BOOK CONTAINER */}
                        <div className="relative shadow-[0_0_80px_rgba(0,0,0,0.6)] z-10">
                            <HTMLFlipBook
                                ref={bookRef}
                                width={dimensions.width}
                                height={dimensions.height}
                                size="stretch"
                                minWidth={300}
                                maxWidth={800}
                                minHeight={400}
                                maxHeight={1200}
                                drawShadow={true}
                                flippingTime={1000}
                                usePortrait={false}
                                startPage={0}
                                onFlip={(e) => {
                                    setCurrentPage(e.data);
                                    playFlipSound(); // Trigger Sound
                                }}
                                className="magazine-book"
                                style={{ backgroundColor: 'transparent' }}
                            >
                                {[...Array(numPages).keys()].map((n) => (
                                    <PageContent
                                        key={n}
                                        pageNumber={n + 1}
                                        width={dimensions.width}
                                    />
                                ))}
                            </HTMLFlipBook>
                        </div>

                        {/* PROFESSIONAL NAVIGATION BAR */}
                        <div className="flex items-center gap-4 bg-zinc-900/90 backdrop-blur-2xl border border-white/5 px-6 py-3 rounded-2xl shadow-2xl z-50">
                            <button
                                onClick={() => bookRef.current?.pageFlip().flipPrev()}
                                className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-90 text-white/70 hover:text-amber-400"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col items-center px-6 border-x border-white/10 min-w-[120px]">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-1">Page</span>
                                <div className="text-lg font-mono text-amber-400 font-bold leading-none">
                                    {currentPage + 1} <span className="text-white/10 mx-1">/</span> {numPages}
                                </div>
                            </div>

                            <button
                                onClick={() => bookRef.current?.pageFlip().flipNext()}
                                className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-90 text-white/70 hover:text-amber-400"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            <div className="h-6 w-px bg-white/10 mx-2" />

                            {/* MUTE/UNMUTE BUTTON */}
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={`p-2 rounded-full transition-colors ${isMuted ? 'text-red-400 bg-red-400/10' : 'text-white/40 hover:text-amber-400'}`}
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                )}
            </Document>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <div
                    className="h-full bg-amber-500 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    style={{ width: `${((currentPage + 1) / numPages) * 100}%` }}
                />
            </div>

            <style jsx global>{`
                .magazine-book {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                canvas {
                    max-width: 100%;
                    height: auto !important;
                }
            `}</style>
        </div>
    );
}