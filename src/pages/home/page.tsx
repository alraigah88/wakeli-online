import { useEffect, useState, createContext, useContext, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CodeHero from './components/CodeHero';
import AgentsGrid from './components/AgentsGrid';
import AgentDetailModal from './components/AgentDetailModal';
import CreateAgentModal from './components/CreateAgentModal';
import PricingSection from './components/PricingSection';
import ReviewsSection from './components/ReviewsSection';
import IntegrationsStrip from '@/components/feature/IntegrationsStrip';
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

  // Define isRTL
  const isRTL = i18n.language === 'ar';

  // Force scroll to top BEFORE paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Scroll to top on mount (backup)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // SEO Setup
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
        // Update existing agent
        const updated = [...prev];
        updated[existingIndex] = agent;
        return updated;
      }
      // Add new agent
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
    // TODO: Will implement package selection logic in next plan
  };

  const handleStartMeetingClick = () => {
    // Check if user is logged in
    if (user) {
      setShowAIMeetingModal(true);
      return;
    }

    // Guest: check how many free meetings used from localStorage
    const guestMeetingCount = parseInt(localStorage.getItem('guest_meeting_count') || '0', 10);
    
    if (guestMeetingCount < 2) {
      // Allow guest to use meeting (count will be incremented when meeting actually starts)
      setShowAIMeetingModal(true);
    } else {
      // 3rd time: show coming soon modal
      setShowAuthModal(true);
    }
  };

  const handleStartMeeting = (department: string, selectedAgents: string[], topic: string) => {
    console.log('Starting meeting:', { department, selectedAgents, topic });
    // TODO: Will implement meeting simulation in next plan
    setShowAIMeetingModal(false);
  };

  const getBgAccent = () => {
    if (hoverGender === 'male')
      return 'from-stone-100 via-teal-50/70 to-cyan-50/50';
    if (hoverGender === 'female')
      return 'from-stone-100 via-violet-50/70 to-rose-50/50';
    return 'from-stone-100 via-slate-50 to-zinc-100/80';
  };

  const getDarkBgAccent = () => {
    if (hoverGender === 'male')
      return 'from-[#141820] via-[#162028] to-[#131a22]';
    if (hoverGender === 'female')
      return 'from-[#141820] via-[#1c1528] to-[#161220]';
    return 'from-[#131720] via-[#161a24] to-[#141822]';
  };

  // If mobile device, render mobile-optimized view
  if (isMobile) {
    return (
      <ThemeContext.Provider
        value={{ isDark, toggleTheme, hoverGender, setHoverGender }}
      >
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

        {/* Modals */}
        {selectedAgent && (
          <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        )}

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

        <AIMeetingModal
          isOpen={showAIMeetingModal}
          onClose={() => setShowAIMeetingModal(false)}
          onStartMeeting={handleStartMeeting}
        />

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          isDark={isDark}
        />
      </ThemeContext.Provider>
    );
  }

  // Desktop view (existing code)
  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, hoverGender, setHoverGender }}
    >
      <div
        className={`min-h-screen flex flex-col transition-all duration-700 ${
          isDark ? 'bg-[#131720]' : 'bg-stone-50'
        }`}
      >
        {/* Animated background */}
        <div
          className={`fixed inset-0 pointer-events-none transition-all duration-700 bg-gradient-to-br ${
            isDark ? getDarkBgAccent() : getBgAccent()
          }`}
        >
          {/* Blob 1 - top start */}
          <div
            className={`absolute top-[-8%] start-[-6%] w-[520px] h-[520px] rounded-full blur-[130px] transition-all duration-700 ${
              hoverGender === 'male'
                ? isDark ? 'bg-teal-400/12' : 'bg-teal-300/30'
                : hoverGender === 'female'
                ? isDark ? 'bg-violet-400/12' : 'bg-violet-300/30'
                : isDark ? 'bg-indigo-400/10' : 'bg-indigo-200/40'
            }`}
          ></div>

          {/* Blob 2 - bottom end */}
          <div
            className={`absolute bottom-[-8%] end-[-6%] w-[480px] h-[480px] rounded-full blur-[110px] transition-all duration-700 ${
              hoverGender === 'male'
                ? isDark ? 'bg-cyan-400/10' : 'bg-cyan-300/25'
                : hoverGender === 'female'
                ? isDark ? 'bg-pink-400/10' : 'bg-pink-300/25'
                : isDark ? 'bg-teal-400/8' : 'bg-teal-200/35'
            }`}
          ></div>

          {/* Blob 3 - center */}
          <div
            className={`absolute top-[35%] start-[25%] w-[700px] h-[350px] rounded-full blur-[150px] transition-all duration-700 ${
              isDark ? 'bg-slate-500/10' : 'bg-slate-300/30'
            }`}
          ></div>

          {/* Blob 4 - top end */}
          <div
            className={`absolute top-[10%] end-[5%] w-[300px] h-[300px] rounded-full blur-[100px] transition-all duration-700 ${
              isDark ? 'bg-violet-500/7' : 'bg-amber-100/50'
            }`}
          ></div>

          {/* Subtle dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDark
                ? 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)'
                : 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
              opacity: 0.6,
            }}
          ></div>

          {/* Subtle noise texture overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
            }}
          ></div>
        </div>

        <div className="relative z-10 flex-1">
          <CodeHero onStartMeetingClick={handleStartMeetingClick} />
          <div id="agents">
            <AgentsGrid
              onAgentSelect={setSelectedAgent}
              onCreateAgent={() => {
                setEditingAgent(null);
                setShowCreateModal(true);
              }}
              customAgents={customAgents}
              onEditAgent={handleEditAgent}
              onDeleteAgent={handleDeleteAgent}
            />
          </div>

          {/* AI Meeting Room Section */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2
                  className={`font-mono text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  ناقش فكرتك مع وكلاء مختصين بالأسواق المحلية والعالمية بإحتراف
                </h2>
                <p
                  className={`font-mono text-xl md:text-2xl mb-2 transition-colors duration-500 font-semibold ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  جربه الآن مجاناً - Demo
                </p>
                <p
                  className={`font-mono text-lg transition-colors duration-500 font-medium ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  شاهد الوكلاء يتناقشون حول فكرتك أمام عينيك ويقدمون لك الحلول
                </p>
              </div>

              <div
                className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-[#0f1520]/80 backdrop-blur-xl border-slate-700/40'
                    : 'bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-lg shadow-slate-200/50'
                }`}
              >
                <div className="p-8 md:p-12 text-center">
                  <div className="mb-8">
                    <div
                      className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${
                        isDark ? 'bg-[#5a5490]/30' : 'bg-gray-100'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <span
                        className={`font-mono text-sm font-medium ${
                          isDark ? 'text-slate-300/70' : 'text-slate-700'
                        }`}
                      >
                        قاعة الاجتماعات متاحة الآن
                      </span>
                    </div>
                    <h3
                      className={`font-mono text-2xl md:text-3xl font-bold mb-4 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      اجتماع الوكلاء الذكي
                    </h3>
                    <p
                      className={`font-mono text-base md:text-lg leading-relaxed max-w-3xl mx-auto ${
                        isDark ? 'text-slate-300/75' : 'text-slate-700'
                      }`}
                    >
                      اكتب مشكلتك أو فكرتك مرة واحدة، وشاهد فريق الوكلاء المتخصصين يتناقشون
                      ويحللون من جميع النواحي ويقدمون لك خطة عمل متكاملة
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div
                      className={`p-6 rounded-xl ${
                        isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                        <i className="ri-team-line text-2xl text-teal-500"></i>
                      </div>
                      <h4
                        className={`font-mono text-lg font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        اختر الوكلاء
                      </h4>
                      <p
                        className={`font-mono text-base font-medium ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}
                      >
                        حدد القسم والوكلاء المناسبين لموضوعك
                      </p>
                    </div>

                    <div
                      className={`p-6 rounded-xl ${
                        isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <i className="ri-chat-4-line text-2xl text-violet-500"></i>
                      </div>
                      <h4
                        className={`font-mono text-lg font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        شاهد النقاش
                      </h4>
                      <p
                        className={`font-mono text-base font-medium ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}
                      >
                        الوكلاء يتناقشون ويتحاورون أمامك مباشرة
                      </p>
                    </div>

                    <div
                      className={`p-6 rounded-xl ${
                        isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <i className="ri-lightbulb-line text-2xl text-amber-500"></i>
                      </div>
                      <h4
                        className={`font-mono text-lg font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        احصل على الحلول
                      </h4>
                      <p
                        className={`font-mono text-base font-medium ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}
                      >
                        خطة عمل متكاملة مع تحذيرات المخاطر
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartMeetingClick}
                    className="px-8 py-4 rounded-xl font-mono font-bold text-lg text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap"
                  >
                    ابدأ الاجتماع المجاني الآن
                  </button>

                  <p
                    className={`font-mono text-base mt-6 font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    تجربة مجانية واحدة • للمزيد سجل بإيميل Google أو إيميلك الشخصي
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <PricingSection onSelectPackage={handlePackageSelect} />

          {/* Account Connections Section */}
          <AccountConnectionsSection />

          {/* Partnership Banner - Simple */}
          <PartnerStrip />

          {/* Reviews & Newsletter Section */}
          <ReviewsSection />

          {/* Integrations Strip */}
          <IntegrationsStrip />
        </div>

        {/* Social Links */}
        <div className="relative z-10 pt-12 pb-6 px-4 transition-colors duration-500">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
            <div className="flex items-center gap-5">
              <a
                href="https://x.com/alraigah"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-black/60 text-white hover:bg-black hover:scale-110'
                    : 'bg-black text-white hover:scale-110 hover:shadow-lg'
                }`}
              >
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a
                href="https://wa.me/966535797207"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white hover:scale-110'
                    : 'bg-[#25D366] text-white hover:scale-110 hover:shadow-lg hover:shadow-green-300/50'
                }`}
              >
                <i className="ri-whatsapp-line text-xl"></i>
              </a>
              <a
                href="https://www.youtube.com/@usb_boot"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:scale-110'
                    : 'bg-[#FF0000] text-white hover:scale-110 hover:shadow-lg hover:shadow-red-300/50'
                }`}
              >
                <i className="ri-youtube-line text-xl"></i>
              </a>
              <a
                href="https://t.me/alraigah_M"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-[#229ED9]/20 text-[#229ED9] hover:bg-[#229ED9] hover:text-white hover:scale-110'
                    : 'bg-[#229ED9] text-white hover:scale-110 hover:shadow-lg hover:shadow-sky-300/50'
                }`}
              >
                <i className="ri-telegram-line text-xl"></i>
              </a>
              <a
                href="mailto:cvlink2030@gmail.com"
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-white hover:scale-110'
                    : 'bg-teal-500 text-white hover:scale-110 hover:shadow-lg hover:shadow-teal-300/50'
                }`}
              >
                <i className="ri-mail-line text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className={`relative z-10 py-8 px-4 border-t transition-colors duration-500 ${
            isDark ? 'border-[#5a5490]/20' : 'border-gray-200/60'
          }`}
        >
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
            <span
              className={`font-mono text-sm md:text-base font-semibold transition-colors duration-500 ${
                isDark ? 'text-white/50' : 'text-gray-600'
              }`}
            >
              جميع الحقوق محفوظة © May Dhafer 2026
            </span>
            <a
              href="/"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={`font-mono text-sm md:text-base transition-colors duration-500 cursor-pointer ${
                isDark
                  ? 'text-white/40 hover:text-white/70'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
            >
              Powered by Readdy
            </a>
          </div>
        </footer>

        {/* Agent Detail Modal */}
        {selectedAgent && (
          <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        )}

        {/* Create Agent Modal */}
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

        {/* AI Meeting Modal */}
        <AIMeetingModal
          isOpen={showAIMeetingModal}
          onClose={() => setShowAIMeetingModal(false)}
          onStartMeeting={handleStartMeeting}
        />

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          isDark={isDark}
        />
      </div>
    </ThemeContext.Provider>
  );
}
