import type { VercelRequest, VercelResponse } from '@vercel/node';
import { listToolkitActions, normalizeToolkit, setCorsHeaders } from './_helpers.js';

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
    const toolkit = normalizeToolkit(req.query.toolkit || req.query.toolkit_slug);
    const q = (req.query.q as string) || (req.query.search as string) || undefined;
    if (!toolkit) {
      res.status(400).json({ error: 'INVALID_TOOLKIT' });
      return;
    }

    const r = await listToolkitActions(toolkit, q);
    if (!r.ok) {
      res.status(r.status || 500).json({ error: 'LIST_FAILED', data: r.data });
      return;
    }
    res.status(200).json(r.data);
  } catch (e: any) {
    res.status(500).json({
      error: 'COMPOSIO_TOOLS_FAILED',
      message: e?.message || String(e),
    });
  }
}
