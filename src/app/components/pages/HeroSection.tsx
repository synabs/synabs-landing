import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
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
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/bg-vd.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/85" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '220px', background: 'linear-gradient(to bottom, transparent, #000000)', zIndex: 2 }} />
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
              className="relative flex flex-col sm:flex-row items-center gap-4 mb-7"
              style={{ width: 'fit-content' }}
            >
              <a
                href="#tia-in-action"
                className="rounded-full font-semibold transition-all bg-white text-zinc-950 hover:bg-zinc-100"
                style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
              >
                See it live
              </a>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center rounded-full font-semibold transition-colors border border-white/20 text-white hover:bg-white/10"
                style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
              >
                Start free trial
              </button>
              <img
                src="/cortex-1.04.avif"
                alt="AI Engine"
                className="pointer-events-none"
                style={{
                  position: 'absolute',
                  left: 'calc(100% + 1.5rem)',
                  bottom: '-10px',
                  width: '110px',
                  height: '150px',
                  objectFit: 'contain',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/55 italic" style={{ fontSize: '0.82rem' }}>
                "Not human. Better"
              </p>
              <span className="text-white/25" style={{ fontSize: '0.82rem' }}>—</span>
              <span className="text-white/40 font-medium" style={{ fontSize: '0.82rem' }}>Verkkopantteri</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
