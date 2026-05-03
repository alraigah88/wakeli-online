import { useEffect, useState, createContext, useContext, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CodeHero from './components/CodeHero';
import AgentsGrid from './components/AgentsGrid';
import AgentDetailModal from './components/AgentDetailModal';
import CreateAgentModal from './components/CreateAgentModal';
import PricingSection from './components/PricingSection';
import ReviewsSection from './components/ReviewsSection';
import CalendlySection from './components/CalendlySection';
import AIMeetingModal from './components/AIMeetingModal';
import AccountConnectionsSection from './components/AccountConnectionsSection';
import { useSEO, getWebsiteSchema, getOrganizationSchema, getSoftwareApplicationSchema, getFAQSchema, getWebPageSchema } from '@/utils/seo';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/feature/AuthModal';
import PartnerStrip from './components/PartnerStrip';
import MobileView from './components/MobileView';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  hoverGender: 'male' | 'female' | null;
  setHoverGender: (g: 'male' | 'female' | null) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  hoverGender: null,
  setHoverGender: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export type Agent = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  bg: string;
  system: string;
  gender: 'male' | 'female';
  avatar?: string;
  isCustom?: boolean;
};

export default function HomePage() {
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
  const { isMobile } = useDeviceDetection();
  const [isDark, setIsDark] = useState(false);
  const [hoverGender, setHoverGender] = useState<'male' | 'female' | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [customAgents, setCustomAgents] = useState<Agent[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIMeetingModal, setShowAIMeetingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const isRTL = i18n.language === 'ar';

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSEO({
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        getWebPageSchema(),
        getWebsiteSchema(),
        getOrganizationSchema(),
        getSoftwareApplicationSchema(),
        getFAQSchema()
      ]
    }
  });

  const toggleTheme = () => setIsDark(prev => !prev);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleAgentCreated = (agent: Agent) => {
    setCustomAgents(prev => {
      const existingIndex = prev.findIndex(a => a.id === agent.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = agent;
        return updated;
      }
      return [...prev, agent];
    });
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowCreateModal(true);
  };

  const handleDeleteAgent = (agentId: string) => {
    setCustomAgents(prev => prev.filter(a => a.id !== agentId));
  };

  const handlePackageSelect = (packageType: 'trial' | 'agent' | 'corporate') => {
    console.log('Selected package:', packageType);
  };

  const handleStartMeetingClick = () => {
    if (user) {
      setShowAIMeetingModal(true);
      return;
    }
    const guestMeetingCount = parseInt(localStorage.getItem('guest_meeting_count') || '0', 10);
    if (guestMeetingCount < 2) {
      setShowAIMeetingModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleStartMeeting = (department: string, selectedAgents: string[], topic: string) => {
    console.log('Starting meeting:', { department, selectedAgents, topic });
    setShowAIMeetingModal(false);
  };

  const getBgAccent = () => {
    if (hoverGender === 'male') return 'from-stone-100 via-teal-50/70 to-cyan-50/50';
    if (hoverGender === 'female') return 'from-stone-100 via-violet-50/70 to-rose-50/50';
    return 'from-stone-100 via-slate-50 to-zinc-100/80';
  };

  const getDarkBgAccent = () => {
    if (hoverGender === 'male') return 'from-[#141820] via-[#162028] to-[#131a22]';
    if (hoverGender === 'female') return 'from-[#141820] via-[#1c1528] to-[#161220]';
    return 'from-[#131720] via-[#161a24] to-[#141822]';
  };

  if (isMobile) {
    return (
      <ThemeContext.Provider value={{ isDark, toggleTheme, hoverGender, setHoverGender }}>
        <MobileView
          isDark={isDark}
          toggleTheme={toggleTheme}
          customAgents={customAgents}
          onAgentSelect={setSelectedAgent}
          onCreateAgent={() => {
            setEditingAgent(null);
            setShowCreateModal(true);
          }}
          onEditAgent={handleEditAgent}
          onDeleteAgent={handleDeleteAgent}
          onSelectPackage={handlePackageSelect}
          onLoginClick={() => setShowAuthModal(true)}
        />
        {selectedAgent && <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
        {showCreateModal && (
          <CreateAgentModal
            onClose={() => {
              setShowCreateModal(false);
              setEditingAgent(null);
            }}
            onAgentCreated={handleAgentCreated}
            editingAgent={editingAgent}
          />
        )}
        <AIMeetingModal isOpen={showAIMeetingModal} onClose={() => setShowAIMeetingModal(false)} onStartMeeting={handleStartMeeting} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} isDark={isDark} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, hoverGender, setHoverGender }}>
      <div className={`min-h-screen flex flex-col transition-all duration-700 ${isDark ? 'bg-[#131720]' : 'bg-stone-50'}`}>
        <div className={`fixed inset-0 pointer-events-none transition-all duration-700 bg-gradient-to-br ${isDark ? getDarkBgAccent() : getBgAccent()}`}>
          <div className={`absolute top-[-8%] start-[-6%] w-[520px] h-[520px] rounded-full blur-[130px] transition-all duration-700 ${hoverGender === 'male' ? (isDark ? 'bg-teal-400/12' : 'bg-teal-300/30') : hoverGender === 'female' ? (isDark ? 'bg-violet-400/12' : 'bg-violet-300/30') : (isDark ? 'bg-indigo-400/10' : 'bg-indigo-200/40')}`}></div>
          <div className={`absolute bottom-[-8%] end-[-6%] w-[480px] h-[480px] rounded-full blur-[110px] transition-all duration-700 ${hoverGender === 'male' ? (isDark ? 'bg-cyan-400/10' : 'bg-cyan-300/25') : hoverGender === 'female' ? (isDark ? 'bg-pink-400/10' : 'bg-pink-300/25') : (isDark ? 'bg-teal-400/8' : 'bg-teal-200/35')}`}></div>
          <div className={`absolute top-[35%] start-[25%] w-[700px] h-[350px] rounded-full blur-[150px] transition-all duration-700 ${isDark ? 'bg-slate-500/10' : 'bg-slate-300/30'}`}></div>
          <div className={`absolute top-[10%] end-[5%] w-[300px] h-[300px] rounded-full blur-[100px] transition-all duration-700 ${isDark ? 'bg-violet-500/7' : 'bg-amber-100/50'}`}></div>
          <div className="absolute inset-0" style={{ backgroundImage: isDark ? 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)' : 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '36px 36px', opacity: 0.6 }}></div>
          <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }}></div>
        </div>

        <main className="relative z-10 flex-grow">
          <CodeHero onStartMeeting={handleStartMeetingClick} onLoginClick={() => setShowAuthModal(true)} />
          <PartnerStrip />
          <AgentsGrid customAgents={customAgents} onAgentSelect={setSelectedAgent} onCreateAgent={() => { setEditingAgent(null); setShowCreateModal(true); }} onEditAgent={handleEditAgent} onDeleteAgent={handleDeleteAgent} />
          
          {/* Unified Integration Section - ONLY ONE CALL HERE */}
          <AccountConnectionsSection />
          
          <PricingSection onSelectPackage={handlePackageSelect} />
          <ReviewsSection />
          <CalendlySection />
        </main>

        <footer className={`relative z-10 py-12 border-t ${isDark ? 'bg-[#0d1117] border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>© 2026 Wakeli AI. All rights reserved.</p>
          </div>
        </footer>

        {selectedAgent && <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />}
        {showCreateModal && (
          <CreateAgentModal
            onClose={() => {
              setShowCreateModal(false);
              setEditingAgent(null);
            }}
            onAgentCreated={handleAgentCreated}
            editingAgent={editingAgent}
          />
        )}
        <AIMeetingModal isOpen={showAIMeetingModal} onClose={() => setShowAIMeetingModal(false)} onStartMeeting={handleStartMeeting} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} isDark={isDark} />
      </div>
    </ThemeContext.Provider>
  );
}
