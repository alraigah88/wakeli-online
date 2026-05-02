import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  disconnectConnectedAccount,
  findConnectedAccountId,
  normalizeToolkit,
  setCorsHeaders,
} from './_helpers.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST' && req.method !== 'DELETE') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    const params: any = req.method === 'POST' ? (req.body || {}) : (req.query || {});
    const toolkit = normalizeToolkit(params.toolkit ?? params.toolkit_slug ?? params.app);
    const userId =
      params.user_id ??
      params.userId ??
      (req.headers['x-user-id'] as string) ??
      '';

    if (!userId) {
      res.status(400).json({ error: 'MISSING_USER_ID' });
      return;
    }

    if (params.connected_account_id || params.connectedAccountId) {
      const id = params.connected_account_id || params.connectedAccountId;
      const ok = await disconnectConnectedAccount(id);
      res.status(ok ? 200 : 500).json({ ok });
      return;
    }

    if (!toolkit) {
      res.status(400).json({ error: 'MISSING_TOOLKIT' });
      return;
    }

    const id = await findConnectedAccountId({ userId: String(userId), toolkitSlug: toolkit });
    if (!id) {
      res.status(404).json({ error: 'CONNECTION_NOT_FOUND', toolkit, user_id: userId });
      return;
    }

    const ok = await disconnectConnectedAccount(id);
    res.status(ok ? 200 : 500).json({ ok, toolkit, user_id: userId });
  } catch (e: any) {
    res.status(500).json({
      error: 'COMPOSIO_DISCONNECT_FAILED',
      message: e?.message || String(e),
    });
  }
}
