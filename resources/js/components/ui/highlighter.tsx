"use client";

import React, { useRef, useEffect, useState, useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HighlighterAction =
    | "highlight"
    | "underline"
    | "circle"
    | "box"
    | "strike-through";

interface HighlighterProps {
    children: ReactNode;
    color?: string;
    action?: HighlighterAction;
    strokeWidth?: number;
    animationDuration?: number;
    padding?: number;
    className?: string;
}

/**
 * Generates a rough hand-drawn SVG path for the given action.
 */
function generatePath(
    action: HighlighterAction,
    w: number,
    h: number,
    padding: number,
): string {
    const pw = w + padding * 2;
    const ph = h + padding * 2;
    // Small random wobble for hand-drawn feel
    const r = () => (Math.random() - 0.5) * 2;

    switch (action) {
        case "highlight": {
            // Horizontal fill strokes across the text
            const lines: string[] = [];
            const step = 4;
            for (let y = padding + 2; y < ph - padding; y += step) {
                lines.push(`M ${padding + r()} ${y + r()} Q ${pw * 0.3 + r()} ${y + r() * 1.5} ${pw * 0.5 + r()} ${y + r()} T ${pw - padding + r()} ${y + r()}`);
            }
            return lines.join(" ");
        }
        case "underline": {
            const y = ph - padding + 1;
            return `M ${padding + r()} ${y + r()} Q ${pw * 0.25 + r()} ${y + r() * 2} ${pw * 0.5 + r()} ${y + r()} T ${pw - padding + r()} ${y + r()}`;
        }
        case "circle": {
            const cx = pw / 2;
            const cy = ph / 2;
            const rx = pw / 2 - 2;
            const ry = ph / 2 - 1;
            return `M ${cx - rx + r()} ${cy + r()} C ${cx - rx + r()} ${cy - ry + r()}, ${cx + rx + r()} ${cy - ry + r()}, ${cx + rx + r()} ${cy + r()} C ${cx + rx + r()} ${cy + ry + r()}, ${cx - rx + r()} ${cy + ry + r()}, ${cx - rx + r()} ${cy + r()}`;
        }
        case "box": {
            return `M ${padding + r()} ${padding + r()} L ${pw - padding + r()} ${padding + r()} L ${pw - padding + r()} ${ph - padding + r()} L ${padding + r()} ${ph - padding + r()} Z`;
        }
        case "strike-through": {
            const y = ph / 2;
            return `M ${padding + r()} ${y + r()} Q ${pw * 0.3 + r()} ${y + r() * 2} ${pw * 0.5 + r()} ${y + r()} T ${pw - padding + r()} ${y + r()}`;
        }
        default:
            return "";
    }
}

export function Highlighter({
    children,
    color = "#ffd1dc",
    action = "highlight",
    strokeWidth = 1.5,
    animationDuration = 600,
    padding = 3,
    className,
}: HighlighterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [svgPath, setSvgPath] = useState("");
    const id = useId();

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 },
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setDimensions({ w: rect.width, h: rect.height });
    }, [children]);

    useEffect(() => {
        if (dimensions.w > 0 && dimensions.h > 0) {
            setSvgPath(generatePath(action, dimensions.w, dimensions.h, padding));
        }
    }, [dimensions, action, padding]);

    const pathLength = svgPath ? 5000 : 0; // generous estimate

    return (
        <span ref={ref} className={cn("relative inline", className)}>
            {children}
            {isVisible && svgPath && (
                <svg
                    className="absolute pointer-events-none"
                    style={{
                        top: -padding,
                        left: -padding,
                        width: dimensions.w + padding * 2,
                        height: dimensions.h + padding * 2,
                        overflow: "visible",
                    }}
                    aria-hidden
                >
                    <path
                        d={svgPath}
                        fill={action === "highlight" ? "none" : "none"}
                        stroke={color}
                        strokeWidth={action === "highlight" ? strokeWidth + 6 : strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={action === "highlight" ? 0.35 : 0.8}
                        style={{
                            strokeDasharray: pathLength,
                            strokeDashoffset: pathLength,
                            animation: `highlighter-draw ${animationDuration}ms ease-out forwards`,
                        }}
                    />
                </svg>
            )}
            <style>{`
                @keyframes highlighter-draw {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </span>
    );
}
