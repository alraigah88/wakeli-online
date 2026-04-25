import { supabase } from '../contexts/AuthContext';

export type ComposioConnectResult = {
  redirectUrl: string;
  connectedAccountId?: string;
};

const isBrowser = typeof window !== 'undefined';

/**
 * IMPORTANT:
 * The embedded Composio/Decimal widget can break the whole app when it runs
 * inside an iframe and tries to postMessage / access cross-origin frames.
 * Until the widget is configured with the correct allowed origins + keys,
 * we hard-disable widget init in production to keep the site usable.
 */
const SHOULD_DISABLE_WIDGET =
  (import.meta as any).env?.PROD === true ||
  (import.meta as any).env?.MODE === 'production';

export async function connectComposioToolkit(toolkit: string): Promise<ComposioConnectResult> {
  // Keep UI alive even if widget/integration is misconfigured.
  if (SHOULD_DISABLE_WIDGET) {
    throw new Error('Composio integration is temporarily disabled on production.');
  }

  if (!isBrowser) {
    throw new Error('Must be called in the browser');
  }

  const { data: auth } = await supabase.auth.getSession();
  const accessToken = auth?.session?.access_token;

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  // Placeholder for future server-side integration.
  // NOTE: Keep function signature stable for UI.
  return {
    redirectUrl: '',
  };
}
