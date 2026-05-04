import { useState, createContext, useContext, useLayoutEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

const CodeHero = lazy(() => import('./components/CodeHero'));
const AgentsGrid = lazy(() => import('./components/AgentsGrid'));
const AgentDetailModal = lazy(() => import('./components/AgentDetailModal'));
const CreateAgentModal = lazy(() => import('./components/CreateAgentModal'));
const PricingSection = lazy(() => import('./components/PricingSection'));
const ReviewsSection = lazy(() => import('./components/ReviewsSection'));
const CalendlySection = lazy(() => import('./components/CalendlySection'));
const AIMeetingModal = lazy(() => import('./components/AIMeetingModal'));
const AccountConnectionsSection = lazy(() => import('./components/AccountConnectionsSection'));
const AgentTemplatesSection = lazy(() => import('./components/AgentTemplatesSection'));
const PartnerStrip = lazy(() => import('./components/PartnerStrip'));

import { useDeviceDetection } from '../../hooks/useDeviceDetection';

export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  bg: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'unspecified';
  system?: string;
  isCustom?: boolean;
}

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

export default function HomePage() {
  const { i18n } = useTranslation();
  const { isMobile } = useDeviceDetection();
  const [isDark, setIsDark] = useState(false);
  const [hoverGender, setHoverGender] = useState<'male' | 'female' | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [customAgents, setCustomAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAgentCreated = (agent: Agent) => {
    if (editingAgent) {
      setCustomAgents(prev => prev.map(a => a.id === agent.id ? agent : a));
    } else {
      setCustomAgents(prev => [...prev, agent]);
    }
    setEditingAgent(null);
    setIsCreateModalOpen(false);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setIsCreateModalOpen(true);
  };

  const handleDeleteAgent = (agentId: string) => {
    setCustomAgents(prev => prev.filter(a => a.id !== agentId));
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, hoverGender, setHoverGender }}>
      <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">جار التحميل...</div>}>
          <CodeHero onStartMeetingClick={() => setIsMeetingModalOpen(true)} />

          <div className="relative z-10">
            <AgentsGrid
              onAgentSelect={setSelectedAgent}
              onCreateAgent={() => { setEditingAgent(null); setIsCreateModalOpen(true); }}
              customAgents={customAgents}
              onEditAgent={handleEditAgent}
              onDeleteAgent={handleDeleteAgent}
            />
            <div className="py-10"><AccountConnectionsSection /></div>
            <div className="py-10"><AgentTemplatesSection /></div>
            <PartnerStrip />
            <PricingSection />
            <ReviewsSection />
            <CalendlySection />
          </div>

          {isCreateModalOpen && (
            <CreateAgentModal
              onClose={() => { setIsCreateModalOpen(false); setEditingAgent(null); }}
              onAgentCreated={handleAgentCreated}
              editingAgent={editingAgent}
            />
          )}
          {selectedAgent && (
            <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
          )}
          <AIMeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
        </Suspense>
      </main>
    </ThemeContext.Provider>
  );
}
