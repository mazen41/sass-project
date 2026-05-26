'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { apiForgotPassword } from '@/lib/api';
import { Loader2, Mail, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiForgotPassword(email);
      setSuccess(
        isRTL
          ? 'لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
          : res.message || 'We have emailed your password reset link.'
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : (isRTL ? 'فشل إرسال البريد' : 'Failed to send password reset email')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left: Cinematic Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#111]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(234,179,8,0.12),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(236,72,153,0.08),_transparent_50%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-pink-500 bg-clip-text text-transparent">StoryHero</span>
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-md">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              {isRTL ? 'استعد الوصول إلى' : 'Restore access to'}
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                {isRTL ? 'حسابك الإبداعي' : 'your creative account'}
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              {isRTL ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور فوراً.' : 'Enter your email and we will send you a link to reset your password immediately.'}
            </p>
          </motion.div>

          <div className="flex gap-6 text-sm text-gray-500">
            <span>10K+ {isRTL ? 'عائلة' : 'Families'}</span>
            <span>50K+ {isRTL ? 'قصة' : 'Stories'}</span>
            <span>4.9★ {isRTL ? 'تقييم' : 'Rating'}</span>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-6">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Link>
          </div>

          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">StoryHero</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">{isRTL ? 'نسيت كلمة المرور' : 'Forgot Password'}</h1>
          <p className="text-gray-400 mb-8">
            {isRTL 
              ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابط إعادة التعيين.' 
              : 'Enter your registered email address to receive a reset link.'}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-950/50 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-950/50 border border-green-900/50 text-green-400 px-4 py-3 rounded-xl text-sm leading-relaxed">
                {success}
              </div>
            )}

            {!success && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isRTL ? 'بريدك الإلكتروني' : 'you@example.com'}
                    className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-pink-500 hover:from-yellow-400 hover:via-amber-300 hover:to-pink-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : isRTL ? 'إرسال رابط التعيين' : 'Send Reset Link'}
                </button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
