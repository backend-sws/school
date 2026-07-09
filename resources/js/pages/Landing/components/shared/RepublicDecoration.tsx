import React from 'react';
import { motion } from 'motion/react';

/**
 * RepublicDecoration — Ashoka Chakra inspired spinning decoration.
 * A 24-spoke wheel with gentle rotation, using theme primary color.
 */

const AshokaChakra = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="70" height="70" viewBox="0 0 100 100" fill="none"
        className="sm:w-[80px] sm:h-[80px] lg:w-[90px] lg:h-[90px]"
    >
        {/* Outer ring */}
        <circle cx="50" cy="50" r="38" stroke="var(--accent, #000080)" strokeWidth="1.5" opacity="0.4" />
        <circle cx="50" cy="50" r="35" stroke="var(--accent, #000080)" strokeWidth="0.8" opacity="0.25" />

        {/* 24 spokes — rotating */}
        <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
        >
            {Array.from({ length: 24 }).map((_, i) => (
                <line
                    key={i}
                    x1="50" y1="18" x2="50" y2="42"
                    stroke="var(--accent, #000080)"
                    strokeWidth="0.6"
                    opacity="0.3"
                    transform={`rotate(${i * 15} 50 50)`}
                />
            ))}
        </motion.g>

        {/* Center hub */}
        <circle cx="50" cy="50" r="8" stroke="var(--accent, #000080)" strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="50" r="3" fill="var(--accent, #000080)" fillOpacity="0.2" />

        {/* Tricolor ribbon hints */}
        <path d="M12 50 Q12 40 18 35" stroke="#FF9933" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
        <path d="M12 50 Q12 55 15 60" stroke="#138808" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
    </motion.svg>
);

const RepublicDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <AshokaChakra delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <AshokaChakra flip delay={0.35} />
        </div>
    </div>
);

export default RepublicDecoration;
