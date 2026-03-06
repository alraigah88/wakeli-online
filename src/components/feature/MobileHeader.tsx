
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from './AuthModal';

interface MobileHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function MobileHeader({ isDark, onToggleTheme }: MobileHeaderProps) {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isRTL = i18n.language === 'ar';

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b transition-colors duration-300 ${
          isDark
            ? 'bg-[#131720]/95 border-[#5a5490]/20 backdrop-blur-xl'
            : 'bg-white/95 border-gray-200/60 backdrop-blur-xl shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo - نفس الموقع */}
          <a href="/" className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d4a98132b4c7bfb8a15b56d046ddf8d5.png"
              alt="وكيلي AI"
              className="h-10 w-10 object-contain rounded-full"
            />
            <span
              className={`font-mono text-lg font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              وكيلي <span className={isDark ? 'text-teal-400' : 'text-teal-500'}>AI</span>
            </span>
          </a>

          {/* Buttons - نفس الموقع */}
          <div className="flex items-center gap-1.5">
            {/* Auth Button */}
            <div className="relative">
              <button
                onClick={handleAuthClick}
                className={`flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap border ${
                  isDark
                    ? 'bg-[#5a5490]/30 border-[#5a5490]/40 text-white/60 hover:text-white hover:border-[#7a74b0]'
                    : 'bg-white/80 border-gray-200 text-gray-500 hover:text-teal-600 hover:border-teal-300'
                }`}
              >
                {isAuthenticated ? (
                  <>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-4 h-4 rounded-full" />
                    ) : (
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-user-line text-xs"></i>
                      </div>
                    )}
                    <span className="max-w-[70px] truncate">{user?.fullName || user?.email}</span>
                    <i className="ri-arrow-down-s-line text-xs"></i>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-login-box-line text-xs"></i>
                    </div>
                    <span>{t('auth.registerNow')}</span>
                  </>
                )}
              </button>

              {/* User Dropdown */}
              {isAuthenticated && showUserMenu && (
                <div
                  className={`absolute top-full mt-1 ${isRTL ? 'left-0' : 'right-0'} min-w-[180px] rounded-lg border overflow-hidden shadow-lg z-50 ${
                    isDark ? 'bg-[#3a3568] border-[#5a5490]/40' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`px-3 py-2 border-b ${isDark ? 'border-[#5a5490]/20' : 'border-gray-100'}`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.fullName}</p>
                    <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{user?.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer ${
                      isDark ? 'text-white/60 hover:text-white hover:bg-[#5a5490]/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <i className="ri-logout-box-line"></i>
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer border ${
                isDark
                  ? 'bg-[#5a5490]/30 border-[#5a5490]/40 text-white/60 hover:text-white'
                  : 'bg-white/80 border-gray-200 text-gray-500 hover:text-teal-600'
              }`}
            >
              <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} text-sm`}></i>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`font-mono text-xs px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap border ${
                isDark
                  ? 'bg-[#5a5490]/30 border-[#5a5490]/40 text-white/60 hover:text-white hover:border-[#7a74b0]'
                  : 'bg-white/80 border-gray-200 text-gray-500 hover:text-teal-600 hover:border-teal-300'
              }`}
            >
              {t('langSwitch')}
            </button>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          isDark={isDark}
        />
      )}
    </>
  );
}
