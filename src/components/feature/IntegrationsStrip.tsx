'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { openComposioOAuthPopup } from '../../utils/composioApi';

const IntegrationsStrip = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const allTools = [
    { name: 'Gmail', icon: 'ri-mail-fill', color: '#EA4335', slug: 'gmail' },
    { name: 'Google Calendar', icon: 'ri-calendar-fill', color: '#4285F4', slug: 'googlecalendar' },
    { name: 'Google Docs', icon: 'ri-file-text-fill', color: '#4285F4', slug: 'googledocs' },
    { name: 'Google Drive', icon: 'ri-drive-fill', color: '#4285F4', slug: 'googledrive' },
    { name: 'Google Sheets', icon: 'ri-table-fill', color: '#4285F4', slug: 'googlesheets' },
    { name: 'Notion', icon: 'ri-notion-fill', color: '#000000', slug: 'notion' },
    { name: 'GitHub', icon: 'ri-github-fill', color: '#181717', slug: 'github' },
    { name: 'Slack', icon: 'ri-slack-fill', color: '#E01E5A', slug: 'slack' },
    { name: 'Discord', icon: 'ri-discord-fill', color: '#5865F2', slug: 'discord' },
    { name: 'Outlook', icon: 'ri-mail-fill', color: '#0078D4', slug: 'outlook' },
    { name: 'Trello', icon: 'ri-trello-fill', color: '#0079BF', slug: 'trello' },
    { name: 'Asana', icon: 'ri-checkbox-multiple-fill', color: '#F06A4D', slug: 'asana' },
    { name: 'Airtable', icon: 'ri-table-fill', color: '#18BFFF', slug: 'airtable' },
    { name: 'Dropbox', icon: 'ri-cloud-fill', color: '#0061FF', slug: 'dropbox' },
    { name: 'OneDrive', icon: 'ri-cloud-fill', color: '#0078D4', slug: 'onedrive' },
    { name: 'Calendly', icon: 'ri-calendar-fill', color: '#006AFF', slug: 'calendly' },
    { name: 'Supabase', icon: 'ri-database-2-fill', color: '#3ECF8E', slug: 'supabase' },
    { name: 'Vercel', icon: 'ri-upload-cloud-fill', color: '#000000', slug: 'vercel' },
    { name: 'YouTube', icon: 'ri-youtube-fill', color: '#FF0000', slug: 'youtube' },
    { name: 'Mailchimp', icon: 'ri-mail-fill', color: '#FFE01B', slug: 'mailchimp' },
    { name: 'HubSpot', icon: 'ri-mail-fill', color: '#FF7A59', slug: 'hubspot' },
    { name: 'SendGrid', icon: 'ri-mail-fill', color: '#0099E5', slug: 'sendgrid' },
    { name: 'Canva', icon: 'ri-brush-fill', color: '#5B67CA', slug: 'canva' },
    { name: 'Stripe', icon: 'ri-bank-card-fill', color: '#5469D4', slug: 'stripe' },
    { name: 'PayPal', icon: 'ri-bank-card-fill', color: '#003087', slug: 'paypal' },
    { name: 'Twilio', icon: 'ri-phone-fill', color: '#F22F46', slug: 'twilio' },
    { name: 'Zoom', icon: 'ri-video-fill', color: '#2D8CFF', slug: 'zoom' },
    { name: 'Figma', icon: 'ri-pen-fill', color: '#F24E1E', slug: 'figma' },
    { name: 'Linear', icon: 'ri-checkbox-fill', color: '#5E6AD2', slug: 'linear' },
    { name: 'Jira', icon: 'ri-task-fill', color: '#0052CC', slug: 'jira' },
  ];

  const handleConnect = async (tool: (typeof allTools)[0]) => {
    setLoading(tool.slug);
    try {
      const result = await openComposioOAuthPopup(tool.slug, {
        userId: user?.id || 'guest',
      });
      if (result.status === 'success') {
        setConnected((prev) => ({ ...prev, [tool.slug]: true }));
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('integrations.title', 'تكامل سلس مع أكثر من 30 أداة')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('integrations.subtitle', 'اربط حسابك مرة واحدة، واترك وكيلك ينفذ المهام تلقائيًا')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {allTools.map((tool) => (
            <button
              key={tool.slug}
              onClick={() => handleConnect(tool)}
              disabled={loading === tool.slug}
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 disabled:opacity-60"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-white text-2xl"
                style={{ backgroundColor: tool.color }}
              >
                <i className={tool.icon}></i>
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">
                {tool.name}
              </span>
              <span className="text-xs text-gray-500 mt-2">
                {loading === tool.slug
                  ? '...جارٍ'
                  : connected[tool.slug]
                  ? '✓ متصل'
                  : 'Connect'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsStrip;
