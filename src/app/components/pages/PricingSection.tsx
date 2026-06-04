import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const PLANS = [
  {
    id: 'S',
    name: 'S',
    label: 'Core',
    priceNum: 199,
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
  },
  {
    id: 'M',
    name: 'M',
    label: 'Pro',
    priceNum: 399,
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
  },
  {
    id: 'L',
    name: 'L',
    label: 'Enterprise',
    priceNum: 699,
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
  },
];

const THEMES = [
  {
    id: 'synabs',
    title: 'SYNABS Theme',
    subtitle: 'White or Black',
    badge: '−20% forever',
  },
  {
    id: 'custom',
    title: 'Custom Theme',
    subtitle: 'Fully personalized',
    badge: null,
  },
];

interface PricingSectionProps {
  activeTheme: string;
  onGetStarted: (id: string) => void;
}

export function PricingSection({ activeTheme, onGetStarted }: PricingSectionProps) {
  const isDark = activeTheme === 'dark';
  const [planIdx, setPlanIdx] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  const plan = PLANS[planIdx];
  const discountedPrice =
    selectedTheme === 'synabs' ? Math.round(plan.priceNum * 0.8) : plan.priceNum;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'center center'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const blurVal = useTransform(scrollYProgress, [0, 0.6], [10, 0]);
  const sectionFilter = useTransform(blurVal, (b) => `blur(${b}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const c = {
    label: isDark ? '#555' : '#999',
    muted: isDark ? '#444' : '#aaa',
    faint: isDark ? '#2a2a2a' : '#ccc',
    border: isDark ? '#1e1e1e' : '#e5e5e5',
    borderActive: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)',
    text: isDark ? '#fff' : '#000',
    bg: isDark ? '#000' : '#fff',
    tabActive: isDark ? '#fff' : '#000',
    tabInactive: isDark ? '#444' : '#bbb',
    cardBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    green: '#4ade80',
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.section
        ref={sectionRef}
        id="pricing"
        style={{ scale, filter: sectionFilter, opacity }}
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-700 py-24 px-6 relative`}
        style={{
          scale,
          filter: sectionFilter,
          opacity,
          background: c.bg,
        }}
      >
        <div className="max-w-2xl mx-auto w-full">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ marginBottom: 48 }}
          >
            <p style={{ color: c.faint, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 16px', fontWeight: 400 }}>
              Pricing
            </p>
            <h2 style={{ color: c.text, fontSize: 56, fontWeight: 300, margin: '0 0 12px', letterSpacing: -2, lineHeight: 1.05, whiteSpace: 'nowrap' }}>
              Hire Your AI Agent
            </h2>
            <p style={{ color: c.label, fontSize: 15, margin: 0, fontWeight: 300 }}>
              Save thousands every month with AI automation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
          >

            {/* Theme selector */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ color: c.faint, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                Choose your theme
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {THEMES.map((opt) => {
                  const active = selectedTheme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedTheme((v) => (v === opt.id ? '' : opt.id))}
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 8,
                        border: `0.5px solid ${active ? c.borderActive : c.border}`,
                        background: active ? c.cardBg : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ display: 'block', fontSize: 13, color: active ? c.text : c.label, fontWeight: 400, marginBottom: 3 }}>
                        {opt.title}
                      </span>
                      <span style={{ fontSize: 11, color: c.faint }}>
                        {opt.subtitle}
                        {opt.badge && (
                          <span style={{ marginLeft: 8, color: active ? c.green : c.faint }}>
                            {opt.badge}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plan tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 36, borderBottom: `0.5px solid ${c.border}` }}>
              {PLANS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPlanIdx(i)}
                  style={{
                    padding: '8px 28px 10px',
                    fontSize: 13,
                    fontWeight: 400,
                    border: 'none',
                    background: 'transparent',
                    color: i === planIdx ? c.tabActive : c.tabInactive,
                    cursor: 'pointer',
                    borderBottom: `1px solid ${i === planIdx ? c.tabActive : 'transparent'}`,
                    marginBottom: -1,
                    transition: 'all 0.2s',
                    letterSpacing: '0.03em',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Price + chats row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {selectedTheme === 'synabs' && (
                    <span style={{ fontSize: 18, color: c.faint, textDecoration: 'line-through', marginRight: 6 }}>
                      {plan.priceNum}€
                    </span>
                  )}
                  <span style={{ fontSize: 72, fontWeight: 200, color: c.text, letterSpacing: -3, lineHeight: 0.9 }}>
                    {discountedPrice}
                  </span>
                  <span style={{ fontSize: 22, color: c.muted, fontWeight: 300, paddingBottom: 4 }}>€</span>
                </div>
                <p style={{ color: c.faint, fontSize: 12, margin: '10px 0 0', fontWeight: 300 }}>/month</p>
              </div>
              <div style={{ textAlign: 'right', paddingBottom: 4 }}>
                <p style={{ color: c.text, fontSize: 15, margin: '0 0 4px', fontWeight: 300 }}>
                  {plan.chatsPerDay}
                </p>
                <p style={{ color: c.muted, fontSize: 12, margin: '0 0 2px', fontWeight: 300 }}>
                  {plan.messagesLimit}
                </p>
                <p style={{ color: c.faint, fontSize: 11, margin: 0 }}>
                  +{plan.additionalUsage} overage
                </p>
              </div>
            </div>

            {/* Features */}
            <div style={{ paddingTop: 24, borderTop: `0.5px solid ${c.border}`, marginBottom: 36 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, columns: 2, gap: 24 }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{ fontSize: 13, color: c.label, padding: '5px 0', fontWeight: 300, breakInside: 'avoid' }}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 14, color: c.text, fontWeight: 300 }}>
                  {discountedPrice}€ / month
                </span>
                {selectedTheme === 'synabs' && (
                  <span style={{ fontSize: 11, color: c.green, marginLeft: 10 }}>
                    SYNABS discount applied
                  </span>
                )}
              </div>
              <button
                onClick={() => onGetStarted(plan.id)}
                style={{
                  padding: '12px 28px',
                  borderRadius: 6,
                  background: c.text,
                  color: c.bg,
                  fontSize: 13,
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Get started
              </button>
            </div>

            {/* Trust line */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 28, paddingTop: 24, borderTop: `0.5px solid ${c.border}` }}>
              {['GDPR-ready', 'Encrypted cloud storage', 'Data encrypted in transit', 'Data deletion on request'].map((item) => (
                <span key={item} style={{ fontSize: 11, color: c.faint }}>
                  {item}
                </span>
              ))}
            </div>

          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
