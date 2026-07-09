import React from 'react';
import { motion } from 'motion/react';

/**
 * HanumanDecoration — Gada (mace) with power aura.
 * Celebrates Hanuman Jayanti with his iconic weapon and strength symbols.
 */

const GadaMotif = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, x: flip ? 15 : -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="60" height="80" viewBox="0 0 80 120" fill="none"
        className="sm:w-[70px] sm:h-[90px] lg:w-[75px] lg:h-[100px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Gada head — spiked sphere */}
        <motion.circle cx="40" cy="25" r="16"
            stroke="var(--accent, #BF360C)" strokeWidth="1.5"
            fill="var(--accent, #BF360C)" fillOpacity="0.08"
            animate={{ r: [16, 17, 16], fillOpacity: [0.06, 0.12, 0.06] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
        <circle cx="40" cy="25" r="10" stroke="var(--accent, #BF360C)" strokeWidth="1" opacity="0.5" fill="none" />
        <circle cx="40" cy="25" r="5" fill="var(--accent, #BF360C)" fillOpacity="0.2" />

        {/* Spike accents */}
        {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            return (
                <line key={i}
                    x1={40 + Math.cos(angle) * 16}
                    y1={25 + Math.sin(angle) * 16}
                    x2={40 + Math.cos(angle) * 20}
                    y2={25 + Math.sin(angle) * 20}
                    stroke="var(--accent, #BF360C)" strokeWidth="1" opacity="0.4"
                />
            );
        })}

        {/* Handle shaft */}
        <line x1="40" y1="41" x2="40" y2="105" stroke="var(--accent, #BF360C)" strokeWidth="2" opacity="0.7" />

        {/* Handle grip bands */}
        <line x1="35" y1="65" x2="45" y2="65" stroke="var(--accent, #BF360C)" strokeWidth="1.2" opacity="0.4" />
        <line x1="36" y1="75" x2="44" y2="75" stroke="var(--accent, #BF360C)" strokeWidth="1" opacity="0.35" />
        <line x1="36" y1="85" x2="44" y2="85" stroke="var(--accent, #BF360C)" strokeWidth="1" opacity="0.3" />

        {/* Bottom pommel */}
        <path d="M36 103 L40 110 L44 103" stroke="var(--accent, #BF360C)" strokeWidth="1" fill="none" opacity="0.4" />

        {/* Power aura */}
        <motion.circle cx="40" cy="25" r="24"
            stroke="var(--accent, #BF360C)" strokeWidth="0.5" fill="none"
            animate={{ r: [24, 28, 24], opacity: [0.15, 0.05, 0.15] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
    </motion.svg>
);

const HanumanDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <GadaMotif delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <GadaMotif flip delay={0.35} />
        </div>
    </div>
);

export default HanumanDecoration;
