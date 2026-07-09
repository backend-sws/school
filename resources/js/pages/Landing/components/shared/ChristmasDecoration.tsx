import React from 'react';
import { motion } from 'motion/react';

/**
 * ChristmasDecoration — Snowflakes and star with gentle animations.
 */

const Snowflake = ({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) => (
    <motion.g
        animate={{ y: [0, 6, 0], opacity: [0.3, 0.7, 0.3], rotate: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 3 + delay, ease: 'easeInOut' }}
        style={{ transformOrigin: `${x}px ${y}px` }}
    >
        {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={x} y1={y - size} x2={x} y2={y + size}
                stroke="white" strokeWidth="0.8" opacity="0.6"
                transform={`rotate(${i * 30} ${x} ${y})`}
            />
        ))}
        <circle cx={x} cy={y} r={size * 0.2} fill="white" opacity="0.5" />
    </motion.g>
);

const StarOrnament = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="80" height="75" viewBox="0 0 100 100" fill="none"
        className="sm:w-[90px] sm:h-[85px] lg:w-[100px] lg:h-[90px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Christmas star */}
        <motion.path
            d="M50 10 L55 35 L80 38 L60 55 L67 80 L50 65 L33 80 L40 55 L20 38 L45 35 Z"
            stroke="var(--accent, #FFD700)"
            strokeWidth="1"
            fill="var(--accent, #FFD700)"
            fillOpacity="0.1"
            animate={{ scale: [1, 1.05, 1], fillOpacity: [0.08, 0.15, 0.08] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ transformOrigin: '50px 45px', filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.3))' }}
        />

        {/* Snowflakes */}
        <Snowflake x={18} y={22} size={6} delay={0} />
        <Snowflake x={82} y={28} size={5} delay={0.5} />
        <Snowflake x={25} y={75} size={4} delay={1} />
        <Snowflake x={78} y={72} size={4.5} delay={0.8} />
    </motion.svg>
);

const ChristmasDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <StarOrnament delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <StarOrnament flip delay={0.35} />
        </div>
    </div>
);

export default ChristmasDecoration;
