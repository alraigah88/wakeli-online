import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import AppConnectionModal from './AppConnectionModal';
import { useAuth } from '../../../contexts/AuthContext';
import { UI_TO_DB_KEY, useIntegrations } from '../../../hooks/useIntegrations';

interface AppConnection {
  id: string;
  name: string;
  nameAr: string;
  logoUrl: string;
  color: string;
  category: 'productivity' | 'communication' | 'marketing' | 'technical' | 'financial';
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
  // Safety gate: don't let any external/widget/composio wiring break the whole SPA.
  // Enable on preview/dev only.
  const mode = (import.meta as any).env?.MODE;
  const isProd = (import.meta as any).env?.PROD === true || mode === 'production';
  if (isProd) return null;

  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const isRTL = i18n.language === 'ar';
  const { user } = useAuth();
  const { enabledIntegrations, userStatusByKey, setStatus } = useIntegrations(user?.id);

  const [connections, setConnections] = useState<AppConnection[]>([
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
      tools: ['Gmail API', 'AI Classifier', 'Auto Responder'],
      toolsAr: ['واجهة جيميل', 'تصنيف ذكي', 'رد تلقائي'],
      howItWorks: ['Connect Gmail securely', 'Choose automations', 'AI manages inbox'],
      howItWorksAr: ['اربط جيميل بأمان', 'اختر الأتمتة', 'الذكاء يدير بريدك'],
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
    // Temporary safe no-op until backend Composio OAuth endpoints are finalized.
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
          <AppConnectionModal
            app={selectedApp}
            isOpen={!!selectedApp}
            onClose={handleCloseModal}
            onConfirm={handleConfirmConnection}
          />
        )}
      </div>
    </section>
  );
};

export default AccountConnectionsSection;
