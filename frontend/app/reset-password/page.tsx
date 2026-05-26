'use client';

import { FormEvent, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { apiResetPassword } from '@/lib/api';
import { Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token || !email) {
      return setError(isRTL ? 'الرابط غير صالح أو منتهي الصلاحية.' : 'Token or email is missing.');
    }
    if (password !== confirm) {
      return setError(isRTL ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiResetPassword({
        token,
        email,
        password,
        password_confirmation: confirm,
      });
      setSuccess(isRTL ? 'تم تغيير كلمة المرور بنجاح. يتم توجيهك الآن...' : 'Password has been reset successfully. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : (isRTL ? 'فشل إعادة التعيين.' : 'Password reset failed.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="lg:hidden mb-8 text-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">StoryHero</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{isRTL ? 'تعيين كلمة مرور جديدة' : 'Reset Password'}</h1>
      <p className="text-gray-400 mb-8">
        {isRTL 
          ? 'الرجاء إدخال كلمة المرور الجديدة وتأكيدها لحسابك.' 
          : 'Please enter your new password to restore access to your account.'}
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-950/50 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-950/50 border border-green-900/50 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {!success && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{isRTL ? 'كلمة المرور الجديدة' : 'New Password'}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 rtl:pr-4 rtl:pl-12 py-3 bg-[#111] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" aria-label="Toggle password">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-12 rtl:pr-4 rtl:pl-12 py-3 bg-[#111] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" aria-label="Toggle confirm password">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-pink-500 hover:from-yellow-400 hover:via-amber-300 hover:to-pink-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';

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
              {isRTL ? 'خطوة واحدة وتعود' : 'One step away from'}
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                {isRTL ? 'لرحلتك الإبداعية' : 'your creative journey'}
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              {isRTL ? 'عيّن كلمة المرور الجديدة لتأمين حسابك ومتابعة السرد والقصص.' : 'Set your new password to secure your account and resume storytelling.'}
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
        <Suspense fallback={
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
