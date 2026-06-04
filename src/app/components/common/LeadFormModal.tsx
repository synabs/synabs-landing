import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

const SERVICES = [
  { id: 'M', label: 'S', desc: '149€/mo · 1,000 messages / month' },
  { id: 'L', label: 'M', desc: '299€/mo · 2,500 messages / month' },
  { id: 'XL', label: 'L', desc: '699€/mo · 10,000 messages / month' },
];

const SERVICE_PRICES = { M: 149, L: 299, XL: 699 };

interface LeadFormModalProps {
  isDark: boolean;
  onClose: () => void;
  initialService?: string;
}

export function LeadFormModal({ isDark, onClose, initialService = '' }: LeadFormModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    service: initialService,
    company: '',
    website: '',
    email: '',
    analytics: 'basic',
    botSetup: '' as 'tia' | 'custom' | '',
  });

  const basePrice = SERVICE_PRICES[form.service] || 0;
  const analyticsPrice = form.analytics === 'advanced' ? 50 : 0;
  const discountMultiplier = form.botSetup === 'tia' ? 0.80 : 1.0;
  const discountedBase = Math.round(basePrice * discountMultiplier);
  const total = discountedBase + analyticsPrice;

  const handleSubmit = () => {
    if (!form.service || !form.botSetup || !form.company || !form.website || !form.email) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl p-8 relative shadow-2xl overflow-y-auto max-h-[92vh] ${
            isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <X className="size-4" />
          </button>

          {!submitted ? (
            <>
              <h3 className={`text-2xl font-light mb-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Get Started
              </h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                No commitment · Cancel anytime
              </p>
              <div className="flex flex-col gap-4">

                {/* Service selector */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Which Plan Interests You? <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SERVICES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setForm(f => ({ ...f, service: s.id }))}
                        className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                          form.service === s.id
                            ? isDark
                              ? 'border-white bg-white/10 text-white'
                              : 'border-zinc-950 bg-zinc-950 text-white'
                            : isDark
                              ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                              : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                        }`}
                      >
                        <div className="text-xs font-semibold">{s.label}</div>
                        <div className={`text-[10px] mt-0.5 ${
                          form.service === s.id ? 'opacity-70' : isDark ? 'text-zinc-600' : 'text-zinc-400'
                        }`}>{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bot Setup */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Bot Setup <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'tia', title: 'TIA Theme', subtitle: 'White or Black', badge: '−20% forever', badgeColor: 'text-emerald-400' },
                      { id: 'custom', title: 'Custom Theme', subtitle: 'Fully personalized', badge: null, badgeColor: '' },
                    ].map(opt => {
                      const active = form.botSetup === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setForm(f => ({ ...f, botSetup: opt.id as any }))}
                          className={`flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                            active
                              ? isDark ? 'border-white bg-white/10' : 'border-zinc-950 bg-zinc-950'
                              : isDark ? 'border-zinc-700 hover:border-zinc-500' : 'border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
                            active ? 'bg-white border-white' : isDark ? 'border-zinc-600' : 'border-zinc-300'
                          }`}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-xs font-semibold ${active ? (isDark ? 'text-white' : 'text-white') : isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {opt.title}
                              {opt.subtitle && (
                                <span className={`ml-1.5 font-normal ${active ? 'opacity-70' : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                  {opt.subtitle}
                                </span>
                              )}
                            </p>
                            {opt.badge && (
                              <span className={`text-xs font-medium ${active ? opt.badgeColor : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                {opt.badge}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Analytics Dashboard */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Analytics Dashboard <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'basic', label: 'Basic', price: '0€/mo' },
                      { id: 'advanced', label: 'Advanced', price: '+50€/mo' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setForm(f => ({ ...f, analytics: opt.id }))}
                        className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                          form.analytics === opt.id
                            ? isDark ? 'border-white bg-white/10 text-white' : 'border-zinc-950 bg-zinc-950 text-white'
                            : isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                        }`}
                      >
                        <div className="text-xs font-semibold">{opt.label}</div>
                        <div className={`text-[10px] mt-0.5 ${
                          form.analytics === opt.id ? 'opacity-70' : isDark ? 'text-zinc-600' : 'text-zinc-400'
                        }`}>{opt.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className={`rounded-xl px-4 py-4 border ${isDark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                  {form.service && (
                    <div className={`flex justify-between text-xs mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      <span>{SERVICES.find(s => s.id === form.service)?.label}</span>
                      <span className="flex items-center gap-1.5">
                        {form.botSetup === 'tia' && (
                          <span className="line-through opacity-50">{basePrice}€/mo</span>
                        )}
                        {discountedBase}€/mo
                      </span>
                    </div>
                  )}
                  {form.botSetup === 'tia' && form.service && (
                    <div className="flex justify-between text-xs mb-2 text-emerald-500">
                      <span>TIA Theme discount (-20%)</span>
                      <span>-{basePrice - discountedBase}€/mo</span>
                    </div>
                  )}
                  {form.analytics === 'advanced' && (
                    <div className={`flex justify-between text-xs mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      <span>Advanced Analytics</span>
                      <span>+50€/mo</span>
                    </div>
                  )}
                  <div className={`flex justify-between text-sm font-semibold pt-2 mt-1 border-t ${isDark ? 'border-zinc-700 text-white' : 'border-zinc-200 text-zinc-950'}`}>
                    <span>Total</span>
                    <span>{total > 0 ? `${total}€/mo` : '—'}</span>
                  </div>
                </div>

                {/* Text fields */}
                {[
                  { key: 'company', label: 'Company Name', placeholder: 'TIA.AI Inc' },
                  { key: 'website', label: 'Website URL', placeholder: 'https://yourcompany.com' },
                  { key: 'email', label: 'Email Address', placeholder: 'you@yourcompany.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {label} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors ${
                        isDark
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-600 focus:border-zinc-500'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-950 placeholder-zinc-400 focus:border-zinc-400'
                      }`}
                    />
                  </div>
                ))}

                <p className={`text-xs text-center ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  We'll get back to you shortly
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={!form.service || !form.botSetup || !form.company || !form.website || !form.email}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  }`}
                >
                  Send Request
                </button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="size-6 text-emerald-400" />
              </div>
              <h3 className={`text-xl font-light mb-3 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                You're all set!
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Thanks! We'll review your website and contact you within 24 hours with a custom AI chatbot plan.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
