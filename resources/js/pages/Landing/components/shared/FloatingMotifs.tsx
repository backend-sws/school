import React, { useMemo } from 'react';

/**
 * Individual motif SVG elements extracted from the Madhubani pattern library.
 * Each renders as a standalone decorative element (not a repeating tile).
 */
const MOTIF_SVGS: React.FC<{ color?: string }>[] = [
    // 1. Lotus flower
    ({ color = 'currentColor' }) => (
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="30" cy="14" rx="5" ry="10" stroke={color} strokeWidth="1.2" />
            <ellipse cx="30" cy="46" rx="5" ry="10" stroke={color} strokeWidth="1.2" />
            <ellipse cx="14" cy="30" rx="10" ry="5" stroke={color} strokeWidth="1.2" />
            <ellipse cx="46" cy="30" rx="10" ry="5" stroke={color} strokeWidth="1.2" />
            <ellipse cx="18" cy="18" rx="8" ry="4" stroke={color} strokeWidth="0.8" transform="rotate(-45 18 18)" />
            <ellipse cx="42" cy="18" rx="8" ry="4" stroke={color} strokeWidth="0.8" transform="rotate(45 42 18)" />
            <ellipse cx="18" cy="42" rx="8" ry="4" stroke={color} strokeWidth="0.8" transform="rotate(45 18 42)" />
            <ellipse cx="42" cy="42" rx="8" ry="4" stroke={color} strokeWidth="0.8" transform="rotate(-45 42 42)" />
            <circle cx="30" cy="30" r="5" fill={color} fillOpacity="0.15" />
            <circle cx="30" cy="30" r="2" fill={color} fillOpacity="0.4" />
        </svg>
    ),

    // 2. Fish (fertility symbol)
    ({ color = 'currentColor' }) => (
        <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,25 Q40,5 70,25" stroke={color} strokeWidth="1.5" />
            <path d="M10,25 Q40,45 70,25" stroke={color} strokeWidth="1.5" />
            <circle cx="25" cy="23" r="3" stroke={color} strokeWidth="1" />
            <circle cx="25" cy="23" r="1" fill={color} />
            <path d="M70,25 L82,15 L82,35 Z" stroke={color} strokeWidth="1" />
            <path d="M35,21 Q40,18 45,21" stroke={color} strokeWidth="0.6" />
            <path d="M45,21 Q50,18 55,21" stroke={color} strokeWidth="0.6" />
            <path d="M35,29 Q40,26 45,29" stroke={color} strokeWidth="0.6" />
            <path d="M45,29 Q50,26 55,29" stroke={color} strokeWidth="0.6" />
        </svg>
    ),

    // 3. Peacock feather eye
    ({ color = 'currentColor' }) => (
        <svg viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="25" cy="30" rx="16" ry="22" stroke={color} strokeWidth="1.5" />
            <ellipse cx="25" cy="30" rx="10" ry="15" stroke={color} strokeWidth="1" />
            <ellipse cx="25" cy="30" rx="5" ry="8" stroke={color} strokeWidth="1" />
            <ellipse cx="25" cy="27" rx="2.5" ry="4" fill={color} fillOpacity="0.2" />
            <circle cx="25" cy="25" r="2" fill={color} fillOpacity="0.4" />
            <line x1="25" y1="4" x2="25" y2="8" stroke={color} strokeWidth="0.8" />
            <line x1="25" y1="52" x2="25" y2="56" stroke={color} strokeWidth="0.8" />
        </svg>
    ),

    // 4. Sun/mandala circle
    ({ color = 'currentColor' }) => (
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="12" stroke={color} strokeWidth="1.5" />
            <circle cx="25" cy="25" r="7" stroke={color} strokeWidth="1" />
            <circle cx="25" cy="25" r="3" fill={color} fillOpacity="0.3" />
            {/* Rays */}
            <line x1="25" y1="2" x2="25" y2="10" stroke={color} strokeWidth="0.8" />
            <line x1="25" y1="40" x2="25" y2="48" stroke={color} strokeWidth="0.8" />
            <line x1="2" y1="25" x2="10" y2="25" stroke={color} strokeWidth="0.8" />
            <line x1="40" y1="25" x2="48" y2="25" stroke={color} strokeWidth="0.8" />
            <line x1="8" y1="8" x2="14" y2="14" stroke={color} strokeWidth="0.6" />
            <line x1="36" y1="8" x2="42" y2="14" stroke={color} strokeWidth="0.6" />
            <line x1="8" y1="42" x2="14" y2="36" stroke={color} strokeWidth="0.6" />
            <line x1="36" y1="42" x2="42" y2="36" stroke={color} strokeWidth="0.6" />
        </svg>
    ),

    // 5. Dot cluster
    ({ color = 'currentColor' }) => (
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="6" stroke={color} strokeWidth="1" />
            <circle cx="20" cy="20" r="2" fill={color} fillOpacity="0.4" />
            <circle cx="10" cy="20" r="1.5" fill={color} fillOpacity="0.3" />
            <circle cx="30" cy="20" r="1.5" fill={color} fillOpacity="0.3" />
            <circle cx="20" cy="10" r="1.5" fill={color} fillOpacity="0.3" />
            <circle cx="20" cy="30" r="1.5" fill={color} fillOpacity="0.3" />
            <circle cx="13" cy="13" r="1" fill={color} fillOpacity="0.2" />
            <circle cx="27" cy="13" r="1" fill={color} fillOpacity="0.2" />
            <circle cx="13" cy="27" r="1" fill={color} fillOpacity="0.2" />
            <circle cx="27" cy="27" r="1" fill={color} fillOpacity="0.2" />
        </svg>
    ),

    // 6. Paisley/mango motif
    ({ color = 'currentColor' }) => (
        <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,5 Q38,15 35,35 Q32,55 20,55 Q8,55 5,35 Q2,15 20,5Z" stroke={color} strokeWidth="1.5" />
            <path d="M20,12 Q32,20 30,35 Q28,48 20,48 Q12,48 10,35 Q8,20 20,12Z" stroke={color} strokeWidth="0.8" />
            <circle cx="20" cy="30" r="3" fill={color} fillOpacity="0.2" />
            <circle cx="20" cy="30" r="1.2" fill={color} fillOpacity="0.4" />
            <path d="M20,5 Q25,0 28,5" stroke={color} strokeWidth="0.8" />
        </svg>
    ),
];

/** Seeded random number generator for stable positions per mount */
function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

interface FloatingMotifsProps {
    /** Number of motifs to scatter (default 10) */
    count?: number;
    /** Opacity of motifs (default 0.04) */
    opacity?: number;
    /** Extra class on wrapper */
    className?: string;
    /** Color for motif strokes & fills */
    color?: string;
    /** Random seed for consistent positions (default 42) */
    seed?: number;
}

/**
 * Scatters individual Madhubani motifs randomly across a positioned container.
 * Parent must have `position: relative` and `overflow: hidden`.
 */
export default function FloatingMotifs({
    count = 10,
    opacity = 0.04,
    className = '',
    color = 'var(--l-primary, currentColor)',
    seed = 42,
}: FloatingMotifsProps) {
    const motifs = useMemo(() => {
        const rng = seededRandom(seed);
        return Array.from({ length: count }, (_, i) => {
            const MotifSvg = MOTIF_SVGS[Math.floor(rng() * MOTIF_SVGS.length)];
            const size = 40 + rng() * 60; // 40–100px
            const top = rng() * 100;
            const left = rng() * 100;
            const rotation = rng() * 360;
            const motifOpacity = 0.5 + rng() * 0.5; // 50–100% of base opacity

            return { id: i, MotifSvg, size, top, left, rotation, motifOpacity };
        });
    }, [count, seed]);

    return (
        <div
            className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
            aria-hidden="true"
        >
            {motifs.map(({ id, MotifSvg, size, top, left, rotation, motifOpacity }) => (
                <div
                    key={id}
                    className="absolute"
                    style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        width: size,
                        height: size,
                        transform: `rotate(${rotation}deg) translate(-50%, -50%)`,
                        opacity: opacity * motifOpacity,
                    }}
                >
                    <MotifSvg color={color} />
                </div>
            ))}
        </div>
    );
}
