import type { VercelRequest } from '@vercel/node';

const COMPOSIO_API_BASE = 'https://backend.composio.dev/api/v3';

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
  mailchimp: 'mailchimp',
  hubspot: 'hubspot',
  zoom: 'zoom',
  calendly: 'calendly',
  stripe: 'stripe',
  paypal: 'paypal',
  sendgrid: 'sendgrid',
  figma: 'figma',
  canva: 'canva',
  dropbox: 'dropbox',
  onedrive: 'one_drive',
  linear: 'linear',
  jira: 'jira',
  chatbotkit: 'chatbotkit',
  // Aliases that don't exist on Composio map to closest match
  twilio: 'twilio',
  zapier: 'zapier',
};

// Cache: toolkit -> auth_config_id
const authConfigCache = new Map<string, string>();
// Cache: toolkit -> auth scheme (OAUTH2, OAUTH1, BEARER_TOKEN, API_KEY, BASIC, ...)
const authSchemeCache = new Map<string, string>();

export function getApiKey(): string {
  const key = process.env.COMPOSIO_API_KEY;
  if (!key) throw new Error('MISSING_COMPOSIO_API_KEY');
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
  const lower = String(raw).toLowerCase().replace(/[-_\s]/g, '');
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

async function composioFetch(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: boolean; status: number; data: any }> {
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

async function getAuthSchemeForConfig(authConfigId: string): Promise<string> {
  const r = await composioFetch(`/auth_configs/${encodeURIComponent(authConfigId)}`);
  if (r.ok && r.data) {
    const scheme =
      r.data?.auth_scheme ||
      r.data?.authScheme ||
      r.data?.auth_config?.auth_scheme ||
      r.data?.data?.auth_scheme ||
      r.data?.toolkit?.auth_schemes?.[0] ||
      'OAUTH2';
    return String(scheme).toUpperCase();
  }
  return 'OAUTH2';
}

export async function getOrCreateAuthConfig(
  toolkitSlug: string,
): Promise<{ id: string; authScheme: string }> {
  if (authConfigCache.has(toolkitSlug)) {
    const id = authConfigCache.get(toolkitSlug)!;
    const scheme = authSchemeCache.get(toolkitSlug) || (await getAuthSchemeForConfig(id));
    authSchemeCache.set(toolkitSlug, scheme);
    return { id, authScheme: scheme };
  }

  const envKey = `COMPOSIO_AUTH_CONFIG_${toolkitSlug.toUpperCase()}`;
  const envVal = process.env[envKey];
  if (envVal && envVal.trim().length > 0) {
    const id = envVal.trim();
    authConfigCache.set(toolkitSlug, id);
    const scheme = await getAuthSchemeForConfig(id);
    authSchemeCache.set(toolkitSlug, scheme);
    return { id, authScheme: scheme };
  }

  const list = await composioFetch(
    `/auth_configs?toolkit_slug=${encodeURIComponent(toolkitSlug)}&limit=20`,
  );
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
      const scheme = (
        existing?.auth_scheme ||
        existing?.authScheme ||
        existing?.toolkit?.auth_schemes?.[0] ||
        'OAUTH2'
      )
        .toString()
        .toUpperCase();
      authSchemeCache.set(toolkitSlug, scheme);
      return { id: existing.id, authScheme: scheme };
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
    throw new Error(
      `AUTH_CONFIG_CREATE_FAILED for "${toolkitSlug}": ${created.status} ${JSON.stringify(created.data)}`,
    );
  }

  const id = created.data?.auth_config?.id || created.data?.id || created.data?.data?.id;
  if (!id) throw new Error('AUTH_CONFIG_CREATE_NO_ID');
  authConfigCache.set(toolkitSlug, id);
  const scheme = await getAuthSchemeForConfig(id);
  authSchemeCache.set(toolkitSlug, scheme);
  return { id, authScheme: scheme };
}

export async function initiateConnection(opts: {
  toolkitSlug: string;
  userId: string;
  callbackUrl?: string;
}): Promise<{ redirectUrl: string; connectedAccountId?: string; authScheme?: string }> {
  const { id: authConfigId, authScheme } = await getOrCreateAuthConfig(opts.toolkitSlug);

  // Try multiple body shapes to handle Composio API variations across toolkits
  const bodies: any[] = [
    {
      auth_config: { id: authConfigId },
      connection: {
        user_id: opts.userId,
        callback_url: opts.callbackUrl,
        state: {
          authScheme,
          val: { status: 'INITIALIZING', long_redirect_url: true },
        },
      },
    },
    {
      auth_config: { id: authConfigId },
      connection: {
        user_id: opts.userId,
        callback_url: opts.callbackUrl,
        state: { val: { status: 'INITIALIZING', long_redirect_url: true } },
      },
    },
    {
      auth_config: { id: authConfigId },
      connection: { user_id: opts.userId, callback_url: opts.callbackUrl },
    },
  ];

  let last: any = null;
  for (const body of bodies) {
    const r = await composioFetch('/connected_accounts', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    last = r;
    if (r.ok) break;
  }

  if (!last?.ok) {
    throw new Error(
      `CONNECTED_ACCOUNT_CREATE_FAILED for "${opts.toolkitSlug}" (scheme=${authScheme}): ${last?.status} ${JSON.stringify(last?.data)}`,
    );
  }

  const r = last;
  const redirectUrl =
    r.data?.redirect_url ||
    r.data?.redirectUrl ||
    r.data?.connectionData?.val?.redirectUrl ||
    r.data?.data?.redirect_url ||
    null;
  const connectedAccountId =
    r.data?.id || r.data?.connectedAccountId || r.data?.data?.id || undefined;

  if (!redirectUrl && !connectedAccountId) {
    throw new Error(`MISSING_REDIRECT_URL: ${JSON.stringify(r.data)}`);
  }
  return { redirectUrl: redirectUrl || '', connectedAccountId, authScheme };
}

export async function getUserConnectionStatuses(userId: string): Promise<Record<string, string>> {
  const r = await composioFetch(
    `/connected_accounts?user_id=${encodeURIComponent(userId)}&limit=100`,
  );
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
  const r = await composioFetch(
    `/connected_accounts/${encodeURIComponent(connectedAccountId)}`,
    { method: 'DELETE' },
  );
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
  const r = await composioFetch(
    `/tools?toolkit_slug=${encodeURIComponent(toolkitSlug)}&limit=50${q}`,
  );
  return r;
}

export function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
}
