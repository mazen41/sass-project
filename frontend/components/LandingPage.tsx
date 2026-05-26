'use client';

import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import AnimatedScene from './AnimatedScene';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import { useLang } from '@/context/LangContext';
import { apiGetLandingSettings, LandingPageSettings } from '@/lib/api';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

/* ── Animation presets ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.72, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function Section({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className} style={style}>
      {children}
    </motion.div>
  );
}

/* ── Elegant Line Divider ── */
function WaveDivider({ flip = false, color = 'var(--bg-2)' }: { flip?: boolean; color?: string }) {
  return (
    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', width: '100%' }} />
  );
}

export default function LandingPage() {
  const { t, locale } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dbSettings, setDbSettings] = useState<LandingPageSettings | null>(null);

  useEffect(() => {
    apiGetLandingSettings()
      .then((res) => setDbSettings(res.settings))
      .catch((err) => console.error('Failed to load landing settings', err));
  }, []);

  const features = [
    {
      icon: (
        <svg style={{ width: 24, height: 24, color: '#E5C158' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      color: 'feat-icon-yellow', accent: 'kido-card-yellow', title: t('feat1_title'), desc: t('feat1_desc')
    },
    {
      icon: (
        <svg style={{ width: 24, height: 24, color: '#E5C158' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      color: 'feat-icon-yellow', accent: 'kido-card-yellow', title: t('feat2_title'), desc: t('feat2_desc')
    },
    {
      icon: (
        <svg style={{ width: 24, height: 24, color: '#E5C158' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20M14.214 16.055a9.394 9.394 0 00-5.84-2.81 4.125 4.125 0 10-4.121 8.232c2.09 0 4.02-.507 5.717-1.402m5.01-4.02a4.97 4.97 0 00-1.919-1.64M18.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 9.75a3 3 0 116 0 3 3 0 01-6 0z" />
        </svg>
      ),
      color: 'feat-icon-yellow', accent: 'kido-card-yellow', title: t('feat3_title'), desc: t('feat3_desc')
    },
    {
      icon: (
        <svg style={{ width: 24, height: 24, color: '#E5C158' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
      color: 'feat-icon-yellow', accent: 'kido-card-yellow', title: t('feat4_title'), desc: t('feat4_desc')
    },
    {
      icon: (
        <svg style={{ width: 24, height: 24, color: '#E5C158' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      color: 'feat-icon-yellow', accent: 'kido-card-yellow', title: t('feat5_title'), desc: t('feat5_desc')
    },
  ];

  const steps = [
    { num: '01', title: t('step1_title'), desc: t('step1_desc') },
    { num: '02', title: t('step2_title'), desc: t('step2_desc') },
    { num: '03', title: t('step3_title'), desc: t('step3_desc') },
    { num: '04', title: t('step4_title'), desc: t('step4_desc') },
  ];

  const pricingPlans = [
    {
      name: t('plan_basic'), price: t('plan_basic_price'), period: t('plan_per_month'),
      desc: t('plan_basic_desc'),
      features: ['3 ' + t('feat_stories'), t('feat_hd'), t('feat_voice')],
      checkClass: 'pricing-check-blue', featured: false,
    },
    {
      name: t('plan_pro'), price: t('plan_pro_price'), period: t('plan_per_month'),
      desc: t('plan_pro_desc'),
      features: ['15 ' + t('feat_stories'), t('feat_hd'), t('feat_voice'), t('feat_download')],
      checkClass: 'pricing-check-pink', featured: true,
    },
    {
      name: t('plan_premium'), price: t('plan_premium_price'), period: t('plan_per_month'),
      desc: t('plan_premium_desc'),
      features: [t('feat_unlimited'), t('feat_4k'), t('feat_voice'), t('feat_download'), t('feat_priority')],
      checkClass: 'pricing-check-yellow', featured: false,
    },
  ];

  const testimonials = [
    { initial: 'S', avatarClass: 'testi-avatar-blue',   name: 'Sarah M.', stars: 5,
      text: locale === 'ar' ? '"ابني أصبح بطل قصته الخاصة! السحر الحقيقي."' : '"My son became the hero of his own story! Pure magic."' },
    { initial: 'J', avatarClass: 'testi-avatar-pink',   name: 'James K.', stars: 5,
      text: locale === 'ar' ? '"جودة سينمائية لا تصدق من صورة واحدة فقط."' : '"Incredible cinematic quality from just one photo."' },
    { initial: 'L', avatarClass: 'testi-avatar-yellow', name: 'Layla R.', stars: 5,
      text: locale === 'ar' ? '"هدية مثالية. ابنتي تشاهد قصتها كل يوم."' : '"Perfect gift. My daughter watches her story every day."' },
  ];

  const faqs = dbSettings?.faqs && dbSettings.faqs.length > 0
    ? dbSettings.faqs.map(f => ({
        q: locale === 'ar' ? f.q_ar : f.q_en,
        a: locale === 'ar' ? f.a_ar : f.a_en
      }))
    : (locale === 'ar' ? [
        { q: 'ما هو StoryHero؟', a: 'منصة ذكاء اصطناعي لتحويل صور أطفالك إلى قصص ومقاطع فيديو سينمائية رائعة.' },
        { q: 'كم من الوقت يستغرق إنشاء القصة؟', a: 'بضع دقائق فقط! يعالج الذكاء الاصطناعي صورتك وينتج قصة كاملة مع مقطع فيديو.' },
        { q: 'هل هو آمن للأطفال؟', a: 'نعم! نحن نضع سلامة الأطفال في المقام الأول. جميع المحتويات مناسبة للأعمار وخاضعة للمراجعة.' },
        { q: 'هل يمكنني تنزيل القصص؟', a: 'نعم، يمكن لمشتركي الخطة الاحترافية والمميزة تنزيل القصص بجودة عالية.' },
      ] : [
        { q: 'What is StoryHero?', a: 'An AI platform that transforms photos of your children into breathtaking cinematic stories and videos.' },
        { q: 'How long does it take to create a story?', a: 'Just a few minutes! Our AI processes your photo and produces a complete story with a video.' },
        { q: 'Is it safe for kids?', a: 'Absolutely! We prioritize child safety. All content is age-appropriate and reviewed.' },
        { q: 'Can I download the stories?', a: 'Yes, Pro and Premium subscribers can download stories in high quality.' },
      ]);

  return (
    <div className="site-shell min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <CustomCursor />
      <Navbar />

      {/* ════════════════════════════════════════════
          HERO — Cinematic Full Viewport
      ═══════════════════════════════════════════════ */}
      <section className="kido-hero">
        {/* Background blobs */}
        <div className="hero-bg-blobs">
          <div className="blob blob-1" style={{ opacity: 0.15 }} />
          <div className="blob blob-2" style={{ opacity: 0.1 }} />
          <div className="blob blob-3" style={{ opacity: 0.08 }} />
        </div>

        {/* Animated scene canvas */}
        <AnimatedScene />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.2 }} />

        {/* Main content */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <span className="kido-badge">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {t('hero_badge')}
            </span>
          </motion.div>

          <motion.h1
            className="hero-h1 font-display"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontWeight: 800, letterSpacing: '-0.03em' }}
          >
            {t('hero_headline_1')}{' '}
            <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('hero_headline_2')}</span>
            <br />
            {t('hero_headline_3')}
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ color: 'var(--text-2)', fontWeight: 400 }}
          >
            {t('hero_sub')}
          </motion.p>

          <motion.div
            className="cta-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <Link href="/register" className="btn btn-primary btn-lg">
              <span>{t('hero_cta_primary')}</span>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="#how" className="btn btn-ghost btn-lg">
              {t('hero_cta_secondary')}
            </Link>
          </motion.div>

          {/* Preview story tags */}
          <motion.div
            className="hero-preview-strip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            {[
              { label: locale === 'ar' ? 'مغامرة الفضاء' : 'Space Adventure' },
              { label: locale === 'ar' ? 'مملكة الغابة' : 'Jungle Kingdom' },
              { label: locale === 'ar' ? 'أسطورة الفارس' : 'Knight\'s Legend' },
              { label: locale === 'ar' ? 'ساحر العالم' : 'Wizard World' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="hero-preview-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                style={{
                  animationDelay: `${i * 1.5}s`,
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)', backdropFilter: 'blur(8px)', color: 'var(--text-2)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em'
                }}
              >
                <span style={{ color: 'var(--k-yellow)', marginRight: '0.2rem' }}>✦</span>
                <span>{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
            }}>
              <span style={{ color: 'var(--text-3)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Fredoka, sans-serif' }}>
                {locale === 'ar' ? 'اكتشف المزيد' : 'Scroll to explore'}
              </span>
              <div style={{
                width: '1.5px', height: '44px',
                background: 'linear-gradient(to bottom, transparent, var(--k-blue))',
                borderRadius: '9999px',
                animation: 'float 2s ease-in-out infinite',
                opacity: 0.5,
              }} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Wave divider */}
      <WaveDivider color="var(--bg-2)" />

      {/* ════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════ */}
      <div style={{ background: 'var(--bg-2)' }}>
        <section className="section">
          <Section>
            <motion.div className="section-header" variants={fadeUp}>
              <span className="kido-badge">
                <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
                {t('features_badge')}
              </span>
              <h2>{t('features_title')}</h2>
              <p>{t('features_sub')}</p>
            </motion.div>

            <div className="features-grid">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="kido-card"
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ scale: 1.02, y: -4 }}
                  style={{
                    background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: '24px',
                    padding: '2.2rem 1.8rem'
                  }}
                >
                  <div className="feat-icon-wrap" style={{
                    width: 48, height: 48,
                    borderRadius: '12px 4px 12px 4px',
                    background: 'var(--surface)', border: '1.5px solid var(--border)', boxShadow: 'none',
                    display: 'grid',
                    placeItems: 'center',
                    marginBottom: '1.2rem'
                  }}>
                    {f.icon}
                  </div>
                  <h3 className="feat-title" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{f.title}</h3>
                  <p className="feat-desc" style={{ color: 'var(--text-2)' }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </section>
      </div>

      <WaveDivider flip color="var(--bg-2)" />

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="section" id="how">
        <Section>
          <motion.div className="section-header" variants={fadeUp}>
            <span className="kido-badge">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {t('how_badge')}
            </span>
            <h2>{t('how_title')}</h2>
          </motion.div>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="step-card"
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6, borderColor: 'var(--border-hover)' }}
                style={{
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: '24px',
                  padding: '2.5rem 1.8rem',
                  textAlign: 'left'
                }}
              >
                <div className="step-num" style={{
                  background: 'transparent',
                  border: '1.5px solid var(--border)', color: 'var(--k-yellow)',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  width: '38px',
                  height: '38px',
                  borderRadius: '4px',
                  marginBottom: '1.2rem',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: 'none'
                }}>{s.num}</div>
                <h3 className="step-title" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      <WaveDivider color="var(--bg-3)" />

      {/* ════════════════════════════════════════════
          AI SHOWCASE
      ═══════════════════════════════════════════════ */}
      <div style={{ background: 'var(--bg-3)' }}>
        <section className="section">
          <Section>
            <motion.div className="section-header" variants={fadeUp}>
              <span className="kido-badge">
                <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
                {locale === 'ar' ? 'المخرجات الإبداعية' : 'AI Output'}
              </span>
              <h2>
                {locale === 'ar' ? 'شاهد ما يتم' : 'See what gets'}{' '}
                <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{locale === 'ar' ? 'إنشاؤه' : 'created'}</span>
              </h2>
              <p>{locale === 'ar' ? 'من صورة واحدة — عالم سينمائي كامل.' : 'From one photo — a complete cinematic universe.'}</p>
            </motion.div>

            <div className="showcase-grid">
              {/* Video mock */}
              <motion.div className="video-mock glass" variants={fadeUp} whileHover={{ scale: 1.02 }}>
                <div className="video-inner">
                  <div className="video-stars" />
                  <div className="video-planet" />
                  <div className="video-moon" />
                  <div className="video-comet" />
                  <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <div className="play-btn-kido" style={{ margin: '0 auto 1rem' }}>
                      <div className="play-icon-kido" />
                    </div>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.76rem', margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.15em' }}>
                      CINEMATIC STORY PREVIEW
                    </p>
                  </div>
                  <div className="video-progress">
                    <div className="progress-bar"><div className="progress-fill" /></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                      <span>1:24</span><span>3:12</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Story cards */}
              <div className="story-cards-list">
                {[
                  { tag: '01', bg: 'rgba(229, 193, 88, 0.15)', title: locale === 'ar' ? 'مغامرة الفضاء' : 'Space Adventure', sub: locale === 'ar' ? '٤ فصول · ٢ دقيقة' : '4 chapters · 2 min' },
                  { tag: '02', bg: 'rgba(255, 64, 129, 0.15)', title: locale === 'ar' ? 'مملكة الغابة' : 'Jungle Kingdom', sub: locale === 'ar' ? '٦ فصول · ٣ دقائق' : '6 chapters · 3 min' },
                  { tag: '03', bg: 'rgba(0, 119, 255, 0.15)', title: locale === 'ar' ? 'أسطورة الفارس' : "Knight's Legend", sub: locale === 'ar' ? '٥ فصول · ٢.٥ دقيقة' : '5 chapters · 2.5 min' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="story-card-item glass"
                    variants={fadeUp}
                    custom={i + 1}
                    whileHover={{ borderColor: 'var(--border-hover)' }}
                    style={{
                      background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: '16px'
                    }}
                  >
                    <div className="story-thumb-emoji" style={{
                      background: item.bg,
                      borderRadius: '12px 4px 12px 4px',
                      color: 'var(--k-yellow)',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 800,
                      fontSize: '0.95rem'
                    }}>{item.tag}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.98rem', marginBottom: '0.25rem' }}>{item.title}</div>
                      <div style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{item.sub}</div>
                    </div>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--surface)', border: '1.5px solid var(--border)',
                      display: 'grid', placeItems: 'center', fontSize: '0.65rem',
                      color: 'var(--text)', flexShrink: 0,
                    }}>▶</div>
                  </motion.div>
                ))}

                <motion.div variants={fadeUp} custom={4} style={{ marginTop: '0.5rem' }}>
                  <Link href="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    {t('hero_cta_primary')}
                  </Link>
                </motion.div>
              </div>
            </div>
          </Section>
        </section>
      </div>

      <WaveDivider flip color="var(--bg-3)" />

      {/* ════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════ */}
      <section className="section" id="pricing">
        <Section>
          <motion.div className="section-header" variants={fadeUp}>
            <span className="kido-badge">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {t('pricing_badge')}
            </span>
            <h2>{t('pricing_title')}</h2>
            <p>{t('pricing_sub')}</p>
          </motion.div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`pricing-card ${plan.featured ? 'featured' : ''}`}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                style={{
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: '24px',
                  boxShadow: plan.featured ? '0 0 24px rgba(229, 193, 88, 0.15)' : 'none'
                }}
              >
                {plan.featured && (
                  <div className="pricing-featured-badge" style={{ background: 'var(--k-yellow)', color: '#050505', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                    {t('plan_popular')}
                  </div>
                )}
                <div>
                  <div className="pricing-name" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{plan.name}</div>
                  <div className="pricing-desc" style={{ color: 'var(--text-2)', fontSize: '0.88rem', marginTop: '0.3rem' }}>{plan.desc}</div>
                </div>
                <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
                  <span className="pricing-amount" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2.5rem' }}>{plan.price}</span>
                  <span className="pricing-period" style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>{plan.period}</span>
                </div>
                <ul className="pricing-features" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: 'var(--k-yellow)', fontWeight: 900 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  {t('plan_cta')}
                </Link>
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      <WaveDivider color="var(--bg-2)" />

      {/* ════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <div style={{ background: 'var(--bg-2)' }}>
        <section className="section">
          <Section>
            <motion.div className="section-header" variants={fadeUp}>
              <span className="kido-badge">
                <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
                {locale === 'ar' ? 'ماذا يقول الآباء' : 'What parents say'}
              </span>
              <h2>
                {locale === 'ar' ? 'لحظات' : 'Moments that'}{' '}
                <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{locale === 'ar' ? 'لا تُنسى' : 'last forever'}</span>
              </h2>
            </motion.div>

            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  className="testi-card"
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4 }}
                  style={{
                    background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: '24px'
                  }}
                >
                  <div className="testi-stars" style={{ color: 'var(--k-yellow)', marginBottom: '0.8rem' }}>
                    {'★'.repeat(t.stars)}
                  </div>
                  <p className="testi-text" style={{ color: 'var(--text-2)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.7 }}>{t.text}</p>
                  <div className="testi-author-row" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="testi-avatar" style={{
                      width: 32, height: 32,
                      borderRadius: '10px 4px 10px 4px',
                      background: 'var(--surface)', border: '1.5px solid var(--border)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--k-yellow)'
                    }}>{t.initial}</div>
                    <span className="testi-name" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        </section>
      </div>

      <WaveDivider flip color="var(--bg-2)" />

      {/* ════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════ */}
      <section className="section">
        <Section>
          <motion.div className="section-header" variants={fadeUp}>
            <span className="kido-badge">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
            </span>
            <h2>
              {locale === 'ar' ? 'هل لديك' : 'Got'}{' '}
              <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{locale === 'ar' ? 'أسئلة؟' : 'questions?'}</span>
            </h2>
          </motion.div>

          <div className="faq-list" style={{ maxWidth: '720px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="faq-item"
                variants={fadeUp}
                custom={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '1.25rem 0',
                  cursor: 'pointer'
                }}
              >
                <div className="faq-q" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {faq.q}
                  <span style={{ fontSize: '1.2rem', transition: 'transform 0.3s ease', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
                {openFaq === i && (
                  <motion.p
                    className="faq-a"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ color: 'var(--text-2)', fontSize: '0.92rem', marginTop: '0.8rem', lineHeight: 1.7 }}
                  >
                    {faq.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </Section>
      </section>

      {/* ════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════ */}
      <Section className="cta-section" style={{ position: 'relative', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: '32px', padding: '5rem 2rem', margin: '4rem auto', maxWidth: '1240px' }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,193,88,0.08), transparent 70%)', top: '-60px', right: '-60px', animation: 'float-blob 8s ease-in-out infinite' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div variants={fadeUp}>
            <span className="kido-badge">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {locale === 'ar' ? 'ابدأ مجاناً' : 'Start for free'}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            {locale === 'ar'
              ? <>اصنع <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ذكريات سينمائية</span> اليوم</>
              : <>Create <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>cinematic memories</span> today</>}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} style={{ color: 'var(--text-2)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            {locale === 'ar'
              ? 'انضم إلى آلاف الأسر التي تحوّل صور أطفالها إلى قصص سحرية لا تُنسى.'
              : 'Join thousands of families turning their children\'s photos into magical stories.'}
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="cta-row" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              {locale === 'ar' ? 'ابدأ مجاناً' : 'Start Free'}
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg">
              {locale === 'ar' ? 'تسجيل الدخول' : 'Log In'}
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="footer" style={{ background: '#050505', color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '5rem 0 3rem' }}>
        <div className="footer-inner" style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem' }}>
          <div className="footer-brand">
            <span className="nav-logo-kido" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              <span className="nav-logo-star" style={{ color: 'var(--k-yellow)' }}>✦</span> StoryHero
            </span>
            <p className="footer-brand-desc" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.78, marginTop: '0.9rem', maxWidth: 280 }}>
              {dbSettings ? (locale === 'ar' ? dbSettings.footer_tagline_ar : dbSettings.footer_tagline_en) : t('footer_tagline')}
            </p>
            <div className="footer-social" style={{ display: 'flex', gap: '0.8rem', marginTop: '1.25rem' }}>
              {[
                { name: 'Twitter', href: dbSettings?.social_links?.twitter, icon: Twitter },
                { name: 'Facebook', href: dbSettings?.social_links?.facebook, icon: Facebook },
                { name: 'Instagram', href: dbSettings?.social_links?.instagram, icon: Instagram },
                { name: 'Youtube', href: dbSettings?.social_links?.youtube, icon: Youtube },
              ]
                .filter(social => social.href && social.href !== '#' && social.href !== '')
                .map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#111] hover:bg-[#222] border border-[#333] hover:border-yellow-500/50 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                      title={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
            </div>
          </div>
          {dbSettings?.footer_sections && dbSettings.footer_sections.length > 0 ? (
            dbSettings.footer_sections.map((section, idx) => (
              <div key={idx} className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 className="footer-col-title" style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  {locale === 'ar' ? section.title_ar : section.title_en}
                </h4>
                {section.links?.map((link, lIdx) => {
                  const isExternal = link.url.startsWith('http') || link.url.startsWith('//');
                  if (isExternal) {
                    return (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}
                      >
                        {locale === 'ar' ? link.label_ar : link.label_en}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={lIdx}
                      href={link.url}
                      style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}
                    >
                      {locale === 'ar' ? link.label_ar : link.label_en}
                    </Link>
                  );
                })}
              </div>
            ))
          ) : (
            <>
              <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 className="footer-col-title" style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{t('footer_product')}</h4>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{t('footer_features')}</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{t('footer_pricing')}</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{locale === 'ar' ? 'أمثلة' : 'Examples'}</a>
              </div>
              <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 className="footer-col-title" style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{t('footer_company')}</h4>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{t('footer_about')}</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{t('footer_blog')}</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{locale === 'ar' ? 'وظائف' : 'Careers'}</a>
              </div>
              <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h4 className="footer-col-title" style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{t('footer_legal')}</h4>
                <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{t('footer_privacy')}</Link>
                <Link href="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem' }}>{t('footer_terms')}</Link>
              </div>
            </>
          )}
        </div>
        <div className="footer-bottom" style={{ maxWidth: '1240px', margin: '3rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          <span>{t('footer_rights')}</span>
          <span style={{ opacity: 0.6 }}>Made for creators and families seeking cinematic storytelling.</span>
        </div>
      </footer>
    </div>
  );
}
