'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { apiGetStories, Story, apiGetActiveSubscription, Subscription } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Loader2, BookOpen, Video, ImageIcon, User, Crown, Sparkles, ArrowRight, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { isLoggedIn, user } = useAuth();
  const { locale } = useLang();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeSub, setActiveSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const isRTL = locale === 'ar';

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const loadDashboardData = async () => {
      try {
        const [storiesData, subData] = await Promise.all([
          apiGetStories(),
          apiGetActiveSubscription()
        ]);
        setStories(storiesData.data || []);
        setActiveSub(subData.subscription);
      } catch {
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const firstName = user?.name?.split(' ')[0] ?? '';
  const greeting = isRTL ? `مرحباً، ${firstName}` : `Welcome back, ${firstName}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400 uppercase tracking-wider">
              {isRTL ? 'استوديو القصص' : 'Story Studio'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {greeting} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">✦</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {isRTL ? 'استوديو القصص الاصطناعي الخاص بك في انتظارك.' : 'Your AI story studio is waiting for you.'}
          </p>
        </motion.div>

        {/* Hero CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-[#333] p-8 mb-8"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(234,179,8,0.1),_transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle,_rgba(236,72,153,0.08),_transparent_70%)]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">{isRTL ? 'ابدأ قصتك الأولى' : 'Create your first story'}</h2>
            </div>
            <p className="text-gray-400 max-w-lg mb-6 text-lg">
              {isRTL
                ? 'ارفع صورة طفلك وشاهد العالم السينمائي يُولد في ثوانٍ.'
                : 'Upload a photo of your child and watch a cinematic world be born in seconds.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/create-story"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 via-amber-400 to-pink-500 hover:from-yellow-400 hover:via-amber-300 hover:to-pink-400 text-black font-bold rounded-xl transition-all"
              >
                {isRTL ? 'إنشاء قصة' : 'Create Story'}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                href="/#how"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white font-medium rounded-xl transition-all"
              >
                {isRTL ? 'عرض الأمثلة' : 'View Examples'}
              </Link>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* My Stories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#333] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-white">{stories.length}</span>
              </div>
              <h3 className="font-semibold mb-1">{isRTL ? 'قصصي' : 'My Stories'}</h3>
              {stories.length === 0 ? (
                <p className="text-gray-500 text-sm">{isRTL ? 'لا توجد قصص بعد' : 'No stories yet'}</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {stories.slice(0, 3).map((story) => (
                    <Link
                      key={story.id}
                      href={`/stories/${story.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-yellow-400 transition-colors">{story.title}</p>
                        <p className="text-xs text-gray-500">
                          {story.status === 'completed' ? (isRTL ? '✓ جاهز' : '✓ Ready') : story.status === 'processing' ? (isRTL ? 'جاري المعالجة...' : 'Processing...') : (isRTL ? 'مسودة' : 'Draft')}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {stories.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">+{stories.length - 3} {isRTL ? 'المزيد' : 'more'}</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* My Videos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#333] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-pink-400" />
                </div>
                <span className="text-2xl font-bold text-white">0</span>
              </div>
              <h3 className="font-semibold mb-1">{isRTL ? 'فيديوهاتي' : 'My Videos'}</h3>
              <p className="text-gray-500 text-sm">{isRTL ? 'لا توجد فيديوهات بعد' : 'No videos yet'}</p>
              <Link href="/create-story" className="inline-flex items-center gap-1 mt-4 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                {isRTL ? 'إنشاء فيديو' : 'Create video'}
                <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#333] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-white">0</span>
              </div>
              <h3 className="font-semibold mb-1">{isRTL ? 'معرضي' : 'My Gallery'}</h3>
              <p className="text-gray-500 text-sm">{isRTL ? 'لا توجد صور بعد' : 'No images yet'}</p>
              <Link href="/create-story" className="inline-flex items-center gap-1 mt-4 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                {isRTL ? 'إنشاء صورة' : 'Create image'}
                <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>

            {/* Account */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#333] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">{isRTL ? 'الحساب' : 'Account'}</h3>
              <p className="text-white font-medium text-sm mb-1">{user?.name}</p>
              <p className="text-gray-500 text-sm mb-3">{user?.email}</p>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400 uppercase">
                  {activeSub ? activeSub.plan?.name : (isRTL ? 'الخطة المجانية' : 'Free Plan')}
                </span>
              </div>
              <Link
                href="/billing"
                className="inline-flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                {activeSub ? (isRTL ? 'إدارة الاشتراك' : 'Manage subscription') : (isRTL ? 'ترقية الخطة' : 'Upgrade plan')}
                <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
