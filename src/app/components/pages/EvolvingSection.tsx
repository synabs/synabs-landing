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
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', position: 'relative' }}>

        {/* Left image */}
        <div style={{ flex: '0 0 780px', marginLeft: '-180px' }}>
          <video
            ref={(el) => {
              if (!el) return;
              let forward = true;
              el.addEventListener('ended', () => {
                if (forward) {
                  el.playbackRate = -1;
                  forward = false;
                } else {
                  el.playbackRate = 1;
                  forward = true;
                }
                el.play();
              });
            }}
            src="/bg-rd.mp4"
            autoPlay
            muted
            playsInline
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Right content — overlaps image */}
        <div style={{ flex: 1, position: 'relative', zIndex: 2, marginLeft: '-120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 64, textAlign: 'right' }}>
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
            margin: '0 0 0 auto',
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
            background: 'linear-gradient(90deg, transparent 55%, rgba(255,255,255,0.07) 70%, rgba(255,255,255,0.07) 100%)',
          }} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            justifyContent: 'end',
            gap: '0 40px',
            textAlign: 'right',
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

      </div>
    </section>
  );
}
