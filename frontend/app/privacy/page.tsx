'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { apiGetLandingSettings, LandingPageSettings } from '@/lib/api';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { ArrowLeft, ArrowRight, Loader2, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';
  const [settings, setSettings] = useState<LandingPageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetLandingSettings()
      .then((res) => setSettings(res.settings))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const content = settings
    ? (isRTL ? settings.privacy_policy_ar : settings.privacy_policy_en)
    : '';

  // Simple, fast Markdown-to-JSX parser
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/5 pb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listText = line.replace(/^[-*]\s/, '');
        return (
          <li key={idx} className="ml-6 rtl:mr-6 list-disc text-gray-300 my-2 leading-relaxed">
            {parseBold(listText)}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        const listText = line.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-6 rtl:mr-6 list-decimal text-gray-300 my-2 leading-relaxed">
            {parseBold(listText)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-gray-300 leading-relaxed text-base mb-4">
          {parseBold(line)}
        </p>
      );
    });
  };

  const parseBold = (line: string) => {
    const parts = line.split('**');
    return parts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        return (
          <strong key={pIdx} className="text-yellow-500 font-bold">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="site-shell min-h-screen flex flex-col" data-theme="dark" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#070707', color: '#ffffff' }}>
      <CustomCursor />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors mb-8"
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>

        <div className="bg-white/2 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="animate-spin text-yellow-500" size={32} />
            </div>
          ) : (
            <article className="prose prose-invert max-w-none">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <Shield size={20} />
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </h1>
              </div>
              <div className="mt-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                {content ? renderMarkdown(content) : (
                  <p className="text-gray-400">
                    {isRTL ? 'سيتم تحميل سياسة الخصوصية قريباً.' : 'Privacy Policy will be uploaded soon.'}
                  </p>
                )}
              </div>
            </article>
          )}
        </div>
      </main>

      <footer className="footer mt-auto" style={{ background: '#050505', color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} StoryHero. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
