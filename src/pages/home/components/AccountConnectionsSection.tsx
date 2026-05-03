import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import AppConnectionModal from './AppConnectionModal';
import { useIntegrations } from '../../../hooks/useIntegrations';
import { useAuth } from '../../../contexts/AuthContext';

interface AppConnection {
  id: string;
  name: string;
  logoUrl: string;
  category: string;
  status: 'available' | 'coming-soon';
}

export default function AccountConnectionsSection() {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { userStatusByKey, setStatus } = useIntegrations(user?.id);
  const isRTL = i18n.language === 'ar';
  const [selectedApp, setSelectedApp] = useState<AppConnection | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAllApps, setShowAllApps] = useState(false);

  const categories = [
    { id: 'all', nameAr: 'جميع التطبيقات', nameEn: 'All Apps' },
    { id: 'productivity', nameAr: 'الإنتاجية', nameEn: 'Productivity' },
    { id: 'communication', nameAr: 'التواصل', nameEn: 'Communication' },
    { id: 'marketing', nameAr: 'التسويق', nameEn: 'Marketing' },
    { id: 'technical', nameAr: 'التقني', nameEn: 'Technical' },
    { id: 'finance', nameAr: 'المالي', nameEn: 'Finance' },
  ];

  const allApps = useMemo<AppConnection[]>(() => [
    { id: 'gmail', name: 'Gmail', category: 'communication', logoUrl: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png', status: 'available' },
    { id: 'google-calendar', name: 'Google Calendar', category: 'productivity', logoUrl: 'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png', status: 'available' },
    { id: 'notion', name: 'Notion', category: 'productivity', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', status: 'available' },
    { id: 'slack', name: 'Slack', category: 'communication', logoUrl: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', status: 'available' },
    { id: 'discord', name: 'Discord', category: 'communication', logoUrl: 'https://cdn.worldvectorlogo.com/logos/discord-6.svg', status: 'available' },
    { id: 'telegram', name: 'Telegram', category: 'communication', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg', status: 'available' },
    { id: 'whatsapp', name: 'WhatsApp', category: 'communication', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', status: 'available' },
    { id: 'github', name: 'GitHub', category: 'technical', logoUrl: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg', status: 'available' },
    { id: 'trello', name: 'Trello', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/trello.svg', status: 'available' },
    { id: 'asana', name: 'Asana', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/asana-1.svg', status: 'available' },
    { id: 'zoom', name: 'Zoom', category: 'communication', logoUrl: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', status: 'available' },
    { id: 'google-drive', name: 'Google Drive', category: 'productivity', logoUrl: 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png', status: 'available' },
    { id: 'google-sheets', name: 'Google Sheets', category: 'productivity', logoUrl: 'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png', status: 'available' },
    { id: 'google-docs', name: 'Google Docs', category: 'productivity', logoUrl: 'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png', status: 'available' },
    { id: 'dropbox', name: 'Dropbox', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/dropbox-1.svg', status: 'available' },
    { id: 'figma', name: 'Figma', category: 'technical', logoUrl: 'https://cdn.worldvectorlogo.com/logos/figma-1.svg', status: 'available' },
    { id: 'hubspot', name: 'HubSpot', category: 'marketing', logoUrl: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg', status: 'available' },
    { id: 'salesforce', name: 'Salesforce', category: 'marketing', logoUrl: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg', status: 'available' },
    { id: 'jira', name: 'Jira', category: 'technical', logoUrl: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg', status: 'available' },
    { id: 'linear', name: 'Linear', category: 'technical', logoUrl: 'https://cdn.worldvectorlogo.com/logos/linear-1.svg', status: 'available' },
    { id: 'clickup', name: 'ClickUp', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/clickup.svg', status: 'available' },
    { id: 'monday', name: 'Monday', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/monday-1.svg', status: 'available' },
    { id: 'todoist', name: 'Todoist', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/todoist-2.svg', status: 'available' },
    { id: 'airtable', name: 'Airtable', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/airtable.svg', status: 'available' },
    { id: 'calendly', name: 'Calendly', category: 'productivity', logoUrl: 'https://cdn.worldvectorlogo.com/logos/calendly.svg', status: 'available' },
    { id: 'stripe', name: 'Stripe', category: 'finance', logoUrl: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', status: 'available' },
    { id: 'shopify', name: 'Shopify', category: 'marketing', logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg', status: 'available' },
    { id: 'paypal', name: 'PayPal', category: 'finance', logoUrl: 'https://cdn.worldvectorlogo.com/logos/paypal-3.svg', status: 'available' },
    { id: 'quickbooks', name: 'QuickBooks', category: 'finance', logoUrl: 'https://cdn.worldvectorlogo.com/logos/quickbooks-1.svg', status: 'available' },
    { id: 'xero', name: 'Xero', category: 'finance', logoUrl: 'https://cdn.worldvectorlogo.com/logos/xero.svg', status: 'available' },
  ], []);

  const filteredApps = useMemo(() => {
    if (activeCategory === 'all') return allApps;
    return allApps.filter(app => app.category === activeCategory);
  }, [activeCategory, allApps]);

  const handleConnect = async (app: AppConnection) => {
    try {
      const toolkitId = app.id.replace(/-/g, '');
      const response = await fetch(`/api/composio/connect?toolkit=${toolkitId}&userId=${user?.id || 'guest'}`);
      const data = await response.json();
      if (data.redirect_url) {
        window.open(data.redirect_url, '_blank');
      } else {
        alert(isRTL ? 'فشل في بدء عملية الربط' : 'Failed to start connection');
      }
    } catch (error) {
      alert(isRTL ? 'حدث خطأ أثناء الاتصال' : 'Error during connection');
    }
  };

  return (
    <section className={`py-16 px-4 ${isDark ? 'bg-gray-900' : 'bg-[#f0f7f7]'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-100 mb-6 shadow-sm">
            <i className="ri-links-line text-teal-500 text-sm"></i>
            <span className="text-teal-600 font-medium text-xs">{isRTL ? 'ربط الحسابات' : 'Connect Accounts'}</span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isRTL ? 'اربط حساباتك وابدأ الأتمتة' : 'Connect Your Accounts & Start Automating'}
          </h2>
          <p className={`text-lg mb-10 max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isRTL ? 'اربط تطبيقاتك المفضلة ودع الوكلاء يديرون مهامك تلقائياً' : 'Connect your favorite apps and let agents manage your tasks automatically'}
          </p>
          
          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-200/50'
                    : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                {isRTL ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => (
              <motion.button
                key={app.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedApp(app)}
                className={`relative w-14 h-14 rounded-xl flex items-center justify-center p-3 transition-all shadow-sm ${
                  isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-md'
                }`}
              >
                <img src={app.logoUrl} alt={app.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/124/124010.png'; }} />
              </motion.button>
            ))}
            {activeCategory === 'all' && (
              <motion.button
                layout
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowAllApps(true)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center font-medium text-sm transition-all border-2 border-dashed ${
                  isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                + 15
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Info Box */}
        <div className={`rounded-2xl p-8 shadow-sm border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'} max-w-4xl mx-auto`}>
          <div className="flex items-start gap-4">
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{isRTL ? 'كيف يعمل الربط؟' : 'How does it work?'}</h3>
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center"><i className="ri-information-line text-teal-600 text-xs"></i></div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {isRTL ? 'عند ربط حسابك، سيتمكن الوكلاء من الوصول إلى بياناتك بشكل آمن لتنفيذ المهام المطلوبة. جميع البيانات محمية ومشفرة، ويمكنك قطع الاتصال في أي وقت.' : 'When you connect your account, agents will securely access your data to perform required tasks. All data is protected and encrypted, and you can disconnect anytime.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {selectedApp && (
        <AppConnectionModal
          app={{
            ...selectedApp,
            benefits: isRTL ? ['أتمتة كاملة', 'مزامنة فورية'] : ['Full automation', 'Instant sync'],
            benefitsAr: ['أتمتة كاملة', 'مزامنة فورية'],
            tools: [selectedApp.name],
            toolsAr: [selectedApp.name],
            howItWorks: ['Connect', 'Authorize', 'Automate'],
            howItWorksAr: ['اربط', 'وافق', 'أتمتة']
          }}
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          onConfirm={() => {
            handleConnect(selectedApp);
            setSelectedApp(null);
          }}
        />
      )}
    </section>
  );
}
