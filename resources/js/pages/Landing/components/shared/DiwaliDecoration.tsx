import React from 'react';
import { motion } from 'motion/react';

/**
 * DiwaliDecoration — Animated diyas with sparkling particles.
 * Flanks the banner with flickering oil lamps and floating sparkles.
 */

const Diya = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="70" height="70" viewBox="0 0 100 100" fill="none"
        className="sm:w-[80px] sm:h-[80px] lg:w-[90px] lg:h-[90px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Diya base */}
        <path
            d="M30 65 Q28 55 38 50 L62 50 Q72 55 70 65 L65 70 Q55 74 50 74 Q45 74 35 70 Z"
            stroke="var(--accent, #F9A825)"
            strokeWidth="1.2"
            fill="var(--accent, #F9A825)"
            fillOpacity="0.1"
        />
        {/* Rim decoration */}
        <path d="M38 54 Q50 58 62 54" stroke="var(--accent, #F9A825)" strokeWidth="0.6" fill="none" opacity="0.5" />
        <path d="M40 60 Q50 63 60 60" stroke="var(--accent, #F9A825)" strokeWidth="0.5" fill="none" opacity="0.4" />
        
        {/* Pedestal */}
        <rect x="42" y="74" width="16" height="5" rx="2" stroke="var(--accent, #F9A825)" strokeWidth="0.8" fill="none" opacity="0.5" />

        {/* Flame outer */}
        <motion.path
            d="M50 22 Q44 35 47 44 Q49 48 50 48 Q51 48 53 44 Q56 35 50 22Z"
            stroke="var(--diya-flame, #FF9800)"
            strokeWidth="1"
            fill="var(--diya-flame, #FF9800)"
            fillOpacity="0.2"
            animate={{
                d: [
                    'M50 22 Q44 35 47 44 Q49 48 50 48 Q51 48 53 44 Q56 35 50 22Z',
                    'M50 18 Q43 33 47 44 Q49 48 50 48 Q51 48 53 44 Q57 33 50 18Z',
                    'M50 22 Q44 35 47 44 Q49 48 50 48 Q51 48 53 44 Q56 35 50 22Z',
                ],
            }}
            transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(255, 152, 0, 0.5))' }}
        />
        {/* Flame inner */}
        <motion.path
            d="M50 30 Q47 38 49 44 Q50 46 50 46 Q50 46 51 44 Q53 38 50 30Z"
            fill="#FFF9C4"
            fillOpacity="0.6"
            animate={{
                d: [
                    'M50 30 Q47 38 49 44 Q50 46 50 46 Q50 46 51 44 Q53 38 50 30Z',
                    'M50 27 Q46 37 49 44 Q50 46 50 46 Q50 46 51 44 Q54 37 50 27Z',
                    'M50 30 Q47 38 49 44 Q50 46 50 46 Q50 46 51 44 Q53 38 50 30Z',
                ],
            }}
            transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
        />

        {/* Sparkle particles */}
        <g opacity="0.4">
            <motion.circle cx="35" cy="28" r="1" fill="var(--diya-flame, #FF9800)"
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.1 }}
            />
            <motion.circle cx="65" cy="32" r="0.8" fill="var(--diya-flame, #FF9800)"
                animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.3, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}
            />
            <motion.circle cx="42" cy="18" r="0.6" fill="#FFF9C4"
                animate={{ opacity: [0.1, 0.7, 0.1], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
            />
            <motion.circle cx="58" cy="20" r="0.7" fill="#FFF9C4"
                animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
            />
        </g>
    </motion.svg>
);

const DiwaliDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <Diya delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <Diya flip delay={0.35} />
        </div>
    </div>
);

export default DiwaliDecoration;
