import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AdaptiveGrid
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AdaptiveGridProps {
    children: ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: string;
    className?: string;
}

const COLS_MAP = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
};

/**
 * AdaptiveGrid — Factory-standard grid wrapper.
 * Automatically handles column transitions from Mobile → Desktop.
 */
export function AdaptiveGrid({ children, cols = 3, gap = "var(--space-4)", className }: AdaptiveGridProps) {
    return (
        <div 
            className={cn("grid w-full", COLS_MAP[cols], className)}
            style={{ gap }}
        >
            {children}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ViewportGuard
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ViewportGuardProps {
    children: ReactNode;
    showOn: "mobile" | "desktop";
    fallback?: ReactNode;
    className?: string; // Optional wrapper class
}

/**
 * ViewportGuard — Functional visibility component.
 * Uses CSS for zero-layout-shift (avoids JS window checks where possible).
 */
export function ViewportGuard({ children, showOn, fallback = null, className }: ViewportGuardProps) {
    return (
        <>
            <div className={cn(
                className,
                showOn === "mobile" ? "block md:hidden" : "hidden md:block"
            )}>
                {children}
            </div>
            {fallback && (
                <div className={cn(
                    className,
                    showOn === "mobile" ? "hidden md:block" : "block md:hidden"
                )}>
                    {fallback}
                </div>
            )}
        </>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AdaptiveStack
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface AdaptiveStackProps {
    children: ReactNode;
    direction?: "row" | "col"; // Desktop preference
    align?: "start" | "center" | "end" | "stretch";
    gap?: string;
    className?: string;
}

/**
 * AdaptiveStack — Factory-standard flex wrapper.
 * Defaults to Vertical on Mobile, Horizontal on Desktop.
 */
export function AdaptiveStack({ 
    children, 
    direction = "row", 
    align = "center", 
    gap = "var(--space-4)",
    className 
}: AdaptiveStackProps) {
    const alignMap = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
    };

    return (
        <div 
            className={cn(
                "flex w-full",
                direction === "row" ? "flex-col md:flex-row" : "flex-col",
                alignMap[align],
                className
            )}
            style={{ gap }}
        >
            {children}
        </div>
    );
}
