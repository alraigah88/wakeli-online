import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export default function AuthModal({ isOpen, onClose, isDark }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supabase) {
      setError('إعدادات الدخول غير مفعلة حالياً');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      if (err.message?.includes('Invalid login credentials')) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('يرجى تأكيد بريدك الإلكتروني أولاً');
      } else {
        setError(err.message || 'حدث خطأ. حاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-teal-500/20"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-30%] right-[-20%] w-[300px] h-[300px] rounded-full bg-teal-400/10 blur-[100px]"></div>
            <div className="absolute bottom-[-30%] left-[-20%] w-[250px] h-[250px] rounded-full bg-cyan-400/10 blur-[90px]"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>

          {/* Content */}
          <div className="relative z-10 px-8 pt-12 pb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-500/40 shadow-2xl shadow-teal-500/30">
                  <img
                    src="https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d4a98132b4c7bfb8a15b56d046ddf8d5.png"
                    alt="وكيلي AI"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-4 border-slate-900 animate-pulse"></div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                مرحباً بعودتك 👋
              </h2>
              <p className="text-base text-slate-300">
                سجل دخولك للوصول إلى وكلائك
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-base text-center font-medium"
              >
                <i className="ri-error-warning-line ml-1"></i>
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="relative">
                <i className="ri-mail-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-full pr-12 pl-4 py-4 rounded-xl text-base border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-white placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>

              <div className="relative">
                <i className="ri-lock-line absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full pr-12 pl-4 py-4 rounded-xl text-base border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-white placeholder:text-slate-500"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all shadow-xl shadow-teal-500/30 cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-wait"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin text-xl"></i>
                    جاري التحميل...
                  </span>
                ) : 'تسجيل الدخول'}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
