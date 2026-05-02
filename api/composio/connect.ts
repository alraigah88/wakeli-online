import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getBaseUrl,
  initiateConnection,
  normalizeToolkit,
  setCorsHeaders,
} from './_helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const params: any = req.method === 'POST' ? (req.body || {}) : (req.query || {});
    const rawToolkit = params.toolkit ?? params.toolkit_slug ?? params.app ?? params.slug;
    const rawUserId =
      params.user_id ??
      params.userId ??
      params.uid ??
      (req.headers['x-user-id'] as string) ??
      'guest';

    const toolkit = normalizeToolkit(rawToolkit);
    if (!toolkit) {
      res.status(400).json({
        error: 'UNSUPPORTED_TOOLKIT',
        message: `Toolkit "${rawToolkit}" is not supported`,
      });
      return;
    }

    const userId = String(rawUserId || 'guest');
    const baseUrl = getBaseUrl(req);
    const callbackUrl = `${baseUrl}/api/composio/callback?toolkit=${encodeURIComponent(toolkit)}&user_id=${encodeURIComponent(userId)}`;

    const result = await initiateConnection({
      toolkitSlug: toolkit,
      userId,
      callbackUrl,
    });

    res.status(200).json({
      redirect_url: result.redirectUrl,
      connected_account_id: result.connectedAccountId,
      toolkit,
      user_id: userId,
    });
  } catch (e: any) {
    res.status(500).json({
      error: 'COMPOSIO_CONNECT_FAILED',
      message: e?.message || String(e),
    });
  }
}
