'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { apiGetStories, Story, apiGetActiveSubscription, Subscription, LimitDetails } from '@/lib/api';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Loader2, BookOpen, Video, Image as ImageIcon, User, Crown, 
  ArrowRight, HardDrive, Plus, Calendar, Settings, FileText 
} from 'lucide-react';

export default function DashboardPage() {
  const { isLoggedIn, user } = useAuth();
  const { locale } = useLang();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeSub, setActiveSub] = useState<Subscription | null>(null);
  const [storyLimits, setStoryLimits] = useState<LimitDetails | null>(null);
  const [videoLimits, setVideoLimits] = useState<LimitDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const isRTL = locale === 'ar';

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  const loadDashboardData = useCallback(async () => {
    try {
      const [storiesData, subData] = await Promise.all([
        apiGetStories(),
        apiGetActiveSubscription()
      ]);
      setStories(storiesData.data || []);
      setActiveSub(subData.subscription);
      if (subData.story_limits) setStoryLimits(subData.story_limits);
      if (subData.video_limits) setVideoLimits(subData.video_limits);
    } catch (err) {
      console.error(err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadDashboardData();
  }, [isLoggedIn, loadDashboardData]);

  if (!isLoggedIn) return null;

  const firstName = user?.name?.split(' ')[0] ?? '';
  const greeting = isRTL ? `مرحباً بعودتك، ${user?.name}` : `Welcome back, ${user?.name}`;

  return (
    <div className="min-h-screen bg-[#070708] text-gray-100 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-2xl shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{greeting}</h1>
              <p className="text-gray-400 text-sm mt-1">
                {isRTL 
                  ? 'قم بإدارة قصصك المصورة والخدمات الإضافية المتاحة في حسابك.' 
                  : 'Manage your animated story generation, active subscription and addons.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Crown size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              {activeSub ? activeSub.plan?.name : (isRTL ? 'الخطة المجانية' : 'Free Account')}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0f0f12] p-5 rounded-2xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium">{isRTL ? 'القصص هذا الشهر' : 'Stories This Month'}</p>
              <h4 className="text-lg font-bold mt-0.5 text-white">
                {storyLimits ? (
                  `${storyLimits.usage} / ${storyLimits.is_unlimited ? '∞' : storyLimits.total_limit}`
                ) : (
                  stories.length
                )}
              </h4>
              {storyLimits && (
                <p className="text-[10px] text-gray-500 mt-1">
                  {isRTL ? 'اليوم:' : 'Today:'} {storyLimits.daily_usage} / {storyLimits.is_daily_unlimited ? '∞' : storyLimits.daily_total_limit}
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#0f0f12] p-5 rounded-2xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
              <Video size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium">{isRTL ? 'الفيديوهات هذا الشهر' : 'Videos This Month'}</p>
              <h4 className="text-lg font-bold mt-0.5 text-white">
                {videoLimits ? (
                  `${videoLimits.usage} / ${videoLimits.is_unlimited ? '∞' : videoLimits.total_limit}`
                ) : (
                  '0'
                )}
              </h4>
              {videoLimits && (
                <p className="text-[10px] text-gray-500 mt-1">
                  {isRTL ? 'اليوم:' : 'Today:'} {videoLimits.daily_usage} / {videoLimits.is_daily_unlimited ? '∞' : videoLimits.daily_total_limit}
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#0f0f12] p-5 rounded-2xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{isRTL ? 'الصور في المعرض' : 'Gallery Images'}</p>
              <h4 className="text-xl font-bold mt-0.5 text-white">0</h4>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-5 rounded-2xl border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <HardDrive size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{isRTL ? 'المساحة المستخدمة' : 'Storage Used'}</p>
              <h4 className="text-xl font-bold mt-0.5 text-white">0.0 MB</h4>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stories Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{isRTL ? 'القصص الأخيرة' : 'Recent Stories'}</h3>
              <Link 
                href="/create-story" 
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {isRTL ? 'إنشاء قصة جديدة' : 'Create new story'}
                <Plus size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 bg-[#0f0f12] border border-gray-800 rounded-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            ) : stories.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0f0f12] border border-gray-800 rounded-2xl">
                <BookOpen size={48} className="text-gray-600 mb-4 opacity-50" />
                <p className="text-gray-400 text-sm mb-4">{isRTL ? 'لم تقم بإنشاء أي قصص بعد.' : 'You haven\'t created any stories yet.'}</p>
                <Link
                  href="/create-story"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
                >
                  {isRTL ? 'ابدأ كتابة قصتك الأولى' : 'Start your first story'}
                  <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="group bg-[#0f0f12] hover:bg-[#131317] border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border
                          ${story.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {story.status === 'completed' ? (isRTL ? 'جاهز' : 'Ready') : (isRTL ? 'معالجة' : 'Processing')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {story.created_at ? new Date(story.created_at).toLocaleDateString(locale) : ''}
                        </span>
                      </div>
                      <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">{story.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{story.theme || (isRTL ? 'لا يوجد موضوع متاح' : 'No theme provided')}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-800/80">
                      <span className="text-xs font-semibold text-indigo-400 group-hover:underline flex items-center gap-1">
                        {isRTL ? 'عرض القصة' : 'View Story'}
                        <ArrowRight size={12} className={isRTL ? 'rotate-180' : ''} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Active Subscription Details */}
            <div className="bg-[#0f0f12] border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Crown size={16} className="text-indigo-400" />
                {isRTL ? 'تفاصيل الاشتراك' : 'Subscription Status'}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-[#070708] p-3 rounded-xl border border-gray-800">
                  <span className="text-xs text-gray-500 block">{isRTL ? 'الخطة الحالية' : 'Current Plan'}</span>
                  <span className="font-bold text-white block mt-0.5">{activeSub ? activeSub.plan?.name : (isRTL ? 'حساب مجاني' : 'Free Account')}</span>
                </div>

                <div className="space-y-2 bg-[#070708] p-3 rounded-xl border border-gray-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isRTL ? 'القصص المتبقية' : 'Remaining Stories'}:</span>
                    <span className="font-bold text-white">
                      {storyLimits ? (storyLimits.is_unlimited ? (isRTL ? 'غير محدود' : 'Unlimited') : storyLimits.remaining) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{isRTL ? 'الفيديوهات المتبقية' : 'Remaining Videos'}:</span>
                    <span className="font-bold text-white">
                      {videoLimits ? (videoLimits.is_unlimited ? (isRTL ? 'غير محدود' : 'Unlimited') : videoLimits.remaining) : 0}
                    </span>
                  </div>
                  {activeSub && (
                    <div className="flex justify-between pt-1.5 border-t border-gray-800/80">
                      <span className="text-gray-500">{isRTL ? 'الأيام المتبقية للاشتراك' : 'Days Remaining'}:</span>
                      <span className="font-bold text-indigo-400">
                        {storyLimits ? storyLimits.days_remaining : 0} {isRTL ? 'أيام' : 'days'}
                      </span>
                    </div>
                  )}
                </div>

                {((storyLimits && storyLimits.addon_limit > 0) || (videoLimits && videoLimits.addon_limit > 0)) && (
                  <div className="bg-[#070708] p-3 rounded-xl border border-gray-800 text-xs space-y-1">
                    <span className="text-gray-400 font-bold block mb-1">{isRTL ? 'الزيادات النشطة (Add-ons)' : 'Active Add-ons'}:</span>
                    {storyLimits && storyLimits.addon_limit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{isRTL ? 'قصص إضافية' : 'Extra Stories'}:</span>
                        <span className="font-semibold text-indigo-400">+{storyLimits.addon_limit}</span>
                      </div>
                    )}
                    {videoLimits && videoLimits.addon_limit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{isRTL ? 'فيديوهات إضافية' : 'Extra Videos'}:</span>
                        <span className="font-semibold text-indigo-400">+{videoLimits.addon_limit}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeSub && activeSub.current_period_end && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} className="text-indigo-400" />
                    <span>
                      {isRTL ? 'ينتهي في:' : 'Renews on:'} {new Date(activeSub.current_period_end).toLocaleDateString(locale)}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href="/billing"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    {activeSub ? (isRTL ? 'إدارة خطتي وترقيتها' : 'Manage & Upgrade Plan') : (isRTL ? 'الترقية لباقة مدفوعة' : 'Upgrade to Premium')}
                    <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0f0f12] border border-gray-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Settings size={16} className="text-indigo-400" />
                {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
              </h3>

              <div className="grid grid-cols-1 gap-2">
                <Link
                  href="/create-story"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#070708] border border-gray-800 hover:border-gray-700 hover:bg-[#131317] transition-all text-xs font-medium text-gray-300"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} className="text-indigo-400" />
                    {isRTL ? 'إنشاء قصة مصورة' : 'Create Animated Story'}
                  </span>
                  <Plus size={14} />
                </Link>

                <Link
                  href="/billing"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#070708] border border-gray-800 hover:border-gray-700 hover:bg-[#131317] transition-all text-xs font-medium text-gray-300"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-indigo-400" />
                    {isRTL ? 'الفواتير ومعاملات الدفع' : 'Billing & Invoice History'}
                  </span>
                  <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
