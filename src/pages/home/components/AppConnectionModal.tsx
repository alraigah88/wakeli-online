import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';

interface AppConnectionModalProps {
  app: {
    id: string;
    name: string;
    nameAr: string;
    logoUrl: string;
    color: string;
    description: string;
    descriptionAr: string;
    isConnected: boolean;
    status: 'available' | 'coming-soon';
    benefits: string[];
    benefitsAr: string[];
    tools: string[];
    toolsAr: string[];
    howItWorks: string[];
    howItWorksAr: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AppConnectionModal({ app, isOpen, onClose, onConfirm }: AppConnectionModalProps) {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const isRTL = i18n.language === 'ar';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
            isDark ? 'bg-[#2a2458]' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              isDark ? 'bg-[#2a2458] border-[#5a5490]/30' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${app.color}20` }}
              >
                <img
                  src={app.logoUrl}
                  alt={app.name}
                  className="w-9 h-9 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'font-bold text-2xl';
                      fallback.style.color = app.color;
                      fallback.textContent = app.name.charAt(0);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <div>
                <h2
                  className={`font-mono text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {isRTL ? app.nameAr : app.name}
                </h2>
                <p
                  className={`font-mono text-base ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  {isRTL ? app.descriptionAr : app.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Content */}
          <div
            className={`p-8 overflow-y-auto max-h-[calc(90vh-160px)] ${
              isDark ? 'bg-[#1e1a40]' : 'bg-gray-50'
            }`}
          >
            {/* Benefits Section */}
            <div className="mb-8">
              <h3
                className={`font-mono text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <i className="ri-star-line text-2xl" style={{ color: app.color }}></i>
                {isRTL ? 'الفوائد' : 'Benefits'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(isRTL ? app.benefitsAr : app.benefits).map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      isDark
                        ? 'bg-[#3a3568]/40 border-[#5a5490]/30'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <i
                        className="ri-checkbox-circle-fill text-xl flex-shrink-0 mt-0.5"
                        style={{ color: app.color }}
                      ></i>
                      <p
                        className={`font-mono text-base ${
                          isDark ? 'text-slate-300' : 'text-gray-700'
                        }`}
                      >
                        {benefit}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tools Section */}
            <div className="mb-8">
              <h3
                className={`font-mono text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <i className="ri-tools-line text-2xl" style={{ color: app.color }}></i>
                {isRTL ? 'الأدوات المستخدمة' : 'Tools Used'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {(isRTL ? app.toolsAr : app.tools).map((tool, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`px-4 py-2 rounded-xl border ${
                      isDark
                        ? 'bg-[#3a3568]/40 border-[#5a5490]/30'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <span
                      className={`font-mono text-base font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {tool}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-6">
              <h3
                className={`font-mono text-xl font-bold mb-4 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <i className="ri-lightbulb-line text-2xl" style={{ color: app.color }}></i>
                {isRTL ? 'كيف يعمل؟' : 'How It Works'}
              </h3>
              <div className="space-y-3">
                {(isRTL ? app.howItWorksAr : app.howItWorks).map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-4 p-4 rounded-xl border ${
                      isDark
                        ? 'bg-[#3a3568]/40 border-[#5a5490]/30'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div
                      className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-mono font-bold text-white"
                      style={{ backgroundColor: app.color }}
                    >
                      {i + 1}
                    </div>
                    <p
                      className={`font-mono text-base ${
                        isDark ? 'text-slate-300' : 'text-gray-700'
                      }`}
                    >
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Security Note */}
            <div
              className={`p-4 rounded-xl border-2 ${
                isDark
                  ? 'bg-teal-500/10 border-teal-500/30'
                  : 'bg-teal-50 border-teal-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <i className="ri-shield-check-line text-2xl text-teal-500 flex-shrink-0"></i>
                <div>
                  <h4
                    className={`font-mono text-base font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {isRTL ? '🔒 آمن ومشفر' : '🔒 Secure & Encrypted'}
                  </h4>
                  <p
                    className={`font-mono text-base ${
                      isDark ? 'text-slate-300' : 'text-gray-700'
                    }`}
                  >
                    {isRTL
                      ? 'جميع بياناتك محمية بتشفير من الدرجة العسكرية. يمكنك قطع الاتصال في أي وقت.'
                      : 'All your data is protected with military-grade encryption. You can disconnect at any time.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`flex items-center justify-between px-8 py-4 border-t ${
              isDark ? 'bg-[#2a2458] border-[#5a5490]/30' : 'bg-white border-gray-200'
            }`}
          >
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-mono font-bold text-base transition-all cursor-pointer whitespace-nowrap ${
                isDark
                  ? 'bg-[#3a3568]/60 text-white hover:bg-[#3a3568]/80'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>

            {app.status === 'coming-soon' ? (
              <div
                className={`px-6 py-3 rounded-xl font-mono font-bold text-base ${
                  isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                }`}
              >
                {isRTL ? '🔜 قريباً' : '🔜 Coming Soon'}
              </div>
            ) : (
              <button
                onClick={onConfirm}
                className="px-6 py-3 rounded-xl font-mono font-bold text-base text-white transition-all hover:scale-105 shadow-lg cursor-pointer whitespace-nowrap"
                style={{
                  background: `linear-gradient(135deg, ${app.color}, ${app.color}dd)`,
                }}
              >
                {app.isConnected
                  ? isRTL
                    ? 'قطع الاتصال'
                    : 'Disconnect'
                  : isRTL
                  ? 'ربط الآن'
                  : 'Connect Now'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}