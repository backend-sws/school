import React from 'react';
import { motion } from 'motion/react';

/**
 * NavratriDecoration — Ornate hand-with-diya line art, inspired by traditional Indian illustration.
 * Features a stylized hand holding a diya with flame, rendered in decorative outline style.
 */

const HandWithDiya = ({ flip = false, delay = 0 }: { flip?: boolean; delay?: number }) => (
    <motion.svg
        initial={{ opacity: 0, x: flip ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.7, ease: 'easeOut' }}
        width="80" height="80" viewBox="0 0 100 100" fill="none"
        className="sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px]"
        style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
        {/* Corner mandala accent */}
        <g opacity="0.35">
            <path d="M5 5 Q15 2 20 10 Q12 15 5 5Z" stroke="var(--accent, #F9A825)" strokeWidth="0.8" fill="none" />
            <path d="M2 12 Q10 8 15 15 Q8 18 2 12Z" stroke="var(--accent, #F9A825)" strokeWidth="0.6" fill="none" />
            <circle cx="8" cy="8" r="2" stroke="var(--accent, #F9A825)" strokeWidth="0.5" fill="none" />
        </g>

        {/* Diya bowl — ornate traditional shape */}
        <g>
            <path
                d="M35 58 Q35 52 42 50 L58 50 Q65 52 65 58 L62 62 Q55 65 50 65 Q45 65 38 62 Z"
                stroke="var(--accent, #F9A825)"
                strokeWidth="1.2"
                fill="var(--accent, #F9A825)"
                fillOpacity="0.08"
            />
            {/* Bowl decoration lines */}
            <path d="M40 54 Q50 57 60 54" stroke="var(--accent, #F9A825)" strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M42 58 Q50 60 58 58" stroke="var(--accent, #F9A825)" strokeWidth="0.5" fill="none" opacity="0.4" />
            {/* Bowl rim dots */}
            <circle cx="38" cy="52" r="0.8" fill="var(--accent, #F9A825)" opacity="0.5" />
            <circle cx="50" cy="50" r="0.8" fill="var(--accent, #F9A825)" opacity="0.5" />
            <circle cx="62" cy="52" r="0.8" fill="var(--accent, #F9A825)" opacity="0.5" />
        </g>

        {/* Flame — animated */}
        <g>
            {/* Outer flame */}
            <motion.path
                d="M50 22 Q43 36 46 44 Q48 48 50 48 Q52 48 54 44 Q57 36 50 22Z"
                stroke="var(--diya-flame, #FF9800)"
                strokeWidth="1.2"
                fill="var(--diya-flame, #FF9800)"
                fillOpacity="0.15"
                animate={{
                    d: [
                        'M50 22 Q43 36 46 44 Q48 48 50 48 Q52 48 54 44 Q57 36 50 22Z',
                        'M50 18 Q42 34 46 44 Q48 48 50 48 Q52 48 54 44 Q58 34 50 18Z',
                        'M50 22 Q43 36 46 44 Q48 48 50 48 Q52 48 54 44 Q57 36 50 22Z',
                    ],
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 4px rgba(255, 152, 0, 0.4))' }}
            />
            {/* Inner flame core */}
            <motion.path
                d="M50 30 Q47 38 48 43 Q49 46 50 46 Q51 46 52 43 Q53 38 50 30Z"
                fill="#FFF9C4"
                fillOpacity="0.5"
                animate={{
                    d: [
                        'M50 30 Q47 38 48 43 Q49 46 50 46 Q51 46 52 43 Q53 38 50 30Z',
                        'M50 27 Q46 37 48 43 Q49 46 50 46 Q51 46 52 43 Q54 37 50 27Z',
                        'M50 30 Q47 38 48 43 Q49 46 50 46 Q51 46 52 43 Q53 38 50 30Z',
                    ],
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
        </g>

        {/* Hand — stylized with ornate line patterns */}
        <g>
            {/* Wrist and palm */}
            <path
                d="M70 85 Q68 78 65 72 Q62 67 60 65 L58 62 Q56 60 54 62 L50 65 L46 62 Q44 60 42 62 L40 65 Q38 67 35 72 Q32 78 30 85"
                stroke="var(--accent, #F9A825)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
            />
            {/* Finger details */}
            <path d="M42 62 L40 56 Q40 54 42 55 L45 60" stroke="var(--accent, #F9A825)" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M54 62 L56 56 Q56 54 54 55 L51 60" stroke="var(--accent, #F9A825)" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />

            {/* Hand henna patterns */}
            <path d="M40 72 Q45 70 50 72 Q55 70 60 72" stroke="var(--accent, #F9A825)" strokeWidth="0.5" fill="none" opacity="0.35" />
            <path d="M42 76 Q47 74 50 76 Q53 74 58 76" stroke="var(--accent, #F9A825)" strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="50" cy="74" r="1.5" stroke="var(--accent, #F9A825)" strokeWidth="0.5" fill="none" opacity="0.3" />

            {/* Bangles */}
            <path d="M32 82 Q31 80 32 78" stroke="var(--accent, #F9A825)" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M34 83 Q33 81 34 79" stroke="var(--accent, #F9A825)" strokeWidth="0.7" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d="M68 82 Q69 80 68 78" stroke="var(--accent, #F9A825)" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M66 83 Q67 81 66 79" stroke="var(--accent, #F9A825)" strokeWidth="0.7" fill="none" opacity="0.4" strokeLinecap="round" />
        </g>

        {/* Decorative dots radiating from flame */}
        <g opacity="0.3">
            <circle cx="38" cy="30" r="0.8" fill="var(--accent, #F9A825)" />
            <circle cx="62" cy="30" r="0.8" fill="var(--accent, #F9A825)" />
            <circle cx="35" cy="38" r="0.6" fill="var(--accent, #F9A825)" />
            <circle cx="65" cy="38" r="0.6" fill="var(--accent, #F9A825)" />
            <circle cx="50" cy="15" r="0.8" fill="var(--diya-flame, #FF9800)" />
        </g>
    </motion.svg>
);

const NavratriDecoration = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-between">
            {/* Left hand with diya */}
            <div className="hidden sm:block pl-1 md:pl-4 lg:pl-8">
                <HandWithDiya delay={0.2} />
            </div>

            {/* Right hand with diya (mirrored) */}
            <div className="hidden sm:block pr-8 md:pr-12 lg:pr-16">
                <HandWithDiya flip delay={0.35} />
            </div>
        </div>
    );
};

export default NavratriDecoration;
