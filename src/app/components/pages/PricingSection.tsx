import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check } from 'lucide-react';

const SHARED_FEATURES = [
  'Trained on your content',
  'AI evolves weekly with new data',
  'Analytics dashboard',
  'Lead capture integration',
  'Calendly integration',
  'Priority support',
  'Cancel anytime',
];

const PLANS = [
  {
    id: 'S',
    name: 'S',
    label: 'Core',
    priceNum: 249,
    chatsPerDay: '~6–10 chats a day',
    messagesLimit: '2,000 messages / month',
    additionalUsage: '€0.06 / message',
    features: SHARED_FEATURES,
  },
  {
    id: 'M',
    name: 'M',
    label: 'Pro',
    priceNum: 349,
    chatsPerDay: '~12–20 chats a day',
    messagesLimit: '5,000 messages / month',
    additionalUsage: '€0.06 / message',
    features: SHARED_FEATURES,
  },
  {
    id: 'L',
    name: 'L',
    label: 'Enterprise',
    priceNum: 699,
    chatsPerDay: '~20–40 chats a day',
    messagesLimit: '10,000 messages / month',
    additionalUsage: '€0.06 / message',
    features: SHARED_FEATURES,
  },
];

const THEMES = [
  { id: 'synabs', title: 'On frontside', badge: '−20% forever' },
  { id: 'custom', title: 'On backside', badge: null },
];

interface PricingSectionProps {
  activeTheme: string;
  onGetStarted: (id: string) => void;
}

export function PricingSection({ activeTheme, onGetStarted }: PricingSectionProps) {
  const isDark = activeTheme === 'dark';
  const [planIdx, setPlanIdx] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [error, setError] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  const plan = planIdx !== null ? PLANS[planIdx] : null;
  const discountedPrice =
    plan && selectedTheme === 'synabs' ? Math.round(plan.priceNum * 0.8) : plan?.priceNum ?? null;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.9', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const blurVal = useTransform(scrollYProgress, [0, 0.6], [10, 0]);
  const sectionFilter = useTransform(blurVal, (b) => `blur(${b}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const c = {
    label: isDark ? '#a1a1aa' : '#52525b',
    muted: isDark ? '#71717a' : '#71717a',
    faint: isDark ? '#52525b' : '#a1a1aa',
    border: isDark ? '#27272a' : '#e4e4e7',
    borderActive: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)',
    text: isDark ? '#fff' : '#000',
    bg: isDark ? '#000' : '#fff',
    tabActive: isDark ? '#fff' : '#000',
    tabInactive: isDark ? '#71717a' : '#a1a1aa',
    cardBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    green: '#4ade80',
    errorBg: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)',
    errorBorder: 'rgba(239,68,68,0.4)',
    errorText: '#f87171',
  };

  const sectionLabel: React.CSSProperties = {
    color: c.faint,
    fontSize: 12,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    margin: '0 0 12px',
    fontWeight: 400,
  };

  const handleGetStarted = () => {
    const missing: string[] = [];
    if (!selectedTheme) missing.push('SYNABS Logo');
    if (planIdx === null) missing.push('message packet (S / M / L)');
    if (missing.length > 0) {
      setError(`Please select: ${missing.join(' and ')}.`);
      return;
    }
    setError('');
    onGetStarted(PLANS[planIdx!].id);
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.section
        ref={sectionRef}
        id="pricing"
        style={{ scale, filter: sectionFilter, opacity, background: c.bg }}
        className="min-h-screen flex flex-col items-center justify-center transition-colors duration-700 py-24 px-6 relative"
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
            <h2 style={{ color: c.text, fontSize: 56, fontWeight: 300, margin: '0 0 12px', letterSpacing: -2, lineHeight: 1.05, whiteSpace: 'nowrap' }}>
              Hire Your AI Agent
            </h2>
            <p style={{ color: c.label, fontSize: 18, margin: 0, fontWeight: 300 }}>
              Save thousands every month with AI automation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
          >

            {/* Initial costs */}
            <div style={{ marginBottom: 36 }}>
              <p style={sectionLabel}>Initial costs</p>
              <button
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 8,
                  border: `0.5px solid ${c.border}`,
                  background: 'transparent',
                  cursor: 'default',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 16, color: c.faint, textDecoration: 'line-through', fontWeight: 300 }}>499€</span>
                <span style={{ fontSize: 14, color: c.label, fontWeight: 300 }}>That's on us for now.</span>
              </button>
            </div>

            {/* SYNABS Logo selector */}
            <div style={{ marginBottom: 36 }}>
              <p style={sectionLabel}>SYNABS Logo</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {THEMES.map((opt) => {
                  const active = selectedTheme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => { setSelectedTheme((v) => (v === opt.id ? '' : opt.id)); setError(''); }}
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: active ? c.text : c.label, fontWeight: 400 }}>
                        {opt.title}
                        {opt.badge && (
                          <span style={{ fontSize: 12, color: active ? c.green : c.faint }}>
                            {opt.badge}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select message packet label + Plan tabs */}
            <div style={{ marginBottom: 36 }}>
              <p style={sectionLabel}>Select message packet</p>
              <div style={{ display: 'flex', gap: 0, borderBottom: `0.5px solid ${c.border}` }}>
                {PLANS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => { setPlanIdx(i); setError(''); }}
                    style={{
                      padding: '8px 28px 10px',
                      fontSize: 14,
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
            </div>

            {/* Price + chats row — only shown when plan selected */}
            {plan && (
              <>
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
                    <p style={{ color: c.faint, fontSize: 13, margin: '10px 0 0', fontWeight: 300 }}>/month</p>
                  </div>
                  <div style={{ textAlign: 'right', paddingBottom: 4 }}>
                    <p style={{ color: c.text, fontSize: 17, margin: '0 0 4px', fontWeight: 300 }}>
                      {plan.chatsPerDay}
                    </p>
                    <p style={{ color: c.muted, fontSize: 13, margin: '0 0 2px', fontWeight: 300 }}>
                      {plan.messagesLimit}
                    </p>
                    <p style={{ color: c.faint, fontSize: 12, margin: 0 }}>
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
                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: c.label, padding: '5px 0', fontWeight: 300, breakInside: 'avoid' }}
                      >
                        <Check size={13} color={c.text} strokeWidth={2} style={{ flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Error message */}
            {error && (
              <div style={{
                marginBottom: 16,
                padding: '12px 16px',
                borderRadius: 8,
                border: `0.5px solid ${c.errorBorder}`,
                background: c.errorBg,
              }}>
                <p style={{ color: c.errorText, fontSize: 13, margin: 0, fontWeight: 300 }}>{error}</p>
              </div>
            )}

            {/* CTA row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                {plan && (
                  <span style={{ fontSize: 15, color: c.text, fontWeight: 300 }}>
                    {discountedPrice}€ / month
                  </span>
                )}
                {selectedTheme === 'synabs' && plan && (
                  <span style={{ fontSize: 12, color: c.green, marginLeft: 10 }}>
                    SYNABS discount applied
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 13, color: c.faint, fontWeight: 300 }}>Cancel anytime</span>
                <button
                  onClick={handleGetStarted}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 6,
                    background: c.text,
                    color: c.bg,
                    fontSize: 14,
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
            </div>

            {/* Trust line */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 28, paddingTop: 24, borderTop: `0.5px solid ${c.border}` }}>
              {['GDPR-ready', 'Encrypted cloud storage', 'Data encrypted in transit', 'Data deletion on request'].map((item) => (
                <span key={item} style={{ fontSize: 12, color: c.faint }}>
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
