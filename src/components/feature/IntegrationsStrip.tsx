import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const IntegrationsStrip = () => {
  const { t } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { signInWithMicrosoft, signInWithGoogle, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const platforms = [
    { name: 'Slack', icon: 'ri-slack-fill', color: '#4A154B', slug: 'slack' },
    { name: 'Discord', icon: 'ri-discord-fill', color: '#5865F2', slug: 'discord' },
    { name: 'Gmail', icon: 'ri-gmail-fill', color: '#EA4335', slug: 'gmail' },
    { name: 'Outlook', icon: 'ri-mail-fill', color: '#0078D4', slug: 'outlook' },
    { name: 'Notion', icon: 'ri-notion-fill', color: '#000000', slug: 'notion' },
    { name: 'GitHub', icon: 'ri-github-fill', color: '#181717', slug: 'github' },
    { name: 'Google Drive', icon: 'ri-google-drive-fill', color: '#4285F4', slug: 'googledrive' },
    { name: 'YouTube', icon: 'ri-youtube-fill', color: '#FF0000', slug: 'youtube' },
    { name: 'Airtable', icon: 'ri-table-fill', color: '#18BFFF', slug: 'airtable' },
    { name: 'Supabase', icon: 'ri-database-2-fill', color: '#3ECF8E', slug: 'supabase' }
  ];

  const handleConnect = async (platform: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/composio/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: platform.slug })
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank', 'width=600,height=700');
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-white overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{t('integrations.title')}</h2>
          <p className="mt-4 text-lg text-gray-600">{t('integrations.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => handleConnect(platform)}
              disabled={loading}
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all border border-transparent hover:border-gray-200"
            >
              <i className={`${platform.icon} text-4xl mb-3`} style={{ color: platform.color }}></i>
              <span className="font-medium text-gray-900">{platform.name}</span>
              <span className="text-xs text-gray-500 mt-1">{loading ? '...' : t('integrations.connect')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsStrip;
