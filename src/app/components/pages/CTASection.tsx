import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { ParticleField } from '../common/ParticleField';

interface CTASectionProps {
  activeTheme: string;
  onGetStarted: () => void;
}

export function CTASection({ activeTheme, onGetStarted }: CTASectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const y = useTransform(scrollYProgress, [0, 0.6], [80, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.88, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.6], [12, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div style={{ perspective: '1400px', overflow: 'hidden' }}>
      <motion.section
        ref={ref}
        id="cta" style={{ y, scale, rotateX, opacity, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000' }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black" />
        <ParticleField count={20} />



        <div className="relative z-10 flex items-center justify-center text-center" style={{ minHeight: '100vh' }}>
          <div className="max-w-3xl mx-auto w-full px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-7xl md:text-8xl font-light mb-4 text-white leading-tight">
                Try It Free<br />for 14 Days
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-xl font-light text-zinc-400 max-w-lg mx-auto mb-10"
            >
              Try next-gen AI support in minutes and decide later.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-12 py-5 rounded-full text-lg font-semibold transition-all bg-white text-zinc-950 hover:bg-zinc-100"
              >
                Start Trial <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6 flex-wrap"
            >
              {['No credit card required', 'Setup in 48 hours', 'Cancel anytime'].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-white/40">
                  <Check className="size-3.5" style={{ color: '#00BC7D' }} />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
