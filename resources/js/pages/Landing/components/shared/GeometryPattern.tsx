import React, { useState, useEffect } from 'react';
import { BorderBeam } from '@/components/ui/border-beam';

export type PatternVariant = 'madhubani' | 'lotus-border' | 'fish-border' | 'peacock-border' | 'zigzag-border' | 'dots-border';

export const ALL_PATTERN_VARIANTS: PatternVariant[] = [
    'madhubani', 'lotus-border', 'fish-border', 'peacock-border', 'zigzag-border', 'dots-border',
];

interface GeometryPatternProps {
    variant?: PatternVariant;
    opacity?: number;
    className?: string;
    /** Position: 'top' | 'bottom' | 'both' | 'full' */
    position?: 'top' | 'bottom' | 'both' | 'full';
    /** Auto-cycle through all patterns */
    autoSwap?: boolean;
    /** Interval in ms for auto-swap (default 5000) */
    interval?: number;
    /** Show BorderBeam around pattern bands */
    borderBeam?: boolean;
}

/**
 * Madhubani/Mithila painting-inspired border patterns.
 * Renders as horizontal decorative bands — parent must have `relative overflow-hidden`.
 */
export default function GeometryPattern({
    variant: fixedVariant,
    opacity = 0.12,
    className = '',
    position = 'both',
    autoSwap = false,
    interval = 5000,
    borderBeam = false,
}: GeometryPatternProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoSwap) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ALL_PATTERN_VARIANTS.length);
        }, interval);
        return () => clearInterval(timer);
    }, [autoSwap, interval]);

    const variant = autoSwap ? ALL_PATTERN_VARIANTS[currentIndex] : (fixedVariant || 'madhubani');
    const showTop = position === 'top' || position === 'both';
    const showBottom = position === 'bottom' || position === 'both';

    const transitionStyle = autoSwap
        ? { opacity, transition: 'opacity 0.8s ease-in-out' }
        : { opacity };

    if (position === 'full') {
        return (
            <div
                key={variant}
                className={`absolute inset-0 pointer-events-none z-0 ${className}`}
                style={transitionStyle}
                aria-hidden="true"
            >
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>{PATTERN_DEFS[variant]}</defs>
                    <rect width="100%" height="100%" fill={`url(#pattern-${variant})`} />
                </svg>
                {borderBeam && (
                    <BorderBeam
                        size={300}
                        duration={10}
                        colorFrom="var(--l-primary)"
                        colorTo="var(--l-accent)"
                    />
                )}
            </div>
        );
    }

    return (
        <>
            {showTop && (
                <div
                    key={`top-${variant}`}
                    className={`absolute top-0 left-0 right-0 h-16 pointer-events-none z-0 rounded-b-xl overflow-hidden ${className}`}
                    style={transitionStyle}
                    aria-hidden="true"
                >
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <defs>{PATTERN_DEFS[variant]}</defs>
                        <rect width="100%" height="100%" fill={`url(#pattern-${variant})`} />
                    </svg>
                    {borderBeam && (
                        <BorderBeam
                            size={200}
                            duration={8}
                            colorFrom="var(--l-primary)"
                            colorTo="var(--l-accent)"
                        />
                    )}
                </div>
            )}
            {showBottom && (
                <div
                    key={`bottom-${variant}`}
                    className={`absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-0 rounded-t-xl overflow-hidden ${className}`}
                    style={transitionStyle}
                    aria-hidden="true"
                >
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <defs>{PATTERN_DEFS[variant]}</defs>
                        <rect width="100%" height="100%" fill={`url(#pattern-${variant})`} />
                    </svg>
                    {borderBeam && (
                        <BorderBeam
                            size={200}
                            duration={8}
                            delay={4}
                            colorFrom="var(--l-accent)"
                            colorTo="var(--l-primary)"
                            reverse
                        />
                    )}
                </div>
            )}
        </>
    );
}

const PATTERN_DEFS: Record<PatternVariant, React.ReactNode> = {
    /**
     * Madhubani border: double-line frame with zigzag fill, dots, and lotus buds
     */
    'madhubani': (
        <pattern id="pattern-madhubani" x="0" y="0" width="120" height="64" patternUnits="userSpaceOnUse">
            {/* Top and bottom border lines */}
            <line x1="0" y1="2" x2="120" y2="2" stroke="#B91C1C" strokeWidth="2" />
            <line x1="0" y1="6" x2="120" y2="6" stroke="#D97706" strokeWidth="1" />
            <line x1="0" y1="58" x2="120" y2="58" stroke="#D97706" strokeWidth="1" />
            <line x1="0" y1="62" x2="120" y2="62" stroke="#B91C1C" strokeWidth="2" />

            {/* Zigzag band */}
            <polyline points="0,12 10,20 20,12 30,20 40,12 50,20 60,12 70,20 80,12 90,20 100,12 110,20 120,12"
                fill="none" stroke="#B91C1C" strokeWidth="1.5" />
            <polyline points="0,52 10,44 20,52 30,44 40,52 50,44 60,52 70,44 80,52 90,44 100,52 110,44 120,52"
                fill="none" stroke="#B91C1C" strokeWidth="1.5" />

            {/* Central lotus motif */}
            <circle cx="60" cy="32" r="8" fill="none" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="60" cy="32" r="3" fill="#B91C1C" fillOpacity="0.6" />
            {/* Petals */}
            <ellipse cx="60" cy="20" rx="4" ry="6" fill="none" stroke="#15803D" strokeWidth="1" />
            <ellipse cx="60" cy="44" rx="4" ry="6" fill="none" stroke="#15803D" strokeWidth="1" />
            <ellipse cx="48" cy="32" rx="6" ry="4" fill="none" stroke="#15803D" strokeWidth="1" />
            <ellipse cx="72" cy="32" rx="6" ry="4" fill="none" stroke="#15803D" strokeWidth="1" />

            {/* Corner dots */}
            <circle cx="15" cy="32" r="2.5" fill="#D97706" fillOpacity="0.7" />
            <circle cx="105" cy="32" r="2.5" fill="#D97706" fillOpacity="0.7" />
            <circle cx="30" cy="32" r="1.5" fill="#B91C1C" fillOpacity="0.5" />
            <circle cx="90" cy="32" r="1.5" fill="#B91C1C" fillOpacity="0.5" />
        </pattern>
    ),

    /**
     * Lotus border: repeating lotus flowers in Madhubani style
     */
    'lotus-border': (
        <pattern id="pattern-lotus-border" x="0" y="0" width="80" height="64" patternUnits="userSpaceOnUse">
            {/* Border lines */}
            <line x1="0" y1="1" x2="80" y2="1" stroke="#B91C1C" strokeWidth="1.5" />
            <line x1="0" y1="63" x2="80" y2="63" stroke="#B91C1C" strokeWidth="1.5" />

            {/* Lotus flower */}
            <ellipse cx="40" cy="24" rx="5" ry="10" fill="none" stroke="#DC2626" strokeWidth="1.2" />
            <ellipse cx="40" cy="40" rx="5" ry="10" fill="none" stroke="#DC2626" strokeWidth="1.2" />
            <ellipse cx="28" cy="32" rx="10" ry="5" fill="none" stroke="#DC2626" strokeWidth="1.2" />
            <ellipse cx="52" cy="32" rx="10" ry="5" fill="none" stroke="#DC2626" strokeWidth="1.2" />
            <ellipse cx="30" cy="22" rx="8" ry="4" fill="none" stroke="#EA580C" strokeWidth="0.8" transform="rotate(-45 30 22)" />
            <ellipse cx="50" cy="22" rx="8" ry="4" fill="none" stroke="#EA580C" strokeWidth="0.8" transform="rotate(45 50 22)" />
            <ellipse cx="30" cy="42" rx="8" ry="4" fill="none" stroke="#EA580C" strokeWidth="0.8" transform="rotate(45 30 42)" />
            <ellipse cx="50" cy="42" rx="8" ry="4" fill="none" stroke="#EA580C" strokeWidth="0.8" transform="rotate(-45 50 42)" />
            <circle cx="40" cy="32" r="4" fill="#D97706" fillOpacity="0.5" />
            <circle cx="40" cy="32" r="1.5" fill="#B91C1C" />

            {/* Dots between flowers */}
            <circle cx="5" cy="10" r="1.5" fill="#15803D" />
            <circle cx="75" cy="10" r="1.5" fill="#15803D" />
            <circle cx="5" cy="54" r="1.5" fill="#15803D" />
            <circle cx="75" cy="54" r="1.5" fill="#15803D" />
        </pattern>
    ),

    /**
     * Fish border: Madhubani fish motif (symbol of fertility/prosperity)
     */
    'fish-border': (
        <pattern id="pattern-fish-border" x="0" y="0" width="100" height="64" patternUnits="userSpaceOnUse">
            {/* Border lines */}
            <line x1="0" y1="2" x2="100" y2="2" stroke="#B91C1C" strokeWidth="1.5" />
            <line x1="0" y1="5" x2="100" y2="5" stroke="#D97706" strokeWidth="0.8" />
            <line x1="0" y1="59" x2="100" y2="59" stroke="#D97706" strokeWidth="0.8" />
            <line x1="0" y1="62" x2="100" y2="62" stroke="#B91C1C" strokeWidth="1.5" />

            {/* Fish body — two arcs */}
            <path d="M20,32 Q50,12 80,32" fill="none" stroke="#1D4ED8" strokeWidth="1.5" />
            <path d="M20,32 Q50,52 80,32" fill="none" stroke="#1D4ED8" strokeWidth="1.5" />
            {/* Fish eye */}
            <circle cx="35" cy="30" r="3" fill="none" stroke="#1D4ED8" strokeWidth="1" />
            <circle cx="35" cy="30" r="1" fill="#1D4ED8" />
            {/* Fish tail */}
            <path d="M80,32 L92,22 L92,42 Z" fill="none" stroke="#1D4ED8" strokeWidth="1" />
            {/* Scales */}
            <path d="M45,28 Q50,25 55,28" fill="none" stroke="#2563EB" strokeWidth="0.6" />
            <path d="M55,28 Q60,25 65,28" fill="none" stroke="#2563EB" strokeWidth="0.6" />
            <path d="M45,36 Q50,33 55,36" fill="none" stroke="#2563EB" strokeWidth="0.6" />
            <path d="M55,36 Q60,33 65,36" fill="none" stroke="#2563EB" strokeWidth="0.6" />
            {/* Decorative dots */}
            <circle cx="10" cy="32" r="2" fill="#D97706" fillOpacity="0.6" />
            <circle cx="95" cy="12" r="1.5" fill="#DC2626" fillOpacity="0.5" />
            <circle cx="95" cy="52" r="1.5" fill="#DC2626" fillOpacity="0.5" />
        </pattern>
    ),

    /**
     * Peacock border: peacock feather eye motif
     */
    'peacock-border': (
        <pattern id="pattern-peacock-border" x="0" y="0" width="90" height="64" patternUnits="userSpaceOnUse">
            {/* Border lines */}
            <line x1="0" y1="1" x2="90" y2="1" stroke="#15803D" strokeWidth="1.5" />
            <line x1="0" y1="63" x2="90" y2="63" stroke="#15803D" strokeWidth="1.5" />

            {/* Peacock feather eye */}
            <ellipse cx="45" cy="32" rx="16" ry="20" fill="none" stroke="#15803D" strokeWidth="1.5" />
            <ellipse cx="45" cy="32" rx="10" ry="14" fill="none" stroke="#1D4ED8" strokeWidth="1" />
            <ellipse cx="45" cy="32" rx="5" ry="8" fill="none" stroke="#0EA5E9" strokeWidth="1" />
            <ellipse cx="45" cy="30" rx="2.5" ry="4" fill="#1D4ED8" fillOpacity="0.4" />
            <circle cx="45" cy="28" r="2" fill="#15803D" fillOpacity="0.6" />

            {/* Fringe lines */}
            <line x1="45" y1="8" x2="45" y2="12" stroke="#15803D" strokeWidth="0.8" />
            <line x1="45" y1="52" x2="45" y2="56" stroke="#15803D" strokeWidth="0.8" />
            <line x1="25" y1="20" x2="29" y2="22" stroke="#15803D" strokeWidth="0.6" />
            <line x1="65" y1="20" x2="61" y2="22" stroke="#15803D" strokeWidth="0.6" />
            <line x1="25" y1="44" x2="29" y2="42" stroke="#15803D" strokeWidth="0.6" />
            <line x1="65" y1="44" x2="61" y2="42" stroke="#15803D" strokeWidth="0.6" />

            {/* Corner dots */}
            <circle cx="10" cy="32" r="2" fill="#D97706" fillOpacity="0.5" />
            <circle cx="80" cy="32" r="2" fill="#D97706" fillOpacity="0.5" />
        </pattern>
    ),

    /**
     * Zigzag border: classic Madhubani double-zigzag
     */
    'zigzag-border': (
        <pattern id="pattern-zigzag-border" x="0" y="0" width="40" height="64" patternUnits="userSpaceOnUse">
            {/* Outer border */}
            <line x1="0" y1="1" x2="40" y2="1" stroke="#B91C1C" strokeWidth="2" />
            <line x1="0" y1="63" x2="40" y2="63" stroke="#B91C1C" strokeWidth="2" />

            {/* Upper zigzag band */}
            <polyline points="0,8 10,18 20,8 30,18 40,8" fill="none" stroke="#D97706" strokeWidth="1.5" />
            <polyline points="0,18 10,8 20,18 30,8 40,18" fill="none" stroke="#B91C1C" strokeWidth="1.5" />

            {/* Center line with dots */}
            <line x1="0" y1="32" x2="40" y2="32" stroke="#15803D" strokeWidth="0.8" />
            <circle cx="10" cy="32" r="2" fill="#D97706" fillOpacity="0.6" />
            <circle cx="30" cy="32" r="2" fill="#D97706" fillOpacity="0.6" />

            {/* Lower zigzag band */}
            <polyline points="0,46 10,56 20,46 30,56 40,46" fill="none" stroke="#D97706" strokeWidth="1.5" />
            <polyline points="0,56 10,46 20,56 30,46 40,56" fill="none" stroke="#B91C1C" strokeWidth="1.5" />
        </pattern>
    ),

    /**
     * Dots border: concentric dot clusters (Madhubani fill pattern)
     */
    'dots-border': (
        <pattern id="pattern-dots-border" x="0" y="0" width="60" height="64" patternUnits="userSpaceOnUse">
            {/* Border lines */}
            <line x1="0" y1="2" x2="60" y2="2" stroke="#B91C1C" strokeWidth="1.5" />
            <line x1="0" y1="62" x2="60" y2="62" stroke="#B91C1C" strokeWidth="1.5" />

            {/* Dot cluster 1 */}
            <circle cx="30" cy="20" r="4" fill="none" stroke="#D97706" strokeWidth="1" />
            <circle cx="30" cy="20" r="1.5" fill="#B91C1C" />
            <circle cx="22" cy="20" r="1" fill="#15803D" />
            <circle cx="38" cy="20" r="1" fill="#15803D" />
            <circle cx="30" cy="12" r="1" fill="#1D4ED8" />
            <circle cx="30" cy="28" r="1" fill="#1D4ED8" />

            {/* Dot cluster 2 */}
            <circle cx="30" cy="44" r="4" fill="none" stroke="#15803D" strokeWidth="1" />
            <circle cx="30" cy="44" r="1.5" fill="#D97706" />
            <circle cx="22" cy="44" r="1" fill="#B91C1C" />
            <circle cx="38" cy="44" r="1" fill="#B91C1C" />
            <circle cx="30" cy="36" r="1" fill="#D97706" />
            <circle cx="30" cy="52" r="1" fill="#D97706" />

            {/* Corner small dots */}
            <circle cx="10" cy="32" r="1.5" fill="#B91C1C" fillOpacity="0.5" />
            <circle cx="50" cy="32" r="1.5" fill="#15803D" fillOpacity="0.5" />
        </pattern>
    ),
};
