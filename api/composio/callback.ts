import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const status = ((req.query.status as string) || '').toLowerCase();
  const toolkit = (req.query.toolkit as string) || '';
  const userId = (req.query.user_id as string) || (req.query.userId as string) || '';

  const ok = status === 'success' || status === 'active' || status === '';
  const heading = ok ? 'تم الربط بنجاح' : 'فشل الربط';
  const sub = ok
    ? 'سيتم إغلاق هذه النافذة تلقائيًا...'
    : 'يرجى المحاولة مرة أخرى أو الاتصال بالدعم.';
  const color = ok ? '#10b981' : '#ef4444';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>${heading}</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e1a40 0%, #2a2458 100%);
      color: #fff;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      padding: 48px;
      border-radius: 24px;
      text-align: center;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 40px;
      color: #fff;
    }
    h1 { margin: 0 0 12px; font-size: 24px; font-weight: 700; }
    p  { margin: 0; opacity: 0.7; font-size: 16px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${ok ? '✓' : '✗'}</div>
    <h1>${heading}</h1>
    <p>${sub}</p>
  </div>
  <script>
    (function () {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: 'composio:callback',
            status: ${JSON.stringify(ok ? 'success' : 'error')},
            toolkit: ${JSON.stringify(toolkit)},
            user_id: ${JSON.stringify(userId)}
          }, '*');
        }
      } catch (e) {}
      setTimeout(function () {
        try { window.close(); } catch (e) {}
        if (!window.closed) {
          window.location.href = '/?integration=' + encodeURIComponent(${JSON.stringify(toolkit)}) + '&status=' + encodeURIComponent(${JSON.stringify(ok ? 'connected' : 'failed')});
        }
      }, 1500);
    })();
  </script>
</body>
</html>`);
}
