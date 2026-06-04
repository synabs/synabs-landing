import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { ParticleField } from '../common/ParticleField';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000' }}
    >
      <div className="absolute inset-0 bg-black" />
      <ParticleField count={20} />

      <img
        src="/bg-st.avif"
        alt=""
        className="absolute pointer-events-none select-none"
        style={{
          right: '5%',
          bottom: '8%',
          width: '68%',
          maxWidth: '980px',
          minWidth: '420px',
          height: 'auto',
          maxHeight: '92vh',
          objectFit: 'contain',
          objectPosition: 'bottom right',
          opacity: 0.9,
          maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          zIndex: 1,
        }}
      />

      <div className="relative z-10 flex items-start" style={{ minHeight: '100vh', paddingTop: '18vh' }}>
        <div className="max-w-6xl mx-auto w-full px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl md:text-6xl font-light mb-3 text-white leading-tight">
              Live chat support by the<br />world's smartest AI Agent
            </h2>
            <p className="text-lg font-light text-zinc-400 max-w-2xl mb-8">
              The AI Agent resolves complex inquiries, evolves every week, and helps increase
              conversions while reducing support workload.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start gap-3 mb-6"
            >
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all bg-white text-zinc-950 hover:bg-zinc-100"
              >
                Start free trial <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#tia-in-action"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-colors border border-white/20 text-white hover:bg-white/10"
              >
                <img
                  src="/cortex-1.04.avif"
                  alt="AI Engine"
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                />
                See it live
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-6 flex-wrap"
            >
              {['No credit card required', 'Setup in 48 hours', 'Cancel anytime'].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-white/40">
                  <Check className="size-3.5" style={{ color: '#00BC7D' }} />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
