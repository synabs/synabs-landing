import React from 'react';
import { motion } from 'motion/react';

function FloatingParticle({ delay, duration, x, size }: {
  delay: number;
  duration: number;
  x: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/5 pointer-events-none"
      style={{ left: `${x}%`, bottom: 0, width: size, height: size }}
      animate={{ y: [0, -900], opacity: [0, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function ParticleField({ count = 18 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: (i * 0.7) % 8,
    duration: 6 + (i * 1.3) % 6,
    x: (i * 7.3) % 100,
    size: 2 + (i * 3.1) % 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <FloatingParticle key={p.id} {...p} />
      ))}
    </div>
  );
}
