import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../contexts/AuthContext';

type IntegrationRow = { key: string; name: string; enabled: boolean };
type UserIntegrationRow = { integration_key: string; status: string; metadata: any };

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending';

export const UI_TO_DB_KEY: Record<string, string> = {
  gmail: 'google_gmail',
  'google-docs': 'google_docs',
  'google-drive': 'google_drive',
  'google-sheets': 'google_sheets',
  'google-calendar': 'google_calendar',
  slack: 'slack',
  notion: 'notion',
};

export function useIntegrations(appUserId?: string) {
  const [loading, setLoading] = useState(false);
  const [enabledIntegrations, setEnabledIntegrations] = useState<Record<string, IntegrationRow>>({});
  const [userStatusByKey, setUserStatusByKey] = useState<Record<string, IntegrationStatus>>({});

  const dbKeys = useMemo(() => Object.values(UI_TO_DB_KEY), []);

  const refresh = async () => {
    if (!appUserId) return;
    setLoading(true);
    try {
      const { data: integrations, error: iErr } = await supabase
        .from('integrations')
        .select('key,name,enabled')
        .in('key', dbKeys);
      if (iErr) throw iErr;

      const enabledMap: Record<string, IntegrationRow> = {};
      (integrations as IntegrationRow[] | null || []).forEach((row) => {
        enabledMap[row.key] = row;
      });
      setEnabledIntegrations(enabledMap);

      const { data: userIntegrations, error: uErr } = await supabase
        .from('user_integrations')
        .select('integration_key,status,metadata')
        .eq('user_id', appUserId)
        .in('integration_key', dbKeys);
      if (uErr) throw uErr;

      const statusMap: Record<string, IntegrationStatus> = {};
      (userIntegrations as UserIntegrationRow[] | null || []).forEach((row) => {
        statusMap[row.integration_key] = (row.status as IntegrationStatus) || 'disconnected';
      });
      setUserStatusByKey(statusMap);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = async (integrationKey: string, status: IntegrationStatus, metadata: any = {}) => {
    if (!appUserId) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_integrations')
        .upsert(
          {
            user_id: appUserId,
            integration_key: integrationKey,
            status,
            metadata,
          },
          { onConflict: 'user_id,integration_key' }
        );
      if (error) throw error;
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appUserId]);

  return { loading, enabledIntegrations, userStatusByKey, refresh, setStatus };
}
