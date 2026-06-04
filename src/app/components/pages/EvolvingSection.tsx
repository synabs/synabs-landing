import React from 'react';

const STATS = [
  { value: '200+', label: 'Prompt improvements per week' },
  { value: '75', label: 'Quality signals analysed per cycle' },
  { value: '7 days', label: 'Between each evolution cycle' },
];

export function EvolvingSection() {
  return (
    <section
      id="evolving"
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
            Evolves every week,<br />gets smarter constantly
          </h2>
          <p style={{
            fontSize: 17,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 560,
            lineHeight: 1.65,
            margin: 0,
          }}>
            Your AI Agent gets smarter every week. Every conversation is captured, analysed across 75 quality signals, and turned into over 200 targeted improvements. All verified by a human before deployment.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ position: 'relative', paddingTop: 32 }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.07) 30%, transparent 45%)',
          }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            justifyContent: 'start',
            gap: '0 40px',
          }}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 300,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.38)',
                  lineHeight: 1.5,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
