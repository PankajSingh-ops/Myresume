'use client';

import { useEffect, useRef, useState } from 'react';
import { useCoverLetterStore } from '@/store/coverLetterStore';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { Button } from '@/components/ui/button';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

export function LivePreview() {
    const currentCoverLetter = useCoverLetterStore(s => s.currentCoverLetter);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.5);
    const [manualZoom, setManualZoom] = useState(false);

    useEffect(() => {
        if (manualZoom) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries.length) return;
            const containerWidth = entries[0].contentRect.width;
            const a4Width = 794;
            const targetScale = Math.min((containerWidth - 40) / a4Width, 1.2);
            setScale(targetScale);
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [manualZoom]);

    if (!currentCoverLetter) return null;

    const handleZoomIn = () => {
        setManualZoom(true);
        setScale(s => Math.min(s + 0.1, 2));
    };

    const handleZoomOut = () => {
        setManualZoom(true);
        setScale(s => Math.max(s - 0.1, 0.2));
    };

    const handleFit = () => {
        setManualZoom(false);
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const a4Width = 794;
            setScale(Math.min((containerWidth - 40) / a4Width, 1.2));
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center">
            {/* Toolbar overlay */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm border shadow-sm rounded-md p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFit} title="Fit to screen">
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Scrollable Container */}
            <div ref={containerRef} className="w-full h-full overflow-auto bg-muted/30 flex justify-center py-8">
                {/* Scaled Wrapper */}
                <div
                    className="origin-top relative"
                    style={{ transform: `scale(${scale})`, height: `${1123 * scale}px`, width: '794px' }}
                >
                    <div className="w-full h-full bg-white shadow-xl ring-1 ring-black/5">
                        <TemplateRenderer coverLetter={currentCoverLetter} />
                    </div>
                </div>
            </div>
        </div>
    );
}
