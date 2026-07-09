import React from 'react';
import { motion } from 'motion/react';

/**
 * GaneshDecoration — Stylized Ganesha silhouette with modak and om symbol.
 */

const GaneshMotif = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.6, ease: 'easeOut' }}
        width="75" height="75" viewBox="0 0 100 100" fill="none"
        className="sm:w-[85px] sm:h-[85px] lg:w-[95px] lg:h-[95px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Head circle */}
        <circle cx="50" cy="35" r="18" stroke="var(--accent, #FF6F00)" strokeWidth="1.2"
            fill="var(--accent, #FF6F00)" fillOpacity="0.06" />
        
        {/* Trunk — curved downward */}
        <motion.path
            d="M44 48 Q40 58 38 65 Q37 70 42 68 Q45 66 44 60"
            stroke="var(--accent, #FF6F00)" strokeWidth="1.5" fill="none" strokeLinecap="round"
            animate={{ d: [
                'M44 48 Q40 58 38 65 Q37 70 42 68 Q45 66 44 60',
                'M44 48 Q39 58 37 66 Q36 71 41 69 Q44 67 44 61',
                'M44 48 Q40 58 38 65 Q37 70 42 68 Q45 66 44 60',
            ]}}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />

        {/* Ears */}
        <path d="M33 30 Q22 25 25 38 Q27 45 33 42" stroke="var(--accent, #FF6F00)" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M67 30 Q78 25 75 38 Q73 45 67 42" stroke="var(--accent, #FF6F00)" strokeWidth="1" fill="none" opacity="0.6" />

        {/* Crown */}
        <path d="M40 20 L45 12 L50 18 L55 12 L60 20" stroke="var(--accent, #FF6F00)" strokeWidth="0.8" fill="none" opacity="0.5" />
        <circle cx="50" cy="10" r="2" fill="var(--accent, #FF6F00)" fillOpacity="0.3" />

        {/* Eyes */}
        <circle cx="44" cy="32" r="1.5" fill="var(--accent, #FF6F00)" fillOpacity="0.5" />
        <circle cx="56" cy="32" r="1.5" fill="var(--accent, #FF6F00)" fillOpacity="0.5" />

        {/* Tusk */}
        <path d="M52 42 L54 50 L56 48" stroke="var(--accent, #FF6F00)" strokeWidth="0.8" fill="none" opacity="0.5" />

        {/* Modak in other hand */}
        <motion.circle cx="65" cy="62" r="6" stroke="var(--accent, #FF6F00)" strokeWidth="0.8"
            fill="var(--accent, #FF6F00)" fillOpacity="0.1"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
        <path d="M62 60 Q65 56 68 60" stroke="var(--accent, #FF6F00)" strokeWidth="0.5" fill="none" opacity="0.4" />

        {/* Lotus seat */}
        <path d="M35 78 Q42 72 50 78 Q58 72 65 78" stroke="var(--accent, #FF6F00)" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M30 82 Q40 76 50 82 Q60 76 70 82" stroke="var(--accent, #FF6F00)" strokeWidth="0.6" fill="none" opacity="0.3" />

        {/* Om symbol accent */}
        <g opacity="0.2" transform="translate(15, 70)">
            <path d="M5 10 Q2 5 6 3 Q10 1 10 6 Q10 10 6 12 L10 15" stroke="var(--accent, #FF6F00)" strokeWidth="0.8" fill="none" />
        </g>
    </motion.svg>
);

const GaneshDecoration = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
        <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
            <GaneshMotif delay={0.2} />
        </div>
        <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
            <GaneshMotif flip delay={0.35} />
        </div>
    </div>
);

export default GaneshDecoration;
