import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserConnectionStatuses, setCorsHeaders } from './_helpers.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    const userId =
      (req.query.user_id as string) ||
      (req.query.userId as string) ||
      (req.headers['x-user-id'] as string) ||
      '';

    if (!userId) {
      res.status(400).json({ error: 'MISSING_USER_ID' });
      return;
    }

    const statuses = await getUserConnectionStatuses(userId);
    res.status(200).json({ user_id: userId, statuses });
  } catch (e: any) {
    res.status(500).json({
      error: 'COMPOSIO_STATUS_FAILED',
      message: e?.message || String(e),
    });
  }
}
