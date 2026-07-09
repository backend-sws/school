import React from 'react';
import { motion } from 'motion/react';

/**
 * JanmashtamiDecoration — Peacock feather with animated eye and decorative flute.
 * Celebrates Lord Krishna's birth with his iconic symbols.
 */

const PeacockFeather = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, rotate: flip ? 5 : -5 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        width="75" height="80" viewBox="0 0 100 110" fill="none"
        className="sm:w-[85px] sm:h-[90px] lg:w-[95px] lg:h-[100px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Feather shaft */}
        <path d="M50 105 Q48 70 50 30" stroke="var(--accent, #2E7D32)" strokeWidth="1.2" opacity="0.7" />

        {/* Outer feather shape */}
        <path
            d="M50 20 Q30 40 25 60 Q22 75 35 80 Q45 82 50 70 Q55 82 65 80 Q78 75 75 60 Q70 40 50 20Z"
            stroke="var(--accent, #2E7D32)"
            strokeWidth="1.2"
            fill="var(--accent, #2E7D32)"
            fillOpacity="0.06"
        />

        {/* Inner feather barbs */}
        <path d="M50 30 Q38 45 32 60" stroke="var(--accent, #2E7D32)" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M50 30 Q62 45 68 60" stroke="var(--accent, #2E7D32)" strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M50 35 Q40 48 36 65" stroke="var(--accent, #2E7D32)" strokeWidth="0.4" fill="none" opacity="0.3" />
        <path d="M50 35 Q60 48 64 65" stroke="var(--accent, #2E7D32)" strokeWidth="0.4" fill="none" opacity="0.3" />

        {/* Peacock eye — the iconic pattern */}
        <motion.ellipse
            cx="50" cy="55" rx="12" ry="15"
            stroke="#1565C0"
            strokeWidth="1.5"
            fill="#1565C0"
            fillOpacity="0.1"
            animate={{ ry: [15, 16, 15], fillOpacity: [0.08, 0.15, 0.08] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <ellipse cx="50" cy="55" rx="7" ry="10" stroke="#00897B" strokeWidth="1" fill="none" opacity="0.5" />
        <motion.circle
            cx="50" cy="53" r="4"
            fill="#1565C0"
            fillOpacity="0.3"
            animate={{ fillOpacity: [0.2, 0.4, 0.2], r: [4, 4.5, 4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 3px rgba(21, 101, 192, 0.3))' }}
        />
        <circle cx="50" cy="52" r="1.5" fill="#FFD700" fillOpacity="0.5" />

        {/* Tiny barb lines at feather top */}
        <g opacity="0.2">
            <line x1="42" y1="25" x2="38" y2="22" stroke="var(--accent, #2E7D32)" strokeWidth="0.5" />
            <line x1="58" y1="25" x2="62" y2="22" stroke="var(--accent, #2E7D32)" strokeWidth="0.5" />
            <line x1="46" y1="22" x2="44" y2="18" stroke="var(--accent, #2E7D32)" strokeWidth="0.5" />
            <line x1="54" y1="22" x2="56" y2="18" stroke="var(--accent, #2E7D32)" strokeWidth="0.5" />
        </g>
    </motion.svg>
);

const JanmashtamiDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <PeacockFeather delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <PeacockFeather flip delay={0.35} />
        </div>
    </div>
);

export default JanmashtamiDecoration;
