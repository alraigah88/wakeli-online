import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../contexts/AuthContext';
import { fetchConnectionStatuses } from '../utils/composioApi';

type IntegrationRow = { key: string; name: string; enabled: boolean };
type UserIntegrationRow = { integration_key: string; status: string; metadata: any };

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending';

export const UI_TO_DB_KEY: Record<string, string> = {
  gmail: 'gmail',
  github: 'github',
  'google-docs': 'googledocs',
  'google-drive': 'googledrive',
  'google-sheets': 'googlesheets',
  'google-calendar': 'googlecalendar',
  googlecalendar: 'googlecalendar',
  googledocs: 'googledocs',
  googledrive: 'googledrive',
  googlesheets: 'googlesheets',
  outlook: 'outlook',
  slack: 'slack',
  discord: 'discord',
  notion: 'notion',
  asana: 'asana',
  trello: 'trello',
  airtable: 'airtable',
  zapier: 'zapier',
  mailchimp: 'mailchimp',
  hubspot: 'hubspot',
  zoom: 'zoom',
  calendly: 'calendly',
  stripe: 'stripe',
  paypal: 'paypal',
  twilio: 'twilio',
  sendgrid: 'sendgrid',
  figma: 'figma',
  canva: 'canva',
  dropbox: 'dropbox',
  onedrive: 'one_drive',
  linear: 'linear',
  jira: 'jira',
  youtube: 'youtube',
  supabase: 'supabase',
  vercel: 'vercel',
  chatbotkit: 'chatbotkit',
};

function mapComposioStatus(s: string | undefined): IntegrationStatus {
  if (!s) return 'disconnected';
  const upper = s.toUpperCase();
  if (upper === 'ACTIVE' || upper === 'CONNECTED') return 'connected';
  if (upper === 'INITIATED' || upper === 'INITIALIZING' || upper === 'PENDING')
    return 'pending';
  return 'disconnected';
}

export function useIntegrations(appUserId?: string) {
  const [loading, setLoading] = useState(false);
  const [enabledIntegrations, setEnabledIntegrations] = useState<
    Record<string, IntegrationRow>
  >({});
  const [userStatusByKey, setUserStatusByKey] = useState<
    Record<string, IntegrationStatus>
  >({});

  const dbKeys = useMemo(() => Object.values(UI_TO_DB_KEY), []);

  const refresh = useCallback(async () => {
    if (!appUserId) return;
    setLoading(true);
    try {
      try {
        const { data: integrations } = await supabase
          .from('integrations')
          .select('key,name,enabled')
          .in('key', dbKeys);
        const enabledMap: Record<string, IntegrationRow> = {};
        (integrations as IntegrationRow[] | null | []).forEach?.((row) => {
          enabledMap[row.key] = row;
        });
        if (Object.keys(enabledMap).length > 0) {
          setEnabledIntegrations(enabledMap);
        }
      } catch {}

      try {
        const composioStatuses = await fetchConnectionStatuses(appUserId);
        const statusMap: Record<string, IntegrationStatus> = {};
        Object.entries(composioStatuses || {}).forEach(([toolkit, raw]) => {
          statusMap[toolkit] = mapComposioStatus(raw);
        });
        setUserStatusByKey(statusMap);
      } catch {
        try {
          const { data: userIntegrations } = await supabase
            .from('user_integrations')
            .select('integration_key,status,metadata')
            .eq('user_id', appUserId)
            .in('integration_key', dbKeys);
          const statusMap: Record<string, IntegrationStatus> = {};
          (userIntegrations as UserIntegrationRow[] | null | []).forEach?.((row) => {
            statusMap[row.integration_key] =
              (row.status as IntegrationStatus) || 'disconnected';
          });
          setUserStatusByKey(statusMap);
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }, [appUserId, dbKeys]);

  const setStatus = useCallback(
    async (
      integrationKey: string,
      status: IntegrationStatus,
      metadata: any = {},
    ) => {
      if (!appUserId) return;
      setLoading(true);
      try {
        await supabase.from('user_integrations').upsert(
          {
            user_id: appUserId,
            integration_key: integrationKey,
            status,
            metadata,
          },
          { onConflict: 'user_id,integration_key' },
        );
        await refresh();
      } catch {} finally {
        setLoading(false);
      }
    },
    [appUserId, refresh],
  );

  useEffect(() => {
    void refresh();
    const onFocus = () => void refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  return {
    loading,
    enabledIntegrations,
    userStatusByKey,
    refresh,
    setStatus,
  };
}
