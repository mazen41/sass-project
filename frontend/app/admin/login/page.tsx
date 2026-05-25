'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { apiLogin, apiRegister, apiSocialRedirect } from '@/lib/api';
import { Loader2, Eye, EyeOff } from 'lucide-react';

type Mode = 'login' | 'register';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (password !== confirm) {
        return setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { token, user } = await apiLogin({ email, password });
        if (user.role !== 'super_admin' && user.role !== 'admin') {
          setError(isRTL ? 'غير مصرح لك بالوصول إلى لوحة الإدارة' : 'You are not authorized to access the admin panel');
          setLoading(false);
          return;
        }
        login(token, user);
        router.push('/admin');
      } else {
        const { token, user } = await apiRegister({
          name,
          email,
          password,
          password_confirmation: confirm,
        });
        login(token, user);
        router.push('/admin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isRTL ? 'فشلت العملية' : 'Operation failed'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialAuth(provider: 'google' | 'facebook' | 'apple') {
    setSocialLoading(provider);
    try {
      const { url } = await apiSocialRedirect(provider);
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (isRTL ? 'فشل الاتصال' : 'Connection failed'));
      setSocialLoading(null);
    }
  }

  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[420px]"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">StoryHero</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">
            {isLogin ? (isRTL ? 'لوحة الإدارة' : 'Admin Panel') : (isRTL ? 'تسجيل حساب إداري' : 'Admin Sign Up')}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? (isRTL ? 'تسجيل الدخول للمتابعة' : 'Sign in to continue')
              : (isRTL ? 'إنشاء حساب إداري جديد' : 'Create a new admin account')}
          </p>
        </div>

        {/* Social Auth */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['google', 'facebook', 'apple'] as const).map((provider) => (
            <button
              key={provider}
              onClick={() => handleSocialAuth(provider)}
              disabled={!!socialLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              {socialLoading === provider ? (
                <Loader2 size={18} className="animate-spin" />
              ) : provider === 'google' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.67 0 3.16.58 4.33 1.71l3.24-3.24C17.47 1.18 14.93 0 12 0 7.31 0 3.23 2.69 1.23 6.57l3.76 2.92C6.09 6.34 8.82 5.04 12 5.04z"/><path fill="#4285F4" d="M23.5 12.23c0-.87-.08-1.71-.22-2.53H12v4.78h6.45c-.28 1.47-1.11 2.72-2.36 3.56l3.82 2.96C21.8 18.76 23.5 15.72 23.5 12.23z"/><path fill="#FBBC05" d="M5.04 14.49l-3.76 2.92C3.23 21.31 7.31 24 12 24c2.93 0 5.47-.98 7.27-2.91l-3.82-2.96c-.98.66-2.24 1.05-3.45 1.05-2.66 0-4.91-1.8-5.71-4.17z"/><path fill="#34A853" d="M12 10.43v4.78h6.45c-.28 1.47-1.11 2.72-2.36 3.56l3.82 2.96C21.8 18.76 23.5 15.72 23.5 12.23z"/></svg>
              ) : provider === 'facebook' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.016 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.85-1.52 2.37-2.48 4.02-2.51 1.34-.01 2.55.91 3.34.91.78 0 2.26-1.29 3.81-1.08.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              )}
              <span className="hidden sm:inline capitalize">{provider}</span>
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#333]" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0a0a0a] px-3 text-gray-500">{isRTL ? 'أو بالبريد الإلكتروني' : 'Or with email'}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950/50 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{isRTL ? 'الاسم' : 'Name'}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRTL ? 'اسمك' : 'John Doe'}
                className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">{isRTL ? 'كلمة المرور' : 'Password'}</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" aria-label="Toggle password">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50 transition-all"
                  required={!isLogin}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" aria-label="Toggle confirm password">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-pink-500 hover:from-yellow-400 hover:via-amber-300 hover:to-pink-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : isLogin ? (isRTL ? 'تسجيل الدخول' : 'Sign In') : (isRTL ? 'إنشاء حساب' : 'Create Account')}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          {isLogin
            ? (isRTL ? 'ليس لديك حساب؟ ' : "Don't have an account? ")
            : (isRTL ? 'لديك حساب بالفعل؟ ' : 'Already have an account? ')}
          <button
            onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); }}
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            {isLogin ? (isRTL ? 'سجل الآن' : 'Sign up') : (isRTL ? 'سجل دخولك' : 'Sign in')}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
