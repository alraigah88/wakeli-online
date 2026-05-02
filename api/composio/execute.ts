import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  executeTool,
  findConnectedAccountId,
  normalizeToolkit,
  setCorsHeaders,
} from './_helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  try {
    const body: any = req.body || {};
    const userId = body.user_id || body.userId || (req.headers['x-user-id'] as string);
    const action = body.action || body.tool || body.actionName;
    const args = body.arguments || body.input || {};
    const toolkit = normalizeToolkit(body.toolkit || body.toolkit_slug || body.app);
    let connectedAccountId = body.connected_account_id || body.connectedAccountId;

    if (!userId) {
      res.status(400).json({ error: 'MISSING_USER_ID' });
      return;
    }
    if (!action) {
      res.status(400).json({ error: 'MISSING_ACTION' });
      return;
    }

    if (!connectedAccountId && toolkit) {
      connectedAccountId = await findConnectedAccountId({
        userId: String(userId),
        toolkitSlug: toolkit,
      });
    }

    const result = await executeTool({
      userId: String(userId),
      action,
      arguments: args,
      connectedAccountId,
    });

    if (!result.ok) {
      res.status(result.status || 500).json({
        error: 'COMPOSIO_EXECUTE_FAILED',
        status: result.status,
        data: result.data,
      });
      return;
    }

    res.status(200).json(result.data);
  } catch (e: any) {
    res.status(500).json({
      error: 'COMPOSIO_EXECUTE_ERROR',
      message: e?.message || String(e),
    });
  }
}
