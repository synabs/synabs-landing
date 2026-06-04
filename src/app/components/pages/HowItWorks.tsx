import React from 'react';
import { motion } from 'motion/react';
import { Globe, Zap, Target, RefreshCw, Check } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Globe,
      title: 'We train TIA on your business',
      desc: 'Share your website URL, product pages, FAQs, and pricing. TIA learns your entire knowledge base in minutes — no manual input required.',
      detail: 'Supports any URL, PDF, or document',
    },
    {
      number: '02',
      icon: Zap,
      title: 'We install it on your site',
      desc: 'One line of code added to your website. Works with WordPress, Shopify, Wix, and any custom-built site. We handle the entire setup.',
      detail: 'Setup completed in under 48 hours',
    },
    {
      number: '03',
      icon: Target,
      title: 'TIA starts converting visitors',
      desc: 'From the moment it goes live, TIA greets visitors, answers questions, qualifies leads, and captures contact details — 24/7, in any language.',
      detail: 'Average 40% increase in lead capture',
    },
    {
      number: '04',
      icon: RefreshCw,
      title: 'TIA gets smarter every week',
      desc: 'The AI learns from every conversation. You review insights on your analytics dashboard and TIA continuously improves its responses.',
      detail: 'Weekly AI evolution cycle',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: '#09090b' }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light mb-3 text-white">
            From zero to live<br />in 48 hours
          </h2>
          <p className="text-lg font-light text-zinc-500 max-w-xl">
            No technical expertise needed. We do everything — you just get more leads.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-7 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 transition-colors overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
                  <step.icon className="size-5 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-zinc-500">{step.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
                <Check className="size-3.5 flex-shrink-0" style={{ color: '#00BC7D' }} />
                <span className="text-xs text-zinc-500">{step.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
