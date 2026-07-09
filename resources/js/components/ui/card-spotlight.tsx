"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Radius of spotlight glow in pixels */
  radius?: number;
  /** Spotlight color (CSS color string) */
  color?: string;
  /** Border radius class — defaults to rounded-2xl */
  rounded?: string;
  /** If true, removes the default border (use when ShineBorder handles the border) */
  borderless?: boolean;
  children: React.ReactNode;
}

/**
 * Reusable card with cursor-following spotlight effect.
 * Inspired by Aceternity UI's card-spotlight component.
 *
 * Usage:
 *   <CardSpotlight className="p-6">
 *     <h3>Title</h3>
 *     <p>Description</p>
 *   </CardSpotlight>
 */
export function CardSpotlight({
  children,
  className,
  radius = 300,
  color = "var(--l-primary, oklch(0.35 0.12 250))",
  rounded = "rounded-2xl",
  borderless = false,
  ...props
}: CardSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group/spotlight relative bg-[var(--l-surface,var(--card))]",
        !borderless && "overflow-hidden border border-[var(--l-border,var(--border))]/50",
        rounded,
        className
      )}
      {...props}
    >
      {/* Spotlight radial gradient — follows cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, ${color} 12%, transparent), transparent 70%)`,
          // @ts-ignore — CSS custom properties
          "--spot-x": springX,
          "--spot-y": springY,
        } as React.CSSProperties}
      />

      {/* Spotlight border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(${radius * 0.6}px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, ${color} 25%, transparent), transparent 60%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
          borderRadius: "inherit",
          "--spot-x": springX,
          "--spot-y": springY,
        } as React.CSSProperties}
      />

      {/* Content — always on top */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
