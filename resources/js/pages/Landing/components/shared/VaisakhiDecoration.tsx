import React from 'react';
import { motion } from 'motion/react';

/**
 * VaisakhiDecoration — Golden wheat stalks swaying gently.
 * Harvest festival celebration with wheat sheaves and sun rays.
 */

const WheatStalk = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="70" height="75" viewBox="0 0 100 110" fill="none"
        className="sm:w-[80px] sm:h-[85px] lg:w-[90px] lg:h-[95px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Main stalk */}
        <motion.line
            x1="50" y1="25" x2="50" y2="100"
            stroke="var(--accent, #2E7D32)"
            strokeWidth="1.5"
            opacity="0.7"
            animate={{ x1: [50, 52, 50] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />

        {/* Wheat grain head */}
        <motion.ellipse
            cx="50" cy="18" rx="5" ry="12"
            stroke="var(--primary, #F9A825)"
            strokeWidth="1.2"
            fill="var(--primary, #F9A825)"
            fillOpacity="0.15"
            animate={{ ry: [12, 13, 12], cy: [18, 17, 18] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        {/* Grain lines */}
        <line x1="48" y1="10" x2="48" y2="26" stroke="var(--primary, #F9A825)" strokeWidth="0.5" opacity="0.4" />
        <line x1="52" y1="10" x2="52" y2="26" stroke="var(--primary, #F9A825)" strokeWidth="0.5" opacity="0.4" />

        {/* Side leaves — left */}
        <motion.path d="M50 40 Q38 35 30 42" stroke="var(--accent, #2E7D32)" strokeWidth="1" fill="none" opacity="0.5"
            animate={{ d: ['M50 40 Q38 35 30 42', 'M50 40 Q37 34 28 41', 'M50 40 Q38 35 30 42'] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        />
        <motion.path d="M50 55 Q40 50 32 55" stroke="var(--accent, #2E7D32)" strokeWidth="0.8" fill="none" opacity="0.4"
            animate={{ d: ['M50 55 Q40 50 32 55', 'M50 55 Q39 49 30 54', 'M50 55 Q40 50 32 55'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.3 }}
        />
        <path d="M50 70 Q42 66 36 70" stroke="var(--accent, #2E7D32)" strokeWidth="0.6" fill="none" opacity="0.3" />

        {/* Side leaves — right */}
        <motion.path d="M50 45 Q62 40 70 47" stroke="var(--accent, #2E7D32)" strokeWidth="1" fill="none" opacity="0.5"
            animate={{ d: ['M50 45 Q62 40 70 47', 'M50 45 Q63 41 72 48', 'M50 45 Q62 40 70 47'] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.path d="M50 60 Q60 56 68 60" stroke="var(--accent, #2E7D32)" strokeWidth="0.8" fill="none" opacity="0.4"
            animate={{ d: ['M50 60 Q60 56 68 60', 'M50 60 Q61 57 70 61', 'M50 60 Q60 56 68 60'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.7 }}
        />
        <path d="M50 75 Q58 72 64 75" stroke="var(--accent, #2E7D32)" strokeWidth="0.6" fill="none" opacity="0.3" />

        {/* Sun ray hints at top */}
        <g opacity="0.2">
            <line x1="50" y1="5" x2="50" y2="2" stroke="var(--primary, #F9A825)" strokeWidth="0.8" />
            <line x1="42" y1="8" x2="38" y2="4" stroke="var(--primary, #F9A825)" strokeWidth="0.6" />
            <line x1="58" y1="8" x2="62" y2="4" stroke="var(--primary, #F9A825)" strokeWidth="0.6" />
        </g>
    </motion.svg>
);

const VaisakhiDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <WheatStalk delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <WheatStalk flip delay={0.35} />
        </div>
    </div>
);

export default VaisakhiDecoration;
