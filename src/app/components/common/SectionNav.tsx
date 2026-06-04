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
  const ratioRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          ratioRef.current[id] = entry.intersectionRatio;
          // Activate whichever section is most visible
          const best = Object.entries(ratioRef.current).reduce((a, b) =>
            b[1] > a[1] ? b : a
          );
          if (best[1] > 0) setActive(best[0]);
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
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
