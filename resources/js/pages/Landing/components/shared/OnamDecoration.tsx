import React from 'react';
import { motion } from 'motion/react';

/**
 * OnamDecoration — Pookalam (floral rangoli) with snake boat race hint.
 * Celebrates the harvest festival of Kerala with concentric flower patterns.
 */

const Pookalam = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        width="75" height="75" viewBox="0 0 100 100" fill="none"
        className="sm:w-[85px] sm:h-[85px] lg:w-[95px] lg:h-[95px]"
    >
        {/* Outer petal ring */}
        <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
        >
            {Array.from({ length: 8 }).map((_, i) => (
                <ellipse key={i} cx="50" cy="22" rx="7" ry="14"
                    stroke="#E91E63" strokeWidth="0.8"
                    fill="#E91E63" fillOpacity="0.08"
                    transform={`rotate(${i * 45} 50 50)`}
                />
            ))}
        </motion.g>

        {/* Middle petal ring */}
        <motion.g
            animate={{ rotate: [0, -360] }}
            transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <ellipse key={i} cx="50" cy="30" rx="5" ry="10"
                    stroke="#FF9800" strokeWidth="0.7"
                    fill="#FF9800" fillOpacity="0.08"
                    transform={`rotate(${i * 60} 50 50)`}
                />
            ))}
        </motion.g>

        {/* Inner ring */}
        <circle cx="50" cy="50" r="12" stroke="var(--accent, #FDD835)" strokeWidth="1" opacity="0.4" fill="none" />
        <circle cx="50" cy="50" r="8" stroke="var(--accent, #FDD835)" strokeWidth="0.8" opacity="0.3" fill="none" />

        {/* Center dot */}
        <motion.circle cx="50" cy="50" r="4"
            fill="var(--accent, #FDD835)" fillOpacity="0.3"
            animate={{ fillOpacity: [0.2, 0.4, 0.2], r: [4, 5, 4] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />

        {/* Tiny floret dots */}
        <g opacity="0.3">
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                return (
                    <circle key={i}
                        cx={50 + Math.cos(angle) * 35}
                        cy={50 + Math.sin(angle) * 35}
                        r="1.5" fill="#E91E63"
                    />
                );
            })}
        </g>
    </motion.svg>
);

const OnamDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <Pookalam delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <Pookalam flip delay={0.35} />
        </div>
    </div>
);

export default OnamDecoration;
