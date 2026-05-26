'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { Loader2 } from 'lucide-react';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  useEffect(() => {
    const token = searchParams.get('token');
    const idStr = searchParams.get('id');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    if (token && idStr && name && email && role) {
      const id = parseInt(idStr, 10);
      login(token, {
        id,
        name,
        email,
        role: role as 'user' | 'admin' | 'super_admin',
        status: 'active',
        created_at: new Date().toISOString(),
      });
      router.push('/dashboard');
    } else {
      router.push('/login?error=invalid_callback_params');
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center text-white p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-6 max-w-sm">
        <div className="relative w-16 h-16 mx-auto">
          <Loader2 className="animate-spin text-yellow-500 w-full h-full" size={48} />
        </div>
        <h2 className="text-2xl font-black tracking-tight font-sans">
          {isRTL ? 'جاري التحقق من الهوية...' : 'Authenticating...'}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          {isRTL 
            ? 'جاري تأمين اتصالك وتوجيهك إلى لوحة التحكم الخاصة بك.' 
            : 'Securing your session and redirecting you to your creative dashboard.'}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center text-white p-6">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
