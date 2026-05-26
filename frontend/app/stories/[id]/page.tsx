'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiGetStory, apiDeleteStory, Story } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import {
  BookOpen,
  Video,
  Trash2,
  Compass,
  Rocket,
  Leaf,
  Sparkles,
  Waves,
  Shield,
  Crown,
  Anchor,
  Wand2,
  Calendar,
  Clock,
  Globe,
  User,
  ArrowLeft
} from 'lucide-react';

const DinosaurIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 18c0-3.5 2.5-6 6-6 1.5 0 3 .5 4 1.5V11c0-2.5 2-4.5 4.5-4.5H19c1.7 0 3 1.3 3 3v2c0 1.7-1.3 3-3 3h-1v1c0 2.2-1.8 4-4 4h-5.5c-3 0-5.5-2.5-5.5-5.5z" />
    <path d="M17 11.5v-1" />
    <path d="M19.5 9a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill="currentColor" />
    <path d="M12 18l-1.5 3" />
    <path d="M8 18.5l-1.5 3.5" />
  </svg>
);

export default function StoryViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { locale } = useLang();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isRTL = locale === 'ar';

  const t = {
    loading: isRTL ? 'جاري تحميل القصة...' : 'Loading story...',
    notFound: isRTL ? 'القصة غير موجودة' : 'Story not found',
    backBtn: isRTL ? 'العودة للوحة التحكم' : 'Back to Dashboard',
    deleteConfirm: isRTL ? 'هل أنت متأكد من حذف هذه القصة نهائياً؟' : 'Are you sure you want to delete this story?',
    deleteFailed: isRTL ? 'فشل حذف القصة' : 'Failed to delete story',
    created: isRTL ? 'تم الإنشاء في' : 'Created',
    themeLabel: isRTL ? 'الموضوع' : 'Theme',
    storyTitle: isRTL ? 'القصة' : 'The Story',
    scenesTitle: isRTL ? 'المشاهد السينمائية' : 'Scenes',
    childLabel: isRTL ? 'الطفل' : 'Child',
    ageLabel: isRTL ? 'العمر' : 'Age',
    ageValue: (age: number) => isRTL ? `${age} سنوات` : `${age} years`,
    durationLabel: isRTL ? 'المدة' : 'Duration',
    langLabel: isRTL ? 'اللغة' : 'Language',
    deleteBtn: isRTL ? 'حذف القصة' : 'Delete Story',
    statusDraft: isRTL ? 'مسودة' : 'Draft',
    statusProcessing: isRTL ? 'جاري المعالجة' : 'Processing',
    statusCompleted: isRTL ? 'جاهز' : 'Completed',
    statusFailed: isRTL ? 'فشل' : 'Failed',
  };

  const themes: Record<string, string> = {
    adventure: isRTL ? 'مغامرة' : 'Adventure',
    space: isRTL ? 'فضاء' : 'Space',
    jungle: isRTL ? 'غابة' : 'Jungle',
    fantasy: isRTL ? 'خيال' : 'Fantasy',
    ocean: isRTL ? 'محيط' : 'Ocean',
    dinosaur: isRTL ? 'ديناصور' : 'Dinosaur',
    superhero: isRTL ? 'بطل خارق' : 'Superhero',
    princess: isRTL ? 'أميرة' : 'Princess',
    pirate: isRTL ? 'قرصان' : 'Pirate',
  };

  const getThemeIcon = (theme: string) => {
    const size = 20;
    const strokeWidth = 2;
    const color = 'var(--k-blue)';
    const props = { size, strokeWidth, color };

    switch (theme) {
      case 'adventure':
        return <Compass {...props} />;
      case 'space':
        return <Rocket {...props} />;
      case 'jungle':
        return <Leaf {...props} />;
      case 'fantasy':
        return <Wand2 {...props} />;
      case 'ocean':
        return <Waves {...props} />;
      case 'dinosaur':
        return <DinosaurIcon {...props} />;
      case 'superhero':
        return <Shield {...props} />;
      case 'princess':
        return <Crown {...props} />;
      case 'pirate':
        return <Anchor {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!id) return;

    const loadStory = async () => {
      try {
        const { story } = await apiGetStory(Number(id));
        setStory(story);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load story');
      } finally {
        setLoading(false);
      }
    };
    loadStory();
  }, [id, isLoggedIn, router]);

  const handleDelete = async () => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await apiDeleteStory(Number(id));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.deleteFailed);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      draft: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: t.statusDraft },
      processing: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: t.statusProcessing },
      completed: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', label: t.statusCompleted },
      failed: { bg: 'rgba(248,113,113,0.15)', color: '#f87171', label: t.statusFailed },
    };
    const s = styles[status] || styles.draft;
    return (
      <span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600 }}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="site-shell" style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CustomCursor />
        <Navbar />
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--k-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-2)' }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="site-shell" style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '7rem' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <CustomCursor />
        <Navbar />
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--k-pink)' }}>{error || t.notFound}</p>
          <button className="btn btn-ghost" onClick={() => router.push('/dashboard')} style={{ marginTop: '1rem' }}>
            {t.backBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell" style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <CustomCursor />
      <Navbar />

      <div className="section" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
                {getThemeIcon(story.theme)}
              </div>
              {getStatusBadge(story.status)}
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>
              {story.title}
            </h1>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>{t.created}: {new Date(story.created_at).toLocaleDateString(locale)}</span>
              <span>•</span>
              <span>{t.themeLabel}: {themes[story.theme] || story.theme}</span>
            </p>
          </motion.div>

          {/* Photo */}
          {story.photo_url && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ marginTop: '2rem' }}
            >
              <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                <Image src={story.photo_url} alt="Story photo" width={800} height={400} style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }} />
              </div>
            </motion.div>
          )}

          {/* Story Content */}
          {story.content && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                marginTop: '2rem',
                padding: '2rem',
                borderRadius: 'var(--r-lg)',
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
              }}
            >
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} className="text-indigo-400" />
                <span className="gradient-text">{t.storyTitle}</span>
              </h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {story.content}
              </p>
            </motion.div>
          )}

          {/* Scenes */}
          {story.scenes && story.scenes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ marginTop: '2rem' }}
            >
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={20} className="text-indigo-400" />
                <span className="gradient-text">{t.scenesTitle}</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {story.scenes.map((scene, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--surface)',
                      border: '1.5px solid var(--border)',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--k-blue), var(--k-pink))',
                      display: 'grid', placeItems: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.85rem',
                      flexShrink: 0,
                    }}>
                      {scene.chapter}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.15rem' }}>{scene.description}</p>
                      <p style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{scene.duration}s</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Info bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              marginTop: '2rem',
              padding: '1.25rem',
              borderRadius: 'var(--r-lg)',
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
            }}
          >
            {story.child_name && (
              <div>
                <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={12} /> {t.childLabel}
                </p>
                <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{story.child_name}</p>
              </div>
            )}
            {story.child_age && (
              <div>
                <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> {t.ageLabel}
                </p>
                <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{t.ageValue(story.child_age)}</p>
              </div>
            )}
            {story.duration_seconds && (
              <div>
                <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {t.durationLabel}
                </p>
                <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>
                  {Math.floor(story.duration_seconds / 60)}:{String(story.duration_seconds % 60).padStart(2, '0')}
                </p>
              </div>
            )}
            <div>
              <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Globe size={12} /> {t.langLabel}
              </p>
              <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{story.language.toUpperCase()}</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <button
              className="btn btn-primary"
              onClick={() => router.push('/dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
              {t.backBtn}
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleDelete}
              style={{ color: 'var(--k-pink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={16} />
              {t.deleteBtn}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
