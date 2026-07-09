import type { LandingThemeKey } from '@/constants/landing/types';
import type { ReactNode } from 'react';

/* ────────────────────────────────────────────────────────────────────
 *  Placement positions — predefined slots scattered across the page.
 *  Uses viewport-relative percentages so they distribute evenly
 *  regardless of page height.
 * ─────────────────────────────────────────────────────────────────── */
export interface MotifPlacement {
    /** % from top of container */
    top: string;
    /** % from left of container */
    left: string;
    /** Tailwind size class */
    size: string;
    /** Optional rotation in degrees */
    rotate?: number;
    /** Optional opacity override (0–1) */
    opacity?: number;
    /** Mirror horizontally */
    flip?: boolean;
}

/** A single motif definition: its SVG + scattered placements */
export interface ThemeMotifEntry {
    /** Unique key for keying */
    id: string;
    /** Inline SVG as ReactNode factory */
    svg: (size: number | string, color: string) => ReactNode;
    /** Placement slots for this motif across the page */
    placements: MotifPlacement[];
}

/** Full motif config for a theme */
export interface ThemeMotifConfig {
    /** Array of motifs with their placements */
    motifs: ThemeMotifEntry[];
}

/* ────────────────────────────────────────────────────────────────────
 *  SVG Factories — reusable inline SVGs for each motif shape.
 *  These render as actual SVGs (not masks), so they inherit
 *  the theme's motif color naturally.
 * ─────────────────────────────────────────────────────────────────── */

const DiyaSvg = (size: number | string, color: string): ReactNode => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flame */}
        <path d="M40 8 Q34 22 37 32 Q39 36 40 36 Q41 36 43 32 Q46 22 40 8Z" fill={color} opacity={0.7} />
        <path d="M40 12 Q36 22 38 30 Q39 34 40 34 Q41 34 42 30 Q44 22 40 12Z" fill={color} opacity={0.4} />
        {/* Bowl */}
        <path d="M28 40 Q28 36 34 34 L46 34 Q52 36 52 40 L50 48 Q48 52 40 52 Q32 52 30 48 Z" fill="none" stroke={color} strokeWidth="1.5" />
        {/* Base */}
        <path d="M34 52 L34 58 Q34 62 40 62 Q46 62 46 58 L46 52" fill="none" stroke={color} strokeWidth="1.2" />
        {/* Decorative dots */}
        <circle cx="40" cy="44" r="1.5" fill={color} opacity={0.5} />
        <circle cx="36" cy="42" r="1" fill={color} opacity={0.3} />
        <circle cx="44" cy="42" r="1" fill={color} opacity={0.3} />
    </svg>
);

const KalashSvg = (size: number | string, color: string): ReactNode => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pot body */}
        <path d="M28 45 Q24 35 28 28 Q32 22 40 20 Q48 22 52 28 Q56 35 52 45 Z" fill="none" stroke={color} strokeWidth="1.5" />
        {/* Pot neck */}
        <path d="M34 20 L34 16 Q34 14 40 14 Q46 14 46 16 L46 20" fill="none" stroke={color} strokeWidth="1.2" />
        {/* Coconut */}
        <circle cx="40" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.2" />
        {/* Mango leaves */}
        <path d="M36 14 Q30 6 28 2" fill="none" stroke={color} strokeWidth="1" opacity={0.6} />
        <path d="M44 14 Q50 6 52 2" fill="none" stroke={color} strokeWidth="1" opacity={0.6} />
        <path d="M38 13 Q34 4 36 0" fill="none" stroke={color} strokeWidth="0.8" opacity={0.4} />
        <path d="M42 13 Q46 4 44 0" fill="none" stroke={color} strokeWidth="0.8" opacity={0.4} />
        {/* Pot base */}
        <path d="M30 45 L30 50 Q30 54 40 54 Q50 54 50 50 L50 45" fill="none" stroke={color} strokeWidth="1.2" />
        {/* Decoration band */}
        <path d="M30 36 Q35 34 40 36 Q45 34 50 36" fill="none" stroke={color} strokeWidth="0.8" opacity={0.4} />
        <circle cx="40" cy="34" r="1.2" fill={color} opacity={0.3} />
    </svg>
);

const LotusSvg = (size: number | string, color: string): ReactNode => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Center petal */}
        <path d="M40 10 Q35 25 40 40 Q45 25 40 10Z" fill={color} opacity={0.3} stroke={color} strokeWidth="1" />
        {/* Side petals */}
        <path d="M25 20 Q32 30 40 40 Q30 32 25 20Z" fill="none" stroke={color} strokeWidth="1" opacity={0.6} />
        <path d="M55 20 Q48 30 40 40 Q50 32 55 20Z" fill="none" stroke={color} strokeWidth="1" opacity={0.6} />
        {/* Outer petals */}
        <path d="M15 32 Q28 35 40 40 Q26 38 15 32Z" fill="none" stroke={color} strokeWidth="0.8" opacity={0.4} />
        <path d="M65 32 Q52 35 40 40 Q54 38 65 32Z" fill="none" stroke={color} strokeWidth="0.8" opacity={0.4} />
        {/* Bottom petals (reflection) */}
        <path d="M30 52 Q36 46 40 40 Q34 48 30 52Z" fill="none" stroke={color} strokeWidth="0.8" opacity={0.3} />
        <path d="M50 52 Q44 46 40 40 Q46 48 50 52Z" fill="none" stroke={color} strokeWidth="0.8" opacity={0.3} />
        {/* Center dot */}
        <circle cx="40" cy="40" r="2" fill={color} opacity={0.5} />
    </svg>
);

const MudraSvg = (size: number | string, color: string): ReactNode => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lotus bud */}
        <path d="M40 8 Q35 18 37 26 Q39 30 40 30 Q41 30 43 26 Q45 18 40 8Z" fill={color} opacity={0.5} stroke={color} strokeWidth="1" />
        <path d="M34 14 Q37 22 39 26" fill="none" stroke={color} strokeWidth="0.8" opacity={0.5} />
        <path d="M46 14 Q43 22 41 26" fill="none" stroke={color} strokeWidth="0.8" opacity={0.5} />
        {/* Hand curves */}
        <path d="M35 30 Q34 34 30 38 Q26 44 25 50 Q24 56 28 60" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M45 30 Q46 34 50 38 Q54 44 55 50 Q56 56 52 60" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Thumb detail */}
        <path d="M30 38 L28 34 Q27 33 29 33 L32 36" fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity={0.5} />
        <path d="M50 38 L52 34 Q53 33 51 33 L48 36" fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity={0.5} />
        {/* Henna arc */}
        <path d="M28 48 Q35 45 42 48 Q49 45 52 48" fill="none" stroke={color} strokeWidth="0.6" opacity={0.3} />
        {/* Bangle */}
        <path d="M26 58 Q25 56 26 54" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={0.4} />
        <path d="M54 58 Q55 56 54 54" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity={0.4} />
    </svg>
);

const OmSvg = (size: number | string, color: string): ReactNode => (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stylized Om strokes */}
        <path d="M25 45 Q20 35 25 28 Q30 22 38 24 Q42 25 42 30 Q42 35 38 38 Q34 40 30 38" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 38 Q44 42 50 38 Q56 32 52 26 Q48 22 44 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M25 45 Q28 50 35 50 Q42 50 45 46 Q48 42 50 38" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Chandrabindu */}
        <path d="M44 16 Q48 12 52 16" fill="none" stroke={color} strokeWidth="1" opacity={0.6} />
        <circle cx="48" cy="10" r="1.5" fill={color} opacity={0.5} />
    </svg>
);

/* ────────────────────────────────────────────────────────────────────
 *  THEME → MOTIFS HASHMAP
 *  Single source of truth: each theme maps to its culturally
 *  appropriate motifs with pre-defined scattered placements.
 *  Positions use % so they distribute evenly across any page height.
 * ─────────────────────────────────────────────────────────────────── */

export const THEME_MOTIFS_MAP: Partial<Record<LandingThemeKey, ThemeMotifConfig>> = {
    navratri: {
        motifs: [
            {
                id: 'diya',
                svg: DiyaSvg,
                placements: [
                    { top: '3%', left: '2%', size: 'w-20 h-20', rotate: -10, opacity: 0.12 },
                    { top: '18%', left: '90%', size: 'w-16 h-16', rotate: 12, opacity: 0.10 },
                    { top: '55%', left: '93%', size: 'w-18 h-18', rotate: -8, opacity: 0.12, flip: true },
                    { top: '82%', left: '4%', size: 'w-16 h-16', rotate: 5, opacity: 0.10 },
                ],
            },
            {
                id: 'kalash',
                svg: KalashSvg,
                placements: [
                    { top: '10%', left: '88%', size: 'w-24 h-24', rotate: 8, opacity: 0.10 },
                    { top: '42%', left: '1%', size: 'w-20 h-20', rotate: -5, opacity: 0.12 },
                    { top: '72%', left: '91%', size: 'w-16 h-16', rotate: 10, opacity: 0.08 },
                ],
            },
            {
                id: 'lotus',
                svg: LotusSvg,
                placements: [
                    { top: '28%', left: '3%', size: 'w-24 h-24', opacity: 0.12 },
                    { top: '48%', left: '92%', size: 'w-20 h-20', rotate: 15, opacity: 0.10 },
                    { top: '88%', left: '90%', size: 'w-16 h-16', rotate: -12, opacity: 0.08 },
                ],
            },
            {
                id: 'mudra',
                svg: MudraSvg,
                placements: [
                    { top: '35%', left: '91%', size: 'w-20 h-20', rotate: -10, opacity: 0.10, flip: true },
                    { top: '65%', left: '2%', size: 'w-24 h-24', rotate: 8, opacity: 0.12 },
                    { top: '92%', left: '3%', size: 'w-16 h-16', opacity: 0.08 },
                ],
            },
        ],
    },

    diwali: {
        motifs: [
            {
                id: 'diya',
                svg: DiyaSvg,
                placements: [
                    { top: '3%', left: '3%', size: 'w-20 h-20', rotate: -8, opacity: 0.12 },
                    { top: '25%', left: '91%', size: 'w-16 h-16', rotate: 10, opacity: 0.10 },
                    { top: '50%', left: '2%', size: 'w-18 h-18', rotate: 5, opacity: 0.12 },
                    { top: '75%', left: '92%', size: 'w-16 h-16', rotate: -12, opacity: 0.10 },
                    { top: '90%', left: '4%', size: 'w-20 h-20', rotate: 8, opacity: 0.08 },
                ],
            },
            {
                id: 'lotus',
                svg: LotusSvg,
                placements: [
                    { top: '15%', left: '90%', size: 'w-24 h-24', opacity: 0.10 },
                    { top: '40%', left: '92%', size: 'w-16 h-16', rotate: 20, opacity: 0.08 },
                    { top: '65%', left: '3%', size: 'w-20 h-20', rotate: -10, opacity: 0.10 },
                ],
            },
            {
                id: 'om',
                svg: OmSvg,
                placements: [
                    { top: '32%', left: '2%', size: 'w-16 h-16', opacity: 0.10 },
                    { top: '58%', left: '91%', size: 'w-20 h-20', rotate: -5, opacity: 0.08 },
                    { top: '85%', left: '91%', size: 'w-16 h-16', opacity: 0.08 },
                ],
            },
        ],
    },

    holi: {
        motifs: [
            {
                id: 'lotus',
                svg: LotusSvg,
                placements: [
                    { top: '6%', left: '3%', size: 'w-20 h-20', opacity: 0.12 },
                    { top: '30%', left: '91%', size: 'w-24 h-24', rotate: 15, opacity: 0.10 },
                    { top: '60%', left: '2%', size: 'w-16 h-16', rotate: -10, opacity: 0.10 },
                    { top: '85%', left: '92%', size: 'w-20 h-20', opacity: 0.08 },
                ],
            },
        ],
    },

    /* Default fallback — subtle lotus scattered sparsely */
    default: {
        motifs: [
            {
                id: 'lotus',
                svg: LotusSvg,
                placements: [
                    { top: '10%', left: '91%', size: 'w-20 h-20', opacity: 0.08 },
                    { top: '50%', left: '2%', size: 'w-16 h-16', rotate: 15, opacity: 0.08 },
                    { top: '85%', left: '92%', size: 'w-16 h-16', rotate: -10, opacity: 0.06 },
                ],
            },
        ],
    },
};
