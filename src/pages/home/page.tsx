import { useState, createContext, useContext, useLayoutEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

// Lazy load components
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
const LiveMeetingRoom = lazy(() => import('./components/LiveMeetingRoom'));

// Hooks and Contexts
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
  const [isLiveMeetingOpen, setIsLiveMeetingOpen] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);

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

  const handleStartMeeting = (data: any) => {
    setMeetingData(data);
    setIsMeetingModalOpen(false);
    setIsLiveMeetingOpen(true);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, hoverGender, setHoverGender }}>
      <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
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
            <CalendlySection onMeetingClick={() => setIsMeetingModalOpen(true)} />
          </div>

          <CreateAgentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
          <AgentDetailModal agent={selectedAgent} isOpen={!!selectedAgent} onClose={() => setSelectedAgent(null)} />
          <AIMeetingModal 
            isOpen={isMeetingModalOpen} 
            onClose={() => setIsMeetingModalOpen(false)} 
            onStartMeeting={handleStartMeeting}
          />
          {isLiveMeetingOpen && meetingData && (
            <LiveMeetingRoom 
              isOpen={isLiveMeetingOpen}
              onClose={() => setIsLiveMeetingOpen(false)}
              department={meetingData.department}
              selectedAgents={meetingData.selectedAgents}
              topic={meetingData.topic}
              onMeetingComplete={(summary) => {
                console.log('Meeting Complete:', summary);
                setIsLiveMeetingOpen(false);
              }}
            />
          )}
        </Suspense>
      </main>
    </ThemeContext.Provider>
  );
}
