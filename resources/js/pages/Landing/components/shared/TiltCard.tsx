import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    /** Max rotation in degrees (default: 8) */
    maxTilt?: number;
    /** Perspective depth in px (default: 800) */
    perspective?: number;
    /** Scale on hover (default: 1.02) */
    hoverScale?: number;
    /** Show inner glow following cursor (default: true) */
    glowEnabled?: boolean;
}

/**
 * Mouse-tracking 3D tilt card with optional inner glow.
 * All colors are theme-centric via CSS custom properties.
 */
export default function TiltCard({
    children,
    className,
    maxTilt = 8,
    perspective = 800,
    hoverScale = 1.02,
    glowEnabled = true,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setTilt({
            x: (y - 0.5) * -maxTilt * 2,
            y: (x - 0.5) * maxTilt * 2,
        });
        setGlowPosition({ x: x * 100, y: y * 100 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            animate={{
                rotateX: tilt.x,
                rotateY: tilt.y,
                scale: isHovered ? hoverScale : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ perspective }}
            className={cn(
                'relative rounded-2xl overflow-hidden will-change-transform',
                className
            )}
        >
            {/* Inner glow overlay */}
            {glowEnabled && isHovered && (
                <div
                    className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-60 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, color-mix(in srgb, var(--primary), transparent 85%), transparent 60%)`,
                    }}
                />
            )}
            {children}
        </motion.div>
    );
}
