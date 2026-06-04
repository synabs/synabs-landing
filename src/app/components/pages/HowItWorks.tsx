import React, { useEffect, useRef, useState } from 'react';

const CMD_TEXT = 'AVERAGE LEAD CAPTURE INCREASED BY 40%\nAMONG EARLY TESTERS WITHIN THREE MONTHS.';

function CmdStat() {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < CMD_TEXT.length) {
        setDisplayed(CMD_TEXT.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#0c0c0c',
      border: '1.5px solid #444',
      maxWidth: 560,
      fontFamily: "'Courier New', monospace",
    }}>
      {/* Title bar */}
      <div style={{
        background: '#1a1a1a',
        borderBottom: '1px solid #333',
        padding: '5px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: 12, color: '#aaa', letterSpacing: '0.05em' }}>
          C:\STATS\RESULTS.CMD
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{ fontSize: 13, color: '#c0c0c0', marginBottom: 4, whiteSpace: 'pre' }}>
          <span style={{ color: '#00BC7D' }}>C:\&gt;</span> RUN STATS --REPORT LEAD_CAPTURE
        </div>
        <div style={{
          fontSize: 13,
          color: '#555',
          marginBottom: 8,
        }}>──────────────────────────────────────────</div>
        <div style={{
          fontSize: 13,
          color: '#e0e0e0',
          letterSpacing: '0.04em',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          textTransform: 'uppercase',
          minHeight: 44,
        }}>
          {displayed}
          {!done && (
            <span style={{
              display: 'inline-block',
              width: 9,
              height: 15,
              background: '#c0c0c0',
              verticalAlign: 'middle',
              marginLeft: 2,
              animation: 'blink 1.1s step-start infinite',
            }} />
          )}
          {done && (
            <span style={{
              display: 'inline-block',
              width: 9,
              height: 15,
              background: '#c0c0c0',
              verticalAlign: 'middle',
              marginLeft: 2,
              animation: 'blink 1.1s step-start infinite',
            }} />
          )}
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ background: '#000000', padding: '96px 24px' }}
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
            Not human, but <br />better where it counts
          </h2>
          <p style={{
            fontSize: 17,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 560,
            lineHeight: 1.65,
            marginBottom: 24,
          }}>
            Every website visitor is a potential customer, but most businesses miss opportunities because they can't respond fast enough. Our AI agent engages visitors instantly, answers their questions, and captures valuable lead information around the clock. Setup takes just one line of code. Let AI handle the rest.
          </p>

          <CmdStat />
        </div>

      </div>
    </section>
  );
}
