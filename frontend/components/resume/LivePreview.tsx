'use client';

import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { Button } from '@/components/ui/button';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LivePreview() {
    const currentResume = useResumeStore(s => s.currentResume);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.5);
    const [manualZoom, setManualZoom] = useState(false);

    // Auto-scale to fit container width
    useEffect(() => {
        if (manualZoom) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries.length) return;
            const containerWidth = entries[0].contentRect.width;
            const a4Width = 794; // Fixed width of the ClassicTemplate
            // Add some padding margin (40px total)
            const targetScale = Math.min((containerWidth - 40) / a4Width, 1.2);
            setScale(targetScale);
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [manualZoom]);

    if (!currentResume) return null;

    const handleZoomIn = () => {
        setManualZoom(true);
        setScale(s => Math.min(s + 0.1, 2));
    };

    const handleZoomOut = () => {
        setManualZoom(true);
        setScale(s => Math.max(s - 0.1, 0.2));
    };

    const handleFit = () => {
        setManualZoom(false); // Let ResizeObserver take over again
        // Force a resize calculation immediately if possible or rely on next tick
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
                    className="origin-top"
                    style={{ transform: `scale(${scale})`, height: `${1123 * scale}px` }}
                >
                    <div className="bg-white shadow-xl ring-1 ring-black/5">
                        <TemplateRenderer resume={currentResume} />
                    </div>
                </div>
            </div>
        </div>
    );
}
