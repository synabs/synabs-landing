import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does setup take?',
    a: 'Most customers are live within 48 hours. We handle everything — from training TIA on your content to installing the widget on your site.',
  },
  {
    q: 'Does TIA work with my website platform?',
    a: 'Yes. TIA integrates with WordPress, Shopify, Wix, and any custom-built website via a single line of JavaScript.',
  },
  {
    q: 'What languages does TIA support?',
    a: "TIA supports over 100 languages out of the box. It automatically detects and responds in the visitor's language.",
  },
  {
    q: 'Can I cancel anytime?',
    a: "Absolutely. No long-term contracts. Cancel from your dashboard at any time, and you'll retain access until the end of your billing period.",
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. We are GDPR-compliant, EU-hosted, and offer data deletion on request.',
  },
  {
    q: "What happens when TIA doesn't know the answer?",
    a: "TIA gracefully escalates to a human or collects the visitor's contact details so your team can follow up. No dead-ends.",
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-5xl md:text-6xl font-light text-white">
            Everything you<br />need to know
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="size-4 text-zinc-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-6 pb-5 text-sm font-light leading-relaxed text-zinc-500">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
