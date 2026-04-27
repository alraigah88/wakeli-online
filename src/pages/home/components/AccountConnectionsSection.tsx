import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import AppConnectionModal from './AppConnectionModal';
import { useAuth } from '../../../contexts/AuthContext';
import { UI_TO_DB_KEY, useIntegrations } from '../../../hooks/useIntegrations';

type ConnectionCategory = 'productivity' | 'communication' | 'marketing' | 'technical' | 'financial';

interface AppConnection {
  id:
    | 'gmail'
    | 'github'
    | 'googlecalendar'
    | 'googledocs'
    | 'googledrive'
    | 'googlesheets'
    | 'outlook'
    | 'slack'
    | 'discord'
    | 'youtube'
    | 'supabase'
    | 'vercel'
    | 'chatbotkit';
  name: string;
  nameAr: string;
  logoUrl: string;
  color: string;
  category: ConnectionCategory;
  isConnected: boolean;
  description: string;
  descriptionAr: string;
  status: 'available' | 'coming-soon';
  automationTasks: string[];
  automationTasksAr: string[];
  benefits: string[];
  benefitsAr: string[];
  tools: string[];
  toolsAr: string[];
  howItWorks: string[];
  howItWorksAr: string[];
}

const AccountConnectionsSection = () => {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const isRTL = i18n.language === 'ar';
  const { user, isAuthenticated } = useAuth();
  const { enabledIntegrations, userStatusByKey } = useIntegrations(user?.id);

  const [connections] = useState<AppConnection[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      nameAr: 'جيميل',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png',
      color: '#EA4335',
      category: 'productivity',
      isConnected: false,
      description: 'Email management and automation',
      descriptionAr: 'إدارة البريد الإلكتروني والأتمتة',
      status: 'available',
      automationTasks: ['Auto-classify emails', 'Smart replies', 'Schedule sending'],
      automationTasksAr: ['تصنيف الإيميلات تلقائياً', 'ردود ذكية', 'جدولة الإرسال'],
      benefits: ['Save time', 'Never miss important emails', 'Auto organize inbox'],
      benefitsAr: ['توفير الوقت', 'عدم تفويت المهم', 'تنظيم تلقائي'],
      tools: ['Gmail API'],
      toolsAr: ['واجهة Gmail'],
      howItWorks: ['Connect Gmail', 'Authorize access', 'Use automations'],
      howItWorksAr: ['اربط Gmail', 'وافق على الصلاحيات', 'استخدم الأتمتة'],
    },
    {
      id: 'github',
      name: 'GitHub',
      nameAr: 'جيت هب',
      logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      color: '#111111',
      category: 'technical',
      isConnected: false,
      description: 'Repositories and issues automation',
      descriptionAr: 'مستودعات وأتمتة المهام',
      status: 'available',
      automationTasks: ['Create issues', 'Summarize PRs', 'Auto label'],
      automationTasksAr: ['إنشاء تذاكر', 'تلخيص PR', 'وسوم تلقائية'],
      benefits: ['Faster tracking', 'Better collaboration'],
      benefitsAr: ['متابعة أسرع', 'تعاون أفضل'],
      tools: ['GitHub API'],
      toolsAr: ['واجهة GitHub'],
      howItWorks: ['Connect GitHub', 'Authorize access', 'Use automations'],
      howItWorksAr: ['اربط GitHub', 'وافق على الصلاحيات', 'استخدم الأتمتة'],
    },
    {
      id: 'googlecalendar',
      name: 'Google Calendar',
      nameAr: 'تقويم Google',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png',
      color: '#4285F4',
      category: 'productivity',
      isConnected: false,
      description: 'Scheduling and calendar automation',
      descriptionAr: 'حجوزات وأتمتة المواعيد',
      status: 'available',
      automationTasks: ['Create events', 'Find free slots'],
      automationTasksAr: ['إنشاء مواعيد', 'البحث عن أوقات متاحة'],
      benefits: ['Less back-and-forth', 'Auto reminders'],
      benefitsAr: ['تقليل الرسائل', 'تذكير تلقائي'],
      tools: ['Calendar API'],
      toolsAr: ['واجهة التقويم'],
      howItWorks: ['Connect Calendar', 'Authorize', 'Automate scheduling'],
      howItWorksAr: ['اربط التقويم', 'وافق', 'أتمتة المواعيد'],
    },
    {
      id: 'googledocs',
      name: 'Google Docs',
      nameAr: 'مستندات Google',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png',
      color: '#1A73E8',
      category: 'productivity',
      isConnected: false,
      description: 'Docs creation and automation',
      descriptionAr: 'إنشاء المستندات وأتمتتها',
      status: 'available',
      automationTasks: ['Create docs', 'Update docs'],
      automationTasksAr: ['إنشاء مستند', 'تحديث مستند'],
      benefits: ['Faster writing', 'Structured templates'],
      benefitsAr: ['كتابة أسرع', 'قوالب جاهزة'],
      tools: ['Docs API'],
      toolsAr: ['واجهة المستندات'],
      howItWorks: ['Connect Docs', 'Authorize', 'Automate docs'],
      howItWorksAr: ['اربط المستندات', 'وافق', 'أتمتة المستندات'],
    },
    {
      id: 'googledrive',
      name: 'Google Drive',
      nameAr: 'Google Drive',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png',
      color: '#0F9D58',
      category: 'productivity',
      isConnected: false,
      description: 'Files and storage automation',
      descriptionAr: 'أتمتة الملفات والتخزين',
      status: 'available',
      automationTasks: ['Upload files', 'Organize folders'],
      automationTasksAr: ['رفع ملفات', 'تنظيم مجلدات'],
      benefits: ['Auto organization', 'Faster sharing'],
      benefitsAr: ['تنظيم تلقائي', 'مشاركة أسرع'],
      tools: ['Drive API'],
      toolsAr: ['واجهة Drive'],
      howItWorks: ['Connect Drive', 'Authorize', 'Automate files'],
      howItWorksAr: ['اربط Drive', 'وافق', 'أتمتة الملفات'],
    },
    {
      id: 'googlesheets',
      name: 'Google Sheets',
      nameAr: 'جداول Google',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png',
      color: '#34A853',
      category: 'productivity',
      isConnected: false,
      description: 'Spreadsheet automation',
      descriptionAr: 'أتمتة الجداول',
      status: 'available',
      automationTasks: ['Write rows', 'Read sheets'],
      automationTasksAr: ['كتابة صفوف', 'قراءة الجداول'],
      benefits: ['Automate reporting', 'Sync data'],
      benefitsAr: ['تقارير تلقائية', 'مزامنة البيانات'],
      tools: ['Sheets API'],
      toolsAr: ['واجهة Sheets'],
      howItWorks: ['Connect Sheets', 'Authorize', 'Automate sheets'],
      howItWorksAr: ['اربط Sheets', 'وافق', 'أتمتة الجداول'],
    },
    {
      id: 'outlook',
      name: 'Outlook',
      nameAr: 'Outlook',
      logoUrl: 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/outlook_48x1.svg',
      color: '#0A66C2',
      category: 'communication',
      isConnected: false,
      description: 'Email and calendar on Microsoft',
      descriptionAr: 'بريد وتقويم مايكروسوفت',
      status: 'available',
      automationTasks: ['Read emails', 'Send emails'],
      automationTasksAr: ['قراءة البريد', 'إرسال البريد'],
      benefits: ['Centralized inbox', 'Automations'],
      benefitsAr: ['إدارة أسهل', 'أتمتة'],
      tools: ['Microsoft Graph'],
      toolsAr: ['Graph'],
      howItWorks: ['Connect Outlook', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط Outlook', 'وافق', 'شغّل الأتمتة'],
    },
    {
      id: 'slack',
      name: 'Slack',
      nameAr: 'سلاك',
      logoUrl: 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png',
      color: '#4A154B',
      category: 'communication',
      isConnected: false,
      description: 'Team messaging automation',
      descriptionAr: 'أتمتة رسائل الفريق',
      status: 'available',
      automationTasks: ['Post messages', 'Summarize threads'],
      automationTasksAr: ['إرسال رسائل', 'تلخيص المحادثات'],
      benefits: ['Faster updates', 'Less noise'],
      benefitsAr: ['تحديثات أسرع', 'تنظيم أفضل'],
      tools: ['Slack API'],
      toolsAr: ['واجهة Slack'],
      howItWorks: ['Connect Slack', 'Authorize', 'Automate messages'],
      howItWorksAr: ['اربط Slack', 'وافق', 'أتمتة الرسائل'],
    },
    {
      id: 'discord',
      name: 'Discord',
      nameAr: 'ديسكورد',
      logoUrl: 'https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico',
      color: '#5865F2',
      category: 'communication',
      isConnected: false,
      description: 'Community and server automation',
      descriptionAr: 'أتمتة المجتمع والخادم',
      status: 'available',
      automationTasks: ['Send messages', 'Manage roles'],
      automationTasksAr: ['إرسال رسائل', 'إدارة الأدوار'],
      benefits: ['Better moderation', 'Automated tasks'],
      benefitsAr: ['إشراف أفضل', 'مهام آلية'],
      tools: ['Discord API'],
      toolsAr: ['واجهة Discord'],
      howItWorks: ['Connect Discord', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط Discord', 'وافق', 'أتمتة'],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      nameAr: 'يوتيوب',
      logoUrl: 'https://www.gstatic.com/youtube/img/branding/favicon/favicon_144x144.png',
      color: '#FF0000',
      category: 'marketing',
      isConnected: false,
      description: 'Channel automation',
      descriptionAr: 'أتمتة القناة',
      status: 'available',
      automationTasks: ['Upload videos', 'Read comments'],
      automationTasksAr: ['رفع فيديو', 'قراءة التعليقات'],
      benefits: ['Faster operations', 'Better engagement'],
      benefitsAr: ['إدارة أسرع', 'تفاعل أفضل'],
      tools: ['YouTube API'],
      toolsAr: ['واجهة YouTube'],
      howItWorks: ['Connect YouTube', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط YouTube', 'وافق', 'شغّل الأتمتة'],
    },
    {
      id: 'supabase',
      name: 'Supabase',
      nameAr: 'Supabase',
      logoUrl: 'https://supabase.com/favicon/favicon-32x32.png',
      color: '#3ECF8E',
      category: 'technical',
      isConnected: false,
      description: 'Database automations',
      descriptionAr: 'أتمتة قاعدة البيانات',
      status: 'available',
      automationTasks: ['Read/write data'],
      automationTasksAr: ['قراءة/كتابة البيانات'],
      benefits: ['Automate ops', 'Sync data'],
      benefitsAr: ['أتمتة التشغيل', 'مزامنة'],
      tools: ['Supabase'],
      toolsAr: ['Supabase'],
      howItWorks: ['Connect Supabase', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط Supabase', 'وافق', 'شغّل الأتمتة'],
    },
    {
      id: 'vercel',
      name: 'Vercel',
      nameAr: 'Vercel',
      logoUrl: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
      color: '#000000',
      category: 'technical',
      isConnected: false,
      description: 'Deployments automation',
      descriptionAr: 'أتمتة النشر',
      status: 'available',
      automationTasks: ['Deploy', 'Read logs'],
      automationTasksAr: ['نشر', 'قراءة السجلات'],
      benefits: ['Faster ops'],
      benefitsAr: ['تشغيل أسرع'],
      tools: ['Vercel API'],
      toolsAr: ['Vercel'],
      howItWorks: ['Connect Vercel', 'Authorize', 'Automate'],
      howItWorksAr: ['اربط Vercel', 'وافق', 'شغّل الأتمتة'],
    },
    {
      id: 'chatbotkit',
      name: 'ChatbotKit',
      nameAr: 'ChatbotKit',
      logoUrl: 'https://chatbotkit.com/favicon.ico',
      color: '#7C3AED',
      category: 'technical',
      isConnected: false,
      description: 'ChatbotKit automations',
      descriptionAr: 'أتمتة ChatbotKit',
      status: 'available',
      automationTasks: ['Connect account'],
      automationTasksAr: ['ربط الحساب'],
      benefits: ['Automation'],
      benefitsAr: ['أتمتة'],
      tools: ['ChatbotKit'],
      toolsAr: ['ChatbotKit'],
      howItWorks: ['Connect', 'Authorize'],
      howItWorksAr: ['اربط', 'وافق'],
    },
  ]);

  const enabledConnections = useMemo(() => {
    return connections
      .map((c) => {
        const dbKey = (UI_TO_DB_KEY as any)[c.id] as string | undefined;
        const enabled = dbKey ? !!(enabledIntegrations as any)[dbKey]?.enabled : true;
        const status = dbKey ? (userStatusByKey as any)[dbKey] : undefined;
        return {
          ...c,
          isConnected: status === 'connected',
          status: enabled ? c.status : 'coming-soon',
        };
      })
      .filter((c) => c.status !== 'coming-soon');
  }, [connections, enabledIntegrations, userStatusByKey]);

  const [selectedApp, setSelectedApp] = useState<AppConnection | null>(null);

  const handleConfirmConnection = async () => {
    if (!selectedApp) return;

    const toolkit = selectedApp.id;
    const userId = isAuthenticated && user?.id ? user.id : 'guest';

    const r = await fetch(`/api/composio/connect?toolkit=${encodeURIComponent(toolkit)}&user_id=${encodeURIComponent(userId)}`);
    const data = await r.json().catch(() => ({}));

    const redirectUrl = data?.redirect_url;
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }

    alert('فشل ربط الحساب. تأكد أن COMPOSIO_API_KEY والمتغيرات موجودة في Vercel ثم حاول مرة ثانية.');
    setSelectedApp(null);
  };

  const handleCloseModal = () => setSelectedApp(null);

  return (
    <section id="account-connections" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className={`font-mono text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isRTL ? 'اربط حساباتك' : 'Connect Your Accounts'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledConnections.map((connection) => (
            <button
              key={connection.id}
              onClick={() => setSelectedApp(connection)}
              className={`p-6 rounded-2xl border text-left transition ${
                isDark ? 'bg-[#2a2458] border-[#5a5490]/30 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${connection.color}20` }}
                >
                  <img
                    src={connection.logoUrl}
                    alt={connection.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-mono font-bold text-lg">{isRTL ? connection.nameAr : connection.name}</div>
                  <div className={`font-mono text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {isRTL ? connection.descriptionAr : connection.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedApp && (
          <AppConnectionModal app={selectedApp} isOpen={!!selectedApp} onClose={handleCloseModal} onConfirm={handleConfirmConnection} />
        )}
      </div>
    </section>
  );
};

export default AccountConnectionsSection;
