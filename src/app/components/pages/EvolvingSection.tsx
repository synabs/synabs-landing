import React from 'react';

const CYCLE_STEPS = [
  {
    label: 'Collect',
    title: 'Every conversation is captured',
    desc: 'All chat sessions are securely stored and indexed, covering topics, response quality, user intent, and session outcomes, ready for analysis.',
  },
  {
    label: 'Analyse',
    title: 'AI reads 75 quality signals',
    desc: 'Each week, the AI analyses the full conversation dataset across 75 diagnostic criteria spanning lead behaviour, support patterns, and knowledge gaps.',
  },
  {
    label: 'Improve',
    title: 'Over 200 targeted improvements',
    desc: 'From the findings, more than 200 precision prompt updates are generated, each one sharpening a specific response pattern, tone, or knowledge gap.',
  },
  {
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
            Most AI tools stop learning once deployed. Ours continuously analyses real conversation data, identifies gaps, and improves itself automatically.
          </p>
        </div>

        {/* Steps with fading dividers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 64 }}>
          {CYCLE_STEPS.map((step, i) => (
            <div key={step.label} style={{ position: 'relative', padding: '24px 0' }}>
              {/* Fading bottom border */}
              {i < CYCLE_STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.07) 40%, transparent 100%)',
                }} />
              )}
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
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
                maxWidth: 680,
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats row — fading top border, tightly packed grid */}
        <div style={{ position: 'relative', paddingTop: 32 }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 1,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.07) 40%, transparent 100%)',
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
