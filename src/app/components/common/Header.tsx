import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onGetStarted: () => void;
}

export function Header({ isDark, onGetStarted }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 80) setHidden(y > lastY.current);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      animate={{ y: hidden ? '-120%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className={`pointer-events-auto transition-all duration-500 ease-in-out ${
        scrolled
          ? `mx-4 mt-3 rounded-2xl backdrop-blur-xl border shadow-2xl ${
              isDark
                ? 'bg-zinc-900/20 border-white/5 shadow-black/40'
                : 'bg-white/80 border-zinc-200 shadow-black/10'
            }`
          : 'mx-0 mt-0 rounded-none bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={isDark ? '/logo.png' : '/logo-black.png'}
                alt="TIA AI"
                className="h-12 w-auto object-contain"
              />
            </motion.div>
            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  className="px-3.5 py-2 text-base transition-colors text-zinc-400 hover:text-white"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-3"
          >
            <a
              href="#contact"
              className="text-base transition-colors px-3 py-2 text-zinc-400 hover:text-white"
            >
              Sign in
            </a>
            <button
              onClick={() => onGetStarted()}
              className={`px-4 py-2 text-base rounded-lg font-semibold transition-all hover:shadow-lg ${
                isDark
                  ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              Get Started
            </button>
          </motion.div>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 ${isDark ? 'text-white' : 'text-zinc-950'}`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t px-6 py-4 flex flex-col gap-2 overflow-hidden rounded-b-2xl ${
                isDark ? 'border-zinc-800 bg-zinc-900/95' : 'border-zinc-200 bg-white/95'
              }`}
            >
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`py-2 transition-colors ${
                    isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => { setOpen(false); onGetStarted(); }}
                className={`mt-2 py-3 text-sm rounded-lg text-center font-semibold ${
                  isDark ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
