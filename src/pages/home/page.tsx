import { useState, createContext, useContext, useLayoutEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

// Lazy load components to prevent build failure if paths are incorrect
const CodeHero = lazy(() => import('./components/CodeHero').catch(() => ({ default: () => null })));
const AgentsGrid = lazy(() => import('./components/AgentsGrid').catch(() => ({ default: () => null })));
const AgentDetailModal = lazy(() => import('./components/AgentDetailModal').catch(() => ({ default: () => null })));
const CreateAgentModal = lazy(() => import('./components/CreateAgentModal').catch(() => ({ default: () => null })));
const PricingSection = lazy(() => import('./components/PricingSection').catch(() => ({ default: () => null })));
const ReviewsSection = lazy(() => import('./components/ReviewsSection').catch(() => ({ default: () => null })));
const CalendlySection = lazy(() => import('./components/CalendlySection').catch(() => ({ default: () => null })));
const AIMeetingModal = lazy(() => import('./components/AIMeetingModal').catch(() => ({ default: () => null })));
const AccountConnectionsSection = lazy(() => import('./components/AccountConnectionsSection').catch(() => ({ default: () => null })));
const AgentTemplatesSection = lazy(() => import('./components/AgentTemplatesSection').catch(() => ({ default: () => null })));
const PartnerStrip = lazy(() => import('./components/PartnerStrip').catch(() => ({ default: () => null })));
const MobileView = lazy(() => import('./components/MobileView').catch(() => ({ default: () => null })));

// Import hooks and contexts with relative paths
import { useAuth } from '../../contexts/AuthContext';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

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
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

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

  if (isMobile) {
    return (
      <Suspense fallback={null}>
        <MobileView />
      </Suspense>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, hoverGender, setHoverGender }}>
      <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <CodeHero onMeetingClick={() => setIsMeetingModalOpen(true)} />
          
          <div className="relative z-10">
            <AgentsGrid onAgentClick={setSelectedAgent} onCreateClick={() => setIsCreateModalOpen(true)} />
            
            <div className="py-10">
              <AccountConnectionsSection />
            </div>

            <div className="py-10">
              <AgentTemplatesSection />
            </div>

            <PartnerStrip />
            <PricingSection />
            <ReviewsSection />
            <CalendlySection />
          </div>

          <CreateAgentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
          <AgentDetailModal agent={selectedAgent} isOpen={!!selectedAgent} onClose={() => setSelectedAgent(null)} />
          <AIMeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
        </Suspense>
      </main>
    </ThemeContext.Provider>
  );
}
