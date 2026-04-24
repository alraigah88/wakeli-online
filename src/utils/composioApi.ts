import { supabase } from '../contexts/AuthContext';

export type ComposioConnectResult = {
  redirectUrl: string;
  connectedAccountId?: string;
};

export async function startComposioConnect(params: {
  integrationKey: string;
  returnTo?: string;
}): Promise<ComposioConnectResult> {
  const { data, error } = await supabase.functions.invoke('composio-connect', {
    body: params,
  });
  if (error) throw error;
  return data as ComposioConnectResult;
}

export async function disconnectComposio(params: { integrationKey: string }): Promise<{ ok: true }> {
  const { data, error } = await supabase.functions.invoke('composio-disconnect', {
    body: params,
  });
  if (error) throw error;
  return data as { ok: true };
}

export async function listComposioConnections(): Promise<any> {
  const { data, error } = await supabase.functions.invoke('composio-connections', {
    body: {},
  });
  if (error) throw error;
  return data;
}
