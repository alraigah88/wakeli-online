import type { VercelRequest } from '@vercel/node';

/**
 * Composio backend integration helpers.
 *
 * Strategy:
 * - We rely on a single COMPOSIO_API_KEY env var (already configured in Vercel).
 * - Auth configs are created lazily on demand using Composio-managed credentials
 *   (`use_composio_managed_auth: true`), so we DO NOT need per-toolkit OAuth setup.
 * - Auth config ids are cached in-process (per cold start) to avoid hitting the
 *   Composio API on every request.
 */

const COMPOSIO_API_BASE = 'https://backend.composio.dev/api/v3';

// Toolkits we expose in the UI. These map UI ids to Composio toolkit slugs.
export const SUPPORTED_TOOLKITS: Record<string, string> = {
  gmail: 'gmail',
  github: 'github',
  googlecalendar: 'googlecalendar',
  googledocs: 'googledocs',
  googledrive: 'googledrive',
  googlesheets: 'googlesheets',
  outlook: 'outlook',
  slack: 'slack',
  discord: 'discord',
  youtube: 'youtube',
  supabase: 'supabase',
  vercel: 'vercel',
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
  chatbotkit: 'chatbotkit',
};

// In-memory cache of auth_config ids per toolkit slug.
const authConfigCache = new Map<string, string>();

export function getApiKey(): string {
  const key = process.env.COMPOSIO_API_KEY;
  if (!key) {
    throw new Error('MISSING_COMPOSIO_API_KEY');
  }
  return key;
}

export function getBaseUrl(req: VercelRequest): string {
  const fromEnv = process.env.PUBLIC_APP_URL;
  if (fromEnv) return fromEnv;
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string);
  return `${proto}://${host}`;
}

export function normalizeToolkit(input: string | string[] | undefined): string | null {
  const raw = Array.isArray(input) ? input[0] : input;
  if (!raw) return null;
  const lower = raw.toLowerCase().replace(/[-_\s]/g, '');
  const aliases: Record<string, string> = {
    googlecalender: 'googlecalendar',
    googlesheet: 'googlesheets',
    googledoc: 'googledocs',
    gdrive: 'googledrive',
    gcal: 'googlecalendar',
    gh: 'github',
  };
  if (aliases[lower]) return SUPPORTED_TOOLKITS[aliases[lower]] || null;
  return SUPPORTED_TOOLKITS[lower] || null;
}

async function composioFetch(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; data: any }> {
  const apiKey = getApiKey();
  const r = await fetch(`${COMPOSIO_API_BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      ...(init.headers || {}),
    },
  });
  let data: any = null;
  try {
    data = await r.json();
  } catch {
    data = null;
  }
  return { ok: r.ok, status: r.status, data };
}

export async function getOrCreateAuthConfig(toolkitSlug: string): Promise<string> {
  if (authConfigCache.has(toolkitSlug)) {
    return authConfigCache.get(toolkitSlug)!;
  }

  const envKey = `COMPOSIO_AUTH_CONFIG_${toolkitSlug.toUpperCase()}`;
  const envVal = process.env[envKey];
  if (envVal && envVal.trim().length > 0) {
    authConfigCache.set(toolkitSlug, envVal.trim());
    return envVal.trim();
  }

  const list = await composioFetch(`/auth_configs?toolkit_slug=${encodeURIComponent(toolkitSlug)}&limit=10`);
  if (list.ok && list.data) {
    const items: any[] = Array.isArray(list.data?.items)
      ? list.data.items
      : Array.isArray(list.data?.data)
      ? list.data.data
      : Array.isArray(list.data)
      ? list.data
      : [];
    const existing = items.find(
      (it: any) =>
        (it?.toolkit?.slug || it?.toolkit || '').toLowerCase() === toolkitSlug.toLowerCase() &&
        (it?.status || 'ENABLED') !== 'DISABLED',
    );
    if (existing?.id) {
      authConfigCache.set(toolkitSlug, existing.id);
      return existing.id;
    }
  }

  const created = await composioFetch('/auth_configs', {
    method: 'POST',
    body: JSON.stringify({
      toolkit: { slug: toolkitSlug },
      auth_config: {
        type: 'use_composio_managed_auth',
        name: `wakeli-${toolkitSlug}`,
      },
    }),
  });

  if (!created.ok) {
    const fallback = await composioFetch('/auth_configs', {
      method: 'POST',
      body: JSON.stringify({
        toolkit_slug: toolkitSlug,
        auth_config: {
          type: 'use_composio_managed_auth',
          name: `wakeli-${toolkitSlug}`,
        },
      }),
    });
    if (!fallback.ok) {
      throw new Error(
        `AUTH_CONFIG_CREATE_FAILED: ${created.status} ${JSON.stringify(created.data)} | fallback ${fallback.status} ${JSON.stringify(fallback.data)}`,
      );
    }
    const id = fallback.data?.auth_config?.id || fallback.data?.id || fallback.data?.data?.id;
    if (!id) throw new Error('AUTH_CONFIG_CREATE_NO_ID');
    authConfigCache.set(toolkitSlug, id);
    return id;
  }

  const id = created.data?.auth_config?.id || created.data?.id || created.data?.data?.id;
  if (!id) throw new Error('AUTH_CONFIG_CREATE_NO_ID');
  authConfigCache.set(toolkitSlug, id);
  return id;
}

export async function initiateConnection(opts: {
  toolkitSlug: string;
  userId: string;
  callbackUrl?: string;
}): Promise<{ redirectUrl: string; connectedAccountId?: string }> {
  const authConfigId = await getOrCreateAuthConfig(opts.toolkitSlug);
  const body: any = {
    auth_config: { id: authConfigId },
    connection: {
      user_id: opts.userId,
      callback_url: opts.callbackUrl,
      state: {
        authScheme: 'OAUTH2',
        val: { status: 'INITIALIZING', long_redirect_url: true },
      },
    },
  };
  const r = await composioFetch('/connected_accounts', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    throw new Error(`CONNECTED_ACCOUNT_CREATE_FAILED: ${r.status} ${JSON.stringify(r.data)}`);
  }
  const redirectUrl =
    r.data?.redirect_url ||
    r.data?.redirectUrl ||
    r.data?.connectionData?.val?.redirectUrl ||
    r.data?.data?.redirect_url ||
    null;
  const connectedAccountId =
    r.data?.id || r.data?.connectedAccountId || r.data?.data?.id || undefined;
  if (!redirectUrl) {
    if (connectedAccountId) {
      return { redirectUrl: '', connectedAccountId };
    }
    throw new Error(`MISSING_REDIRECT_URL: ${JSON.stringify(r.data)}`);
  }
  return { redirectUrl, connectedAccountId };
}

export async function getUserConnectionStatuses(userId: string): Promise<Record<string, string>> {
  const r = await composioFetch(`/connected_accounts?user_id=${encodeURIComponent(userId)}&limit=100`);
  const out: Record<string, string> = {};
  if (!r.ok || !r.data) return out;
  const items: any[] = Array.isArray(r.data?.items)
    ? r.data.items
    : Array.isArray(r.data?.data)
    ? r.data.data
    : Array.isArray(r.data)
    ? r.data
    : [];
  for (const it of items) {
    const toolkit = (it?.toolkit?.slug || it?.toolkitSlug || it?.toolkit || it?.appName || '')
      .toString()
      .toLowerCase();
    if (!toolkit) continue;
    const status = (it?.status || it?.connectionStatus || 'INITIATED').toString().toUpperCase();
    const rank = (s: string) =>
      s === 'ACTIVE' || s === 'CONNECTED'
        ? 3
        : s === 'INITIATED' || s === 'INITIALIZING' || s === 'PENDING'
        ? 2
        : s === 'FAILED' || s === 'EXPIRED' || s === 'DISABLED'
        ? 1
        : 0;
    if (!out[toolkit] || rank(status) > rank(out[toolkit])) {
      out[toolkit] = status;
    }
  }
  return out;
}

export async function disconnectConnectedAccount(connectedAccountId: string): Promise<boolean> {
  const r = await composioFetch(`/connected_accounts/${encodeURIComponent(connectedAccountId)}`, {
    method: 'DELETE',
  });
  return r.ok;
}

export async function findConnectedAccountId(opts: {
  userId: string;
  toolkitSlug: string;
}): Promise<string | null> {
  const r = await composioFetch(
    `/connected_accounts?user_id=${encodeURIComponent(opts.userId)}&toolkit_slug=${encodeURIComponent(opts.toolkitSlug)}&limit=20`,
  );
  if (!r.ok || !r.data) return null;
  const items: any[] = Array.isArray(r.data?.items)
    ? r.data.items
    : Array.isArray(r.data?.data)
    ? r.data.data
    : Array.isArray(r.data)
    ? r.data
    : [];
  const active = items.find((it: any) => (it?.status || '').toUpperCase() === 'ACTIVE');
  return (active || items[0])?.id || null;
}

export async function executeTool(opts: {
  userId: string;
  toolkitSlug?: string;
  action: string;
  arguments?: Record<string, any>;
  connectedAccountId?: string;
}): Promise<{ ok: boolean; status: number; data: any }> {
  const body: any = {
    user_id: opts.userId,
    arguments: opts.arguments || {},
  };
  if (opts.connectedAccountId) {
    body.connected_account_id = opts.connectedAccountId;
  }
  const r = await composioFetch(`/tools/execute/${encodeURIComponent(opts.action)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return r;
}

export async function listToolkitActions(toolkitSlug: string, query?: string) {
  const q = query ? `&search=${encodeURIComponent(query)}` : '';
  const r = await composioFetch(`/tools?toolkit_slug=${encodeURIComponent(toolkitSlug)}&limit=50${q}`);
  return r;
}

export function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
}
