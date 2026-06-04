import React from 'react';

/* ─── CYCLE STEPS ─────────────────────────────── */
const CYCLE_STEPS = [
  {
    phase: '01',
    label: 'Collect',
    title: 'Every conversation is captured',
    desc: 'All chat sessions are securely stored and indexed — covering topics, response quality, user intent, and session outcomes — ready for analysis.',
  },
  {
    phase: '02',
    label: 'Analyse',
    title: 'AI reads 75 quality signals',
    desc: 'Each week, the AI analyses the full conversation dataset across 75 diagnostic criteria spanning lead behaviour, support patterns, and knowledge gaps.',
  },
  {
    phase: '03',
    label: 'Improve',
    title: 'Over 200 targeted improvements',
    desc: 'From the findings, more than 200 precision prompt updates are generated — each one sharpening a specific response pattern, tone, or knowledge gap.',
  },
  {
    phase: '04',
    label: 'Deploy',
    title: 'You approve, it goes live',
    desc: 'Every proposed improvement is shown to you in the admin panel. One click deploys the new intelligence. Your AI Agent is measurably smarter than last week.',
  },
];

const STATS = [
  { value: '75', label: 'Quality signals analysed per cycle' },
  { value: '200+', label: 'Prompt improvements per week' },
  { value: '7 days', label: 'Between each evolution cycle' },
];

/* ─── MAIN SECTION ───────────────────────────────────── */
export function EvolvingSection() {
  return (
    <section
      id="evolving"
      style={{
        background: '#09090b',
        padding: '96px 24px',
      }}
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
            Most AI tools stop learning once deployed. Ours continuously analyses real conversation data, identifies gaps, and improves itself — automatically.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 64,
          alignItems: 'start',
        }}
          className="evolving-grid"
        >

          {/* Left: steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {CYCLE_STEPS.map((step, i) => (
              <div
                key={step.phase}
                style={{
                  display: 'flex',
                  gap: 24,
                  padding: '24px 0',
                  borderBottom: i < CYCLE_STEPS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                {/* Phase number */}
                <div style={{
                  flexShrink: 0,
                  width: 32,
                  paddingTop: 2,
                }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.2)',
                  }}>
                    {step.phase}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    {step.label}
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
                    margin: 0,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: stats + note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {STATS.map((stat) => (
                <div key={stat.label} style={{
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  paddingBottom: 28,
                }}>
                  <div style={{
                    fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                    fontWeight: 300,
                    color: '#ffffff',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: 8,
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

            {/* Note */}
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.7,
              margin: 0,
              borderLeft: '2px solid rgba(255,255,255,0.12)',
              paddingLeft: 16,
            }}>
              Every change is shown to you before it goes live. You stay in control. The AI does the work.
            </p>

          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 768px) {
          .evolving-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
