import React from 'react';
import { Check } from 'lucide-react';

const CHECKS = [
  'Average 40% increase in lead capture by early testers on third month',
];

export function EvolvingSection() {
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
            We feed your AI Agent on your business data, give single JavaScript code line to install it on your site, and keep it improving every week. No technical expertise needed. We handle everything for you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CHECKS.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={13} color="#00BC7D" strokeWidth={2.5} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
