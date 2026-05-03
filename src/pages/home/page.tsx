import { useState, createContext, useContext, useLayoutEffect, Suspense, lazy } from 'react';

// استخدام lazy loading لتجنب فشل البناء إذا كان أحد المكونات مفقوداً أو مساره خاطئاً
const CodeHero = lazy(() => import('./components/CodeHero').catch(() => ({ default: () => <div>Hero Section Error</div> })));
const AgentsGrid = lazy(() => import('./components/AgentsGrid').catch(() => ({ default: () => <div>Agents Grid Error</div> })));
const AccountConnectionsSection = lazy(() => import('./components/AccountConnectionsSection').catch(() => ({ default: () => <div>Integrations Error</div> })));
const AgentTemplatesSection = lazy(() => import('./components/AgentTemplatesSection').catch(() => ({ default: () => <div>Templates Error</div> })));
const PricingSection = lazy(() => import('./components/PricingSection').catch(() => ({ default: () => <div>Pricing Error</div> })));
const ReviewsSection = lazy(() => import('./components/ReviewsSection').catch(() => ({ default: () => <div>Reviews Error</div> })));
const CalendlySection = lazy(() => import('./components/CalendlySection').catch(() => ({ default: () => <div>Calendly Error</div> })));
const PartnerStrip = lazy(() => import('./components/PartnerStrip').catch(() => ({ default: () => <div>Partners Error</div> })));

// محاولة استيراد الهوكس مع fallback
let useDeviceDetection = () => ({ isMobile: false });
try {
  const mod = await import('../../../hooks/useDeviceDetection');
  useDeviceDetection = mod.useDeviceDetection;
} catch (e) {
  console.error("Hook not found at ../../../hooks/useDeviceDetection, trying ../../hooks/useDeviceDetection");
  try {
    const mod = await import('../../hooks/useDeviceDetection');
    useDeviceDetection = mod.useDeviceDetection;
  } catch (e2) {}
}

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  hoverGender: null,
  setHoverGender: (g: any) => {},
});

export default function HomePage() {
  const { isMobile } = useDeviceDetection();
  const [isDark, setIsDark] = useState(false);
  const [hoverGender, setHoverGender] = useState(null);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, hoverGender, setHoverGender }}>
      <main className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <CodeHero onMeetingClick={() => {}} />
          <div className="relative z-10">
            <AgentsGrid onAgentClick={() => {}} onCreateClick={() => {}} />
            <div className="py-10"><AccountConnectionsSection /></div>
            <div className="py-10"><AgentTemplatesSection /></div>
            <PartnerStrip />
            <PricingSection />
            <ReviewsSection />
            <CalendlySection />
          </div>
        </Suspense>
      </main>
    </ThemeContext.Provider>
  );
}
