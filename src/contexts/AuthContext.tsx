
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await syncUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const syncUserProfile = async (authUser: any) => {
    try {
      const authId = authUser.id;
      const email = authUser.email || '';
      const fullName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        '';
      const avatarUrl =
        authUser.user_metadata?.avatar_url ||
        authUser.user_metadata?.picture ||
        '';
      const provider = authUser.app_metadata?.provider || 'email';

      // Try to find existing user by auth_id
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (existing) {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('auth_id', authId);

        setUser({
          id: existing.id,
          email: existing.email,
          fullName: existing.full_name || fullName,
          avatarUrl: existing.avatar_url || avatarUrl,
          provider: existing.provider,
          phone: existing.phone || '',
          emailVerified: existing.email_verified || false,
          phoneVerified: existing.phone_verified || false,
        });
      } else {
        // Check by email
        const { data: byEmail } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (byEmail) {
          // Link auth_id to existing record
          await supabase
            .from('users')
            .update({ auth_id: authId, last_login: new Date().toISOString() })
            .eq('email', email);

          setUser({
            id: byEmail.id,
            email: byEmail.email,
            fullName: byEmail.full_name || fullName,
            avatarUrl: byEmail.avatar_url || avatarUrl,
            provider: byEmail.provider,
            phone: byEmail.phone || '',
            emailVerified: byEmail.email_verified || false,
            phoneVerified: byEmail.phone_verified || false,
          });
        } else {
          // Create new user
          const { data: newUser, error } = await supabase
            .from('users')
            .insert({
              auth_id: authId,
              email,
              full_name: fullName,
              avatar_url: avatarUrl,
              provider,
              provider_id: authId,
              email_verified: provider !== 'email',
              meeting_count: 0,
            })
            .select()
            .maybeSingle();

          if (!error && newUser) {
            setUser({
              id: newUser.id,
              email: newUser.email,
              fullName: newUser.full_name,
              avatarUrl: newUser.avatar_url,
              provider: newUser.provider,
              phone: '',
              emailVerified: newUser.email_verified,
              phoneVerified: false,
            });
          }
        }
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await syncUserProfile(session.user);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAuthenticated: !!user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export { supabase };
