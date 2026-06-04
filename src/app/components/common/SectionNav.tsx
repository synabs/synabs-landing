import React, { useEffect, useState } from 'react';

const sections = [
  { id: 'hero',         label: 'hero' },
  { id: 'how-it-works', label: 'how_it_works' },
  { id: 'evolving',    label: 'evolving' },
  { id: 'features',    label: 'features' },
  { id: 'pricing',     label: 'pricing' },
  { id: 'faq',         label: 'faq' },
  { id: 'cta',         label: 'cta' },
];

export function SectionNav() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
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
        fontSize: 11,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
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
              gap: 6,
              color: isActive ? '#00BC7D' : 'rgba(255,255,255,0.25)',
              transition: 'color 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            <span style={{ width: 10, display: 'inline-block', color: isActive ? '#00BC7D' : 'transparent' }}>
              {isActive ? '~$' : '>'}
            </span>
            <span>{label}</span>
          </button>
        );
      })}

    </nav>
  );
}
