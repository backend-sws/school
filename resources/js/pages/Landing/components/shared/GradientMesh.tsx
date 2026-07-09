import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientMeshProps {
    className?: string;
    /** Intensity of the gradient blobs (default: 0.15) */
    intensity?: number;
}

/**
 * Animated gradient mesh background.
 * Uses theme CSS variables for color — works in both light and dark mode.
 */
export default function GradientMesh({ className, intensity = 0.15 }: GradientMeshProps) {
    return (
        <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
            {/* Primary blob — top-left */}
            <motion.div
                animate={{
                    x: ['-10%', '5%', '-10%'],
                    y: ['-10%', '10%', '-10%'],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
                style={{ background: `color-mix(in srgb, var(--primary), transparent ${100 - (intensity * 100)}%)` }}
            />

            {/* Secondary blob — bottom-right */}
            <motion.div
                animate={{
                    x: ['10%', '-5%', '10%'],
                    y: ['10%', '-10%', '10%'],
                    scale: [1.1, 0.9, 1.1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
                style={{ background: `color-mix(in srgb, var(--primary), transparent ${100 - (intensity * 0.7 * 100)}%)` }}
            />

            {/* Accent blob — center */}
            <motion.div
                animate={{
                    x: ['-5%', '5%', '-5%'],
                    y: ['5%', '-5%', '5%'],
                    scale: [0.8, 1.1, 0.8],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full blur-3xl"
                style={{ background: `color-mix(in srgb, var(--muted), transparent ${100 - (intensity * 1.5 * 100)}%)` }}
            />
        </div>
    );
}
