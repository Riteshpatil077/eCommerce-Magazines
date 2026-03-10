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
} from "lucide-react";
import { useRouter } from "next/navigation";

const FlipBook = HTMLFlipBook as any;

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageContent = React.forwardRef<
    HTMLDivElement,
    { pageNumber: number; width: number; height: number; isVisible: boolean }
>((props, ref) => {
    return (
        <div
            ref={ref}
            className="bg-zinc-100 overflow-hidden shadow-2xl"
            style={{ width: props.width, height: props.height }}
        >
            <div className="w-full h-full relative flex items-center justify-center">
                {props.isVisible ? (
                    <Page
                        pageNumber={props.pageNumber}
                        width={props.width}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        devicePixelRatio={2} // Reduced from 3 to 2 to save ~50% Canvas Memory
                        className="absolute inset-0 max-w-none"
                        loading={<div className="bg-zinc-800/10 animate-pulse w-full h-full" />}
                    />
                ) : (
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
                )}
            </div>
        </div>
    );
});

PageContent.displayName = "PageContent";

/**
 * Main MagazineViewer component. 
 * Renders a high-resolution, scaleable PDF interactive flipbook.
 */
export default function MagazineViewer({
    pdfUrl, slug,
    fullscreen, // Left intact for potential route-based fullscreen implementations later
}: {
    pdfUrl: string;
    slug: string;
    fullscreen?: boolean;
}) {
    const router = useRouter();

    // Core viewer state
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [scale, setScale] = useState(1);
    const [aspectRatio, setAspectRatio] = useState<number>(1.414); // Default to standard A4 (1:1.414)
    const [baseDimensions, setBaseDimensions] = useState({
        width: 450,
        height: 636, // 450 * 1.414
    });

    const bookRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [fullscreenActive, setFullscreenActive] = useState(false);

    /* Watch Fullscreen State */
    useEffect(() => {
        const onFullscreenChange = () => {
            setFullscreenActive(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    /* Resize book */
    useEffect(() => {
        const handleResize = () => {
            // Give slightly more padding if not fullscreen, otherwise use maximum available
            const heightOffset = fullscreenActive ? 120 : 180;
            const widthOffset = fullscreenActive ? 40 : 60;

            const cWidth = containerRef.current?.clientWidth || window.innerWidth;
            const cHeight = containerRef.current?.clientHeight || window.innerHeight;

            let availableHeight = (fullscreenActive ? window.innerHeight : cHeight) - heightOffset;
            let availableWidth = (fullscreenActive ? window.innerWidth : cWidth) - widthOffset;

            // Maximum bounds check
            const calcWidth = Math.min(
                availableWidth / 2.05, // Slight buffer (.05) prevents precision clipping on odd screen sizes
                availableHeight / aspectRatio
            );

            setBaseDimensions({
                width: calcWidth,
                height: calcWidth * aspectRatio,
            });
        };

        // Delay ensures reliable DOM measurements after fullscreen animations finish
        const timeout = setTimeout(handleResize, 250);
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", handleResize);
        }
    }, [aspectRatio, fullscreenActive]);

    // Ref for the main wrapper div
    const containerRef = useRef<HTMLDivElement | null>(null);

    /**
     * Optional effect to trigger fullscreen on mount if `fullscreen` prop is true.
     * Often used if redirecting to a strictly /full route.
     */
    useEffect(() => {
        if (fullscreen && containerRef.current) {
            containerRef.current.requestFullscreen?.().catch(() => { });
        }
    }, [fullscreen]);

    const finalWidth = baseDimensions.width;
    const finalHeight = baseDimensions.height;

    return (
        <div ref={containerRef} className="flex flex-col h-full w-full bg-[#0c0c0c] overflow-hidden select-none">
            {/* BOOK VIEWPORT */}

            <div className="flex-1 min-h-0 w-full overflow-auto custom-scrollbar">
                <div
                    className="w-full h-full flex items-center justify-center min-w-max min-h-max transition-all duration-300 ease-out"
                    style={{
                        padding: `${Math.max(16, 16 + (finalHeight * (scale - 1)) / 2)}px ${Math.max(16, 16 + finalWidth * (scale - 1))}px`
                    }}
                >
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={async (pdf) => {
                            setNumPages(pdf.numPages);
                            try {
                                const page = await pdf.getPage(1);
                                const viewport = page.getViewport({ scale: 1 });
                                if (viewport.width && viewport.height) {
                                    setAspectRatio(viewport.height / viewport.width);
                                }
                            } catch (error) {
                                console.error("Error determining aspect ratio: ", error);
                            }
                        }}
                        loading={
                            <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                        }
                    >
                        {numPages > 0 && (
                            <div
                                className="relative shadow-[0_0_80px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out origin-center"
                                style={{ transform: `scale(${scale})` }}
                            >
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
                                    }}
                                    className="magazine-book"
                                >
                                    {[...Array(numPages).keys()].map((n) => {
                                        // Memory Optimization: Only actually mount the heavy PDF Canvas 
                                        // for the pages immediately visible or 1 swipe away.
                                        const isVisible = Math.abs(currentPage - n) <= 3;

                                        return (
                                            <PageContent
                                                key={n}
                                                pageNumber={n + 1}
                                                width={finalWidth}
                                                height={finalHeight}
                                                isVisible={isVisible}
                                            />
                                        );
                                    })}
                                </FlipBook>
                            </div>
                        )}
                    </Document>
                </div>
            </div>

            {/* NAVIGATION BAR */}

            <div className="h-24 shrink-0 w-full flex items-center justify-center px-6 z-30">
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