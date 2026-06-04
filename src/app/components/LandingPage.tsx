import React, { useState } from 'react';
import { Header } from './common/Header';
import { Footer } from './common/Footer';
import { LeadFormModal } from './common/LeadFormModal';
import { HeroSection } from './pages/HeroSection';
import { HowItWorks } from './pages/HowItWorks';
import { EvolvingSection } from './pages/EvolvingSection';
import { FeaturesSection } from './pages/FeaturesSection';
import { PricingSection } from './pages/PricingSection';
import { FAQSection } from './pages/FAQSection';
import { CTASection } from './pages/CTASection';

export function LandingPage() {
  const activeTheme = 'dark';
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadService, setLeadService] = useState('');

  const openLead = (service = '') => {
    setLeadService(service);
    setLeadOpen(true);
  };

  return (
    <>
      <style>{`html, body { background: #09090b !important; margin: 0; padding: 0; }`}</style>
      <div className="overflow-x-hidden bg-zinc-950" style={{ minHeight: '100vh', backgroundColor: '#09090b' }}>
        {leadOpen && (
          <LeadFormModal
            isDark={true}
            onClose={() => setLeadOpen(false)}
            initialService={leadService}
          />
        )}
        <Header isDark={true} onGetStarted={() => openLead()} />
        <HeroSection onGetStarted={() => openLead()} />
        <HowItWorks />
        <EvolvingSection />
        <FeaturesSection activeTheme={activeTheme} />
        <PricingSection activeTheme={activeTheme} onGetStarted={(id) => openLead(id)} />
        <FAQSection />
        <CTASection activeTheme={activeTheme} onGetStarted={() => openLead()} />
        <Footer activeTheme={activeTheme} />
      </div>
    </>
  );
}
