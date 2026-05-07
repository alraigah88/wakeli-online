import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../page';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const PARTNER_FORM_URL = 'https://readdy.ai/api/form/d6eva2iohb161tfd9aj0';

export default function PartnerStrip() {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === 'ar';

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(isArabic ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
      return;
    }

    setSubmitting(true);
    try {
      if (!supabase) throw new Error('missing-supabase-config');
      const { error: dbError } = await supabase
        .from('subscriptions')
        .insert([
          {
            email: email.trim(),
            type: 'partner',
          },
        ]);

      if (dbError) throw dbError;

      if (supabaseUrl) {
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-subscription-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.trim(),
              type: 'partner',
            }),
          });
        } catch (notifError) {
          console.error('Notification error:', notifError);
        }
      }

      const formData = new URLSearchParams();
      formData.append('email', email.trim());
      formData.append('type', 'partner_inquiry');

      await fetch(PARTNER_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Partner submission error:', err);
      setError(isArabic ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* WhatsApp Contact */}
        <div className="flex justify-center mb-3">
          <a
            href="https://wa.me/966535797207"
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-mono text-sm font-semibold transition-all hover:scale-105 cursor-pointer whitespace-nowrap ${
              isDark
                ? 'bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25'
                : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
            }`}
          >
            <i className="ri-whatsapp-line text-lg w-5 h-5 flex items-center justify-center"></i>
            {isArabic ? 'التواصل للأعمال فقط والشراكات' : 'Business & Partnerships Only'}
          </a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <p
            className={`font-mono text-2xl md:text-3xl text-center md:text-start flex-shrink-0 font-extrabold`}
            style={{ color: '#8B0000' }}
          >
            <i className="ri-hand-heart-line me-2"></i>
            {isArabic
              ? 'نبحث عن شريك تجاري أو مستثمر'
              : 'Looking for a business partner or investor'}
          </p>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <i className="ri-checkbox-circle-fill text-lg text-green-500"></i>
                <span
                  className={`font-mono text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}
                >
                  {isArabic ? 'تم الإرسال بنجاح!' : 'Sent successfully!'}
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                id="partner-form"
                data-readdy-form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your email'}
                    disabled={submitting}
                    className={`w-56 md:w-64 px-4 py-2.5 rounded-lg font-mono text-sm transition-all focus:outline-none ${
                      isDark
                        ? 'bg-[#5a5490]/20 border border-[#5a5490]/30 text-white placeholder:text-white/25 focus:border-teal-400/50'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-teal-400'
                    } ${error ? (isDark ? 'border-red-400/50' : 'border-red-300') : ''}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 rounded-lg font-mono text-sm font-medium text-white transition-all cursor-pointer whitespace-nowrap ${
                    submitting
                      ? 'bg-teal-500/50 pointer-events-none'
                      : 'bg-teal-500 hover:bg-teal-600 hover:scale-105'
                  }`}
                >
                  {submitting ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <i className="ri-send-plane-fill text-xs"></i>
                      {isArabic ? 'تواصل' : 'Contact'}
                    </span>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {error && <p className="text-center font-mono text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </section>
  );
}
