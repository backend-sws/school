/**
 * PublicWebsiteProvider — injects website builder config once at the layout level.
 *
 * Wraps PublicLayout so all public pages can consume:
 *   - sectionOrder (homepage section visibility/ordering from DB)
 *   - Future: nav overrides, footer config, custom links
 *
 * Theme is NOT handled here — it's applied globally via:
 *   app.blade.php → data-theme → brand-palettes.css
 *   app.tsx ThemeRoot → syncs institution.brand_theme to <html>
 */

import React, { createContext, useContext, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import type { SharedData } from "@/types";
import { useLayoutContext, type LayoutContextResult } from "@/lib/layout-resolver";
import type { SectionMeta } from "@/constants/landing/sections";

// ── Types ────────────────────────────────────────────────────────

interface SectionOrderItem {
    section_id: string;
    sort_order: number;
    is_visible: boolean;
    custom_props: Record<string, any> | null;
}

interface PublicWebsiteContextValue {
    /** Merged section order: DB overrides → static defaults */
    resolvedSections: SectionMeta[];

    /** Raw section order from DB (for admin builder reference) */
    sectionOrder: SectionOrderItem[];

    /** Full layout context (nav, footer, labels, etc.) */
    layout: LayoutContextResult;
}

const PublicWebsiteContext = createContext<PublicWebsiteContextValue | null>(null);

// ── Hook ─────────────────────────────────────────────────────────

/**
 * Hook to consume website builder config.
 * Returns defaults from useLayoutContext when used outside the provider
 * (e.g. when a page renders PublicLayout as a child, not as a wrapper).
 */
export function usePublicWebsite(): PublicWebsiteContextValue {
    const ctx = useContext(PublicWebsiteContext);

    // Graceful fallback — when called outside provider, return static defaults
    const layout = useLayoutContext();

    if (ctx) return ctx;

    return {
        resolvedSections: layout.landingSections,
        sectionOrder: [],
        layout,
    };
}

// ── Provider ─────────────────────────────────────────────────────

interface Props {
    children: React.ReactNode;
}

export function PublicWebsiteProvider({ children }: Props) {
    const pageProps = usePage().props as Record<string, any>;
    const layout = useLayoutContext();

    // Section order from Inertia page props (injected by WebsiteController)
    const sectionOrder: SectionOrderItem[] = (pageProps.sectionOrder as SectionOrderItem[]) ?? [];

    // ── Merge DB section order with static defaults ──────────────
    const resolvedSections = useMemo(() => {
        const { landingSections } = layout;

        // No custom order from backend → use static defaults
        if (!sectionOrder || sectionOrder.length === 0) {
            return landingSections;
        }

        const seen = new Set<string>();
        const result: SectionMeta[] = [];

        // DB-ordered sections first (filtered by visibility)
        for (const dbItem of sectionOrder) {
            if (!dbItem.is_visible) continue;
            const meta = landingSections.find((s) => s.id === dbItem.section_id);
            if (meta) {
                result.push(meta);
                seen.add(dbItem.section_id);
            }
        }

        // Append any static defaults not in DB (visible by default)
        for (const s of landingSections) {
            if (!seen.has(s.id)) {
                result.push(s);
            }
        }

        return result;
    }, [sectionOrder, layout.landingSections]);

    const value = useMemo<PublicWebsiteContextValue>(
        () => ({
            resolvedSections,
            sectionOrder,
            layout,
        }),
        [resolvedSections, sectionOrder, layout],
    );

    return (
        <PublicWebsiteContext.Provider value={value}>
            {children}
        </PublicWebsiteContext.Provider>
    );
}
