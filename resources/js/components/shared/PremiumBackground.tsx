import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import FloatingMotifs from '@/pages/Landing/components/shared/FloatingMotifs';
import GeometryPattern from '@/pages/Landing/components/shared/GeometryPattern';

interface PremiumBackgroundProps {
    className?: string;
    variant?: 'full' | 'subtle' | 'onboarding' | 'mobile';
    orbOpacity?: number;
    motifCount?: number;
    showGrid?: boolean;
    seed?: number;
}

/**
 * PremiumBackground — Unified factory for project-wide "Glow & Polish".
 * Consolidates mesh orbs, geometry patterns, and floating motifs.
 */
export const PremiumBackground: React.FC<PremiumBackgroundProps> = ({
    className,
    variant = 'full',
    orbOpacity = 0.5,
    motifCount = 15,
    showGrid = true,
    seed = 42
}) => {
    const isMobileVariant = variant === 'mobile';
    
    // Adjust configurations based on variant
    const resolvedOrbOpacity = isMobileVariant ? orbOpacity * 0.7 : orbOpacity;
    const resolvedMotifCount = isMobileVariant ? Math.floor(motifCount * 0.6) : motifCount;

    return (
        <div className={cn("absolute inset-0 z-0 overflow-hidden bg-background", className)}>
            {/* Mesh Orbs - Dynamically themed */}
            <div 
                className="auth-gradient-orb auth-gradient-orb-1 transition-opacity duration-1000" 
                style={{ opacity: resolvedOrbOpacity + 0.1 }} 
            />
            <div 
                className="auth-gradient-orb auth-gradient-orb-2 transition-opacity duration-1000" 
                style={{ opacity: resolvedOrbOpacity }} 
            />
            <div 
                className="auth-gradient-orb auth-gradient-orb-3 transition-opacity duration-1000" 
                style={{ opacity: resolvedOrbOpacity - 0.1 }} 
            />

            {/* Grid Pattern */}
            {showGrid && (
                <div 
                    className="absolute inset-0 opacity-[0.03] lg:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                        backgroundSize: isMobileVariant ? '32px 32px' : '48px 48px',
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Geometry Pattern - Standardized positioning */}
            <div className={cn(
                "absolute opacity-[0.06] lg:opacity-[0.08] transition-all duration-1000",
                isMobileVariant ? "top-0 right-0 w-1/2 h-1/3" : "top-0 right-0 w-1/3 h-1/2"
            )}>
                <GeometryPattern autoSwap position="top" />
            </div>

            {/* Floating Motifs */}
            <FloatingMotifs 
                count={resolvedMotifCount} 
                opacity={isMobileVariant ? 0.05 : 0.07} 
                color="var(--primary)" 
                seed={seed} 
            />

            {/* Light sweeping highlights */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,color-mix(in srgb,var(--primary) 12%,transparent),transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,color-mix(in srgb,var(--accent) 10%,transparent),transparent_40%)]" />
            
            {/* Mobile-Specific Bottom Glow (Prominent) */}
            {isMobileVariant && (
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-primary/15 via-primary/5 to-transparent pointer-events-none" />
            )}
        </div>
    );
};

export default PremiumBackground;
