"use client";

import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { pdfjs, Document, Page } from 'react-pdf';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// Required for PDF.js to work
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Props {
    pdfUrl: string;
}

const PageContent = React.forwardRef<HTMLDivElement, { pageNumber: number }>((props, ref) => {
    return (
        <div className="bg-white shadow-2xl" ref={ref}>
            <Page
                pageNumber={props.pageNumber}
                width={500} // Adjust based on your UI
                renderAnnotationLayer={false}
                renderTextLayer={false}
            />
        </div>
    );
});

PageContent.displayName = "PageContent";

export default function MagazineViewer({ pdfUrl }: Props) {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 p-4">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Loader2 className="w-8 h-8 animate-spin text-amber-400" />}
            >
                {numPages > 0 && (
                    <div className="relative">
                        {/* @ts-ignore */}
                        <HTMLFlipBook
                            width={500}
                            height={700}
                            size="stretch"
                            minWidth={315}
                            maxWidth={1000}
                            minHeight={420}
                            maxHeight={1350}
                            drawShadow={true}
                            flippingTime={1000}
                            usePortrait={false}
                            startPage={0}
                            onFlip={(e) => setCurrentPage(e.data)}
                            className="magazine-book"
                        >
                            {[...Array(numPages).keys()].map((n) => (
                                <PageContent key={n} pageNumber={n + 1} />
                            ))}
                        </HTMLFlipBook>

                        {/* Controls */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-zinc-800 px-6 py-3 rounded-full border border-white/10">
                            <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                                Page {currentPage + 1} of {numPages}
                            </span>
                        </div>
                    </div>
                )}
            </Document>

            <style jsx global>{`
        .magazine-book {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
        </div>
    );
}