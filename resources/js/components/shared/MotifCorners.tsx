import React from 'react';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { THEME_MOTIFS_MAP } from '@/constants/landing/theme-motifs';
import type { LandingThemeKey, LandingMotifKey } from '@/constants/landing/types';
import type { SharedData } from '@/types';

interface MotifCornersProps {
    /** Motif key — falls back to reading data-motif from DOM (Branding.php). Only for 'corners' variant. */
    motif?: LandingMotifKey;
    /** Size of each motif element (Tailwind w/h classes). Only for 'corners' variant. */
    size?: string;
    /**
     * Layout variant:
     * - 'corners' — two CSS-mask blocks at top-right + bottom-left
     * - 'backdrop' — scattered inline SVGs from theme hashmap across the full parent
     */
    variant?: 'corners' | 'backdrop';
    /** Additional className */
    className?: string;
}

/**
 * MotifCorners — Reusable decorative motif overlay for any page section.
 *
 * **corners** mode: Two CSS-mask pattern blocks at opposing corners.
 * **backdrop** mode: Multiple culturally-appropriate SVGs scattered
 *   across the page, driven by THEME_MOTIFS_MAP hashmap.
 *
 * Theme is resolved from Inertia shared props (`branding.default_brand_theme`),
 * ensuring it works reliably during SSR and hydration.
 *
 * @example
 * <MotifCorners />                      // corner blocks
 * <MotifCorners variant="backdrop" />   // scattered theme motifs
 */
const MotifCorners = ({ motif, size = 'w-64 h-64', variant = 'corners', className }: MotifCornersProps) => {
    const { branding } = usePage<SharedData>().props;
    const resolvedTheme = (branding?.default_brand_theme as LandingThemeKey) || 'default';

    /* ── Backdrop: Scattered SVGs from theme hashmap ───── */
    if (variant === 'backdrop') {
        const config = THEME_MOTIFS_MAP[resolvedTheme] ?? THEME_MOTIFS_MAP['default'];
        if (!config) return null;

        return (
            <div
                className={cn('absolute inset-0 pointer-events-none overflow-hidden z-30', className)}
                style={{ color: 'var(--l-motif-color, var(--primary))' }}
                aria-hidden="true"
            >
                {config.motifs.map((entry) =>
                    entry.placements.map((placement, idx) => (
                        <div
                            key={`${entry.id}-${idx}`}
                            className={cn(
                                'absolute',
                                placement.size,
                            )}
                            style={{
                                top: placement.top,
                                left: placement.left,
                                opacity: placement.opacity ?? 0.05,
                                transform: `${placement.rotate ? `rotate(${placement.rotate}deg)` : ''} ${placement.flip ? 'scaleX(-1)' : ''}`.trim() || undefined,
                            }}
                        >
                            {entry.svg('100%', 'currentColor')}
                        </div>
                    ))
                )}
            </div>
        );
    }

    /* ── Corners: CSS-mask pattern blocks ───── */
    const resolvedMotif = motif ?? (
        typeof document !== 'undefined'
            ? document.documentElement.getAttribute('data-motif') as LandingMotifKey
            : null
    ) ?? 'ashoka';

    return (
        <>
            <div
                className={cn(
                    `absolute top-0 right-0 ${size} l-motif-${resolvedMotif} pointer-events-none z-20`,
                    className
                )}
                aria-hidden="true"
            />
            <div
                className={cn(
                    `absolute bottom-0 left-0 ${size} l-motif-${resolvedMotif} pointer-events-none z-20`,
                    className
                )}
                aria-hidden="true"
            />
        </>
    );
};

export default MotifCorners;
