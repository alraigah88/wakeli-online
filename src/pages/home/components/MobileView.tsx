import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import MobileHeader from '@/components/feature/MobileHeader';
import MobileNavBar from '@/components/feature/MobileNavBar';
import AgentsGrid from './AgentsGrid';
import AccountConnectionsSection from './AccountConnectionsSection';
import PricingSection from './PricingSection';
import { Agent } from '../page';
import { useAuth } from '@/contexts/AuthContext';

interface MobileViewProps {
  isDark: boolean;
  toggleTheme: () => void;
  customAgents: Agent[];
  onAgentSelect: (agent: Agent) => void;
  onCreateAgent: () => void;
  onEditAgent: (agent: Agent) => void;
  onDeleteAgent: (agentId: string) => void;
  onSelectPackage: (packageType: 'trial' | 'agent' | 'corporate') => void;
  onLoginClick: () => void;
}

const featureItems = [
  { icon: 'ri-medal-line', label: 'مدربون ومتخصصون' },
  { icon: 'ri-time-line', label: 'متاحون 24/7' },
  { icon: 'ri-check-double-line', label: 'سريعون وفعّالون' },
  { icon: 'ri-money-dollar-circle-line', label: 'موفرون للتكاليف' },
  { icon: 'ri-moon-line', label: 'يعملون تلقائياً' },
];

export default function MobileView({
  isDark,
  toggleTheme,
  customAgents,
  onAgentSelect,
  onCreateAgent,
  onEditAgent,
  onDeleteAgent,
  onSelectPackage,
  onLoginClick,
}: MobileViewProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const isRTL = i18n.language === 'ar';

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            {/* Hero */}
            <div className="px-4 pt-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <span
                  className={`inline-flex items-center gap-2 font-mono text-xs px-4 py-1.5 rounded-full ${
                    isDark ? 'text-teal-300/80 bg-teal-500/10' : 'text-teal-600 bg-teal-50'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  {isRTL ? 'منصة الوكلاء الأذكياء' : 'Smart Agents Platform'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`font-mono text-2xl font-normal leading-tight mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isRTL ? 'وكيلك الذكي يعمل لك' : 'Your Smart Agent Works For You'}
                <br />
                <span
                  className={`${
                    isDark
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                >
                  {isRTL ? '24/7 بدون توقف' : '24/7 Non-Stop'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`font-mono text-sm leading-relaxed mb-5 ${
                  isDark ? 'text-slate-200/80' : 'text-slate-600'
                }`}
              >
                {isRTL
                  ? 'فريق كامل من المتخصصين في جهاز واحد • بدون إجازات • بدون أخطاء • بسعر كوب قهوة'
                  : 'Full Team of Specialists in One Device • No Vacations • No Errors • Coffee Price'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-full blur-3xl ${
                      isDark
                        ? 'bg-gradient-to-br from-teal-500/25 via-violet-500/20 to-emerald-500/25'
                        : 'bg-gradient-to-br from-teal-300/40 via-violet-300/30 to-emerald-300/40'
                    }`}
                    style={{ transform: 'scale(1.15)' }}
                  ></div>
                  <div
                    className={`relative w-44 h-44 rounded-full overflow-hidden border-4 ${
                      isDark ? 'border-[#2e2a50]/80 bg-[#1a1a2e]' : 'border-white/90 bg-white'
                    } shadow-2xl`}
                  >
                    <img
                      src="https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/9e61855c937a2e9676d3716a71bb399c.png"
                      alt="وكيل ذكاء اصطناعي"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute -top-2 -right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg text-xs font-mono font-bold ${
                      isDark ? 'bg-teal-500/90 text-white' : 'bg-teal-500 text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {isRTL ? 'متاح 24/7' : 'Available 24/7'}
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className={`absolute -bottom-2 -left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg text-xs font-mono font-bold ${
                      isDark
                        ? 'bg-[#2e2a50]/90 text-violet-300 border border-violet-500/30'
                        : 'bg-white text-violet-600 border border-violet-200'
                    }`}
                  >
                    <i className="ri-robot-line text-xs"></i>
                    AI Agent
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {featureItems.map((f, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs ${
                      isDark ? 'text-white/60' : 'text-gray-500'
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={`${f.icon} text-sm ${isDark ? 'text-teal-400/70' : 'text-teal-500/70'}`}></i>
                    </div>
                    <span>{f.label}</span>
                  </div>
                ))}
              </motion.div>

              <button
                onClick={() => setActiveTab('agents')}
                className="w-full py-3 rounded-xl font-mono font-bold text-base text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                {t('hero.cta')}
              </button>
            </div>

            <div className={`px-4 py-6 border-t ${isDark ? 'border-[#5a5490]/20' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-mono text-lg font-bold ${isDark ? 'text-[#9B8EC4]' : 'text-[#4a3a8e]'}`}>
                  {t('agents.title')}
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className={`font-mono text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>24/7</span>
                </div>
              </div>
              <AgentsGrid
                onAgentSelect={onAgentSelect}
                onCreateAgent={onCreateAgent}
                customAgents={customAgents}
                onEditAgent={onEditAgent}
                onDeleteAgent={onDeleteAgent}
              />
            </div>
          </div>
        );

      case 'agents':
        return (
          <div className="px-4 pt-6 pb-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-mono text-lg font-bold ${isDark ? 'text-[#9B8EC4]' : 'text-[#4a3a8e]'}`}>
                {t('agents.title')}
              </h2>
              <button
                onClick={onCreateAgent}
                className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                  isDark
                    ? 'bg-[#5a5490]/30 border-[#5a5490]/40 text-white/60 hover:text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-teal-600 hover:border-teal-300'
                }`}
              >
                <i className="ri-add-line text-sm"></i>
                إنشاء وكيل
              </button>
            </div>
            <AgentsGrid
              onAgentSelect={onAgentSelect}
              onCreateAgent={onCreateAgent}
              customAgents={customAgents}
              onEditAgent={onEditAgent}
              onDeleteAgent={onDeleteAgent}
            />
          </div>
        );

      case 'apps':
        return (
          <div className="pt-4 pb-24">
            <div className="px-4 mb-4">
              <h2 className={`font-mono text-lg font-bold ${isDark ? 'text-[#9B8EC4]' : 'text-[#4a3a8e]'}`}>
                التطبيقات المرتبطة
              </h2>
              <p className={`font-mono text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                اربط حساباتك بسهولة
              </p>
            </div>
            <AccountConnectionsSection />
          </div>
        );

      case 'pricing':
        return (
          <div className="pt-4 pb-24">
            <div className="px-4 mb-4">
              <h2 className={`font-mono text-lg font-bold ${isDark ? 'text-[#9B8EC4]' : 'text-[#4a3a8e]'}`}>
                الباقات والأسعار
              </h2>
              <p className={`font-mono text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                اختر الباقة المناسبة لك
              </p>
            </div>
            <PricingSection onSelectPackage={onSelectPackage} />
          </div>
        );

      case 'profile':
        return (
          <div className="px-4 pt-8 pb-24 text-center">
            {user ? (
              <div>
                <div
                  className={`w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden border-4 ${
                    isDark ? 'border-[#2e2a50]/80' : 'border-white/90'
                  } shadow-xl`}
                >
                  <img
                    src="https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/9e61855c937a2e9676d3716a71bb399c.png"
                    alt="الملف الشخصي"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className={`font-mono text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {user.email}
                </h2>
                <p className={`font-mono text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  مرحباً بك في وكيلي
                </p>
              </div>
            ) : (
              <div>
                <div
                  className={`w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden border-4 ${
                    isDark ? 'border-[#2e2a50]/80' : 'border-white/90'
                  } shadow-xl`}
                >
                  <img
                    src="https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/9e61855c937a2e9676d3716a71bb399c.png"
                    alt="وكيلي AI"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className={`font-mono text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  الملف الشخصي
                </h2>
                <p className={`font-mono text-sm mb-6 leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  سجل دخولك للوصول لملفك الشخصي<br />وجميع الخدمات
                </p>
                <button
                  onClick={onLoginClick}
                  className="px-6 py-2.5 rounded-md font-mono font-bold text-sm text-white bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg active:scale-95 transition-all whitespace-nowrap"
                >
                  {t('auth.login')}
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#131720]' : 'bg-stone-50'
      }`}
    >
      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-700 bg-gradient-to-br ${
          isDark ? 'from-[#131720] via-[#161a24] to-[#141822]' : 'from-stone-100 via-slate-50 to-zinc-100/80'
        }`}
      >
        <div
          className={`absolute top-[-8%] right-[-6%] w-[300px] h-[300px] rounded-full blur-[100px] ${
            isDark ? 'bg-teal-400/10' : 'bg-teal-300/25'
          }`}
        ></div>
        <div
          className={`absolute bottom-[-8%] left-[-6%] w-[280px] h-[280px] rounded-full blur-[90px] ${
            isDark ? 'bg-cyan-400/8' : 'bg-cyan-300/20'
          }`}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.6,
          }}
        ></div>
      </div>

      <MobileHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <div className="relative z-10 pt-16 pb-16">
        {renderContent()}
      </div>

      <MobileNavBar activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />
    </div>
  );
}
