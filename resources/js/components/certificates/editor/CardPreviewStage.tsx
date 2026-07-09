import React, { useCallback, useRef, useState } from "react";
import { IdCardPreview, type IdCardStudentData } from "@/components/certificates/IdCardPreview";
import { CreditCard, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ID_CARD_CONTENT } from "@/constants/idCard/formConfig";

const EDITOR = ID_CARD_CONTENT.editor;

interface CardPreviewStageProps {
    templateData: {
        name?: string;
        card_type?: string;
        background_color?: string;
        color_scheme?: {
            primary?: string;
            secondary?: string;
            text?: string;
            bg?: string;
        };
    } | null;
    frontFields: string[];
    backFields: string[];
    studentData: IdCardStudentData | null;
    studentName?: string;
}

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

/**
 * Figma-like canvas stage with:
 *  - Scroll to zoom (centered on cursor)
 *  - Click + drag to pan
 *  - Zoom controls in corner
 *  - Double-click to reset view
 */
const CardPreviewStage: React.FC<CardPreviewStageProps> = ({
    templateData,
    frontFields,
    backFields,
    studentData,
    studentName,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(0.65);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0 });
    const offsetStart = useRef({ x: 0, y: 0 });

    // ─── Zoom via scroll wheel ───────────────────────────
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        setZoom((prev) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta)));
    }, []);

    // ─── Pan via mouse drag ──────────────────────────────
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // Only pan on middle-click or when holding space (we'll use any click for simplicity)
        if (e.button !== 0) return;
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY };
        offsetStart.current = { ...offset };
    }, [offset]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isPanning) return;
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setOffset({
            x: offsetStart.current.x + dx,
            y: offsetStart.current.y + dy,
        });
    }, [isPanning]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    // ─── Reset view ──────────────────────────────────────
    const resetView = useCallback(() => {
        setZoom(0.65);
        setOffset({ x: 0, y: 0 });
    }, []);

    const zoomIn = useCallback(() => {
        setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
    }, []);

    const zoomOut = useCallback(() => {
        setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
    }, []);

    if (!templateData) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="size-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-5">
                    <CreditCard className="size-9 text-muted-foreground/20" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                    {EDITOR.previewEmptyTitle}
                </p>
                <p className="text-xs text-muted-foreground/50 mt-1 max-w-[220px]">
                    {EDITOR.previewEmptyDesc}
                </p>
            </div>
        );
    }

    const zoomPercent = Math.round(zoom * 100);

    return (
        <div
            ref={containerRef}
            className={cn(
                "h-full relative overflow-hidden select-none",
                isPanning ? "cursor-grabbing" : "cursor-grab",
            )}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={resetView}
        >
            {/* Background grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
                    backgroundPosition: `${offset.x}px ${offset.y}px`,
                }}
            />

            {/* Zoomable + pannable canvas */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isPanning ? "none" : "transform 0.15s ease-out",
                }}
            >
                <IdCardPreview
                    data={templateData}
                    selectedFields={frontFields}
                    backFields={backFields}
                    activeSide="front"
                    studentData={studentData}
                    studentName={studentName}
                />
            </div>

            {/* Zoom controls — bottom-right corner */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-sm p-0.5">
                <button
                    type="button"
                    onClick={zoomOut}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                    title="Zoom out"
                >
                    <ZoomOut className="size-3.5 text-muted-foreground" />
                </button>
                <span className="text-[10px] font-mono font-medium text-muted-foreground w-10 text-center">
                    {zoomPercent}%
                </span>
                <button
                    type="button"
                    onClick={zoomIn}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                    title="Zoom in"
                >
                    <ZoomIn className="size-3.5 text-muted-foreground" />
                </button>
                <div className="w-px h-4 bg-border" />
                <button
                    type="button"
                    onClick={resetView}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                    title="Reset view (or double-click)"
                >
                    <Maximize2 className="size-3.5 text-muted-foreground" />
                </button>
            </div>

            {/* Hint */}
            <div className="absolute bottom-3 left-3 z-20 text-[10px] text-muted-foreground/40 font-medium">
                {EDITOR.canvasHint}
            </div>
        </div>
    );
};

export default CardPreviewStage;
