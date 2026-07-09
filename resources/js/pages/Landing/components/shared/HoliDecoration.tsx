import React from 'react';
import { motion } from 'motion/react';

/**
 * HoliDecoration — Animated color splashes on banner edges.
 * Bursts of vibrant gulal colors with scale/opacity animations.
 */

const ColorSplash = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5, ease: 'easeOut' }}
        width="80" height="70" viewBox="0 0 120 100" fill="none"
        className="sm:w-[90px] sm:h-[80px] lg:w-[110px] lg:h-[90px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Large splash blob */}
        <motion.path
            d="M60 50 Q40 20 55 15 Q70 10 75 30 Q90 25 85 45 Q100 50 80 60 Q90 80 65 75 Q55 90 45 70 Q25 80 35 55 Q15 45 40 40 Q30 25 60 50Z"
            fill="#E91E63"
            fillOpacity="0.15"
            stroke="#E91E63"
            strokeWidth="0.8"
            strokeOpacity="0.3"
            animate={{ scale: [1, 1.03, 1], rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />

        {/* Color dots — gulal particles */}
        <motion.circle cx="45" cy="30" r="4" fill="#E91E63" fillOpacity="0.4"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
        />
        <motion.circle cx="70" cy="35" r="3.5" fill="#7C4DFF" fillOpacity="0.35"
            animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.25, 0.5, 0.25] }}
            transition={{ repeat: Infinity, duration: 2.2, delay: 0.5 }}
        />
        <motion.circle cx="55" cy="60" r="3" fill="#00BCD4" fillOpacity="0.3"
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.8 }}
        />
        <motion.circle cx="80" cy="55" r="2.5" fill="#FFEB3B" fillOpacity="0.4"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.3 }}
        />
        <motion.circle cx="35" cy="55" r="2" fill="#4CAF50" fillOpacity="0.35"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
        />

        {/* Tiny spray particles */}
        <g opacity="0.3">
            <circle cx="50" cy="18" r="1" fill="#E91E63" />
            <circle cx="85" cy="40" r="1.2" fill="#7C4DFF" />
            <circle cx="30" cy="45" r="0.8" fill="#00BCD4" />
            <circle cx="65" cy="75" r="1" fill="#FFEB3B" />
            <circle cx="40" cy="70" r="0.8" fill="#4CAF50" />
        </g>
    </motion.svg>
);

const HoliDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <ColorSplash delay={0.15} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <ColorSplash flip delay={0.3} />
        </div>
    </div>
);

export default HoliDecoration;
