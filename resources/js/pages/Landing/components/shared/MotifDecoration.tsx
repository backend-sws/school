import React from 'react';
import type { LandingMotifKey } from '../../../../constants/landing/types';
import { cn } from '../../../../lib/utils';

interface MotifDecorationProps {
    motif?: LandingMotifKey;
    opacity?: number;
}

const MotifDecoration = ({ motif, opacity = 0.15 }: MotifDecorationProps) => {
    if (!motif) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Left Motif */}
            <div 
                className={cn(
                    `absolute -left-8 -top-8 w-48 h-48 l-motif-${motif} opacity-[${opacity}] transition-all duration-700 transform rotate-[-15deg]`,
                    // Dynamic opacity can sometimes be tricky with Tailwind classes if not safelisted, 
                    // but using inline style for safety since it's a dynamic value.
                )}
                style={{ opacity }}
            />
            {/* Right Motif */}
            <div 
                className={cn(
                    `absolute -right-8 -bottom-8 w-48 h-48 l-motif-${motif} opacity-[${opacity}] transition-all duration-700 transform rotate-[15deg]`
                )}
                style={{ opacity }}
            />
        </div>
    );
};

export default MotifDecoration;
