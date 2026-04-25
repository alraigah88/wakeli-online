import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });

    const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY || '';
    if (!COMPOSIO_API_KEY) return res.status(500).json({ error: 'MISSING_COMPOSIO_API_KEY' });

    const body = (req.body || {}) as any;
    const toolkit = String(body.toolkit || '').trim();
    const userId = String(body.userId || '').trim();
    const redirectUrl = String(body.redirectUrl || '').trim();

    if (!toolkit) return res.status(400).json({ error: 'MISSING_TOOLKIT' });
    if (!userId) return res.status(400).json({ error: 'MISSING_USER_ID' });

    const appBase =
      process.env.PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

    const finalRedirectUrl = redirectUrl || `${appBase}/?connected=1&toolkit=${encodeURIComponent(toolkit)}`;

    const r = await fetch('https://backend.composio.dev/api/v1/connectedAccounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${COMPOSIO_API_KEY}`,
      },
      body: JSON.stringify({
        toolkit,
        userId,
        redirectUrl: finalRedirectUrl,
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: 'COMPOSIO_ERROR', details: data });

    const url = (data?.redirectUrl || data?.authURL || data?.data?.redirectUrl || data?.data?.authURL) as
      | string
      | undefined;

    if (!url) return res.status(500).json({ error: 'NO_REDIRECT_URL', details: data });

    return res.status(200).json({ redirectUrl: url });
  } catch (e: any) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: String(e?.message || e) });
  }
}
