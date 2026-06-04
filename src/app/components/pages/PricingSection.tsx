import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check } from 'lucide-react';
import { ParticleField } from '../common/ParticleField';

const PLANS = [
  {
    id: 'M',
    name: 'S',
    label: 'Core',
    price: '149€',
    priceNum: 149,
    period: '/month',
    chatsPerDay: '3–5 chats a day',
    messagesLimit: '1,000 messages / month',
    additionalUsage: '€0.02 / message',
    features: [
      'Trained on your content',
      'AI evolves weekly with new data',
      'Analytics dashboard',
      'Email support',
      '48h setup',
    ],
    highlight: false,
  },
  {
    id: 'L',
    name: 'M',
    label: 'Pro',
    price: '299€',
    priceNum: 299,
    period: '/month',
    chatsPerDay: '6–10 chats a day',
    messagesLimit: '2,500 messages / month',
    additionalUsage: '€0.01 / message',
    features: [
      'Trained on your content',
      'AI evolves weekly with new data',
      'Analytics dashboard',
      'Auto-detected and alert hot leads',
      'Lead capture integration',
      'Priority support',
    ],
    highlight: true,
  },
  {
    id: 'XL',
    name: 'L',
    label: 'Enterprise',
    price: '699€',
    priceNum: 699,
    period: '/month',
    chatsPerDay: '20–40 chats a day',
    messagesLimit: '10,000 messages / month',
    additionalUsage: '€0.01 / message',
    features: [
      'Trained on your content',
      'AI evolves weekly with new data',
      'Analytics dashboard',
      'Auto-detected and alert hot leads',
      'Lead capture integration',
      'Priority support',
    ],
    highlight: false,
  },
];

interface PricingSectionProps {
  activeTheme: string;
  onGetStarted: (id: string) => void;
}

export function PricingSection({ activeTheme, onGetStarted }: PricingSectionProps) {
  const isDark = activeTheme === 'dark';
  const [planIdx, setPlanIdx] = useState(0);
  const [addonBotSetup, setAddonBotSetup] = useState('');
  const plan = PLANS[planIdx];
  const discountedPrice = addonBotSetup === 'tia' ? Math.round(plan.priceNum * 0.80) : plan.priceNum;
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.9', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const blurVal = useTransform(scrollYProgress, [0, 0.6], [10, 0]);
  const sectionFilter = useTransform(blurVal, b => `blur(${b}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const trackBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const fillColor = isDark ? '#ffffff' : '#000000';
  const fillPct = (planIdx / (PLANS.length - 1)) * 100;

  const getPctFromEvent = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const snapToNearest = (pct: number) => {
    setPlanIdx(Math.round(pct * (PLANS.length - 1)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    e.preventDefault();
    const move = (e: MouseEvent) => { if (!isDragging.current) return; snapToNearest(getPctFromEvent(e.clientX)); };
    const up = () => { isDragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    const move = (e: TouchEvent) => { if (!isDragging.current) return; snapToNearest(getPctFromEvent(e.touches[0].clientX)); };
    const end = () => { isDragging.current = false; window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end); };
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', end);
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.section
        ref={sectionRef}
        id="pricing"
        style={{ scale, filter: sectionFilter, opacity }}
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'} py-16 px-6 relative overflow-hidden`}
      >
        <ParticleField count={isDark ? 10 : 0} />
        <div className="max-w-2xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }} className="text-center mb-10">
            <h2 className="text-5xl md:text-6xl font-light mb-3 text-white">
              Hire Your <span style={{ color: '#ffffff' }}>AI Agent</span>
            </h2>
            <p className="text-lg font-light text-zinc-500">Save thousands every month with AI automation.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.88 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.1 }}
            className={`rounded-2xl p-8 relative border transition-colors duration-300 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}
          >
            {/* Plan selector */}
            <div className={`mb-6 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div className="flex justify-between mb-3">
                {PLANS.map((p, i) => (
                  <button key={p.id} onClick={() => setPlanIdx(i)}
                    className={`flex flex-col items-center gap-0.5 transition-colors ${
                      i === planIdx
                        ? isDark ? 'text-white' : 'text-zinc-950'
                        : isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600'
                    }`}>
                    <span className="text-xs font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
              <div
                ref={trackRef}
                className="relative h-4 rounded-full cursor-pointer select-none"
                style={{ background: trackBg }}
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPlanIdx(Math.round(((e.clientX - rect.left) / rect.width) * (PLANS.length - 1)));
                }}
              >
                <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200"
                  style={{ width: `${fillPct}%`, background: fillColor }} />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${fillPct}%`,
                    background: fillColor,
                    border: `3px solid ${isDark ? '#3f3f46' : '#e4e4e7'}`,
                    boxShadow: isDark
                      ? '0 0 0 2px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.5)'
                      : '0 0 0 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'left 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 1.15 }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                />
              </div>
            </div>

            {/* Bot Setup */}
            <div className={`mb-6 pb-6 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <p className={`text-xs font-semibold mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Bot Setup</p>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'tia', title: 'TIA Theme', subtitle: 'White or Black', badge: '−20% forever', badgeColor: 'text-emerald-400' },
                  { id: 'custom', title: 'Custom Theme', subtitle: 'Fully personalized', badge: null, badgeColor: '' },
                ].map(opt => {
                  const active = addonBotSetup === opt.id;
                  return (
                    <button key={opt.id}
                      onClick={() => setAddonBotSetup(v => v === opt.id ? '' : opt.id)}
                      className={`flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                        active
                          ? isDark ? 'border-white bg-white/10' : 'border-zinc-950 bg-zinc-950'
                          : isDark ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-200 hover:border-zinc-400'
                      }`}>
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
                        active ? 'bg-white border-white' : isDark ? 'border-zinc-600' : 'border-zinc-300'
                      }`}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-xs font-semibold ${active ? 'text-white' : isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {opt.title}
                          <span className={`ml-1.5 font-normal ${active ? 'opacity-70' : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {opt.subtitle}
                          </span>
                        </p>
                        {opt.badge && (
                          <span className={`text-xs font-medium ${active ? opt.badgeColor : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {opt.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size badge + price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.name}</span>
                <span className={`text-2xl font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.label}</span>
                {plan.highlight && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-zinc-200 text-zinc-700'}`}>
                    Most popular
                  </span>
                )}
              </div>
              <div className="text-right">
                {addonBotSetup === 'tia' ? (
                  <div className="flex flex-col items-end">
                    <div className={`text-sm line-through ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{plan.price}</div>
                    <div className={`text-4xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{discountedPrice}€</div>
                  </div>
                ) : (
                  <div className={`text-4xl font-light ${isDark ? 'text-white' : 'text-zinc-950'}`}>{plan.price}</div>
                )}
                <div className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{plan.period}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="mb-1 flex flex-col gap-0">
              <div className="flex items-baseline gap-0">
                <span style={{ color: '#00BC7D' }} className="text-xs font-bold">≈ </span>
                <span className="text-xs font-bold" style={{ color: '#00BC7D' }}>{plan.chatsPerDay}</span>
              </div>
              <p className={`text-xs font-medium mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.messagesLimit}</p>
            </div>
            <p className={`text-xs mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Additional usage: {plan.additionalUsage}</p>

            <ul className="mb-8" style={{ height: 180, overflow: 'hidden' }}>
              {plan.features.map(f => (
                <li key={f} className={`flex items-center gap-3 text-sm mb-2.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  <Check className="size-4 shrink-0" style={{ color: '#00BC7D' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onGetStarted(plan.id)}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              Get Started
            </button>
            <p className={`text-xs text-center mt-2 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Cancel anytime</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }} transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-5 mt-5 flex-wrap">
            {['GDPR-ready', 'Encrypted cloud storage', 'Data encrypted in transit and at rest', 'Data deletion on request'].map(item => (
              <span key={item} className={`flex items-center gap-1.5 text-xs font-light whitespace-nowrap ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <Check className="size-3 shrink-0" style={{ color: '#00BC7D' }} />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
