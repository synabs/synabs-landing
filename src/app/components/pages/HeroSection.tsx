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
        <div className="max-w-6xl mx-auto w-full px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-light mb-4 text-white leading-tight" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 4.2rem)' }}>
              Live chat support by the<br />world's smartest AI Agent
            </h2>
            <p className="font-light text-zinc-400 max-w-2xl mb-9" style={{ fontSize: '1.2rem' }}>
              The AI Agent resolves complex inquiries, evolves every week, and helps increase
              conversions while reducing support workload.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-7"
            >
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 rounded-full font-semibold transition-all bg-white text-zinc-950 hover:bg-zinc-100"
                style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
              >
                Start_free_trial <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#tia-in-action"
                className="rounded-full font-semibold transition-colors border border-white/20 text-white hover:bg-white/10"
                style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
              >
                See_it_live
              </a>
              <img
                src="/cortex-1.04.avif"
                alt="AI Engine"
                style={{ width: '110px', height: '150px', objectFit: 'contain' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-7 flex-wrap"
            >
              {['No credit card required', 'Setup in 48 hours', 'Cancel anytime'].map(item => (
                <span key={item} className="flex items-center gap-2 text-white/40" style={{ fontSize: '0.95rem' }}>
                  <Check className="size-4" style={{ color: '#00BC7D' }} />
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
