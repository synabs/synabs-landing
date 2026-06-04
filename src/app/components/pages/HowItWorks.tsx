import React from 'react';
import { Globe, Zap, Target, RefreshCw, Check } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Globe,
    title: 'We train AI Agent on your business',
    desc: 'Share your website URL, product pages, FAQs, and pricing. AI Agent learns your entire knowledge base in minutes. No manual input required.',
    detail: 'Supports any URL, PDF, or document',
  },
  {
    number: '02',
    icon: Zap,
    title: 'We install it on your site',
    desc: 'One line of code added to your website. Works with WordPress, Shopify, Wix, and any custom-built site. We handle the entire setup.',
    detail: 'Setup completed in under 48 hours',
  },
  {
    number: '03',
    icon: Target,
    title: 'AI Agent starts converting visitors',
    desc: 'From the moment it goes live, AI Agent greets visitors, answers questions, qualifies leads, and captures contact details. 24/7, in any language.',
    detail: 'Average 40% increase in lead capture',
  },
  {
    number: '04',
    icon: RefreshCw,
    title: 'AI Agent gets smarter every week',
    desc: 'The AI learns from every conversation. You review insights on your analytics dashboard and AI Agent continuously improves its responses.',
    detail: 'Weekly AI evolution cycle',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ background: '#09090b', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            From zero to live<br />in 48 hours
          </h2>
          <p style={{
            fontSize: 17,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 560,
            lineHeight: 1.65,
            marginBottom: 24,
          }}>
            We train your AI Agent on your business, install it on your site, and keep it improving every week. No technical expertise needed. We handle everything for you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Placeholder check item one',
              'Placeholder check item two',
              'Placeholder check item three',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={13} color="#00BC7D" strokeWidth={2.5} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{ position: 'relative', padding: '28px 0' }}>
              {/* Fading divider */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.07) 30%, transparent 45%)',
                }} />
              )}

              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {/* Icon */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  <step.icon size={16} color="rgba(255,255,255,0.6)" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    {step.number}
                  </span>
                  <h3 style={{
                    fontSize: 17,
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: 8,
                    lineHeight: 1.35,
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.42)',
                    lineHeight: 1.7,
                    margin: '0 0 12px 0',
                    maxWidth: 680,
                  }}>
                    {step.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Check size={12} color="#00BC7D" strokeWidth={2.5} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                      {step.detail}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
