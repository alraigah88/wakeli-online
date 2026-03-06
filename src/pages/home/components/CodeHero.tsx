import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../page';
import { useAuth } from '../../../contexts/AuthContext';
import AuthModal from '../../../components/feature/AuthModal';

interface CodeHeroProps {
  onStartMeetingClick: () => void;
}

const featureItems = [
  { icon: 'ri-medal-line', key: 'trained' },
  { icon: 'ri-time-line', key: 'available' },
  { icon: 'ri-check-double-line', key: 'efficient' },
  { icon: 'ri-money-dollar-circle-line', key: 'cost' },
  { icon: 'ri-moon-line', key: 'autopilot' },
];

export default function CodeHero({ onStartMeetingClick }: CodeHeroProps) {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const isRTL = i18n.language === 'ar';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed', err);
    } finally {
      setShowUserMenu(false);
    }
  };

  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom(prev => {
      const next = Math.min(prev + 10, 150);
      document.documentElement.style.zoom = `${next}%`;
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const next = Math.max(prev - 10, 70);
      document.documentElement.style.zoom = `${next}%`;
      return next;
    });
  };

  return (
    <header className="pt-4 md:pt-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <a
            href="/"
            className="cursor-pointer transition-opacity hover:opacity-80 flex items-center gap-3"
          >
            <img
              src="https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d4a98132b4c7bfb8a15b56d046ddf8d5.png"
              alt="وكيلي AI"
              className="h-20 w-20 object-contain rounded-full"
            />
            <span
              className={`font-mono text-2xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              وكيلي <span className={isDark ? 'text-teal-400' : 'text-teal-500'}>AI</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div
              className={`hidden md:flex items-center gap-0 rounded-md overflow-hidden border transition-all ${
                isDark
                  ? 'bg-[#5a5490]/30 border-[#5a5490]/40'
                  : 'bg-white/80 border-gray-200'
              }`}
            >
              <button
                onClick={handleZoomOut}
                className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-colors ${
                  isDark
                    ? 'text-white/50 hover:text-white hover:bg-[#5a5490]/50'
                    : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
                } ${zoom <= 70 ? 'opacity-30 pointer-events-none' : ''}`}
              >
                <i className="ri-subtract-line text-sm"></i>
              </button>
              <span
                className={`font-mono text-[10px] px-1 min-w-[32px] text-center select-none ${
                  isDark ? 'text-white/40' : 'text-gray-400'
                }`}
              >
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-colors ${
                  isDark
                    ? 'text-white/50 hover:text-white hover:bg-[#5a5490]/50'
                    : 'text-gray-500 hover:text-violet-600 hover:bg-violet-50'
                } ${zoom >= 150 ? 'opacity-30 pointer-events-none' : ''}`}
              >
                <i className="ri-add-line text-sm"></i>
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap border ${
                isDark
                  ? 'bg-[#5a5490]/30 border-[#5a5490]/40 text-white/60 hover:text-white hover:border-[#7a74b0]'
                  : 'bg-white/80 border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-300'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i
                  className={`${
                    isDark ? 'ri-sun-line' : 'ri-moon-line'
                  } text-sm`}
                ></i>
              </div>
            </button>

            <button
              onClick={toggleLanguage}
              className={`font-mono text-xs px-3 md:px-4 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap border ${
                isDark
                  ? 'bg-[#5a5490]/30 border-[#5a5490]/40 text-white/60 hover:text-white hover:border-[#7a74b0]'
                  : 'bg-white/80 border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-300'
              }`}
            >
              {t('langSwitch')}
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-8 md:py-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Left: Text Content */}
            <div className="flex-1 text-center md:text-start">
              {/* Small tag */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
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

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`font-mono text-2xl sm:text-3xl md:text-4xl font-normal leading-tight mb-3 ${
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

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className={`font-mono text-base md:text-lg leading-relaxed max-w-2xl mb-6 ${
                  isDark ? 'text-slate-200/80' : 'text-slate-800'
                }`}
              >
                {isRTL
                  ? 'فريق كامل من المتخصصين في جهاز واحد • بدون إجازات • بدون أخطاء • بسعر كوب قهوة'
                  : 'Full Team of Specialists in One Device • No Vacations • No Errors • Coffee Price'}
              </motion.p>

              {/* Features badges */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                  {featureItems.map((f, idx) => (
                    <motion.div
                      key={f.key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.08, duration: 0.3 }}
                      className={`group flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base font-mono cursor-default transition-all duration-300 ${
                        isDark
                          ? 'text-white/60 hover:text-white/80'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                        <i
                          className={`${f.icon} text-base md:text-lg ${
                            isDark ? 'text-teal-400/70' : 'text-teal-600'
                          }`}
                        ></i>
                      </div>
                      <span className="font-medium">
                        {t(`features.${f.key}.title`)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: AI Agent Image */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <div className="relative">
                {/* Glow ring behind image */}
                <div
                  className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
                    isDark
                      ? 'bg-gradient-to-br from-teal-500/25 via-violet-500/20 to-emerald-500/25'
                      : 'bg-gradient-to-br from-teal-300/40 via-violet-300/30 to-emerald-300/40'
                  }`}
                  style={{ transform: 'scale(1.15)' }}
                ></div>

                {/* Animated border ring */}
                <div
                  className={`absolute inset-0 rounded-full p-[3px] ${
                    isDark
                      ? 'bg-gradient-to-br from-teal-400/60 via-violet-400/40 to-emerald-400/60'
                      : 'bg-gradient-to-br from-teal-400/80 via-violet-400/60 to-emerald-400/80'
                  }`}
                  style={{ borderRadius: '50%' }}
                ></div>

                {/* Image container */}
                <div
                  className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 ${
                    isDark ? 'border-[#2e2a50]/80 bg-[#1a1a2e]' : 'border-white/90 bg-white'
                  } shadow-2xl`}
                >
                  <img
                    src="https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/9e61855c937a2e9676d3716a71bb399c.png"
                    alt="وكيل ذكاء اصطناعي"
                    className="w-full h-full object-cover object-top"
                    draggable={false}
                  />
                </div>

                {/* Floating badge - top */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className={`absolute -top-3 ${isRTL ? '-left-4' : '-right-4'} flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-xs font-mono font-bold ${
                    isDark
                      ? 'bg-teal-500/90 text-white'
                      : 'bg-teal-500 text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  {isRTL ? 'متاح 24/7' : 'Available 24/7'}
                </motion.div>

                {/* Floating badge - bottom */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className={`absolute -bottom-3 ${isRTL ? '-right-4' : '-left-4'} flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-xs font-mono font-bold ${
                    isDark
                      ? 'bg-[#2e2a50]/90 text-violet-300 border border-violet-500/30'
                      : 'bg-white text-violet-600 border border-violet-200'
                  }`}
                >
                  <i className="ri-robot-line text-sm"></i>
                  {isRTL ? 'AI Agent' : 'AI Agent'}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isDark={isDark}
      />
    </header>
  );
}
