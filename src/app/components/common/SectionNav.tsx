import React, { useEffect, useRef, useState } from 'react';

const sections = [
  { id: 'hero',         label: 'hero' },
  { id: 'how-it-works', label: 'how_it_works' },
  { id: 'evolving',    label: 'evolving' },
  { id: 'features',    label: 'features' },
  { id: 'pricing',     label: 'pricing' },
  { id: 'faq',         label: 'faq' },
  { id: 'cta',         label: 'free_trial' },
];

export function SectionNav() {
  const [active, setActive] = useState('hero');
  const lockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !lockedRef.current) {
            setActive(id);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    // Set active immediately on click
    setActive(id);

    // Lock observer updates for ~1s while smooth scroll completes
    lockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
    }, 1000);

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      style={{
        position: 'fixed',
        left: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        userSelect: 'none',
      }}
    >
      {sections.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 0',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.22)',
              transition: 'color 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            <span style={{ width: 14, display: 'inline-block', color: isActive ? '#ffffff' : 'transparent' }}>
              {isActive ? '~$' : '>'}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
