import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/* ─── EVOLVE CYCLE STEPS ─────────────────────────────── */
const CYCLE_STEPS = [
  {
    phase: '01',
    label: 'Collect',
    title: 'Every conversation is captured',
    desc: 'All chat sessions are securely stored and indexed — topics, response quality, user intent, and session outcomes — ready for analysis.',
    color: '#34d399',
  },
  {
    phase: '02',
    label: 'Analyse',
    title: 'AI reads 75 quality signals',
    desc: 'Each week, Claude analyses the full conversation dataset across 75 diagnostic criteria spanning lead behaviour, support patterns, and information gaps.',
    color: '#60a5fa',
  },
  {
    phase: '03',
    label: 'Improve',
    title: 'Over 200 targeted prompt updates',
    desc: 'From the findings, more than 200 precision prompt injections are generated — each one sharpening a specific response pattern, tone, or knowledge gap.',
    color: '#a78bfa',
  },
  {
    phase: '04',
    label: 'Deploy',
    title: 'You approve, it goes live',
    desc: 'Every proposed improvement is shown to you in the admin panel. One click deploys the new intelligence. Your AI Agent is measurably smarter than last week.',
    color: '#f59e0b',
  },
];

/* ─── ANIMATED COUNTER ───────────────────────────────── */
function AnimatedNumber({ target, suffix = '', duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(ease * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

/* ─── PULSE RING ANIMATION ───────────────────────────── */
function PulseRing({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div
      style={{ border: `1px solid ${color}`, borderRadius: '50%', position: 'absolute', inset: -10 }}
      animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, repeatDelay: 0.8 }}
    />
  );
}

/* ─── FLOWING LINE SVG ───────────────────────────────── */
function FlowLine({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'relative', height: 2, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', borderRadius: 1, flexShrink: 0 }}>
      <motion.div
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, #34d399, transparent)', borderRadius: 1 }}
        animate={active ? { x: ['-100%', '200%'] } : { x: '-100%' }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/* ─── MAIN SECTION ───────────────────────────────────── */
export function EvolvingSection() {
  const ref = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.3'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s + 1) % CYCLE_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: 75, suffix: '', label: 'Quality signals analysed per cycle' },
    { value: 200, suffix: '+', label: 'Prompt improvements per week' },
    { value: 7, suffix: 'd', label: 'Between each evolution cycle' },
  ];

  return (
    <motion.section
      ref={ref}
      id="evolving"
      style={{ opacity, y, background: '#09090b' }}
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Subtle background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Glowing orb */}
      <div style={{
        position: 'absolute', top: '20%', right: '10%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          className="mb-16"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
            <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#34d399', fontWeight: 500 }}>
              Weekly AI Evolution
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light mb-3 text-white leading-tight">
            Smarter every week,<br />without lifting a finger
          </h2>
          <p className="text-lg font-light text-zinc-400 max-w-2xl">
            Most AI tools stay static after launch. TIA is different. Every week it reads its own conversations, finds what could be sharper, and upgrades itself automatically.
          </p>
        </motion.div>

        {/* Main content: cycle + stats */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Cycle steps */}
          <div className="flex-1 flex flex-col gap-0">
            {CYCLE_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  onClick={() => setActiveStep(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{
                    display: 'flex', gap: 20, padding: '20px 24px',
                    borderRadius: 16, transition: 'background 0.3s',
                    background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                  }}>
                    {/* Step indicator */}
                    <div style={{ position: 'relative', flexShrink: 0, width: 40, height: 40, marginTop: 2 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: isActive ? step.color : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${isActive ? step.color : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.4s',
                        boxShadow: isActive ? `0 0 20px ${step.color}40` : 'none',
                      }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                          color: isActive ? '#09090b' : 'rgba(255,255,255,0.3)',
                          transition: 'color 0.3s',
                        }}>
                          {step.phase}
                        </span>
                      </div>
                      {isActive && <PulseRing color={step.color} />}

                      {/* Connector line */}
                      {i < CYCLE_STEPS.length - 1 && (
                        <div style={{
                          position: 'absolute', left: '50%', top: 44, width: 1,
                          height: 32, background: 'rgba(255,255,255,0.08)', transform: 'translateX(-50%)',
                        }} />
                      )}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, paddingBottom: i < CYCLE_STEPS.length - 1 ? 12 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: step.color, opacity: isActive ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                          {step.label}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 500, color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)', marginBottom: 6, transition: 'color 0.3s', lineHeight: 1.4 }}>
                        {step.title}
                      </h3>
                      <motion.p
                        animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', margin: 0 }}
                      >
                        {step.desc}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right column: stats + visual */}
          <div className="flex flex-col gap-6" style={{ width: '100%', maxWidth: 400, flexShrink: 0 }}>

            {/* Stats cards */}
            <div className="flex flex-col gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '18px 24px',
                    display: 'flex', alignItems: 'center', gap: 20,
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 300, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', minWidth: 80 }}>
                    <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visual: live cycle indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                  Evolution cycle
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                  <span style={{ fontSize: 11, color: '#34d399', fontWeight: 500 }}>Live</span>
                </div>
              </div>

              {/* Phase indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                {CYCLE_STEPS.map((step, i) => (
                  <React.Fragment key={step.phase}>
                    <motion.div
                      animate={{
                        background: activeStep === i ? step.color : 'rgba(255,255,255,0.08)',
                        boxShadow: activeStep === i ? `0 0 12px ${step.color}60` : 'none',
                      }}
                      transition={{ duration: 0.4 }}
                      style={{ width: activeStep === i ? 28 : 8, height: 8, borderRadius: 4, transition: 'width 0.4s' }}
                    />
                    {i < CYCLE_STEPS.length - 1 && (
                      <FlowLine active={activeStep === i} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Current phase label */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: CYCLE_STEPS[activeStep].color + '22',
                    border: `1px solid ${CYCLE_STEPS[activeStep].color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: CYCLE_STEPS[activeStep].color }}>
                      {CYCLE_STEPS[activeStep].phase}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#ffffff' }}>
                    {CYCLE_STEPS[activeStep].title}
                  </span>
                </div>
                <div style={{
                  height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                }}>
                  <motion.div
                    style={{ height: '100%', background: CYCLE_STEPS[activeStep].color, borderRadius: 2 }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.8, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                display: 'flex', gap: 12, padding: '14px 18px',
                background: 'rgba(52,211,153,0.06)',
                border: '1px solid rgba(52,211,153,0.15)',
                borderRadius: 12,
              }}
            >
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(52,211,153,0.2)', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
                Every change is shown to you before it goes live. You stay in control. The AI does the work.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
