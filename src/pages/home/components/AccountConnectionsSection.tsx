import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import AppConnectionModal from './AppConnectionModal';
import { useIntegrations } from '../../../hooks/useIntegrations';
import { useAuth } from '../../../contexts/AuthContext';

interface AppConnection {
  id: string;
  name: string;
  logoUrl: string;
  color: string;
  isConnected: boolean;
  status: 'available' | 'coming-soon';
  description: string;
  descriptionAr: string;
  benefits: string[];
  benefitsAr: string[];
  tools: string[];
  toolsAr: string[];
  howItWorks: string[];
  howItWorksAr: string[];
}

export default function AccountConnectionsSection() {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { userStatusByKey, setStatus } = useIntegrations(user?.id);
  const isRTL = i18n.language === 'ar';

  const [selectedApp, setSelectedApp] = useState<AppConnection | null>(null);

  const apps = useMemo<AppConnection[]>(() => [
    {
      id: 'zoom',
      name: 'Zoom',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Zoom_Video_Communications_logo.svg',
      color: '#2D8CFF',
      status: 'available',
      isConnected: userStatusByKey['zoom'] === 'connected',
      description: 'Video conferencing automation',
      descriptionAr: 'أتمتة اجتماعات الفيديو',
      benefits: ['Auto-schedule', 'Recording sync'],
      benefitsAr: ['جدولة تلقائية', 'مزامنة التسجيلات'],
      tools: ['Zoom API'],
      toolsAr: ['واجهة Zoom'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'discord',
      name: 'Discord',
      logoUrl: 'https://assets-global.website-files.com/6257adef93467e05d00d957d/6257adef93467e05d00d95a0_Discord-Logo%2BWordmark-Color.png',
      color: '#5865F2',
      status: 'available',
      isConnected: userStatusByKey['discord'] === 'connected',
      description: 'Community automation',
      descriptionAr: 'أتمتة المجتمع',
      benefits: ['Bot integration'],
      benefitsAr: ['ربط بوتات'],
      tools: ['Discord API'],
      toolsAr: ['واجهة Discord'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'telegram',
      name: 'Telegram',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      color: '#0088cc',
      status: 'available',
      isConnected: userStatusByKey['telegram'] === 'connected',
      description: 'Messaging automation',
      descriptionAr: 'أتمتة المراسلة',
      benefits: ['Bot commands'],
      benefitsAr: ['أوامر بوت'],
      tools: ['Telegram API'],
      toolsAr: ['واجهة Telegram'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'slack',
      name: 'Slack',
      logoUrl: 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png',
      color: '#4A154B',
      status: 'available',
      isConnected: userStatusByKey['slack'] === 'connected',
      description: 'Team communication',
      descriptionAr: 'تواصل الفريق',
      benefits: ['Message bots'],
      benefitsAr: ['بوتات رسائل'],
      tools: ['Slack API'],
      toolsAr: ['واجهة Slack'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'asana',
      name: 'Asana',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg',
      color: '#F06560',
      status: 'available',
      isConnected: userStatusByKey['asana'] === 'connected',
      description: 'Task management',
      descriptionAr: 'إدارة المهام',
      benefits: ['Auto-tasks'],
      benefitsAr: ['مهام تلقائية'],
      tools: ['Asana API'],
      toolsAr: ['واجهة Asana'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg',
      color: '#0061FF',
      status: 'available',
      isConnected: userStatusByKey['dropbox'] === 'connected',
      description: 'Cloud storage',
      descriptionAr: 'تخزين سحابي',
      benefits: ['File sync'],
      benefitsAr: ['مزامنة ملفات'],
      tools: ['Dropbox API'],
      toolsAr: ['واجهة Dropbox'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'trello',
      name: 'Trello',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/trello.svg',
      color: '#0052CC',
      status: 'available',
      isConnected: userStatusByKey['trello'] === 'connected',
      description: 'Project management',
      descriptionAr: 'إدارة المشاريع',
      benefits: ['Board automation'],
      benefitsAr: ['أتمتة لوحات'],
      tools: ['Trello API'],
      toolsAr: ['واجهة Trello'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'notion',
      name: 'Notion',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      color: '#000000',
      status: 'available',
      isConnected: userStatusByKey['notion'] === 'connected',
      description: 'Workspace automation',
      descriptionAr: 'أتمتة مساحة العمل',
      benefits: ['Page creation'],
      benefitsAr: ['إنشاء صفحات'],
      tools: ['Notion API'],
      toolsAr: ['واجهة Notion'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
      color: '#4285F4',
      status: 'available',
      isConnected: userStatusByKey['google_calendar'] === 'connected',
      description: 'Schedule automation',
      descriptionAr: 'أتمتة المواعيد',
      benefits: ['Auto-booking'],
      benefitsAr: ['حجز تلقائي'],
      tools: ['Calendar API'],
      toolsAr: ['واجهة التقويم'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
      color: '#0F9D58',
      status: 'available',
      isConnected: userStatusByKey['google_sheets'] === 'connected',
      description: 'Spreadsheet automation',
      descriptionAr: 'أتمتة الجداول',
      benefits: ['Data entry'],
      benefitsAr: ['إدخال بيانات'],
      tools: ['Sheets API'],
      toolsAr: ['واجهة Sheets'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
      color: '#34A853',
      status: 'available',
      isConnected: userStatusByKey['google_drive'] === 'connected',
      description: 'File storage',
      descriptionAr: 'تخزين الملفات',
      benefits: ['Auto-upload'],
      benefitsAr: ['رفع تلقائي'],
      tools: ['Drive API'],
      toolsAr: ['واجهة Drive'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg',
      color: '#4285F4',
      status: 'available',
      isConnected: userStatusByKey['google_docs'] === 'connected',
      description: 'Document automation',
      descriptionAr: 'أتمتة المستندات',
      benefits: ['Template creation'],
      benefitsAr: ['إنشاء قوالب'],
      tools: ['Docs API'],
      toolsAr: ['واجهة Docs'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      color: '#25D366',
      status: 'available',
      isConnected: userStatusByKey['whatsapp'] === 'connected',
      description: 'Messaging automation',
      descriptionAr: 'أتمتة المراسلة',
      benefits: ['Auto-reply'],
      benefitsAr: ['رد تلقائي'],
      tools: ['WhatsApp API'],
      toolsAr: ['واجهة WhatsApp'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
    {
      id: 'gmail',
      name: 'Gmail',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
      color: '#EA4335',
      status: 'available',
      isConnected: userStatusByKey['google_gmail'] === 'connected',
      description: 'Email automation',
      descriptionAr: 'أتمتة البريد',
      benefits: ['Smart sorting'],
      benefitsAr: ['تصنيف ذكي'],
      tools: ['Gmail API'],
      toolsAr: ['واجهة Gmail'],
      howItWorks: ['Connect', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط', 'وافق', 'أتمتة'],
    },
  ], [userStatusByKey]);

  const handleConnect = async (app: AppConnection) => {
    if (app.isConnected) {
      await setStatus(app.id, 'disconnected');
      return;
    }

    try {
      const toolkitId = app.id.replace(/-/g, '');
      const response = await fetch(`/api/composio/connect?toolkit=${toolkitId}&userId=${user?.id || 'guest'}`);
      const data = await response.json();
      
      if (data.redirect_url) {
        window.open(data.redirect_url, '_blank');
      } else {
        console.error('Failed to get redirect URL', data);
        alert(isRTL ? 'فشل في بدء عملية الربط' : 'Failed to start connection');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert(isRTL ? 'حدث خطأ أثناء الاتصال' : 'Error during connection');
    }
  };

  return (
    <section className={`py-16 px-4 ${isDark ? 'bg-gray-900' : 'bg-[#f0f7f7]'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-teal-100 mb-6 shadow-sm">
            <i className="ri-links-line text-teal-500 text-sm"></i>
            <span className="text-teal-600 font-medium text-xs">{isRTL ? 'ربط الحسابات' : 'Connect Accounts'}</span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isRTL ? 'اربط حساباتك وابدأ الأتمتة' : 'Connect Your Accounts & Start Automating'}
          </h2>
          
          <p className={`text-lg mb-10 max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isRTL 
              ? 'اربط تطبيقاتك المفضلة ودع الوكلاء يديرون مهامك تلقائياً'
              : 'Connect your favorite apps and let agents manage your tasks automatically'}
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button className="px-5 py-2 rounded-full font-medium bg-teal-500 text-white shadow-md shadow-teal-200/50">
              {isRTL ? 'جميع التطبيقات' : 'All Apps'}
            </button>
            {['الإنتاجية', 'التواصل', 'التسويق', 'التقني', 'المالي'].map((cat, idx) => (
              <button 
                key={idx}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  isDark
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Icons Grid - Compact & Square as per image */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-5xl mx-auto">
          {/* More Button */}
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-medium text-sm transition-all border-2 border-dashed ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-gray-500'
              : 'bg-white border-gray-200 text-gray-400'
          }`}>
            + 15
          </div>

          {/* App Icons */}
          {apps.map((app) => (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedApp(app)}
              className={`relative w-14 h-14 rounded-xl flex items-center justify-center p-3 transition-all shadow-sm ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:shadow-md'
              } ${app.isConnected ? 'ring-2 ring-teal-400' : ''}`}
            >
              <img
                src={app.logoUrl}
                alt={app.name}
                className="w-full h-full object-contain"
              />
            </motion.button>
          ))}
        </div>

        {/* Info Box - Exactly as image */}
        <div className={`rounded-2xl p-8 shadow-sm border ${
          isDark
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white border-gray-100'
        } max-w-4xl mx-auto`}>
          <div className="flex items-start gap-4">
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {isRTL ? 'كيف يعمل الربط؟' : 'How does it work?'}
                </h3>
                <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                  <i className="ri-information-line text-teal-600 text-xs"></i>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {isRTL 
                  ? 'عند ربط حسابك، سيتمكن الوكلاء من الوصول إلى بياناتك بشكل آمن لتنفيذ المهام المطلوبة. جميع البيانات محمية ومشفرة، ويمكنك قطع الاتصال في أي وقت.'
                  : 'When you connect your account, agents will securely access your data to perform required tasks. All data is protected and encrypted, and you can disconnect anytime.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedApp && (
        <AppConnectionModal
          app={selectedApp}
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
