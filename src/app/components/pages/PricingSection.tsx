import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Check, X } from 'lucide-react';

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
    popular: false,
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
    popular: true,
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
    popular: false,
    features: SHARED_FEATURES,
  },
  {
    id: 'custom',
    name: 'Custom',
    label: 'Custom',
    priceNum: null,
    chatsPerDay: null,
    messagesLimit: null,
    additionalUsage: null,
    popular: false,
    features: [],
  },
];

const THEMES = [
  { id: 'backside', title: 'On backside', badge: null },
  { id: 'synabs', title: 'On frontside', badge: '−20% forever' },
];

interface PricingSectionProps {
  activeTheme: string;
  onGetStarted: (id: string) => void;
}

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

export function PricingSection({ activeTheme, onGetStarted }: PricingSectionProps) {
  const isDark = activeTheme === 'dark';
  const [planIdx, setPlanIdx] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  // For the contact form (custom) or get-started form (regular plans)
  const [formPlanOverride, setFormPlanOverride] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: '',
  });
  const [formError, setFormError] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  const plan = PLANS[planIdx];
  const isCustom = plan.id === 'custom';
  const discountedPrice =
    !isCustom && plan.priceNum && selectedTheme === 'synabs'
      ? Math.round(plan.priceNum * 0.8)
      : plan.priceNum;

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
    inputBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
  };

  const sectionLabel: React.CSSProperties = {
    color: c.faint,
    fontSize: 12,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    margin: '0 0 12px',
    fontWeight: 400,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: `0.5px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 14,
    fontWeight: 300,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const handleGetStarted = () => {
    if (isCustom) {
      // Open form with Custom pre-selected
      setFormPlanOverride('custom');
      setShowForm(true);
      return;
    }
    const missing: string[] = [];
    if (!selectedTheme) missing.push('SYNABS Logo');
    if (missing.length > 0) {
      setError(`Please select: ${missing.join(' and ')}.`);
      return;
    }
    setError('');
    setFormPlanOverride(plan.id);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    const missing: string[] = [];
    if (!contactForm.firstName.trim()) missing.push('first name');
    if (!contactForm.lastName.trim()) missing.push('last name');
    if (!contactForm.email.trim()) missing.push('email');
    if (missing.length > 0) {
      setFormError(`Please fill in: ${missing.join(', ')}.`);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setFormError('');
    onGetStarted(formPlanOverride ?? plan.id);
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormError('');
    setFormPlanOverride(null);
  };

  const isFormCustom = formPlanOverride === 'custom';

  // The form modal — same structure for both custom and regular plans
  // Custom tab is pre-selected and bypasses logo/packet choices
  const formSelectedPlanId = formPlanOverride;

  // Fixed height content area: always show the same layout as plan M (popular),
  // so all plans render identically sized. Badge space is always reserved.
  const RESERVED_BADGE_HEIGHT = 26; // px — space for "Most popular" badge even when not shown

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
              <div style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 8,
                border: `0.5px solid ${c.border}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span style={{ fontSize: 16, color: c.faint, textDecoration: 'line-through', fontWeight: 300 }}>499€</span>
                <span style={{ fontSize: 14, color: c.label, fontWeight: 300 }}>That's on us for now.</span>
              </div>
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

            {/* Select message packet + tabs */}
            <div style={{ marginBottom: 36 }}>
              <p style={sectionLabel}>Select message packet</p>
              <div style={{ display: 'flex', gap: 0, borderBottom: `0.5px solid ${c.border}` }}>
                {PLANS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => { setPlanIdx(i); setError(''); }}
                    style={{
                      padding: '8px 24px 10px',
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan content — always same height as M */}
            {isCustom ? (
              /* Custom: show same structural height as regular plans but with custom copy */
              <>
                {/* Price + chats row — reserved height, empty for custom */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 72, fontWeight: 200, color: c.text, letterSpacing: -3, lineHeight: 0.9 }}>
                        —
                      </span>
                    </div>
                    <p style={{ color: c.faint, fontSize: 13, margin: '10px 0 0', fontWeight: 300 }}>/month</p>
                  </div>
                  <div style={{ textAlign: 'right', paddingBottom: 4 }}>
                    {/* Reserved badge space */}
                    <div style={{ height: RESERVED_BADGE_HEIGHT }} />
                    <p style={{ color: c.text, fontSize: 17, margin: '0 0 4px', fontWeight: 300 }}>
                      Tell us what you need
                    </p>
                    <p style={{ color: c.muted, fontSize: 13, margin: '0 0 2px', fontWeight: 300 }}>
                      we'll build it around you.
                    </p>
                    <p style={{ color: c.faint, fontSize: 12, margin: 0 }}>
                      From custom integrations to longer cooperation.
                    </p>
                  </div>
                </div>

                {/* Features — reserved height with placeholder items */}
                <div style={{ paddingTop: 24, borderTop: `0.5px solid ${c.border}`, marginBottom: 36 }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, columns: 2, gap: 24 }}>
                    {SHARED_FEATURES.map((f) => (
                      <li
                        key={f}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: c.faint, padding: '5px 0', fontWeight: 300, breakInside: 'avoid' }}
                      >
                        <Check size={13} color={c.faint} strokeWidth={2} style={{ flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
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
                    <p style={{ color: c.faint, fontSize: 13, margin: '10px 0 0', fontWeight: 300 }}>/month</p>
                  </div>
                  <div style={{ textAlign: 'right', paddingBottom: 4 }}>
                    {/* Always reserve badge height so layout is identical across all plans */}
                    <div style={{ height: RESERVED_BADGE_HEIGHT, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      {plan.popular && (
                        <span style={{
                          display: 'inline-block',
                          fontSize: 10,
                          fontWeight: 500,
                          color: c.faint,
                          border: `0.5px solid ${c.border}`,
                          borderRadius: 4,
                          padding: '2px 7px',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}>
                          Most popular
                        </span>
                      )}
                    </div>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCustom ? 'flex-end' : 'space-between' }}>
              {!isCustom && (
                <div>
                  <span style={{ fontSize: 15, color: c.text, fontWeight: 300 }}>
                    {discountedPrice}€ / month
                  </span>
                  {selectedTheme === 'synabs' && (
                    <span style={{ fontSize: 12, color: c.green, marginLeft: 10 }}>
                      SYNABS discount applied
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={handleGetStarted}
                style={{
                  padding: isCustom ? '10px 22px' : '12px 28px',
                  borderRadius: 6,
                  background: c.text,
                  color: c.bg,
                  fontSize: isCustom ? 13 : 14,
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {isCustom ? 'Send contact request' : 'Get started'}
              </button>
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

        {/* ─── Get Started / Contact Form Modal ─── */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseForm(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                background: c.bg,
                borderRadius: 12,
                border: `0.5px solid ${c.border}`,
                width: '100%',
                maxWidth: 540,
                padding: '36px 36px 32px',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Close */}
              <button
                onClick={handleCloseForm}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: c.faint,
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              {/* Form header */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ color: c.text, fontSize: 22, fontWeight: 300, margin: '0 0 6px', letterSpacing: -0.5 }}>
                  {isFormCustom ? 'Get in touch' : 'Get started'}
                </h3>
                <p style={{ color: c.label, fontSize: 14, margin: 0, fontWeight: 300 }}>
                  {isFormCustom
                    ? 'Tell us what you need — we\'ll build it around you.'
                    : 'Fill in your details to get started.'}
                </p>
              </div>

              {/* Plan selector tabs inside form — same tabs, Custom is pre-selected for custom flow */}
              <div style={{ marginBottom: 28 }}>
                <p style={sectionLabel}>Select message packet</p>
                <div style={{ display: 'flex', gap: 0, borderBottom: `0.5px solid ${c.border}` }}>
                  {PLANS.map((p, i) => {
                    const isActive = isFormCustom
                      ? p.id === 'custom'
                      : p.id === formSelectedPlanId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          if (!isFormCustom) {
                            setFormPlanOverride(p.id);
                          } else if (p.id === 'custom') {
                            // already custom, do nothing
                          } else {
                            // switching away from custom — allow it
                            setFormPlanOverride(p.id);
                          }
                        }}
                        style={{
                          padding: '8px 24px 10px',
                          fontSize: 14,
                          fontWeight: 400,
                          border: 'none',
                          background: 'transparent',
                          color: isActive ? c.tabActive : c.tabInactive,
                          cursor: 'pointer',
                          borderBottom: `1px solid ${isActive ? c.tabActive : 'transparent'}`,
                          marginBottom: -1,
                          transition: 'all 0.2s',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fields: name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <p style={{ ...sectionLabel, marginBottom: 8 }}>First name</p>
                  <input
                    type="text"
                    placeholder="Jane"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm((f) => ({ ...f, firstName: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <p style={{ ...sectionLabel, marginBottom: 8 }}>Last name</p>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm((f) => ({ ...f, lastName: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ ...sectionLabel, marginBottom: 8 }}>Email</p>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Company */}
              <div style={{ marginBottom: 12 }}>
                <p style={{ ...sectionLabel, marginBottom: 8 }}>Company</p>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={contactForm.company}
                  onChange={(e) => setContactForm((f) => ({ ...f, company: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Message — shown for all, but labeled differently */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ ...sectionLabel, marginBottom: 8 }}>
                  {isFormCustom ? 'What do you need?' : 'Anything else? (optional)'}
                </p>
                <textarea
                  placeholder={isFormCustom
                    ? 'Describe your use case, integrations, volume, or anything else...'
                    : 'Any questions or context...'}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Form error */}
              {formError && (
                <div style={{
                  marginBottom: 16,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `0.5px solid ${c.errorBorder}`,
                  background: c.errorBg,
                }}>
                  <p style={{ color: c.errorText, fontSize: 13, margin: 0, fontWeight: 300 }}>{formError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleFormSubmit}
                style={{
                  width: '100%',
                  padding: '13px 28px',
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
                {isFormCustom ? 'Send contact request' : 'Get started'}
              </button>

            </motion.div>
          </motion.div>
        )}

      </motion.section>
    </div>
  );
}
