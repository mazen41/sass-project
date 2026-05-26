'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { ArrowLeft, ArrowRight, ShieldCheck, Heart, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { apiGetLandingSettings, LandingPageSettings } from '@/lib/api';

export default function AboutPage() {
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
    ? (isRTL ? settings.about_content_ar : settings.about_content_en)
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
    <div className="site-shell min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <CustomCursor />
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-36 pb-20 border-b border-white/10 bg-[#070707]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,179,8,0.06),_transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="kido-badge inline-flex">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {isRTL ? 'قصتنا ورؤيتنا' : 'Our Vision & Purpose'}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 max-w-2xl mx-auto leading-tight"
          >
            {isRTL ? 'خلق لحظات سحرية' : 'We believe every child is the'}{' '}
            <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isRTL ? 'تدوم مدى الحياة' : 'hero of their own story'}
            </span>
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : content ? (
          <div className="prose prose-invert max-w-none space-y-6 bg-white/2 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.03),_transparent_60%)] pointer-events-none" />
            <div className="relative z-10">
              {renderMarkdown(content)}
            </div>
          </div>
        ) : (
          <>
            {/* Intro */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  {isRTL ? 'من نحن؟' : 'Who We Are'}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {isRTL 
                    ? 'StoryHero هي منصة إبداعية متطورة تدمج بين سرد القصص التقليدي وتكنولوجيا الذكاء الاصطناعي التوليدي. نحن نساعد العائلات على تحويل صور أطفالهم البسيطة إلى مغامرات سينمائية وشخصية فريدة من نوعها.'
                    : 'StoryHero is a creative platform combining traditional storytelling with generative AI. We help families convert simple photos of their children into custom, high-quality, cinematic adventures.'}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {isRTL
                    ? 'مهمتنا هي إيقاظ خيال الأطفال، وتشجيع حب القراءة، وخلق طقوس عائلية مشتركة قبل النوم تقرب الآباء من أطفالهم.'
                    : 'Our mission is to spark children\'s imagination, foster a lifelong love for reading, and create collaborative bedtime rituals that bring parents and kids closer together.'}
                </p>
              </div>
              <div className="relative aspect-video bg-gradient-to-br from-yellow-500/10 via-pink-500/5 to-transparent border border-white/10 rounded-3xl p-8 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.1),_transparent_60%)]" />
                <Sparkles size={64} className="text-yellow-500 animate-pulse relative z-10" />
              </div>
            </section>

            {/* Pillars */}
            <section className="space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-3xl font-bold text-white">{isRTL ? 'قيمنا الأساسية' : 'Our Pillars'}</h2>
                <p className="text-gray-400 mt-2">{isRTL ? 'المبادئ التي توجه كل سطر برمجي نكتبه.' : 'The principles that guide every line of code we write.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/2 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-yellow-500/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isRTL ? 'أمان تام للأطفال' : 'Child Safety First'}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {isRTL 
                      ? 'خصوصية طفلك هي أولويتنا. نقوم بمعالجة الصور بأمان تام وحذفها فوراً بعد توليد القصة. جميع المحتويات مناسبة للأطفال بنسبة ١٠٠٪.'
                      : 'Your child\'s data is handled with maximum security. Photos are deleted automatically after processing, and all generated text passes strict safety filters.'}
                  </p>
                </div>

                <div className="bg-white/2 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-pink-500/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isRTL ? 'إبداع بلا حدود' : 'Boundless Imagination'}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {isRTL 
                      ? 'نعيد صياغة عالم القراءة. نجعل طفلك بطلاً خارقاً، أو رائد فضاء، أو مستكشفاً، مما ينمي مهاراته وثقته بنفسه.'
                      : 'We make reading interactive. By placing your child at the center of the story, we boost their self-esteem and build a creative mindset.'}
                  </p>
                </div>

                <div className="bg-white/2 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-indigo-500/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{isRTL ? 'طقوس عائلية دافئة' : 'Shared Moments'}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {isRTL 
                      ? 'وقت النوم هو أثمن اللحظات. نساعدك على تحويله إلى طقس إبداعي مشترك يجمع الآباء والأطفال حول الفن والخيال.'
                      : 'Bedtime is sacred. We transform screen time into a collaborative, memory-making ritual where families create and laugh together.'}
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-white/2 border border-white/10 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.04),_transparent_60%)]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white relative z-10">
                {isRTL ? 'هل أنت جاهز لبدء المغامرة؟' : 'Ready to begin the adventure?'}
              </h2>
              <div className="mt-6 flex justify-center gap-4 relative z-10">
                <Link href="/register" className="btn btn-primary">
                  {isRTL ? 'ابدأ مجاناً' : 'Start for Free'}
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer" style={{ background: '#050505', color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} StoryHero. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
