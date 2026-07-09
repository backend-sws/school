import React from 'react';
import { motion } from 'motion/react';

/**
 * GangaurDecoration — Stylized sindoor/kumkum circles with draped garland.
 * Celebrates Goddess Gauri with concentric sacred circles and marigold hints.
 */

const SindoorCircle = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="70" height="70" viewBox="0 0 100 100" fill="none"
        className="sm:w-[80px] sm:h-[80px] lg:w-[90px] lg:h-[90px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Main sindoor circle */}
        <motion.circle
            cx="50" cy="38" r="22"
            stroke="var(--accent, #C2185B)"
            strokeWidth="1.5"
            fill="var(--accent, #C2185B)"
            fillOpacity="0.08"
            animate={{ r: [22, 23, 22] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <circle cx="50" cy="38" r="14" stroke="var(--accent, #C2185B)" strokeWidth="1" opacity="0.5" fill="none" />
        <motion.circle
            cx="50" cy="38" r="6"
            fill="var(--accent, #C2185B)"
            fillOpacity="0.25"
            animate={{ fillOpacity: [0.2, 0.35, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />

        {/* Marigold garland draped curves */}
        <motion.path
            d="M20 55 Q35 68 50 58 Q65 68 80 55"
            stroke="var(--primary, #FF9800)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
            animate={{ d: ['M20 55 Q35 68 50 58 Q65 68 80 55', 'M20 56 Q35 70 50 59 Q65 70 80 56', 'M20 55 Q35 68 50 58 Q65 68 80 55'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
        <motion.path
            d="M15 62 Q32 78 50 65 Q68 78 85 62"
            stroke="var(--primary, #FF9800)"
            strokeWidth="0.8"
            fill="none"
            opacity="0.35"
            animate={{ d: ['M15 62 Q32 78 50 65 Q68 78 85 62', 'M15 63 Q32 80 50 66 Q68 80 85 63', 'M15 62 Q32 78 50 65 Q68 78 85 62'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Garland flower dots */}
        <g opacity="0.4">
            <motion.circle cx="28" cy="60" r="2" fill="var(--primary, #FF9800)"
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.circle cx="40" cy="64" r="1.8" fill="var(--accent, #C2185B)"
                animate={{ scale: [0.9, 1.2, 0.9] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            />
            <motion.circle cx="50" cy="60" r="2" fill="var(--primary, #FF9800)"
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
            />
            <motion.circle cx="60" cy="64" r="1.8" fill="var(--accent, #C2185B)"
                animate={{ scale: [0.9, 1.2, 0.9] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.9 }}
            />
            <motion.circle cx="72" cy="60" r="2" fill="var(--primary, #FF9800)"
                animate={{ scale: [0.8, 1.1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.2 }}
            />
        </g>

        {/* Sparkle dots */}
        <g opacity="0.25">
            <circle cx="30" cy="28" r="1" fill="var(--accent, #C2185B)" />
            <circle cx="70" cy="28" r="1" fill="var(--accent, #C2185B)" />
            <circle cx="50" cy="14" r="0.8" fill="var(--accent, #C2185B)" />
        </g>
    </motion.svg>
);

const GangaurDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <SindoorCircle delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <SindoorCircle flip delay={0.35} />
        </div>
    </div>
);

export default GangaurDecoration;
