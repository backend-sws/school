import React from 'react';
import { motion } from 'motion/react';

/**
 * RamaNavmiDecoration — Stylized bow (Dhanush) with animated arrow.
 * Uses theme accent color, with a glowing arrow tip.
 */

const BowAndArrow = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, x: flip ? 15 : -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        width="80" height="70" viewBox="0 0 120 100" fill="none"
        className="sm:w-[90px] sm:h-[80px] lg:w-[100px] lg:h-[85px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Bow body — curved */}
        <path
            d="M25 85 Q15 50 25 15 Q30 5 35 15 Q45 50 35 85 Q30 95 25 85Z"
            stroke="var(--accent, #FDD835)"
            strokeWidth="1.5"
            fill="var(--accent, #FDD835)"
            fillOpacity="0.08"
        />
        {/* Bowstring */}
        <line x1="30" y1="13" x2="30" y2="87" stroke="var(--accent, #FDD835)" strokeWidth="0.8" opacity="0.5" />

        {/* Arrow shaft */}
        <motion.line
            x1="30" y1="50" x2="100" y2="25"
            stroke="var(--accent, #FDD835)"
            strokeWidth="1.2"
            opacity="0.9"
            animate={{ x2: [100, 105, 100], y2: [25, 23, 25] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        {/* Arrow tip */}
        <motion.path
            d="M96 23 L105 20 L100 28Z"
            fill="var(--accent, #FDD835)"
            fillOpacity="0.7"
            stroke="var(--accent, #FDD835)"
            strokeWidth="0.8"
            animate={{ x: [0, 5, 0], y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 4px var(--accent, #FDD835))' }}
        />
        {/* Arrow fletching */}
        <path d="M32 49 L28 45 L34 47" stroke="var(--accent, #FDD835)" strokeWidth="0.6" fill="none" opacity="0.5" />
        <path d="M32 51 L28 55 L34 53" stroke="var(--accent, #FDD835)" strokeWidth="0.6" fill="none" opacity="0.5" />

        {/* Decorative dots */}
        <g opacity="0.25">
            <circle cx="60" cy="38" r="1" fill="var(--accent, #FDD835)" />
            <circle cx="80" cy="30" r="0.8" fill="var(--accent, #FDD835)" />
            <circle cx="45" cy="44" r="0.7" fill="var(--accent, #FDD835)" />
        </g>
    </motion.svg>
);

const RamaNavmiDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <BowAndArrow delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <BowAndArrow flip delay={0.35} />
        </div>
    </div>
);

export default RamaNavmiDecoration;
