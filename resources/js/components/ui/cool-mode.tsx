"use client";

import React, { useCallback, useRef, type ReactElement } from "react";

export interface CoolModeOptions {
  /** Image URL to use for particles, or "circle" for colored circles */
  particle?: string;
  /** Base size of particles in pixels */
  size?: number;
  /** Number of particles per click */
  particleCount?: number;
  /** Horizontal speed multiplier */
  speedHorz?: number;
  /** Initial upward speed */
  speedUp?: number;
  /** How quickly particles slow down (0-1) */
  decay?: number;
  /** Gravity acceleration */
  gravity?: number;
}

interface Particle {
  element: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function CoolMode({
  children,
  options = {},
}: {
  children: ReactElement;
  options?: CoolModeOptions;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const {
    particle: particleType,
    size = 20,
    particleCount = 18,
    speedHorz = 1.5,
    speedUp = 8,
    decay = 0.94,
    gravity = 0.35,
  } = options;

  const isImage = particleType && particleType !== "circle";

  const animate = useCallback(() => {
    const particles = particlesRef.current;
    let alive = false;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= decay;
      p.vy *= decay;
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.012;

      if (p.alpha <= 0) {
        p.element.remove();
        particles.splice(i, 1);
      } else {
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.alpha})`;
        p.element.style.opacity = String(Math.min(p.alpha, 1));
        alive = true;
      }
    }

    if (alive) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      animFrameRef.current = null;
    }
  }, [decay, gravity]);

  const spawnParticles = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      for (let i = 0; i < particleCount; i++) {
        const el = document.createElement("div");
        const pSize = randomInRange(size * 0.4, size * 1.2);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        Object.assign(el.style, {
          position: "fixed",
          pointerEvents: "none",
          zIndex: "9999",
          width: `${pSize}px`,
          height: `${pSize}px`,
          left: `${e.clientX - pSize / 2}px`,
          top: `${e.clientY - pSize / 2}px`,
          borderRadius: isImage ? "0" : "50%",
          background: isImage ? `url(${particleType}) center/cover` : color,
          willChange: "transform, opacity",
        });

        document.body.appendChild(el);

        particlesRef.current.push({
          element: el,
          x: 0,
          y: 0,
          vx: randomInRange(-speedHorz * 4, speedHorz * 4),
          vy: randomInRange(-speedUp, -speedUp * 0.3),
          size: pSize,
          alpha: 1,
        });
      }

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    },
    [animate, isImage, particleCount, particleType, size, speedHorz, speedUp]
  );

  return (
    <div
      ref={containerRef}
      style={{ display: "contents" }}
      onClick={spawnParticles}
    >
      {children}
    </div>
  );
}
