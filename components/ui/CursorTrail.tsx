"use client";

import { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LOGO_SIZE = 32;
const HALF_LOGO = LOGO_SIZE / 2;
const MAX_PARTICLES = 40;

type TrailParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
  life: number;
  age: number;
  velocityX: number;
  velocityY: number;
  color: string;
  glow: string;
};

const COLORS = [
  {
    color: "rgba(47, 226, 130, 0.95)",
    glow: "0 0 6px rgba(47, 226, 130, 0.6), 0 0 11px rgba(47, 226, 130, 0.25)",
  },
  {
    color: "rgba(27, 169, 156, 0.95)",
    glow: "0 0 6px rgba(27, 169, 156, 0.5), 0 0 10px rgba(27, 169, 156, 0.2)",
  },
  {
    color: "rgba(59, 224, 208, 0.9)",
    glow: "0 0 6px rgba(59, 224, 208, 0.48), 0 0 10px rgba(59, 224, 208, 0.2)",
  },
];

let particleId = 0;

export function CursorTrail({
  x,
  y,
  visible,
  reducedMotion,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
  reducedMotion: boolean;
}) {
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const prevPositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setParticles([]);
      return;
    }

    let raf = 0;
    let lastFrame = performance.now();

    const animate = (time: number) => {
      const dt = Math.min(40, time - lastFrame);
      lastFrame = time;

      const cursorX = x.get() + HALF_LOGO;
      const cursorY = y.get() + HALF_LOGO;
      const prev = prevPositionRef.current;
      const dx = prev ? cursorX - prev.x : 0;
      const dy = prev ? cursorY - prev.y : 0;
      const movement = Math.hypot(dx, dy);
      const isMoving = visible && movement > 0.45;

      setParticles((current) => {
        let next = current
          .map((particle) => {
            const age = particle.age + dt;
            const progress = age / particle.life;
            const easedDecay = 1 - progress;
            return {
              ...particle,
              age,
              x: particle.x + particle.velocityX * (dt / 16),
              y: particle.y + particle.velocityY * (dt / 16),
              opacity: particle.baseOpacity * Math.max(0, easedDecay),
              size: particle.baseSize * (0.84 + Math.max(0, easedDecay) * 0.16),
            };
          })
          .filter((particle) => particle.opacity > 0.02 && particle.age < particle.life);

        if (isMoving) {
          const spawnCount = movement > 1.6 ? 2 : 1;

          for (let i = 0; i < spawnCount && next.length < MAX_PARTICLES; i += 1) {
            const palette = COLORS[Math.floor(Math.random() * COLORS.length)];
            const bright = particleId % 7 === 0;
            const baseSize = (bright ? 5 : 3) + Math.random() * (bright ? 2 : 4);
            const baseOpacity = (bright ? 0.35 : 0.15) + Math.random() * (bright ? 0.22 : 0.28);

            next.push({
              id: particleId++,
              x: cursorX + (Math.random() - 0.5) * 3,
              y: cursorY + (Math.random() - 0.5) * 3,
              size: baseSize,
              baseSize,
              opacity: baseOpacity,
              baseOpacity,
              life: 400 + Math.random() * 500,
              age: 0,
              velocityX: -dx * 0.06 + (Math.random() * 0.6 - 0.3),
              velocityY: -dy * 0.06 + (Math.random() * 0.6 - 0.3),
              color: palette.color,
              glow: palette.glow,
            });
          }
        }

        if (next.length > MAX_PARTICLES) {
          next = next.slice(next.length - MAX_PARTICLES);
        }

        return next;
      });

      prevPositionRef.current = { x: cursorX, y: cursorY };
      raf = window.requestAnimationFrame(animate);
    };

    raf = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(raf);
  }, [reducedMotion, visible, x, y]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: 0,
            top: 0,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: `translate3d(${particle.x - particle.size / 2}px, ${particle.y - particle.size / 2}px, 0)`,
            background: particle.color,
            boxShadow: particle.glow,
          }}
        />
      ))}
    </div>
  );
}

