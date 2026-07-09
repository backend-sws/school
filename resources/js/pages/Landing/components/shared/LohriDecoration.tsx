import React from 'react';
import { motion } from 'motion/react';

/**
 * LohriDecoration — Bonfire with animated flames and sparks.
 * Celebrates the Punjabi festival with a warm, glowing fire.
 */

const Bonfire = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="70" height="75" viewBox="0 0 100 100" fill="none"
        className="sm:w-[80px] sm:h-[85px] lg:w-[90px] lg:h-[90px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Log pile base */}
        <path d="M25 80 L40 70 L60 70 L75 80" stroke="var(--accent, #5D4037)" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M30 85 L45 76 L55 76 L70 85" stroke="var(--accent, #5D4037)" strokeWidth="1.5" fill="none" opacity="0.5" />
        <line x1="35" y1="75" x2="65" y2="75" stroke="var(--accent, #5D4037)" strokeWidth="1" opacity="0.4" />

        {/* Main flame */}
        <motion.path
            d="M50 18 Q38 35 40 50 Q42 62 50 65 Q58 62 60 50 Q62 35 50 18Z"
            stroke="#FF6D00" strokeWidth="1.2"
            fill="#FF6D00" fillOpacity="0.15"
            animate={{
                d: [
                    'M50 18 Q38 35 40 50 Q42 62 50 65 Q58 62 60 50 Q62 35 50 18Z',
                    'M50 14 Q36 33 40 50 Q42 62 50 65 Q58 62 60 50 Q64 33 50 14Z',
                    'M50 18 Q38 35 40 50 Q42 62 50 65 Q58 62 60 50 Q62 35 50 18Z',
                ]
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255, 109, 0, 0.4))' }}
        />

        {/* Inner flame */}
        <motion.path
            d="M50 28 Q44 40 46 52 Q48 58 50 58 Q52 58 54 52 Q56 40 50 28Z"
            fill="#FFC107" fillOpacity="0.25"
            animate={{
                d: [
                    'M50 28 Q44 40 46 52 Q48 58 50 58 Q52 58 54 52 Q56 40 50 28Z',
                    'M50 24 Q43 39 46 52 Q48 58 50 58 Q52 58 54 52 Q57 39 50 24Z',
                    'M50 28 Q44 40 46 52 Q48 58 50 58 Q52 58 54 52 Q56 40 50 28Z',
                ]
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Core */}
        <motion.path
            d="M50 38 Q47 46 49 52 Q50 54 50 54 Q50 54 51 52 Q53 46 50 38Z"
            fill="#FFF9C4" fillOpacity="0.5"
            animate={{ fillOpacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
        />

        {/* Rising sparks */}
        <motion.circle cx="42" cy="22" r="1" fill="#FF6D00"
            animate={{ y: [0, -8, -16], opacity: [0.6, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
        />
        <motion.circle cx="55" cy="20" r="0.8" fill="#FFC107"
            animate={{ y: [0, -10, -20], opacity: [0.5, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.8 }}
        />
        <motion.circle cx="48" cy="15" r="0.6" fill="#FF6D00"
            animate={{ y: [0, -6, -12], opacity: [0.4, 0.2, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 1.2 }}
        />
    </motion.svg>
);

const LohriDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <Bonfire delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <Bonfire flip delay={0.35} />
        </div>
    </div>
);

export default LohriDecoration;
