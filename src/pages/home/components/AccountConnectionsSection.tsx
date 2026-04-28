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
    | 'chatbotkit'
    | 'notion'
    | 'asana'
    | 'trello'
    | 'airtable'
    | 'zapier'
    | 'mailchimp'
    | 'hubspot'
    | 'zoom'
    | 'calendly'
    | 'stripe'
    | 'paypal'
    | 'twilio'
    | 'sendgrid'
    | 'figma'
    | 'canva'
    | 'dropbox'
    | 'onedrive'
    | 'linear'
    | 'jira';
  name: string;
  logoUrl: string;
  color: string;
  category: ConnectionCategory;
  isConnected: boolean;
  description: string;
  status: 'available' | 'coming-soon';
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
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png',
      color: '#EA4335',
      category: 'productivity',
      isConnected: false,
      description: 'Email management and automation',
      status: 'available',
    },
    {
      id: 'github',
      name: 'GitHub',
      logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      color: '#111111',
      category: 'technical',
      isConnected: false,
      description: 'Repository management and automation',
      status: 'available',
    },
    {
      id: 'googlecalendar',
      name: 'Google Calendar',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png',
      color: '#4285F4',
      category: 'productivity',
      isConnected: false,
      description: 'Calendar scheduling and automation',
      status: 'available',
    },
    {
      id: 'googledocs',
      name: 'Google Docs',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png',
      color: '#1A73E8',
      category: 'productivity',
      isConnected: false,
      description: 'Document creation and automation',
      status: 'available',
    },
    {
      id: 'googledrive',
      name: 'Google Drive',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png',
      color: '#0F9D58',
      category: 'productivity',
      isConnected: false,
      description: 'File storage and automation',
      status: 'available',
    },
    {
      id: 'googlesheets',
      name: 'Google Sheets',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png',
      color: '#34A853',
      category: 'productivity',
      isConnected: false,
      description: 'Spreadsheet automation',
      status: 'available',
    },
    {
      id: 'outlook',
      name: 'Outlook',
      logoUrl: 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/outlook_48x1.svg',
      color: '#0078D4',
      category: 'communication',
      isConnected: false,
      description: 'Email and calendar management',
      status: 'available',
    },
    {
      id: 'slack',
      name: 'Slack',
      logoUrl: 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png',
      color: '#4A154B',
      category: 'communication',
      isConnected: false,
      description: 'Team messaging automation',
      status: 'available',
    },
    {
      id: 'discord',
      name: 'Discord',
      logoUrl: 'https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico',
      color: '#5865F2',
      category: 'communication',
      isConnected: false,
      description: 'Community and server automation',
      status: 'available',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      logoUrl: 'https://www.gstatic.com/youtube/img/branding/favicon/favicon_144x144.png',
      color: '#FF0000',
      category: 'marketing',
      isConnected: false,
      description: 'Channel automation',
      status: 'available',
    },
    {
      id: 'supabase',
      name: 'Supabase',
      logoUrl: 'https://supabase.com/favicon/favicon-32x32.png',
      color: '#3ECF8E',
      category: 'technical',
      isConnected: false,
      description: 'Database automation',
      status: 'available',
    },
    {
      id: 'vercel',
      name: 'Vercel',
      logoUrl: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
      color: '#000000',
      category: 'technical',
      isConnected: false,
      description: 'Deployment automation',
      status: 'available',
    },
    {
      id: 'chatbotkit',
      name: 'ChatbotKit',
      logoUrl: 'https://chatbotkit.com/favicon.ico',
      color: '#000000',
      category: 'technical',
      isConnected: false,
      description: 'Chatbot automation',
      status: 'available',
    },
    {
      id: 'notion',
      name: 'Notion',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
      color: '#000000',
      category: 'productivity',
      isConnected: false,
      description: 'Workspace automation',
      status: 'available',
    },
    {
      id: 'asana',
      name: 'Asana',
      logoUrl: 'https://luna.asset.asana.biz/1.0/image/favicon.png',
      color: '#F06A4D',
      category: 'productivity',
      isConnected: false,
      description: 'Project management automation',
      status: 'available',
    },
    {
      id: 'trello',
      name: 'Trello',
      logoUrl: 'https://d2k5dcd8bfxwq2.cloudfront.net/static/images/favicon.ico',
      color: '#0052CC',
      category: 'productivity',
      isConnected: false,
      description: 'Board management automation',
      status: 'available',
    },
    {
      id: 'airtable',
      name: 'Airtable',
      logoUrl: 'https://www.airtable.com/favicon.ico',
      color: '#18BFFF',
      category: 'productivity',
      isConnected: false,
      description: 'Database automation',
      status: 'available',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      logoUrl: 'https://zapier.com/favicon.ico',
      color: '#FF4F00',
      category: 'technical',
      isConnected: false,
      description: 'Workflow automation',
      status: 'available',
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      logoUrl: 'https://mailchimp.com/favicon.ico',
      color: '#FFE01B',
      category: 'marketing',
      isConnected: false,
      description: 'Email marketing automation',
      status: 'available',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      logoUrl: 'https://www.hubspot.com/favicon.ico',
      color: '#FF7A59',
      category: 'marketing',
      isConnected: false,
      description: 'CRM automation',
      status: 'available',
    },
    {
      id: 'zoom',
      name: 'Zoom',
      logoUrl: 'https://www.zoom.us/favicon.ico',
      color: '#0B5CFF',
      category: 'communication',
      isConnected: false,
      description: 'Video meeting automation',
      status: 'available',
    },
    {
      id: 'calendly',
      name: 'Calendly',
      logoUrl: 'https://calendly.com/favicon.ico',
      color: '#006B3F',
      category: 'productivity',
      isConnected: false,
      description: 'Scheduling automation',
      status: 'available',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logoUrl: 'https://stripe.com/favicon.ico',
      color: '#635BFF',
      category: 'financial',
      isConnected: false,
      description: 'Payment automation',
      status: 'available',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logoUrl: 'https://www.paypal.com/favicon.ico',
      color: '#003087',
      category: 'financial',
      isConnected: false,
      description: 'Payment processing',
      status: 'available',
    },
    {
      id: 'twilio',
      name: 'Twilio',
      logoUrl: 'https://www.twilio.com/favicon.ico',
      color: '#F22F46',
      category: 'communication',
      isConnected: false,
      description: 'SMS and voice automation',
      status: 'available',
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      logoUrl: 'https://sendgrid.com/favicon.ico',
      color: '#1D3557',
      category: 'marketing',
      isConnected: false,
      description: 'Email delivery automation',
      status: 'available',
    },
    {
      id: 'figma',
      name: 'Figma',
      logoUrl: 'https://www.figma.com/favicon.ico',
      color: '#F24E1E',
      category: 'technical',
      isConnected: false,
      description: 'Design automation',
      status: 'available',
    },
    {
      id: 'canva',
      name: 'Canva',
      logoUrl: 'https://www.canva.com/favicon.ico',
      color: '#00C4CC',
      category: 'marketing',
      isConnected: false,
      description: 'Design tool automation',
      status: 'available',
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      logoUrl: 'https://www.dropbox.com/favicon.ico',
      color: '#0061FF',
      category: 'productivity',
      isConnected: false,
      description: 'File storage automation',
      status: 'available',
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      logoUrl: 'https://onedrive.live.com/favicon.ico',
      color: '#0078D4',
      category: 'productivity',
      isConnected: false,
      description: 'Cloud storage automation',
      status: 'available',
    },
    {
      id: 'linear',
      name: 'Linear',
      logoUrl: 'https://linear.app/favicon.ico',
      color: '#5E6AD2',
      category: 'technical',
      isConnected: false,
      description: 'Issue tracking automation',
      status: 'available',
    },
    {
      id: 'jira',
      name: 'Jira',
      logoUrl: 'https://www.atlassian.com/favicon.ico',
      color: '#0052CC',
      category: 'technical',
      isConnected: false,
      description: 'Project tracking automation',
      status: 'available',
    },
  ]);

  const [selectedApp, setSelectedApp] = useState<AppConnection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categorizedConnections = useMemo(() => {
    const categories: Record<ConnectionCategory, AppConnection[]> = {
      productivity: [],
      communication: [],
      marketing: [],
      technical: [],
      financial: [],
    };

    connections.forEach((conn) => {
      categories[conn.category].push(conn);
    });

    return categories;
  }, [connections]);

  const handleAppClick = (app: AppConnection) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleConnect = async (app: AppConnection) => {
    if (!isAuthenticated) {
      // If not authenticated, we can still try as guest or show login
      // For now, let's proceed as guest if user is not logged in
    }

    try {
      const userId = user?.id || 'guest';
      const response = await fetch(`/api/composio/connect?toolkit=${app.id}&userId=${userId}`);
      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error('Failed to get redirect URL:', data);
        alert(isRTL ? 'فشل الحصول على رابط الاتصال' : 'Failed to get connection URL');
      }
    } catch (error) {
      console.error('Error connecting app:', error);
      alert(isRTL ? 'حدث خطأ أثناء محاولة الاتصال' : 'An error occurred while trying to connect');
    }
  };

  const categoryLabels: Record<ConnectionCategory, string> = {
    productivity: 'Productivity',
    communication: 'Communication',
    marketing: 'Marketing',
    technical: 'Technical',
    financial: 'Financial',
  };

  return (
    <section className={`py-16 px-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-3xl font-bold mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Connect Your Accounts
        </h2>

        {Object.entries(categorizedConnections).map(([category, apps]) => (
          apps.length > 0 && (
            <div key={category} className="mb-12">
              <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {categoryLabels[category as ConnectionCategory]}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white hover:bg-gray-100 border border-gray-200'
                    }`}
                    title={app.name}
                  >
                    <img
                      src={app.logoUrl}
                      alt={app.name}
                      className="w-10 h-10 mb-2 object-contain"
                    />
                    <span className={`text-xs font-medium text-center line-clamp-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {selectedApp && (
        <AppConnectionModal
          app={selectedApp}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApp(null);
          }}
          onConfirm={() => handleConnect(selectedApp)}
        />
      )}
    </section>
  );
};

export default AccountConnectionsSection;
