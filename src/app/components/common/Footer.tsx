import React from 'react';

interface FooterProps {
  activeTheme: string;
}

export function Footer({ activeTheme }: FooterProps) {
  const isDark = activeTheme === 'dark';

  return (
    <footer
      id="contact"
      className={`py-12 px-6 border-t transition-colors duration-700 ${
        isDark
          ? 'bg-zinc-950 text-zinc-400 border-zinc-800'
          : 'bg-white text-zinc-500 border-zinc-200'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src={isDark ? '/logo.png' : '/logo-black.png'}
                alt="TIA AI"
                className="size-6 object-contain"
              />
              <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                TIA AI
              </span>
            </div>
            <p className="text-sm font-light leading-relaxed">
              Your website's smartest employee.
            </p>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Case studies'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Terms', 'Privacy', 'Refund policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                {col.title}
              </h4>
              <ul className="space-y-1.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className={`text-sm transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-950'}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <p className="text-xs">© 2025 TIA AI. All rights reserved.</p>
          <p className={`text-xs ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Powered by Anthropic's Claude API.
          </p>
        </div>
      </div>
    </footer>
  );
}
