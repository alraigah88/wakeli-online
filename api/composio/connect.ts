import type { VercelRequest, VercelResponse } from '@vercel/node';

type ToolkitKey = 'github' | 'gmail' | 'googlecalendar' | 'googledocs' | 'googledrive' | 'chatbotkit';

const AUTH_CONFIG_BY_TOOLKIT: Partial<Record<ToolkitKey, string>> = {
  github: process.env.COMPOSIO_AUTH_CONFIG_GITHUB || '',
  gmail: process.env.COMPOSIO_AUTH_CONFIG_GMAIL || '',
  googlecalendar: process.env.COMPOSIO_AUTH_CONFIG_GOOGLECALENDAR || '',
  googledocs: process.env.COMPOSIO_AUTH_CONFIG_GOOGLEDOCS || '',
  googledrive: process.env.COMPOSIO_AUTH_CONFIG_GOOGLEDRIVE || '',
  chatbotkit: process.env.COMPOSIO_AUTH_CONFIG_CHATBOTKIT || '',
};

function getBaseUrl(req: VercelRequest) {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string);
  return `${proto}://${host}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const apiKey = process.env.COMPOSIO_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'MISSING_COMPOSIO_API_KEY' });
      return;
    }

    const toolkit = (req.query.toolkit as string | undefined)?.toLowerCase() as ToolkitKey | undefined;
    if (!toolkit) {
      res.status(400).json({ error: 'MISSING_TOOLKIT' });
      return;
    }

    const authConfigId = AUTH_CONFIG_BY_TOOLKIT[toolkit];
    if (!authConfigId) {
      res.status(400).json({ error: 'MISSING_AUTH_CONFIG_FOR_TOOLKIT', toolkit });
      return;
    }

    const userId = (req.query.user_id as string | undefined) || (req.query.userId as string | undefined) || 'guest';

    const baseUrl = getBaseUrl(req);
    const callbackUrl = `${baseUrl}/#/integrations/callback?toolkit=${encodeURIComponent(toolkit)}`;

    const body = {
      auth_config: { id: authConfigId },
      connection: {
        user_id: userId,
        callback_url: callbackUrl,
        state: {
          authScheme: 'OAUTH2',
          val: {
            status: 'INITIALIZING',
            long_redirect_url: true,
          },
        },
      },
    };

    const r = await fetch('https://backend.composio.dev/api/v3.1/connected_accounts', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      res.status(500).json({ error: 'COMPOSIO_CREATE_CONNECTED_ACCOUNT_FAILED', status: r.status, data });
      return;
    }

    const redirectUrl = (data && (data.redirect_url || data.redirectUrl || data.connectionData?.val?.redirectUrl)) as string | undefined;
    if (!redirectUrl) {
      res.status(500).json({ error: 'MISSING_REDIRECT_URL', data });
      return;
    }

    res.status(200).json({ redirect_url: redirectUrl });
  } catch (e: any) {
    res.status(500).json({ error: 'SERVER_ERROR', message: e?.message || String(e) });
  }
}
