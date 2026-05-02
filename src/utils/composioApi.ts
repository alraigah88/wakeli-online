import { supabase } from '../contexts/AuthContext';

export type ComposioConnectResult = {
  redirectUrl: string;
  connectedAccountId?: string;
  toolkit?: string;
  userId?: string;
};

const isBrowser = typeof window !== 'undefined';

export async function connectComposioToolkit(
  toolkit: string,
  options?: { userId?: string },
): Promise<ComposioConnectResult> {
  if (!isBrowser) {
    throw new Error('connectComposioToolkit must be called in the browser');
  }

  let userId = options?.userId;
  if (!userId) {
    try {
      const { data } = await supabase.auth.getSession();
      userId = data?.session?.user?.id || 'guest';
    } catch {
      userId = 'guest';
    }
  }

  const url = `/api/composio/connect?toolkit=${encodeURIComponent(toolkit)}&user_id=${encodeURIComponent(userId)}`;
  const r = await fetch(url, { method: 'GET', credentials: 'include' });
  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw new Error(data?.message || data?.error || `Connection failed (${r.status})`);
  }

  return {
    redirectUrl: data.redirect_url || '',
    connectedAccountId: data.connected_account_id,
    toolkit: data.toolkit,
    userId: data.user_id,
  };
}

export async function openComposioOAuthPopup(
  toolkit: string,
  options?: { userId?: string },
): Promise<{ status: 'success' | 'error' | 'closed'; toolkit: string }> {
  const { redirectUrl } = await connectComposioToolkit(toolkit, options);
  if (!redirectUrl) {
    return { status: 'error', toolkit };
  }

  return new Promise((resolve) => {
    const popup = window.open(
      redirectUrl,
      `composio-${toolkit}`,
      'width=640,height=720,resizable=yes,scrollbars=yes',
    );

    if (!popup) {
      window.location.href = redirectUrl;
      resolve({ status: 'closed', toolkit });
      return;
    }

    let resolved = false;
    const onMessage = (event: MessageEvent) => {
      const data = event?.data;
      if (!data || data.type !== 'composio:callback') return;
      if (data.toolkit && data.toolkit !== toolkit) return;
      resolved = true;
      window.removeEventListener('message', onMessage);
      try {
        popup.close();
      } catch {}
      resolve({ status: data.status === 'success' ? 'success' : 'error', toolkit });
    };

    window.addEventListener('message', onMessage);

    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        if (!resolved) {
          window.removeEventListener('message', onMessage);
          resolve({ status: 'closed', toolkit });
        }
      }
    }, 500);
  });
}

export async function fetchConnectionStatuses(
  userId: string,
): Promise<Record<string, string>> {
  if (!userId) return {};
  const r = await fetch(`/api/composio/status?user_id=${encodeURIComponent(userId)}`);
  if (!r.ok) return {};
  const data = await r.json().catch(() => ({}));
  return data?.statuses || {};
}

export async function disconnectIntegration(
  toolkit: string,
  userId: string,
): Promise<boolean> {
  const r = await fetch(`/api/composio/disconnect`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ toolkit, user_id: userId }),
  });
  return r.ok;
}

export async function executeComposioAction(opts: {
  userId: string;
  toolkit?: string;
  action: string;
  arguments?: Record<string, any>;
  connectedAccountId?: string;
}): Promise<any> {
  const r = await fetch('/api/composio/execute', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      user_id: opts.userId,
      toolkit: opts.toolkit,
      action: opts.action,
      arguments: opts.arguments || {},
      connected_account_id: opts.connectedAccountId,
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const message = data?.message || data?.error || `Execution failed (${r.status})`;
    throw new Error(message);
  }
  return data;
}
