import React from 'react';
import { motion } from 'motion/react';

/**
 * AkshayaDecoration — Sacred Kalash (pot) with coconut and mango leaves.
 * Symbol of abundance, used during Akshaya Tritiya.
 */

const KalashMotif = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="70" height="80" viewBox="0 0 100 120" fill="none"
        className="sm:w-[80px] sm:h-[90px] lg:w-[85px] lg:h-[95px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Pot body */}
        <path
            d="M30 90 Q28 65 35 50 L65 50 Q72 65 70 90 Z"
            stroke="var(--accent, #F57F17)"
            strokeWidth="1.3"
            fill="var(--accent, #F57F17)"
            fillOpacity="0.08"
        />

        {/* Pot rim */}
        <line x1="32" y1="50" x2="68" y2="50" stroke="var(--accent, #F57F17)" strokeWidth="1.5" opacity="0.8" />

        {/* Pot decoration bands */}
        <path d="M34 65 Q50 58 66 65" stroke="var(--accent, #F57F17)" strokeWidth="0.7" fill="none" opacity="0.4" />
        <path d="M32 78 Q50 72 68 78" stroke="var(--accent, #F57F17)" strokeWidth="0.6" fill="none" opacity="0.3" />

        {/* Mango leaves */}
        <path d="M38 48 Q35 35 30 28" stroke="#2E7D32" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M50 48 Q50 32 50 22" stroke="#2E7D32" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M62 48 Q65 35 70 28" stroke="#2E7D32" strokeWidth="1" fill="none" opacity="0.5" />
        {/* Leaf shapes */}
        <path d="M30 28 Q28 24 32 22 Q34 26 30 28Z" fill="#2E7D32" fillOpacity="0.15" stroke="#2E7D32" strokeWidth="0.5" />
        <path d="M70 28 Q72 24 68 22 Q66 26 70 28Z" fill="#2E7D32" fillOpacity="0.15" stroke="#2E7D32" strokeWidth="0.5" />

        {/* Coconut on top */}
        <motion.circle cx="50" cy="18" r="8"
            stroke="var(--accent, #F57F17)" strokeWidth="1"
            fill="var(--accent, #F57F17)" fillOpacity="0.12"
            animate={{ fillOpacity: [0.08, 0.16, 0.08] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        {/* Coconut detail */}
        <path d="M46 16 Q50 14 54 16" stroke="var(--accent, #F57F17)" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Base/pedestal */}
        <line x1="28" y1="90" x2="72" y2="90" stroke="var(--accent, #F57F17)" strokeWidth="1.2" opacity="0.6" />
        <rect x="33" y="90" width="34" height="5" rx="2" stroke="var(--accent, #F57F17)" strokeWidth="0.8" fill="none" opacity="0.4" />

        {/* Gold sparkles */}
        <motion.g animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
            <circle cx="22" cy="40" r="1" fill="var(--accent, #F57F17)" />
            <circle cx="78" cy="42" r="0.8" fill="var(--accent, #F57F17)" />
            <circle cx="50" cy="8" r="1" fill="var(--accent, #F57F17)" />
        </motion.g>
    </motion.svg>
);

const AkshayaDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <KalashMotif delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <KalashMotif flip delay={0.35} />
        </div>
    </div>
);

export default AkshayaDecoration;
