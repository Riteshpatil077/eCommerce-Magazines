"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page } from "react-pdf";
import {
    Loader2,
    ChevronLeft,
    ChevronRight,
    Volume2,
    VolumeX,
    Maximize2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const FlipBook = HTMLFlipBook as any;

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageContent = React.forwardRef<
    HTMLDivElement,
    { pageNumber: number; width: number; height: number }
>((props, ref) => {
    return (
        <div
            ref={ref}
            className="bg-white flex justify-center shadow-2xl overflow-hidden"
            style={{ width: props.width, height: props.height }}
        >
            <Page
                pageNumber={props.pageNumber}
                width={props.width}
                height={props.height}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                devicePixelRatio={2}
                loading={<div className="bg-zinc-800 animate-pulse w-full h-full" />}
            />
        </div>
    );
});

PageContent.displayName = "PageContent";

export default function MagazineViewer({
    pdfUrl, slug,
    fullscreen,
}: {
    pdfUrl: string;
    slug: string;
    fullscreen?: boolean;
}) {
    const router = useRouter();

    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [scale, setScale] = useState(1);
    const [baseDimensions, setBaseDimensions] = useState({
        width: 450,
        height: 635,
    });

    const bookRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    /* Resize book */
    useEffect(() => {
        const handleResize = () => {
            const availableHeight = window.innerHeight - 180;
            const availableWidth = window.innerWidth - 60;

            const calcWidth = Math.min(
                availableWidth / 2.1,
                availableHeight / 1.41
            );

            setBaseDimensions({
                width: calcWidth,
                height: calcWidth * 1.41,
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* Enter fullscreen if query param exists */
    useEffect(() => {
        if (fullscreen) {
            const element = document.documentElement;

            setTimeout(() => {
                element.requestFullscreen?.().catch(() => { });
            }, 300);
        }
    }, [fullscreen]);

    /* Flip sound */
    const playFlipSound = useCallback(() => {
        if (!isMuted && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    }, [isMuted]);

    /* Navigate to fullscreen reader page */
    const openFullWindow = () => {
        router.push(`/dashboard/read/${slug}?fullscreen=true`);
    };

    const finalWidth = baseDimensions.width * scale;
    const finalHeight = baseDimensions.height * scale;

    return (
        <div className="flex flex-col h-full w-full bg-[#0c0c0c] overflow-hidden select-none">
            <audio
                ref={audioRef}
                src="https://assets.mixkit.co/active_storage/sfx/2384/2384-preview.mp3"
                preload="auto"
            />

            {/* BOOK VIEWPORT */}

            <div className="flex-1 w-full overflow-auto flex items-center justify-center p-4 custom-scrollbar">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={
                        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                    }
                >
                    {numPages > 0 && (
                        <div className="relative shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                            <FlipBook
                                ref={bookRef}
                                width={finalWidth}
                                height={finalHeight}
                                size="fixed"
                                drawShadow={true}
                                flippingTime={800}
                                usePortrait={false}
                                startPage={0}
                                onFlip={(e: any) => {
                                    setCurrentPage(e.data);
                                    playFlipSound();
                                }}
                                className="magazine-book"
                            >
                                {[...Array(numPages).keys()].map((n) => (
                                    <PageContent
                                        key={n}
                                        pageNumber={n + 1}
                                        width={finalWidth}
                                        height={finalHeight}
                                    />
                                ))}
                            </FlipBook>
                        </div>
                    )}
                </Document>
            </div>

            {/* NAVIGATION BAR */}

            <div className="h-24 w-full flex items-center justify-center px-6 z-30">
                <div className="flex items-center gap-4 bg-zinc-900/95 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl shadow-2xl">

                    <button
                        onClick={() => bookRef.current?.pageFlip().flipPrev()}
                        className="p-2 hover:bg-white/5 rounded-xl text-white/50 hover:text-amber-400"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center px-4 border-x border-white/5 min-w-[100px]">
                        <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">
                            Page
                        </span>
                        <div className="text-sm font-mono text-amber-500 font-bold">
                            {currentPage + 1} <span className="text-white/20">/</span>{" "}
                            {numPages}
                        </div>
                    </div>

                    <button
                        onClick={() => bookRef.current?.pageFlip().flipNext()}
                        className="p-2 hover:bg-white/5 rounded-xl text-white/50 hover:text-amber-400"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    {/* ZOOM */}

                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="w-24 h-1 bg-white/10 rounded-lg cursor-pointer accent-amber-500"
                        />
                        <span className="text-[10px] font-mono text-white/40 w-8">
                            {Math.round(scale * 100)}%
                        </span>
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    {/* FULLSCREEN */}

                    <button
                        onClick={openFullWindow}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-amber-500"
                    >
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
                            Full Window
                        </span>
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    {/* SOUND */}

                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-lg transition-colors ${isMuted
                            ? "bg-red-500/10 text-red-400"
                            : "text-white/30 hover:text-amber-400"
                            }`}
                    >
                        {isMuted ? (
                            <VolumeX className="w-4 h-4" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}