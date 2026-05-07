import { useState, useEffect } from 'react';
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

const NEWSLETTER_FORM_URL = 'https://readdy.ai/api/form/d6eun8iohb161tfd9a6g';

interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  created_at: string;
  is_approved: boolean;
}

function StarRating({
  rating,
  onRate,
  interactive = false,
  size = 'text-xl',
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
  size?: string;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${size} transition-all duration-200 ${
            interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'
          }`}
          disabled={!interactive}
        >
          <i
            className={`${
              star <= (hovered || rating) ? 'ri-star-fill' : 'ri-star-line'
            } ${
              star <= (hovered || rating) ? 'text-amber-400' : 'text-gray-300'
            }`}
          ></i>
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === 'ar';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Newsletter
  const [nlEmail, setNlEmail] = useState('');
  const [nlSubmitting, setNlSubmitting] = useState(false);
  const [nlSuccess, setNlSuccess] = useState(false);
  const [nlError, setNlError] = useState('');

  // جلب جميع التقييمات من Supabase بدون فلترة
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      if (!supabase) {
        setLoadingReviews(false);
        return;
      }
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // حساب متوسط التقييم
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!newReview.name.trim()) {
      setError(isArabic ? 'يرجى إدخال اسمك' : 'Please enter your name');
      return;
    }
    if (newReview.rating === 0) {
      setError(isArabic ? 'يرجى اختيار تقييم بالنجوم' : 'Please select a star rating');
      return;
    }
    if (!newReview.text.trim()) {
      setError(isArabic ? 'يرجى كتابة رأيك' : 'Please write your review');
      return;
    }
    if (newReview.text.length > 500) {
      setError(isArabic ? 'الرأي يجب أن لا يتجاوز 500 حرف' : 'Review must not exceed 500 characters');
      return;
    }

    setSubmitting(true);
    try {
      if (!supabase) throw new Error('missing-supabase-config');
      // إضافة التقييم مع is_approved = true تلقائياً
      const { data: insertedReview, error: insertError } = await supabase
        .from('reviews')
        .insert([
          {
            name: newReview.name.trim(),
            rating: newReview.rating,
            review_text: newReview.text.trim(),
            is_approved: true,
          },
        ])
        .select()
        .maybeSingle();

      if (insertError) throw insertError;

      // إضافة التقييم الجديد مباشرة إلى القائمة بدون إعادة جلب
      if (insertedReview) {
        setReviews(prev => [insertedReview, ...prev]);
      }

      setSubmitted(true);
      setNewReview({ name: '', text: '', rating: 0 });

      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error('Review submission error:', err);
      setError(
        isArabic
          ? 'حدث خطأ، يرجى المحاولة مرة أخرى'
          : 'An error occurred, please try again'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNlError('');

    if (!nlEmail.trim()) {
      setNlError(isArabic ? 'يرجى إدخال بريدك الإلكتروني' : 'Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nlEmail)) {
      setNlError(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
      return;
    }

    setNlSubmitting(true);
    try {
      if (!supabase) throw new Error('missing-supabase-config');
      // حفظ في Supabase
      const { error: dbError } = await supabase
        .from('subscriptions')
        .insert([
          {
            email: nlEmail.trim(),
            type: 'newsletter',
          },
        ]);

      if (dbError) throw dbError;

      if (supabaseUrl) {
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-subscription-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: nlEmail.trim(),
              type: 'newsletter',
            }),
          });
        } catch (notifError) {
          console.error('Notification error:', notifError);
        }
      }

      const formData = new URLSearchParams();
      formData.append('email', nlEmail.trim());

      await fetch(NEWSLETTER_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      setNlSuccess(true);
      setNlEmail('');
      setTimeout(() => setNlSuccess(false), 5000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setNlError(
        isArabic
          ? 'حدث خطأ، يرجى المحاولة مرة أخرى'
          : 'An error occurred, please try again'
      );
    } finally {
      setNlSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isArabic) {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* عرض التقييمات الحقيقية */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            {/* متوسط التقييم */}
            <div className="text-center mb-12">
              <h2
                className={`font-mono text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {isArabic ? 'آراء عملائنا' : 'Customer Reviews'}
              </h2>
              <div className="flex items-center justify-center gap-3 mb-2">
                <StarRating rating={Math.round(averageRating)} size="text-3xl" />
                <span
                  className={`font-mono text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p
                className={`font-mono text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {isArabic
                  ? `بناءً على ${reviews.length} تقييم`
                  : `Based on ${reviews.length} reviews`}
              </p>
            </div>

            {/* بطاقات التقييمات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl p-6 border transition-all hover:scale-[1.02] ${
                    isDark
                      ? 'bg-slate-800/40 border-slate-700/30 hover:border-amber-400/30'
                      : 'bg-white/90 border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4
                        className={`font-mono font-bold text-lg mb-1 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {review.name}
                      </h4>
                      <p
                        className={`font-mono text-xs ${
                          isDark ? 'text-slate-500/50' : 'text-slate-400'
                        }`}
                      >
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    <StarRating rating={review.rating} size="text-base" />
                  </div>
                  <p
                    className={`font-mono text-sm leading-relaxed font-medium ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {review.review_text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {loadingReviews && (
          <div className="text-center py-12">
            <i
              className={`ri-loader-4-line animate-spin text-4xl ${
                isDark ? 'text-white/30' : 'text-gray-300'
              }`}
            ></i>
          </div>
        )}

        {/* Write Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <i
              className={`ri-edit-2-line text-xl ${
                isDark ? 'text-amber-400/70' : 'text-amber-500'
              }`}
            ></i>
            <h3
              className={`font-mono text-xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {isArabic ? 'شاركنا رأيك وفكرتك' : 'Share Your Review & Ideas'}
            </h3>
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center"
              >
                <p
                  className={`font-mono text-sm font-bold ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}
                >
                  {isArabic
                    ? 'شكراً لك! تم إرسال رأيك بنجاح 🎉'
                    : 'Thank you! Your review was submitted successfully 🎉'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-mono">
              {error}
            </div>
          )}

          <form
            id="reviews-form"
            onSubmit={handleReviewSubmit}
            data-readdy-form=""
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block font-mono text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300/70' : 'text-slate-600'
                  }`}
                >
                  {isArabic ? 'اسمك' : 'Your Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
                  maxLength={50}
                  className={`w-full px-4 py-3 rounded-lg font-mono text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-slate-800/40 border border-slate-700/40 text-white placeholder:text-slate-500/50 focus:border-amber-400/50'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-400'
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block font-mono text-sm font-medium mb-2 ${
                    isDark ? 'text-slate-300/70' : 'text-slate-600'
                  }`}
                >
                  {isArabic ? 'تقييمك' : 'Your Rating'}
                </label>
                <div className="px-4 py-3">
                  <StarRating
                    rating={newReview.rating}
                    onRate={(r) =>
                      setNewReview((prev) => ({ ...prev, rating: r }))
                    }
                    interactive
                    size="text-2xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                className={`block font-mono text-sm font-medium mb-2 ${
                  isDark ? 'text-slate-300/70' : 'text-slate-600'
                }`}
              >
                {isArabic ? 'رأيك أو فكرتك' : 'Your Review or Idea'}
              </label>
              <textarea
                name="review"
                value={newReview.text}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setNewReview((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }));
                  }
                }}
                placeholder={
                  isArabic
                    ? 'اكتب رأيك أو فكرتك هنا...'
                    : 'Write your review or idea here...'
                }
                rows={3}
                maxLength={500}
                className={`w-full px-4 py-3 rounded-lg font-mono text-sm transition-all focus:outline-none resize-none ${
                  isDark
                    ? 'bg-slate-800/40 border border-slate-700/40 text-white placeholder:text-slate-500/50 focus:border-amber-400/50'
                    : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-400'
                }`}
              />
              <div
                className={`text-end font-mono text-[10px] mt-1 ${
                  isDark ? 'text-slate-500/30' : 'text-slate-400'
                }`}
              >
                {newReview.text.length}/500
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || submitted}
              className={`px-6 py-3 rounded-lg font-mono font-bold text-sm text-white transition-all cursor-pointer whitespace-nowrap ${
                submitting || submitted
                  ? 'bg-amber-500/50 pointer-events-none'
                  : 'bg-amber-500 hover:bg-amber-600 hover:shadow-md'
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  {isArabic ? 'جاري الإرسال...' : 'Sending...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="ri-send-plane-fill"></i>
                  {isArabic ? 'أرسل رأيك' : 'Submit Review'}
                </span>
              )}
            </button>
          </form>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="max-w-xl mx-auto">
            <h3
              className={`font-mono text-xl md:text-2xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {isArabic
                ? 'لا تفوّت وكيلك الذكي! 🚀'
                : "Don't Miss Your Smart Agent! 🚀"}
            </h3>
            <p
              className={`font-mono text-base font-medium mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-800'
              }`}
            >
              {isArabic
                ? 'اشترك ليصلك وكيلك فور الإطلاق مع عروض حصرية للمشتركين الأوائل'
                : 'Subscribe to get your agent upon launch with exclusive early subscriber offers'}
            </p>

            <AnimatePresence>
              {nlSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <p
                    className={`font-mono text-sm font-bold ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}
                  >
                    {isArabic
                      ? 'تم تسجيلك بنجاح! سنبلغك فور الإطلاق 🎉'
                      : "Successfully registered! We'll notify you upon launch 🎉"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {nlError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-mono">
                {nlError}
              </div>
            )}

            <form
              id="newsletter-form"
              onSubmit={handleNewsletterSubmit}
              data-readdy-form=""
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  name="email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your email'}
                  disabled={nlSubmitting || nlSuccess}
                  className={`w-full px-4 py-3 ${
                    isArabic ? 'pe-11' : 'ps-11'
                  } rounded-lg font-mono text-sm transition-all focus:outline-none ${
                    isDark
                      ? 'bg-slate-800/40 border border-slate-700/40 text-white placeholder:text-slate-500/40 focus:border-teal-400/50'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-400'
                  } ${nlSubmitting || nlSuccess ? 'opacity-50' : ''}`}
                />
                <i
                  className={`ri-mail-line absolute top-1/2 -translate-y-1/2 ${
                    isArabic ? 'end-4' : 'start-4'
                  } text-lg ${isDark ? 'text-slate-500/50' : 'text-slate-400'}`}
                ></i>
              </div>
              <button
                type="submit"
                disabled={nlSubmitting || nlSuccess}
                className={`px-6 py-3 rounded-lg font-mono font-bold text-sm text-white transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto ${
                  nlSubmitting || nlSuccess
                    ? 'bg-teal-500/50 pointer-events-none'
                    : 'bg-teal-500 hover:bg-teal-600 hover:shadow-md'
                }`}
              >
                {nlSubmitting ? (
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                ) : (
                  <>{isArabic ? 'اشترك' : 'Subscribe'}</>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 mt-4">
              {[
                {
                  icon: 'ri-shield-check-line',
                  text: isArabic ? 'بياناتك آمنة' : 'Safe',
                },
                { icon: 'ri-spam-line', text: isArabic ? 'بدون إزعاج' : 'No spam' },
                { icon: 'ri-gift-line', text: isArabic ? 'عروض حصرية' : 'Exclusive' },
              ].map((item, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-1 font-mono text-[11px] ${
                    isDark ? 'text-slate-500/40' : 'text-slate-400'
                  }`}
                >
                  <i className={`${item.icon} text-xs`}></i>
                  {item.text}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}