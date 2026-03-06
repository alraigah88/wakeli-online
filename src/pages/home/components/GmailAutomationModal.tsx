import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';

interface GmailAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  category: 'work' | 'personal' | 'important' | 'promotions';
  timestamp: string;
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'manager@company.com',
    subject: 'تقرير الأداء الشهري',
    preview: 'مرفق تقرير الأداء لشهر ديسمبر...',
    category: 'work',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    from: 'noreply@amazon.com',
    subject: 'عرض خاص: خصم 50%',
    preview: 'لا تفوت عروضنا الحصرية...',
    category: 'promotions',
    timestamp: '9:15 AM',
  },
  {
    id: '3',
    from: 'friend@gmail.com',
    subject: 'دعوة لحفل العشاء',
    preview: 'هل أنت متاح يوم الجمعة القادم؟',
    category: 'personal',
    timestamp: '8:45 AM',
  },
  {
    id: '4',
    from: 'ceo@company.com',
    subject: 'اجتماع طارئ - مهم',
    preview: 'يرجى الحضور للاجتماع الطارئ...',
    category: 'important',
    timestamp: 'Yesterday',
  },
  {
    id: '5',
    from: 'team@project.com',
    subject: 'تحديث المشروع',
    preview: 'تم إنجاز المرحلة الثانية بنجاح...',
    category: 'work',
    timestamp: 'Yesterday',
  },
  {
    id: '6',
    from: 'newsletter@tech.com',
    subject: 'أحدث أخبار التقنية',
    preview: 'اشترك في نشرتنا الإخبارية...',
    category: 'promotions',
    timestamp: '2 days ago',
  },
  {
    id: '7',
    from: 'family@gmail.com',
    subject: 'صور العطلة',
    preview: 'شاهد صور رحلتنا الأخيرة...',
    category: 'personal',
    timestamp: '2 days ago',
  },
  {
    id: '8',
    from: 'hr@company.com',
    subject: 'تحديث السياسات - مهم',
    preview: 'تم تحديث سياسات الشركة...',
    category: 'important',
    timestamp: '3 days ago',
  },
];

const categoryColors = {
  work: { bg: '#14b8a6', light: '#14b8a620', border: '#14b8a640', name: 'عمل', nameEn: 'Work', icon: 'ri-briefcase-line' },
  personal: { bg: '#10b981', light: '#10b98120', border: '#10b98140', name: 'شخصي', nameEn: 'Personal', icon: 'ri-user-heart-line' },
  important: { bg: '#ef4444', light: '#ef444420', border: '#ef444440', name: 'مهم', nameEn: 'Important', icon: 'ri-star-line' },
  promotions: { bg: '#f59e0b', light: '#f59e0b20', border: '#f59e0b40', name: 'إعلانات', nameEn: 'Promotions', icon: 'ri-megaphone-line' },
};

export default function GmailAutomationModal({ isOpen, onClose }: GmailAutomationModalProps) {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === 'ar';

  const [step, setStep] = useState<'connect' | 'analyzing' | 'results'>('connect');
  const [progress, setProgress] = useState(0);
  const [categorizedEmails, setCategorizedEmails] = useState<Email[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (step === 'analyzing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCategorizedEmails(mockEmails);
              setStep('results');
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleConnect = () => {
    setStep('analyzing');
    setProgress(0);
  };

  const handleReset = () => {
    setStep('connect');
    setProgress(0);
    setCategorizedEmails([]);
    setSelectedCategory('all');
  };

  const getCategoryCounts = () => {
    return {
      work: categorizedEmails.filter((e) => e.category === 'work').length,
      personal: categorizedEmails.filter((e) => e.category === 'personal').length,
      important: categorizedEmails.filter((e) => e.category === 'important').length,
      promotions: categorizedEmails.filter((e) => e.category === 'promotions').length,
    };
  };

  const filteredEmails =
    selectedCategory === 'all'
      ? categorizedEmails
      : categorizedEmails.filter((e) => e.category === selectedCategory);

  if (!isOpen) return null;

  return (
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
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <i className="ri-mail-line text-2xl text-white"></i>
            </div>
            <div>
              <h2
                className={`font-mono text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {isArabic ? 'أتمتة Gmail' : 'Gmail Automation'}
              </h2>
              <p
                className={`font-mono text-base ${
                  isDark ? 'text-slate-300' : 'text-gray-700'
                }`}
              >
                {isArabic ? 'تصنيف وترتيب الإيميلات تلقائياً' : 'Auto-classify and organize emails'}
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
          className={`p-8 overflow-y-auto max-h-[calc(90vh-80px)] ${
            isDark ? 'bg-[#1e1a40]' : 'bg-gray-50'
          }`}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Connect */}
            {step === 'connect' && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <i className="ri-mail-line text-5xl text-white"></i>
                </div>

                <h3
                  className={`font-mono text-2xl md:text-3xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {isArabic ? 'اربط حساب Gmail الخاص بك' : 'Connect Your Gmail Account'}
                </h3>

                <p
                  className={`font-mono text-lg mb-8 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  {isArabic
                    ? 'سيقوم الوكيل بتحليل صندوق الوارد وتصنيف الإيميلات تلقائياً إلى: عمل، شخصي، مهم، وإعلانات'
                    : 'The agent will analyze your inbox and automatically categorize emails into: Work, Personal, Important, and Promotions'}
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    {
                      icon: 'ri-folder-line',
                      title: isArabic ? 'تصنيف ذكي' : 'Smart Classification',
                      desc: isArabic ? 'تصنيف تلقائي حسب المحتوى' : 'Auto-classify by content',
                    },
                    {
                      icon: 'ri-time-line',
                      title: isArabic ? 'توفير الوقت' : 'Save Time',
                      desc: isArabic ? 'لا حاجة للتصنيف اليدوي' : 'No manual sorting needed',
                    },
                    {
                      icon: 'ri-shield-check-line',
                      title: isArabic ? 'آمن ومشفر' : 'Secure & Encrypted',
                      desc: isArabic ? 'بياناتك محمية بالكامل' : 'Your data is fully protected',
                    },
                    {
                      icon: 'ri-refresh-line',
                      title: isArabic ? 'تحديث مستمر' : 'Continuous Updates',
                      desc: isArabic ? 'مزامنة تلقائية دائمة' : 'Always auto-synced',
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? 'bg-[#3a3568]/40 border-[#5a5490]/30'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <i
                        className={`${feature.icon} text-3xl mb-2`}
                        style={{ color: '#ea4335' }}
                      ></i>
                      <h4
                        className={`font-mono font-bold text-base mb-1 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {feature.title}
                      </h4>
                      <p
                        className={`font-mono text-base ${
                          isDark ? 'text-slate-300' : 'text-gray-700'
                        }`}
                      >
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Connect Button */}
                <button
                  onClick={handleConnect}
                  className="px-8 py-4 rounded-xl font-mono font-bold text-lg text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all hover:scale-105 shadow-lg cursor-pointer whitespace-nowrap flex items-center gap-3 mx-auto"
                >
                  <i className="ri-google-fill text-2xl"></i>
                  {isArabic ? 'ربط حساب Gmail' : 'Connect Gmail Account'}
                </button>

                <p
                  className={`font-mono text-sm mt-4 ${
                    isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}
                >
                  {isArabic
                    ? '🔒 هذا عرض تجريبي — لن يتم الوصول لحسابك الحقيقي'
                    : '🔒 This is a demo — your real account will not be accessed'}
                </p>
              </motion.div>
            )}

            {/* Step 2: Analyzing */}
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
                  <i className="ri-mail-line text-5xl text-white"></i>
                </div>

                <h3
                  className={`font-mono text-2xl md:text-3xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {isArabic ? 'جاري تحليل صندوق الوارد...' : 'Analyzing Inbox...'}
                </h3>

                <p
                  className={`font-mono text-lg mb-8 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  {isArabic
                    ? 'الوكيل يقوم بقراءة وتصنيف إيميلاتك الآن'
                    : 'Agent is reading and categorizing your emails now'}
                </p>

                {/* Progress Bar */}
                <div
                  className={`w-full h-4 rounded-full overflow-hidden mb-4 ${
                    isDark ? 'bg-[#3a3568]/60' : 'bg-gray-200'
                  }`}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <p
                  className={`font-mono text-2xl font-bold mb-8 ${
                    isDark ? 'text-teal-400' : 'text-teal-600'
                  }`}
                >
                  {progress}%
                </p>

                {/* Loading Steps */}
                <div className="space-y-3">
                  {[
                    { text: isArabic ? 'الاتصال بـ Gmail...' : 'Connecting to Gmail...', threshold: 0 },
                    { text: isArabic ? 'قراءة الإيميلات...' : 'Reading emails...', threshold: 30 },
                    { text: isArabic ? 'تحليل المحتوى...' : 'Analyzing content...', threshold: 60 },
                    { text: isArabic ? 'تصنيف الإيميلات...' : 'Categorizing emails...', threshold: 80 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: progress >= item.threshold ? 1 : 0.3,
                        x: 0,
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isDark ? 'bg-[#3a3568]/40' : 'bg-white'
                      }`}
                    >
                      {progress >= item.threshold ? (
                        <i className="ri-checkbox-circle-fill text-2xl text-green-500"></i>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400 animate-spin border-t-transparent"></div>
                      )}
                      <span
                        className={`font-mono text-base ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Object.entries(getCategoryCounts()).map(([category, count]) => {
                    const cat = categoryColors[category as keyof typeof categoryColors];
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCategory === category
                            ? isDark
                              ? 'border-opacity-60 shadow-lg'
                              : 'border-opacity-60 shadow-lg'
                            : isDark
                            ? 'border-opacity-20 hover:border-opacity-40'
                            : 'border-opacity-20 hover:border-opacity-40'
                        }`}
                        style={{
                          backgroundColor: isDark ? cat.light : cat.light,
                          borderColor: cat.border,
                        }}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <i className={`${cat.icon} text-2xl`} style={{ color: cat.bg }}></i>
                          <span
                            className="font-mono text-2xl font-bold"
                            style={{ color: cat.bg }}
                          >
                            {count}
                          </span>
                        </div>
                        <p
                          className={`font-mono text-base font-bold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {isArabic ? cat.name : cat.nameEn}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl font-mono text-base font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? isDark
                          ? 'bg-teal-500 text-white'
                          : 'bg-teal-500 text-white'
                        : isDark
                        ? 'bg-[#3a3568]/40 text-slate-300 hover:bg-[#3a3568]/60'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isArabic ? 'الكل' : 'All'} ({categorizedEmails.length})
                  </button>
                  {Object.entries(categoryColors).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-4 py-2 rounded-xl font-mono text-base font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                        selectedCategory === key
                          ? 'text-white'
                          : isDark
                          ? 'bg-[#3a3568]/40 text-slate-300 hover:bg-[#3a3568]/60'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === key ? cat.bg : undefined,
                      }}
                    >
                      <i className={cat.icon}></i>
                      {isArabic ? cat.name : cat.nameEn}
                    </button>
                  ))}
                </div>

                {/* Emails List */}
                <div className="space-y-3 mb-6">
                  {filteredEmails.map((email, i) => {
                    const cat = categoryColors[email.category];
                    return (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-xl border-2 ${
                          isDark
                            ? 'bg-[#3a3568]/40 border-[#5a5490]/30 hover:border-[#5a5490]/50'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        } transition-all cursor-pointer`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="px-3 py-1 rounded-lg flex items-center gap-2"
                                style={{ backgroundColor: cat.light }}
                              >
                                <i className={`${cat.icon} text-sm`} style={{ color: cat.bg }}></i>
                                <span
                                  className="font-mono text-sm font-bold"
                                  style={{ color: cat.bg }}
                                >
                                  {isArabic ? cat.name : cat.nameEn}
                                </span>
                              </div>
                              <span
                                className={`font-mono text-sm ${
                                  isDark ? 'text-slate-400' : 'text-gray-600'
                                }`}
                              >
                                {email.timestamp}
                              </span>
                            </div>
                            <p
                              className={`font-mono text-base mb-1 ${
                                isDark ? 'text-slate-300' : 'text-gray-700'
                              }`}
                            >
                              {email.from}
                            </p>
                            <h4
                              className={`font-mono text-lg font-bold mb-1 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {email.subject}
                            </h4>
                            <p
                              className={`font-mono text-base ${
                                isDark ? 'text-slate-300' : 'text-gray-700'
                              }`}
                            >
                              {email.preview}
                            </p>
                          </div>
                          <i
                            className={`ri-mail-line text-2xl ${
                              isDark ? 'text-slate-600' : 'text-gray-400'
                            }`}
                          ></i>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className={`px-6 py-3 rounded-xl font-mono font-bold text-base transition-all cursor-pointer whitespace-nowrap ${
                      isDark
                        ? 'bg-[#3a3568]/60 text-white hover:bg-[#3a3568]/80'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <i className="ri-refresh-line text-lg me-2"></i>
                    {isArabic ? 'إعادة التجربة' : 'Try Again'}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl font-mono font-bold text-base text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all hover:scale-105 shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    {isArabic ? 'رائع! أغلق' : 'Great! Close'}
                  </button>
                </div>

                <p
                  className={`font-mono text-base text-center mt-6 ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  {isArabic
                    ? '💡 هذا عرض تجريبي — للحصول على الأتمتة الحقيقية، قم بالترقية للباقة المدفوعة'
                    : '💡 This is a demo — for real automation, upgrade to a paid plan'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}