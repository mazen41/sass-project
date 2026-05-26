'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Tag, 
  Layers, 
  Clock,
  Loader2
} from 'lucide-react';
import { apiGetLandingSettings, LandingPageSettings } from '@/lib/api';

interface ExampleStory {
  id: string;
  genre_en: string;
  genre_ar: string;
  age_en: string;
  age_ar: string;
  moral_en: string;
  moral_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  kid_name_en: string;
  kid_name_ar: string;
  kid_img: string;
  hero_title_en: string;
  hero_title_ar: string;
  hero_img: string;
}

export default function ExamplesPage() {
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
    ? (isRTL ? settings.examples_content_ar : settings.examples_content_en)
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

  const t = {
    title: isRTL ? 'معرض المغامرات السينمائية' : 'Cinematic Adventure Gallery',
    subtitle: isRTL ? 'شاهد كيف يحول ذكاؤنا الاصطناعي صور الأطفال البسيطة إلى ملاحم فنية وقصص مخصصة تفوق الخيال.' : 'Explore real examples of how single child portrait uploads are synthesized into custom masterpieces.',
    badge: isRTL ? 'معرض الأعمال' : 'Our Creative Outputs',
    beforeLabel: isRTL ? 'الصورة الأصلية' : 'Original Photo',
    afterLabel: isRTL ? 'اللوحة السينمائية' : 'Cinematic Illustration',
    genre: isRTL ? 'النوع:' : 'Genre:',
    age: isRTL ? 'العمر المناسب:' : 'Target Age:',
    moral: isRTL ? 'العبرة الأخلاقية:' : 'Moral Theme:',
    excerptTitle: isRTL ? 'مقتطف من القصة:' : 'Story Excerpt:',
    ctaTitle: isRTL ? 'اجعل طفلك بطلاً لقصته الخاصة اليوم!' : 'Make your child the hero of their adventure!',
    ctaSubtitle: isRTL ? 'يستغرق الأمر دقيقتين فقط لرؤية السحر أمام عينيك.' : 'It takes only two minutes to generate a full customized story and video.',
    ctaBtn: isRTL ? 'ابدأ مغامرتك الآن' : 'Start Your Adventure',
  };

  const examples: ExampleStory[] = [
    {
      id: 'space',
      genre_en: 'Sci-Fi Adventure',
      genre_ar: 'مغامرة خيال علمي',
      age_en: '5 - 9 Years',
      age_ar: '٥ - ٩ سنوات',
      moral_en: 'Curiosity & Friendship',
      moral_ar: 'الفضول والصداقة',
      kid_name_en: 'Leo, age 6',
      kid_name_ar: 'ليو، ٦ سنوات',
      kid_img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      hero_title_en: 'Captain Leo & The Nebula Whispers',
      hero_title_ar: 'الكابتن ليو وهمس السديم',
      hero_img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      excerpt_en: '**Leo** gripped the control joystick of the Star-Sailer. His curly brown hair floated slightly in the zero-gravity cabin. Ahead of him, the colorful gaseous clouds of the Nebula Whispers sang a soft, chime-like frequency. Together with his co-pilot robot, Leo was about to decode the ancient interstellar map...',
      excerpt_ar: 'أمسك **ليو** بمقبض التحكم في سفينة النجوم. تطاير شعره البني المجعد قليلاً في مقصورة انعدام الجاذبية. أمامه مباشرة، كانت سحب غاز السديم الملونة تغني بنغمة هادئة أشبه بالرنين. بالتعاون مع آليه المساعد، كان ليو على وشك فك رموز خريطة الفضاء الأثرية...'
    },
    {
      id: 'forest',
      genre_en: 'Medieval Fantasy',
      genre_ar: 'خيال قرون وسطى',
      age_en: '6 - 11 Years',
      age_ar: '٦ - ١١ سنة',
      moral_en: 'Courage & Environmental Care',
      moral_ar: 'الشجاعة وحماية الطبيعة',
      kid_name_en: 'Sania, age 8',
      kid_name_ar: 'سانيا، ٨ سنوات',
      kid_img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=400',
      hero_title_en: 'Sania and the Whispering Redwood',
      hero_title_ar: 'سانيا وشجرة الردود الهامسة',
      hero_img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      excerpt_en: 'The forest was ancient, but **Sania** felt entirely at home. She stepped onto the moss-covered roots of the Whispering Redwood. Holding her wooden staff high, a magical light flared from its tip. She could hear the tree calling—not with a voice, but with a deep warmth that whispered: *Protect us, Guardian...*',
      excerpt_ar: 'كانت الغابة عتيقة للغاية، لكن **سانيا** شعرت وكأنها في منزلها تماماً. خطت فوق الجذور الكثيفة المغطاة بالطحالب لشجرة الردود الهامسة. ورفعت عصاها الخشبية عالياً، لينبعث ضوء سحري من طرفها. سمعت الشجرة تنادي—ليس بصوت بشري، بل بدفء عميق يهمس: *احمينا يا حارسة...*'
    },
    {
      id: 'sea',
      genre_en: 'Oceanic Expedition',
      genre_ar: 'استكشاف أعماق المحيط',
      age_en: '4 - 8 Years',
      age_ar: '٤ - ٨ سنوات',
      moral_en: 'Cooperation & Empathy',
      moral_ar: 'التعاون والتعاطف',
      kid_name_en: 'Tariq, age 7',
      kid_name_ar: 'طارق، ٧ سنوات',
      kid_img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      hero_title_en: 'Tariq & the bioluminescent kingdom',
      hero_title_ar: 'طارق ومملكة الضوء الحيوي',
      hero_img: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800',
      excerpt_en: 'Wearing his special brass diving helmet, **Tariq** floated gently inside the neon-lit coral reefs. Schooling fish glowed in ribbons of sapphire and emerald. Guided by a friendly blue dolphin, Tariq swam closer to the golden chest nestled between swaying sea anemones, realising the real treasure was the trust they shared.',
      excerpt_ar: 'مرتدياً خوذة الغوص النحاسية الخاصة به، طفا **طارق** بلطف بين الشعاب المرجانية المضاءة بالنيون. كانت أسراب الأسماك تلمع بأشرطة من الياقوت والزمرد. وبتوجيه من دلفين أزرق صديق، سبح طارق مقترباً من الصندوق الذهبي المستقر بين شقائق النعمان المتموجة، مدركاً أن الكنز الحقيقي هو ثقة كل منهم بالآخر.'
    }
  ];

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

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,179,8,0.06),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(236,72,153,0.04),_transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="kido-badge inline-flex">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {t.badge}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 max-w-3xl mx-auto leading-tight"
          >
            {isRTL ? 'حول صورتهم العادية إلى' : 'Convert their everyday look into'}{' '}
            <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isRTL ? 'فن سينمائي حقيقي' : 'cinema-grade masterpiece'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto mt-4 text-base sm:text-lg leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Showcases */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full space-y-24">
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
          examples.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <section 
                key={item.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}
              >
                {/* Image Split Panel */}
                <div className={`lg:col-span-6 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="grid grid-cols-12 gap-4 items-end">
                    {/* Kid Portrait */}
                    <div className="col-span-4 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block text-center">
                        {t.beforeLabel}
                      </span>
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                        <img 
                          src={item.kid_img} 
                          alt={item.kid_name_en} 
                          className="w-full h-full object-cover grayscale opacity-80"
                        />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm py-1 rounded text-[10px] text-center font-medium text-white">
                          {isRTL ? item.kid_name_ar : item.kid_name_en}
                        </div>
                      </div>
                    </div>

                    {/* Cinematic Output */}
                    <div className="col-span-8 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-500 block text-center flex items-center justify-center gap-1">
                        <Sparkles size={10} />
                        {t.afterLabel}
                      </span>
                      <div className="relative aspect-video rounded-3xl overflow-hidden border border-yellow-500/20 shadow-2xl">
                        <img 
                          src={item.hero_img} 
                          alt={item.hero_title_en} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Description Panel */}
                <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                      {isRTL ? item.hero_title_ar : item.hero_title_en}
                    </h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <span className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                        <Tag size={12} className="text-yellow-500/85" />
                        <strong>{t.genre}</strong> {isRTL ? item.genre_ar : item.genre_en}
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                        <Clock size={12} className="text-yellow-500/85" />
                        <strong>{t.age}</strong> {isRTL ? item.age_ar : item.age_en}
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                        <Layers size={12} className="text-yellow-500/85" />
                        <strong>{t.moral}</strong> {isRTL ? item.moral_ar : item.moral_en}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/2 border border-white/10 rounded-3xl p-6 sm:p-8 relative">
                    <div className="absolute top-4 right-6 text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <User size={13} />
                      {isRTL ? 'الراوي' : 'Narrator'}
                    </div>
                    <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-3">
                      {t.excerptTitle}
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {isRTL ? parseBold(item.excerpt_ar) : parseBold(item.excerpt_en)}
                    </p>
                  </div>
                </div>
              </section>
            );
          })
        )}

        {/* CTA */}
        <section className="bg-white/2 border border-white/10 rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.04),_transparent_60%)]" />
          
          <h2 className="text-3xl font-extrabold text-white relative z-10">
            {t.ctaTitle}
          </h2>
          <p className="text-gray-400 mt-3 text-sm sm:text-base relative z-10 max-w-lg mx-auto">
            {t.ctaSubtitle}
          </p>

          <div className="mt-8 flex justify-center relative z-10">
            <Link href="/register" className="btn btn-primary inline-flex items-center gap-2 px-8 py-4">
              {t.ctaBtn}
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer mt-auto" style={{ background: '#050505', color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} StoryHero. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
