import React from 'react';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
    className?: string;
    /** Animation duration in seconds (default: 6) */
    duration?: number;
    /** Beam size in px (default: 200) */
    size?: number;
}

/**
 * Animated gradient beam that travels around the border of its container.
 * Parent must have `position: relative` and `overflow: hidden` with `border-radius`.
 * All colors use theme CSS variables.
 */
export default function BorderBeam({
    className,
    duration = 6,
    size = 200,
}: BorderBeamProps) {
    return (
        <div
            className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit]',
                className
            )}
            style={{
                /* Mask trick: show only on border edges */
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '1.5px',
            }}
        >
            <div
                className="absolute inset-[-100%] animate-spin"
                style={{
                    background: `conic-gradient(from 0deg, transparent 0%, transparent 70%, var(--primary) 80%, color-mix(in srgb, var(--primary), transparent 60%) 100%)`,
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'linear',
                }}
            />
        </div>
    );
}
