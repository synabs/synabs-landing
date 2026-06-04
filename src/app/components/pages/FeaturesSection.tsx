import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MessageSquare, Brain, Clock, TrendingUp, Zap, Users, Check, X } from 'lucide-react';

/* ─── CHAT THEMES ─────────────────────────────────────────────── */
export const CHAT_THEMES = {
  dark: {
    name: 'Obsidian Black',
    bg: '#000000',
    headerBg: 'rgba(13,13,15,0.97)',
    msgBg: '#232325',
    userMsgBg: '#2c2c30',
    border: 'rgba(255,255,255,0.09)',
    inputBg: '#1e1e22',
    chipColor: 'rgba(255,255,255,0.45)',
    textColor: 'rgba(232,232,232,0.95)',
    userTextColor: 'rgba(232,232,232,0.95)',
    subtleText: 'rgba(255,255,255,0.22)',
    accentDot: '#34d399',
    sendArrow: 'rgba(255,255,255,0.6)',
    glow: '0 32px 80px rgba(0,0,0,0.7)',
    avatarSrc: '/lg-aw.avif',
    scrollTrack: 'rgba(255,255,255,0.04)',
    scrollThumb: 'rgba(255,255,255,0.12)',
    scrollThumbHover: 'rgba(255,255,255,0.22)',
    chipBg: 'rgba(20,20,24,0.85)',
    msgAreaBg: 'transparent',
  },
  light: {
    name: 'Pearl White',
    bg: '#f4f4f5',
    headerBg: '#ffffff',
    msgBg: '#e4e4e7',
    userMsgBg: '#e4e4e7',
    border: 'rgba(0,0,0,0.08)',
    inputBg: '#ffffff',
    chipColor: 'rgba(0,0,0,0.45)',
    textColor: '#18181b',
    userTextColor: '#18181b',
    subtleText: 'rgba(0,0,0,0.3)',
    accentDot: '#34d399',
    sendArrow: 'rgba(0,0,0,0.5)',
    glow: '0 32px 80px rgba(0,0,0,0.35)',
    avatarSrc: '/lg-aw.avif',
    scrollTrack: 'rgba(0,0,0,0.04)',
    scrollThumb: 'rgba(0,0,0,0.12)',
    scrollThumbHover: 'rgba(0,0,0,0.22)',
    chipBg: 'rgba(255,255,255,0.7)',
    msgAreaBg: '#ececee',
  },
};

/* ─── TYPED TEXT ─────────────────────────────────────────────── */
function TypedText({ text, color, onDone = undefined, onChar = undefined }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  useEffect(() => {
    iRef.current = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      iRef.current += 1;
      setDisplayed(text.slice(0, iRef.current));
      onChar?.();
      if (iRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{ color }}>
      {displayed}
      {!done && <span style={{ opacity: 0.5, color }}>▍</span>}
    </span>
  );
}

/* ─── CONVERSATION DATA ──────────────────────────────────────── */
const CONVERSATION = [
  { from: 'bot',  text: "Hello! I'm your AI Agent. How can I assist you today?", delay: 800 },
  { from: 'user', text: 'How much does installation cost?', delay: 4000, inputTyping: 'How much does installation cost?' },
  { from: 'bot',  text: 'Plans start at 149/mo and go up to 699/mo depending on chat volume. How many customer chats do you estimate per day?', delay: 5800 },
  { from: 'user', text: 'Maybe around 10 max', delay: 9000, inputTyping: 'Maybe around 10 max' },
  { from: 'bot',  text: 'That fits our Pro plan perfectly, up to 10 chats/day with full lead capture and analytics.', delay: 11300 },
  { from: 'bot',  text: 'Would you like to send a contact request yourself, or should I collect your details right here?', delay: 15200 },
];

const AUTO_DETAILS_FLOW = [
  { from: 'user', text: 'Send my details', delay: 0 },
  { from: 'bot',  text: "I'll pass your details to our team. What is your email address?", delay: 1100 },
  { from: 'user', text: 'hello@mycompany.com', delay: 3200, inputTyping: 'hello@mycompany.com' },
  { from: 'bot',  text: 'Got it. And your company name and website URL?', delay: 4600 },
  { from: 'user', text: 'MyCompany, mycompany.com', delay: 7000, inputTyping: 'MyCompany, mycompany.com' },
  { from: 'bot',  text: 'All set. Our team will review your site and reach out within 24 hours with a tailored plan.', delay: 8400 },
  { from: 'bot',  text: 'Have a great rest of your day. Is there anything else I can help you with?', delay: 11000 },
  { from: 'user', text: 'No, thank you!', delay: 13500, inputTyping: 'No, thank you!' },
  { from: 'bot',  text: "You're welcome. Take care!", delay: 15000 },
];

/* ─── ANIMATED CHAT LOOP ──────────────────────────────────────── */
export function AnimatedChatLoop({ theme, onGetStarted }) {
  const [phase, setPhase] = useState<'bubble' | 'chat'>('bubble');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typingIdx, setTypingIdx] = useState(-1);
  const [showCTA, setShowCTA] = useState(false);
  const [inputTypingText, setInputTypingText] = useState('');
  const [detailsMode, setDetailsMode] = useState<null | 'email' | 'company' | 'thanks' | 'done' | 'auto'>(null);
  const [extraMessages, setExtraMessages] = useState<{ from: string; text: string }[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const userEngagedRef = useRef(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const inputIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLight = theme.name === 'Pearl White';

  const CHAT_PANEL_HEIGHT = 420;

  const scrollToBottom = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      rafRef.current = null;
    });
  }, []);

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };
  const clearAll = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const runLoop = useCallback(() => {
    clearAll();
    if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
    setPhase('bubble');
    setVisibleMessages(0);
    setTypingIdx(-1);
    setShowCTA(false);
    setInputTypingText('');
    setDetailsMode(null);
    setExtraMessages([]);

    addTimer(() => setPhase('chat'), 1400);

    CONVERSATION.forEach((msg, i) => {
      const t = 1400 + msg.delay;
      if (msg.from === 'bot') {
        addTimer(() => setTypingIdx(i), t - 900);
        addTimer(() => { setTypingIdx(-1); setVisibleMessages(v => v + 1); }, t);
      } else {
        if ((msg as any).inputTyping) {
          const typingText = (msg as any).inputTyping;
          const typingStart = t - 1200;
          addTimer(() => {
            setInputTypingText('');
            let charIdx = 0;
            if (inputIntervalRef.current) clearInterval(inputIntervalRef.current);
            inputIntervalRef.current = setInterval(() => {
              charIdx++;
              setInputTypingText(typingText.slice(0, charIdx));
              if (charIdx >= typingText.length) { clearInterval(inputIntervalRef.current!); inputIntervalRef.current = null; }
            }, 38);
          }, typingStart > 1400 ? typingStart : 1400 + 200);
        }
        addTimer(() => {
          if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
          setInputTypingText('');
          setVisibleMessages(v => v + 1);
        }, t);
      }
    });

    const lastMsgDelay = 1400 + CONVERSATION[CONVERSATION.length - 1].delay;
    addTimer(() => { if (!userEngagedRef.current) setShowCTA(true); }, lastMsgDelay + 1800);

    const autoStart = lastMsgDelay + 1800;
    AUTO_DETAILS_FLOW.forEach((msg, i) => {
      const t = autoStart + msg.delay + 3500;
      if (msg.from === 'bot') {
        addTimer(() => { if (userEngagedRef.current) return; setTypingIdx(1000 + i); }, t - 900);
        addTimer(() => { if (userEngagedRef.current) return; setTypingIdx(-1); setExtraMessages(m => [...m, { from: 'bot', text: msg.text }]); }, t);
      } else {
        if ((msg as any).inputTyping) {
          const typingText = (msg as any).inputTyping;
          const typingStart = t - 1200;
          addTimer(() => {
            if (userEngagedRef.current) return;
            setInputTypingText('');
            let charIdx = 0;
            if (inputIntervalRef.current) clearInterval(inputIntervalRef.current);
            inputIntervalRef.current = setInterval(() => {
              charIdx++;
              setInputTypingText(typingText.slice(0, charIdx));
              if (charIdx >= typingText.length) { clearInterval(inputIntervalRef.current!); inputIntervalRef.current = null; }
            }, 38);
          }, typingStart > autoStart ? typingStart : autoStart + 200);
        }
        addTimer(() => {
          if (userEngagedRef.current) return;
          if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
          setInputTypingText('');
          if (i === 0) setDetailsMode('auto');
          setExtraMessages(m => [...m, { from: 'user', text: msg.text }]);
        }, t);
      }
    });

    const autoLastDelay = autoStart + AUTO_DETAILS_FLOW[AUTO_DETAILS_FLOW.length - 1].delay + 3500;
    const loopEnd = autoLastDelay + 4000;

    addTimer(() => { if (!userEngagedRef.current) setPhase('bubble'); }, loopEnd);
    addTimer(() => {
      if (userEngagedRef.current) return;
      setVisibleMessages(0); setTypingIdx(-1); setShowCTA(false);
      setInputTypingText(''); setDetailsMode(null); setExtraMessages([]);
      runLoop();
    }, loopEnd + 650);
  }, []);

  useEffect(() => { runLoop(); return clearAll; }, []);
  useEffect(() => { if (showCTA) scrollToBottom(); }, [showCTA]);
  useEffect(() => { if (extraMessages.length > 0) scrollToBottom(); }, [extraMessages]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [visibleMessages, typingIdx]);

  return (
    <div style={{ width: 320, position: 'relative', height: CHAT_PANEL_HEIGHT }}>
      {/* Bubble */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 10 }}>
        <AnimatePresence>
          {phase === 'bubble' && (
            <motion.div key="bubble"
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
              <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', width: 52, height: 52 }}
                className="rounded-full flex items-center justify-center relative cursor-pointer">
                <MessageSquare style={{ color: isLight ? '#18181b' : 'rgba(232,232,232,0.9)' }} className="size-6" strokeWidth={1.5} />
                <span style={{ background: theme.accentDot }} className="absolute w-3 h-3 rounded-full top-0 right-0 border-2 border-white animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat widget */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20 }}>
        <AnimatePresence>
          {phase === 'chat' && (
            <motion.div key="chat"
              initial={{ opacity: 0, scale: 0.9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }} style={{ transformOrigin: 'bottom right' }}>
              <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.45)', width: 320, height: CHAT_PANEL_HEIGHT, display: 'flex', flexDirection: 'column' }}
                className="rounded-[20px] overflow-hidden">

                {/* Header */}
                <div style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}
                  className="flex items-center justify-between px-4 py-3 flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div style={{ border: `1px solid ${theme.border}`, background: theme.msgBg }}
                      className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <img src={theme.avatarSrc} alt="TIA" className="w-full h-full object-contain p-0.5" style={{ filter: isLight ? 'invert(1)' : 'none' }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: theme.textColor }} className="text-sm font-semibold">AI Agent</span>
                      <span style={{ background: theme.accentDot }} className="w-1.5 h-1.5 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-center opacity-30">
                    <div style={{ background: theme.textColor }} className="w-3 h-0.5 rounded-full" />
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><line x1="1" y1="1" x2="9" y2="9" stroke={theme.textColor} strokeWidth="1.6" strokeLinecap="round"/><line x1="9" y1="1" x2="1" y2="9" stroke={theme.textColor} strokeWidth="1.6" strokeLinecap="round"/></svg>
                  </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef}
                  className="flex flex-col gap-2.5 px-3 pt-3 pb-0 overflow-y-auto flex-1"
                  style={{ background: isLight ? '#ececee' : 'transparent', scrollbarWidth: 'thin', scrollbarColor: `${theme.scrollThumb} ${theme.scrollTrack}` }}>
                  <AnimatePresence initial={false}>
                    {CONVERSATION.slice(0, visibleMessages).map((msg, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className={`flex gap-1.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                        {msg.from === 'bot' && (
                          <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                            className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                            <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" style={{ filter: isLight ? 'invert(1)' : 'none' }} />
                          </div>
                        )}
                        <div style={{
                          background: theme.msgBg, border: `1px solid ${theme.border}`,
                          borderRadius: msg.from === 'bot' ? '2px 10px 10px 10px' : '10px 10px 2px 10px', maxWidth: '82%',
                        }} className="px-2.5 py-1.5 text-[10px] leading-relaxed">
                          {msg.from === 'bot' && i === visibleMessages - 1 ? (
                            <TypedText text={msg.text} color={theme.textColor} onChar={scrollToBottom} />
                          ) : (
                            <span style={{ color: msg.from === 'user' ? theme.userTextColor : theme.textColor }}>{msg.text}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator — main conversation */}
                    {typingIdx >= 0 && typingIdx < 1000 && (
                      <motion.div key={typingIdx}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                        className="flex gap-1.5">
                        <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                          className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                          <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" style={{ filter: isLight ? 'invert(1)' : 'none' }} />
                        </div>
                        <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, borderRadius: '2px 10px 10px 10px' }}
                          className="flex items-center gap-1 px-2.5 py-2">
                          {[0, 1, 2].map(d => (
                            <motion.div key={d} style={{ background: theme.subtleText }} className="w-1 h-1 rounded-full"
                              animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 1, delay: d * 0.18, repeat: Infinity }} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Extra messages from auto/details flow */}
                  {extraMessages.map((msg, i) => (
                    <motion.div key={'extra-' + i}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}
                      className={`flex gap-1.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.from === 'bot' && (
                        <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                          className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                          <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" style={{ filter: isLight ? 'invert(1)' : 'none' }} />
                        </div>
                      )}
                      <div style={{
                        background: theme.msgBg, border: `1px solid ${theme.border}`,
                        borderRadius: msg.from === 'bot' ? '2px 10px 10px 10px' : '10px 10px 2px 10px', maxWidth: '82%',
                      }} className="px-2.5 py-1.5 text-[10px] leading-relaxed">
                        <span style={{ color: msg.from === 'user' ? theme.userTextColor : theme.textColor }}>{msg.text}</span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator — auto-flow */}
                  {typingIdx >= 1000 && (
                    <motion.div key="auto-typing"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                      className="flex gap-1.5">
                      <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                        className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 mt-0.5">
                        <img src={theme.avatarSrc} alt="" className="w-full h-full object-contain p-0.5" style={{ filter: isLight ? 'invert(1)' : 'none' }} />
                      </div>
                      <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, borderRadius: '2px 10px 10px 10px' }}
                        className="flex items-center gap-1 px-2.5 py-2">
                        {[0, 1, 2].map(d => (
                          <motion.div key={d} style={{ background: theme.subtleText }} className="w-1 h-1 rounded-full"
                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, delay: d * 0.18, repeat: Infinity }} />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div style={{ height: showCTA ? 0 : 32, flexShrink: 0, overflow: 'hidden' }} />
                </div>

                {/* CTA */}
                <AnimatePresence>
                  {showCTA && detailsMode !== 'auto' && (
                    <motion.div ref={ctaRef} key="cta"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                      style={{ background: isLight ? '#ececee' : 'transparent' }}
                      className="px-3 pt-2.5 pb-2.5 flex-shrink-0">
                      <div className="flex flex-col gap-1.5">
                        {detailsMode === null && (
                          <>
                            <p style={{ color: theme.subtleText }} className="text-[9px] text-center">How would you like to proceed?</p>
                            <div className="flex gap-2">
                              <div onClick={onGetStarted}
                                className="flex-1 py-1.5 bg-emerald-500 text-white text-[9px] font-semibold rounded-lg text-center cursor-pointer hover:bg-emerald-400 transition-colors">
                                Get Started
                              </div>
                              <div onClick={() => {
                                userEngagedRef.current = true;
                                clearAll();
                                if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
                                setInputTypingText('');
                                setDetailsMode('email');
                                setExtraMessages(m => [...m, { from: 'user', text: 'Send my details' }]);
                                setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "I'll pass your details to our team. What is your email address?" }]), 900);
                              }} style={{ background: theme.msgBg, border: `1px solid ${theme.border}`, color: theme.textColor }}
                                className="flex-1 py-1.5 text-[9px] font-semibold rounded-lg text-center cursor-pointer hover:opacity-80 transition-opacity">
                                Send my details
                              </div>
                            </div>
                          </>
                        )}
                        {detailsMode === 'email' && (
                          <div className="flex gap-1.5">
                            <input autoFocus type="email" placeholder="your@email.com"
                              style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.textColor, fontSize: 10 }}
                              className="flex-1 rounded-lg px-2 py-1.5 outline-none"
                              onKeyDown={e => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                  const val = (e.target as HTMLInputElement).value;
                                  (e.target as HTMLInputElement).value = '';
                                  setExtraMessages(m => [...m, { from: 'user', text: val }]);
                                  setDetailsMode('company');
                                  setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: 'Got it. And your company name and website URL?' }]), 800);
                                }
                              }} />
                            <div style={{ background: '#00BC7D' }} className="px-2.5 py-1.5 rounded-lg text-[9px] text-white font-semibold cursor-pointer flex items-center">Send</div>
                          </div>
                        )}
                        {detailsMode === 'company' && (
                          <div className="flex gap-1.5">
                            <input autoFocus type="text" placeholder="Company name and website"
                              style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.textColor, fontSize: 10 }}
                              className="flex-1 rounded-lg px-2 py-1.5 outline-none"
                              onKeyDown={e => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                  const val = (e.target as HTMLInputElement).value;
                                  (e.target as HTMLInputElement).value = '';
                                  setExtraMessages(m => [...m, { from: 'user', text: val }]);
                                  setDetailsMode('thanks');
                                  setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: 'Our team will review your site and reach out within 24 hours with a tailored plan.' }]), 800);
                                  setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: 'Have a great rest of your day. Is there anything else I can help you with?' }]), 2200);
                                }
                              }} />
                            <div style={{ background: '#00BC7D' }} className="px-2.5 py-1.5 rounded-lg text-[9px] text-white font-semibold cursor-pointer flex items-center">Send</div>
                          </div>
                        )}
                        {detailsMode === 'thanks' && (
                          <div className="flex gap-1.5">
                            <input autoFocus type="text" placeholder="Anything else?"
                              style={{ background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.textColor, fontSize: 10 }}
                              className="flex-1 rounded-lg px-2 py-1.5 outline-none"
                              onKeyDown={e => {
                                const val = (e.target as HTMLInputElement).value.trim();
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).value = '';
                                  if (val) {
                                    setExtraMessages(m => [...m, { from: 'user', text: val }]);
                                    setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: 'Our team will take note. Wishing you a great day ahead!' }]), 700);
                                  } else {
                                    setExtraMessages(m => [...m, { from: 'user', text: 'No, thank you!' }]);
                                    setTimeout(() => setExtraMessages(m => [...m, { from: 'bot', text: "You're welcome. Take care!" }]), 700);
                                  }
                                  setDetailsMode('done');
                                }
                              }} />
                            <div style={{ background: '#00BC7D' }} className="px-2.5 py-1.5 rounded-lg text-[9px] text-white font-semibold cursor-pointer flex items-center">Send</div>
                          </div>
                        )}
                        {detailsMode === 'done' && (
                          <p style={{ color: theme.accentDot }} className="text-[9px] text-center font-medium py-1">All set. We'll be in touch within 24h!</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Chips */}
                <div style={{ background: isLight ? '#ececee' : 'transparent' }} className="flex gap-1.5 flex-wrap px-3 pb-2 flex-shrink-0">
                  {['AI deployment', 'Pricing', 'Free trial'].map(chip => (
                    <span key={chip}
                      style={{ color: theme.chipColor, border: `1px solid ${theme.border}`, background: theme.chipBg }}
                      className="text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">{chip}</span>
                  ))}
                </div>

                {/* Input */}
                <div style={{ background: theme.headerBg, borderTop: `1px solid ${theme.border}` }} className="px-3 py-2.5 flex-shrink-0">
                  <div style={{ background: theme.inputBg, border: `1px solid ${theme.border}` }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2">
                    <span style={{ color: inputTypingText ? theme.textColor : theme.subtleText }} className="text-[11px] flex-1 truncate">
                      {inputTypingText || 'Send a message...'}
                      {inputTypingText && <span style={{ opacity: 0.5, color: theme.textColor }}>|</span>}
                    </span>
                    <div style={{ background: theme.msgBg, border: `1px solid ${theme.border}` }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 10 16" fill="none">
                        <polyline points="2,1 9,8 2,15" stroke={theme.sendArrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ background: theme.headerBg }} className="flex items-center gap-1 py-2 justify-center flex-shrink-0">
                  <a href="https://synabs.fi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 no-underline hover:opacity-70 transition-opacity">
                    <span style={{ color: theme.subtleText, fontSize: '9px', letterSpacing: '0.04em' }}>Powered by</span>
                    <img src="/synabs-white.avif" alt="Synabs" className="h-2.5 opacity-50"
                      style={{ filter: isLight ? 'invert(1)' : 'none' }} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── CUSTOMIZED CHAT CONVERSATION ──────────────────────────── */
const CUSTOM_CONVERSATION = [
  { from: 'bot',  text: "Hello! I'm your AI Agent. This is a fully customized version: every element, from colors to content, is tailored to your brand.", delay: 800 },
  { from: 'user', text: 'Interesting, which parts can be customized?', delay: 5000, inputTyping: 'Interesting, which parts can be customized?' },
  { from: 'bot',  text: "Everything you see here: header colors, avatar, message bubbles, fonts, and the conversation flow itself. As you can tell from this chat.", delay: 7200 },
  { from: 'user', text: 'What does it cost?', delay: 11500, inputTyping: 'What does it cost?' },
  { from: 'bot',  text: 'Full customization is included in all plans. If you prefer our standard look (with a link to our site in the footer), you get a 20% discount — unlimited.', delay: 13500 },
  { from: 'user', text: "I'm interested in full customization. Where can I read more?", delay: 18500, inputTyping: "I'm interested in full customization. Where can I read more?" },
  { from: 'bot',  text: 'Great choice! You can explore all our plans and services here:', delay: 21000 },
  { from: 'bot',  text: '__PRICING_BUTTON__', delay: 23200 },
  { from: 'user', text: 'Ok, I\'ll check it out later.', delay: 26000, inputTyping: "Ok, I'll check it out later." },
  { from: 'bot',  text: 'Sounds good! In the meantime, you can try your own AI Agent free for 14 days. Want to get started?', delay: 28000 },
  { from: 'user', text: 'That could be interesting!', delay: 32500, inputTyping: 'That could be interesting!' },
  { from: 'bot',  text: "Excellent! Just fill out a short form and we'll be in touch as soon as possible.", delay: 34500 },
  { from: 'bot',  text: '__TRIAL_BUTTON__', delay: 37000 },
  { from: 'user', text: "Ok, I'll leave my details. Thanks!", delay: 40000, inputTyping: "Ok, I'll leave my details. Thanks!" },
  { from: 'bot',  text: "You're very welcome! Have a great rest of your day.", delay: 42000 },
];

function CustomizedChatLoop({ onGetStarted }) {
  const CHAT_PANEL_HEIGHT = 420;
  const [phase, setPhase] = useState<'bubble' | 'chat'>('bubble');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [typingIdx, setTypingIdx] = useState(-1);
  const [inputTypingText, setInputTypingText] = useState('');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const inputIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      rafRef.current = null;
    });
  }, []);

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };
  const clearAll = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const runLoop = useCallback(() => {
    clearAll();
    if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
    setPhase('bubble');
    setVisibleMessages(0);
    setTypingIdx(-1);
    setInputTypingText('');

    addTimer(() => setPhase('chat'), 1400);

    CUSTOM_CONVERSATION.forEach((msg, i) => {
      const t = 1400 + msg.delay;
      if (msg.from === 'bot') {
        addTimer(() => setTypingIdx(i), t - 900);
        addTimer(() => { setTypingIdx(-1); setVisibleMessages(v => v + 1); }, t);
      } else {
        if ((msg as any).inputTyping) {
          const typingText = (msg as any).inputTyping;
          const typingStart = t - 1200;
          addTimer(() => {
            setInputTypingText('');
            let charIdx = 0;
            if (inputIntervalRef.current) clearInterval(inputIntervalRef.current);
            inputIntervalRef.current = setInterval(() => {
              charIdx++;
              setInputTypingText(typingText.slice(0, charIdx));
              if (charIdx >= typingText.length) { clearInterval(inputIntervalRef.current!); inputIntervalRef.current = null; }
            }, 38);
          }, typingStart > 1400 ? typingStart : 1600);
        }
        addTimer(() => {
          if (inputIntervalRef.current) { clearInterval(inputIntervalRef.current); inputIntervalRef.current = null; }
          setInputTypingText('');
          setVisibleMessages(v => v + 1);
        }, t);
      }
    });

    const lastDelay = 1400 + CUSTOM_CONVERSATION[CUSTOM_CONVERSATION.length - 1].delay;
    addTimer(() => setPhase('bubble'), lastDelay + 4000);
    addTimer(() => {
      setVisibleMessages(0); setTypingIdx(-1); setInputTypingText('');
      runLoop();
    }, lastDelay + 4650);
  }, []);

  useEffect(() => { runLoop(); return clearAll; }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [visibleMessages, typingIdx]);

  const customChips = ['About', 'Custom options', 'Pricing'];

  return (
    <div style={{ width: 320, position: 'relative', height: CHAT_PANEL_HEIGHT }}>
      {/* Bubble */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 10 }}>
        <AnimatePresence>
          {phase === 'bubble' && (
            <motion.div key="bubble"
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}>
              <div style={{ background: '#1a1a1a', boxShadow: '0 4px 24px rgba(0,0,0,0.25)', width: 52, height: 52 }}
                className="rounded-full flex items-center justify-center relative cursor-pointer">
                <MessageSquare style={{ color: '#fff' }} className="size-6" strokeWidth={1.5} />
                <span style={{ background: '#34d399' }} className="absolute w-3 h-3 rounded-full top-0 right-0 border-2 border-white animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat widget */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20 }}>
        <AnimatePresence>
          {phase === 'chat' && (
            <motion.div key="chat"
              initial={{ opacity: 0, scale: 0.9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }} style={{ transformOrigin: 'bottom right' }}>
              <div style={{ background: '#f0efeb', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.3)', width: 320, height: CHAT_PANEL_HEIGHT, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Header — musta kuten ver2 */}
                <div style={{ background: '#1a1a1a', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 0 16px', flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: 'system-ui,sans-serif' }}>AI Agent</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', cursor: 'pointer' }}>
                      <svg width="3" height="14" viewBox="0 0 4 16" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="2" cy="8" r="1.5"/><circle cx="2" cy="14" r="1.5"/></svg>
                    </div>
                    <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', cursor: 'pointer' }}>
                      <svg width="18" height="3" viewBox="0 0 12 2" fill="none"><line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    </div>
                    <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', cursor: 'pointer' }}>
                      <svg width="16" height="16" viewBox="0 0 10 10" fill="none"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                </div>

                {/* Messages area — valkoinen */}
                <div style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                  <div ref={scrollRef} style={{ overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1, scrollbarWidth: 'none' }}>
                    <AnimatePresence initial={false}>
                      {CUSTOM_CONVERSATION.slice(0, visibleMessages).map((msg, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ display: 'flex', gap: 8, flexDirection: msg.from === 'user' ? 'row-reverse' : 'row' }}>
                          {msg.from === 'bot' && (
                            <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, marginTop: 2, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              <img src="/lg-aw.avif" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                            </div>
                          )}
                          {msg.text === '__PRICING_BUTTON__' ? (
                            <a href="#pricing" style={{ background: '#0f0f0f', color: '#fff', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500, fontFamily: 'system-ui,sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                              View Pricing →
                            </a>
                          ) : msg.text === '__TRIAL_BUTTON__' ? (
                            <div onClick={onGetStarted} style={{ background: '#0f0f0f', color: '#fff', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500, fontFamily: 'system-ui,sans-serif', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                              Start Free Trial →
                            </div>
                          ) : (
                            <div style={{ maxWidth: 175, padding: '10px 14px', fontSize: 13, lineHeight: 1.55, fontFamily: 'system-ui,sans-serif', fontWeight: 300, color: '#e8e8e8', background: msg.from === 'bot' ? '#2a2a2a' : '#2f2f2f', borderRadius: msg.from === 'bot' ? '2px 8px 8px 8px' : '8px 8px 2px 8px' }}>
                              {msg.from === 'bot' && i === visibleMessages - 1
                                ? <TypedText text={msg.text} color="#e8e8e8" onChar={scrollToBottom} />
                                : msg.text}
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      {typingIdx >= 0 && (
                        <motion.div key="typing"
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                          style={{ display: 'flex', gap: 8 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, overflow: 'hidden' }}>
                            <img src="/lg-aw.avif" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px', background: '#2a2a2a', borderRadius: '14px 14px 14px 8px' }}>
                            {[0, 1, 2].map(d => (
                              <motion.span key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: '#555', display: 'block' }}
                                animate={{ y: [0, -5, 0] }} transition={{ duration: 1.2, delay: d * 0.2, repeat: Infinity }} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Chips */}
                  <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                    {customChips.map(chip => (
                      <span key={chip} style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid #d0d0d0', background: '#f5f5f5', fontSize: 12, color: '#333', fontFamily: 'system-ui,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div style={{ position: 'relative', background: '#f0efeb', padding: '6px 8px' }}>
                  <div style={{ background: '#ffffff', border: '1.5px solid #d0d0d0', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '6px 10px', gap: 8 }}>
                    <span style={{ flex: 1, fontSize: 13, color: inputTypingText ? '#222' : '#aaa', fontFamily: 'system-ui,sans-serif', overflow: 'hidden', whiteSpace: 'nowrap' as const }}>
                      {inputTypingText || 'Send a message'}
                      {inputTypingText && <span style={{ opacity: 0.5 }}>|</span>}
                    </span>
                    <div style={{ color: '#aaa', display: 'flex', alignItems: 'center' }}>
                      <svg width="11" height="11" viewBox="0 0 10 16" fill="none"><polyline points="2,1 9,8 2,15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



const SLIDES = [
  { src: '/db-1.avif', label: 'Page 1' },
  { src: '/db-2.avif', label: 'Page 2' },
  { src: '/db-3.avif', label: 'Page 3' },
  { src: '/db-4.avif', label: 'Page 4' },
];

function LightboxModal({ slide, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}>
        <button onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
          <X className="size-5" />
        </button>
        <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-white/10 text-white/70 border border-white/15">
          {slide.label} · {SLIDES.indexOf(slide) + 1} / {SLIDES.length}
        </div>
        <button onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><polyline points="8,1 3,6 8,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><polyline points="4,1 9,6 4,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <motion.div key={slide.src}
          initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '85vw', maxHeight: '85vh', boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <img src={slide.src} alt={slide.label} style={{ maxWidth: '85vw', maxHeight: '85vh', display: 'block', borderRadius: 16 }} draggable={false} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const PaperStack = React.forwardRef<{ closeLightbox: () => void }, { isDark: boolean; onLightboxChange?: (open: boolean, slide: typeof SLIDES[0] | null, onClose: () => void, onPrev: () => void, onNext: () => void) => void }>(
  function PaperStack({ isDark, onLightboxChange }, ref) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const closeLightbox = useCallback(() => {
      setLightboxOpen(false);
      onLightboxChange?.(false, null, () => {}, () => {}, () => {});
    }, [onLightboxChange]);

    const prevLightbox = useCallback(() => {
      setDirection(-1);
      setActiveIdx(i => {
        const next = (i - 1 + SLIDES.length) % SLIDES.length;
        return next;
      });
    }, []);

    const nextLightbox = useCallback(() => {
      setDirection(1);
      setActiveIdx(i => {
        const next = (i + 1) % SLIDES.length;
        return next;
      });
    }, []);

    React.useImperativeHandle(ref, () => ({ closeLightbox }));

    useEffect(() => {
      if (lightboxOpen) {
        onLightboxChange?.(true, SLIDES[activeIdx], closeLightbox, prevLightbox, nextLightbox);
      }
    }, [lightboxOpen, activeIdx]);

    useEffect(() => {
      if (lightboxOpen) return;
      const t = setInterval(() => { setDirection(1); setActiveIdx(i => (i + 1) % SLIDES.length); }, 3200);
      return () => clearInterval(t);
    }, [lightboxOpen]);

    const goTo = (idx: number) => { if (idx === activeIdx || isAnimating) return; setDirection(idx > activeIdx ? 1 : -1); setActiveIdx(idx); };
    const prev = () => { setDirection(-1); setActiveIdx(i => (i - 1 + SLIDES.length) % SLIDES.length); };
    const next = () => { setDirection(1); setActiveIdx(i => (i + 1) % SLIDES.length); };

    const getStackStyle = (offset: number): React.CSSProperties => ({
      position: 'absolute', inset: 0,
      transform: `translateY(${offset * 8}px) translateX(${offset * 5}px) scale(${1 - offset * 0.03})`,
      zIndex: 10 - offset,
    });

    return (
      <div className="flex flex-col items-center gap-5 select-none">
        <div style={{ position: 'relative', width: 300, height: 400 }}>
          {[3, 2, 1].map(offset => {
            const stackIdx = (activeIdx + offset) % SLIDES.length;
            return (
              <div key={stackIdx} style={getStackStyle(offset)}>
                <div className="w-full h-full rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: isDark ? `0 ${8 + offset * 4}px ${24 + offset * 8}px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)` : `0 ${8 + offset * 4}px ${24 + offset * 8}px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8)`,
                    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
                    background: isDark ? '#27272a' : '#f4f4f5',
                    filter: `brightness(${1 - offset * 0.12})`,
                  }}>
                  <img src={SLIDES[stackIdx].src} alt={SLIDES[stackIdx].label} className="w-full h-full object-cover" style={{ opacity: 1 - offset * 0.15 }} />
                </div>
              </div>
            );
          })}

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={activeIdx}
              initial={{ opacity: 0, x: direction * 40, scale: 0.97, rotateY: direction * 8 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, x: -direction * 40, scale: 0.96, rotateY: -direction * 8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              style={{ position: 'absolute', inset: 0, zIndex: 20 }}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}>
              <div className="w-full h-full rounded-2xl overflow-hidden cursor-zoom-in group/card relative"
                style={{
                  boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.75), 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' : '0 24px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
                onClick={() => setLightboxOpen(true)}>
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                </div>
                <img src={SLIDES[activeIdx].src} alt={SLIDES[activeIdx].label} className="w-full h-full object-cover" draggable={false} />
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 z-30 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700' : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200 shadow-md'}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="8,1 3,6 8,11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={next}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 z-30 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700' : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200 shadow-md'}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="4,1 9,6 4,11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="transition-all duration-300 rounded-full"
              style={{ width: i === activeIdx ? 20 : 6, height: 6, background: i === activeIdx ? (isDark ? '#fff' : '#000000') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)') }} />
          ))}
        </div>

        <p className={`text-xs font-light tracking-widest uppercase ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
          {SLIDES[activeIdx].label} · {activeIdx + 1} / {SLIDES.length}
        </p>
      </div>
    );
  }
);

/* ─── 3D CAROUSEL GALLERY ─────────────────────────────────────── */
const CAROUSEL_ITEMS = [
  { id: 'standard-dark',  label: 'Standard theme',         sublabel: 'Logo frontside',  badge: '-20% forever', badgeColor: '#34d399', badgeBg: 'rgba(52,211,153,0.15)', badgeBorder: 'rgba(52,211,153,0.4)' },
  { id: 'customized',     label: 'Fully customized',        sublabel: 'Logo backside',   badge: null },
  { id: 'analytics',      label: 'Analytics dashboard',     sublabel: null,               badge: null },
];

function CarouselCard({ item, chatTheme, setChatTheme, scrollToForm, paperStackRef, isDark, onLightboxChange }: {
  item: typeof CAROUSEL_ITEMS[0];
  chatTheme: string;
  setChatTheme: (t: string) => void;
  scrollToForm: () => void;
  paperStackRef: React.Ref<{ closeLightbox: () => void }>;
  isDark: boolean;
  onLightboxChange?: (open: boolean, slide: typeof SLIDES[0] | null, onClose: () => void, onPrev: () => void, onNext: () => void) => void;
}) {
  const theme = CHAT_THEMES[chatTheme];
  return (
    <div className="flex flex-col items-center gap-3">
      {item.id === 'standard-dark' && (
        <AnimatedChatLoop theme={theme} onGetStarted={scrollToForm} />
      )}
      {item.id === 'customized' && (
        <CustomizedChatLoop onGetStarted={scrollToForm} />
      )}
      {item.id === 'analytics' && (
        <PaperStack isDark={isDark} ref={paperStackRef} onLightboxChange={onLightboxChange} />
      )}
    </div>
  );
}

function Carousel3D({ scrollToForm, isDark, paperStackRef }: { scrollToForm: () => void; isDark: boolean; paperStackRef: React.Ref<{ closeLightbox: () => void }> }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [chatTheme, setChatTheme] = useState('dark');
  const N = CAROUSEL_ITEMS.length;
  const STEP = 360 / N;

  // lightbox state lifted here so portal renders outside filter/transform stacking contexts
  const [lightboxData, setLightboxData] = useState<{ slide: typeof SLIDES[0]; onClose: () => void; onPrev: () => void; onNext: () => void } | null>(null);
  const handleLightboxChange = useCallback((open: boolean, slide: typeof SLIDES[0] | null, onClose: () => void, onPrev: () => void, onNext: () => void) => {
    setLightboxData(open && slide ? { slide, onClose, onPrev, onNext } : null);
  }, []);

  // angle state — drives all positions
  const angleRef = useRef(0);           // current rendered angle
  const targetAngleRef = useRef(0);     // where we're lerping to
  const [angle, setAngle] = useState(0);

  // drag state
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragBaseAngleRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // raf loop — always running
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = targetAngleRef.current - angleRef.current;
      if (Math.abs(diff) > 0.015) {
        angleRef.current += diff * 0.09;
        setAngle(angleRef.current);
      } else if (Math.abs(diff) > 0) {
        angleRef.current = targetAngleRef.current;
        setAngle(angleRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // snap targetAngle to nearest slot for given idx (shortest path)
  const snapTo = useCallback((idx: number) => {
    const norm = ((idx % N) + N) % N;
    // figure out current "index" from target angle
    const currentSnap = -targetAngleRef.current / STEP;
    const nearestCurrent = Math.round(currentSnap);
    // how many steps to reach norm from nearest current?
    let delta = norm - ((nearestCurrent % N) + N) % N;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    targetAngleRef.current = -(nearestCurrent + delta) * STEP;
    setActiveIdx(norm);
  }, [N, STEP]);

  const goTo = useCallback((idx: number) => {
    snapTo(idx);
  }, [snapTo]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragBaseAngleRef.current = targetAngleRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 4) hasDraggedRef.current = true;
    // map px to degrees: ~350px = 1 full step (less sensitive)
    const degreesPerPx = STEP / 350;
    targetAngleRef.current = dragBaseAngleRef.current + dx * degreesPerPx;
    // update active index as we drag
    const snapped = ((Math.round(-targetAngleRef.current / STEP) % N) + N) % N;
    setActiveIdx(snapped);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    // snap to nearest slot
    const nearest = Math.round(-targetAngleRef.current / STEP);
    targetAngleRef.current = -nearest * STEP;
    const norm = ((nearest % N) + N) % N;
    setActiveIdx(norm);
  };

  const RADIUS = 500;

  return (
    <div className="flex flex-col items-center gap-8 select-none w-full">
      <div
        style={{ width: '100%', height: 560, position: 'relative', perspective: '1400px', cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {CAROUSEL_ITEMS.map((item, i) => {
            const itemAngle = angle + i * STEP;
            const rad = (itemAngle * Math.PI) / 180;
            const x = Math.sin(rad) * RADIUS;
            const z = Math.cos(rad) * RADIUS;
            const depth = (z + RADIUS) / (2 * RADIUS); // 0=back, 1=front
            const isActive = i === activeIdx;
            const blurAmount = isActive ? 0 : 2 + (1 - depth) * 5;
            const opacity = isActive ? 1 : 0.4 + depth * 0.35;

            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translateX(${x}px) translateY(${(1 - depth) * 24}px)`,
                  filter: `blur(${blurAmount}px)`,
                  opacity,
                  zIndex: isActive ? 50 : Math.round(depth * 40),
                  cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                  pointerEvents: 'auto',
                  transition: 'filter 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'filter, opacity, transform',
                }}
                onClick={() => {
                  if (hasDraggedRef.current) return;
                  if (!isActive) goTo(i);
                }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 24,
                  padding: '20px 20px 16px',
                  boxShadow: isActive
                    ? '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 16px 40px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)',
                  transition: 'border 0.55s ease, box-shadow 0.55s ease',
                  width: 360,
                }}>
                  {/* Card header — only sublabel + badge, no title */}
                  <div className="flex flex-col items-center gap-1 mb-3">
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {item.sublabel && (
                        <span className="text-xs font-light tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>{item.sublabel}</span>
                      )}
                      {!item.sublabel && (
                        <span className="text-xs font-light tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>{item.label}</span>
                      )}
                      {item.badge && (
                        <span style={{ background: item.badgeBg, border: `1px solid ${item.badgeBorder}`, color: item.badgeColor }} className="text-xs font-semibold px-2 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </div>
                  </div>

                  {/* Theme switcher */}
                  {item.id === 'standard-dark' && isActive && (
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); setChatTheme('dark'); }}
                        animate={chatTheme !== 'dark' ? { borderColor: ['#d4d4d8', '#000000', '#d4d4d8'] } : { borderColor: '#71717a' }}
                        transition={chatTheme !== 'dark' ? { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' } : { duration: 0.4 }}
                        style={{ borderWidth: 2, borderStyle: 'solid' }}
                        className={`w-5 h-5 rounded-full transition-transform bg-zinc-900 ${chatTheme === 'dark' ? 'scale-110' : ''}`} />
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); setChatTheme('light'); }}
                        animate={chatTheme !== 'light' ? { borderColor: ['#e4e4e7', '#52525b', '#e4e4e7'] } : { borderColor: '#a1a1aa' }}
                        transition={chatTheme !== 'light' ? { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' } : { duration: 0.4 }}
                        style={{ borderWidth: 2, borderStyle: 'solid' }}
                        className={`w-5 h-5 rounded-full transition-transform bg-white ${chatTheme === 'light' ? 'scale-110' : ''}`} />
                    </div>
                  )}

                  <div style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
                    <CarouselCard item={item} chatTheme={chatTheme} setChatTheme={setChatTheme} scrollToForm={scrollToForm} paperStackRef={paperStackRef} isDark={isDark} onLightboxChange={handleLightboxChange} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {CAROUSEL_ITEMS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{ width: i === activeIdx ? 24 : 7, height: 7, borderRadius: 9999, background: i === activeIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.4s ease' }} />
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {CAROUSEL_ITEMS[activeIdx].label} · {activeIdx + 1} / {N}
        </p>
      </div>

      {/* Lightbox portal — outside any filter/transform stacking context */}
      {lightboxData && createPortal(
        <LightboxModal slide={lightboxData.slide} onClose={lightboxData.onClose} onPrev={lightboxData.onPrev} onNext={lightboxData.onNext} />,
        document.body
      )}
    </div>
  );
}

/* ─── FEATURES SECTION ────────────────────────────────────────── */
export function FeaturesSection({ activeTheme, onGetStarted }: { activeTheme: string; onGetStarted?: () => void }) {
  const scrollToForm = onGetStarted ?? (() => { const el = document.querySelector('form, [id*="contact"], [id*="trial"], [id*="get-started"], [id*="cta"]'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  const isDark = activeTheme === 'dark';
  const ref = useRef<HTMLElement>(null);
  const paperStackRef = useRef<{ closeLightbox: () => void }>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.3'] });
  const { scrollYProgress: scrollFull } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  useEffect(() => {
    return scrollFull.on('change', v => {
      if (v <= 0.05 || v >= 0.95) paperStackRef.current?.closeLightbox();
    });
  }, [scrollFull]);

  return (
    <div style={{ perspective: '1200px', overflow: 'hidden' }}>
      <motion.section
        ref={ref}
        id="features"
        style={{ rotateX, scale, opacity, y }}
        className="min-h-screen flex items-center justify-center bg-black py-20 px-6 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }} className="mb-14 text-center">
            <h2 className="text-5xl md:text-6xl font-light mb-3 text-white">The brain behind AI Agent</h2>
            <p className="text-lg font-light text-zinc-400">Built on the world's most advanced AI and a comprehensive analytics dashboard.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
            <Carousel3D scrollToForm={scrollToForm} isDark={isDark} paperStackRef={paperStackRef} />
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mt-10">
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-semibold transition-all bg-white text-zinc-950 hover:bg-zinc-100"
            >
              Get started free
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
