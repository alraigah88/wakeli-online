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
import AgentTemplatesSection from './components/AgentTemplatesSection';
import { useSEO, getWebsiteSchema, getOrganizationSchema, getSoftwareApplicationSchema, getFAQSchema, getWebPageSchema } from '../../utils/seo';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../components/feature/AuthModal';
import PartnerStrip from './components/PartnerStrip';
import MobileView from './components/MobileView';
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
  const { user } = useAuth();
  const { isMobile } = useDeviceDetection();
  const [isDark, setIsDark] = useState(false);
  const [hoverGender, setHoverGender] = useState<'male' | 'female' | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  useSEO({
    title: i18n.language === 'ar' ? 'وكيلي AI - فريق ذكاء اصطناعي لأتمتة أعمالك' : 'Wakeli AI - AI Team for Business Automation',
    description: i18n.language === 'ar' ? 'منصة وكيلي AI توفر لك وكلاء ذكاء اصطناعي متخصصين لإدارة مهامك، اجتماعاتك، وبريدك الإلكتروني تلقائياً.' : 'Wakeli AI platform provides specialized AI agents to manage your tasks, meetings, and emails automatically.',
    keywords: ['AI Agents', 'Automation', 'Business AI', 'Wakeli AI', 'وكيلي', 'ذكاء اصطناعي', 'أتمتة'],
    canonical: 'https://wakeli-online.vercel.app',
    ogImage: 'https://wakeli-online.vercel.app/og-image.png',
    structuredData: [
      getWebsiteSchema(),
      getOrganizationSchema(),
      getSoftwareApplicationSchema(),
      getFAQSchema(i18n.language as 'ar' | 'en'),
      getWebPageSchema()
    ]
  });

  if (isMobile) return <MobileView />;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, hoverGender, setHoverGender }}>
      <main className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
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

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <CreateAgentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        <AgentDetailModal agent={selectedAgent} isOpen={!!selectedAgent} onClose={() => setSelectedAgent(null)} />
        <AIMeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
      </main>
    </ThemeContext.Provider>
  );
}
