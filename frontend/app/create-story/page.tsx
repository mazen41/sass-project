'use client';

import { useState, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiCreateStory, apiGenerateStory, Story } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import {
  Camera,
  Compass,
  Rocket,
  Leaf,
  Sparkles,
  Waves,
  Shield,
  Crown,
  Anchor,
  Wand2
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

const getThemeIcon = (id: string, active: boolean) => {
  const size = 28;
  const strokeWidth = 2;
  const color = active ? 'var(--k-blue)' : 'var(--text-3)';
  const props = { size, strokeWidth, color, className: 'mx-auto' };

  switch (id) {
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

export default function CreateStoryPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { locale } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('adventure');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [createdStory, setCreatedStory] = useState<Story | null>(null);
  const [error, setError] = useState('');

  const isRTL = locale === 'ar';

  const t = {
    badge: isRTL ? 'استوديو القصص' : 'Story Studio',
    titlePre: isRTL ? 'أنشئ ' : 'Create a ',
    titleGradient: isRTL ? 'قصة سحرية' : 'Magical Story',
    subtitle: isRTL ? 'ارفع صورة، اختر موضوعاً، ودع ذكاءنا الاصطناعي يصنع مغامرة سينمائية.' : 'Upload a photo, choose a theme, and let our AI create a cinematic adventure.',
    uploadClick: isRTL ? 'انقر لرفع صورة' : 'Click to upload a photo',
    uploadDesc: isRTL ? 'الصورة الواضحة لطفلك تعمل بشكل أفضل' : 'Clear photo of your child works best',
    storyTitle: isRTL ? 'عنوان القصة' : 'Story Title',
    storyTitlePlaceholder: isRTL ? 'مثال: مغامرة بطلنا الصغير' : "e.g. My Little Hero's Adventure",
    childName: isRTL ? 'اسم الطفل' : "Child's Name",
    childNamePlaceholder: isRTL ? 'مثال: إيما' : 'e.g. Emma',
    age: isRTL ? 'العمر' : 'Age',
    chooseTheme: isRTL ? 'اختر موضوع القصة' : 'Choose a Theme',
    createBtn: isRTL ? 'إنشاء القصة' : 'Create Story',
    creating: isRTL ? 'جاري الإنشاء...' : 'Creating...',
    storyCreated: isRTL ? 'تم إنشاء القصة بنجاح!' : 'Story Created!',
    storyCreatedDesc: (title: string) => isRTL ? `قصتك "${title}" جاهزة للتوليد بالذكاء الاصطناعي.` : `Your story "${title}" is ready for AI generation.`,
    generateBtn: isRTL ? 'توليد القصة السينمائية' : 'Generate Story',
    generatingBtn: isRTL ? 'جاري توليد السحر...' : 'Generating Magic...',
    backToDashboard: isRTL ? 'العودة للوحة التحكم' : 'Back to Dashboard',
  };

  const themes = [
    { id: 'adventure', label: isRTL ? 'مغامرة' : 'Adventure', desc: isRTL ? 'مهمات ملحمية واكتشافات' : 'Epic quests and discoveries' },
    { id: 'space', label: isRTL ? 'فضاء' : 'Space', desc: isRTL ? 'رحلات كونية بين النجوم' : 'Cosmic journeys among stars' },
    { id: 'jungle', label: isRTL ? 'غابة' : 'Jungle', desc: isRTL ? 'استكشافات برية في الطبيعة' : 'Wild explorations in nature' },
    { id: 'fantasy', label: isRTL ? 'خيال' : 'Fantasy', desc: isRTL ? 'عوالم سحرية وعجائب' : 'Magic realms and wonders' },
    { id: 'ocean', label: isRTL ? 'محيط' : 'Ocean', desc: isRTL ? 'أسرار أعماق البحار' : 'Deep sea mysteries' },
    { id: 'dinosaur', label: isRTL ? 'ديناصور' : 'Dinosaur', desc: isRTL ? 'مغامرات ما قبل التاريخ' : 'Prehistoric adventures' },
    { id: 'superhero', label: isRTL ? 'بطل خارق' : 'Superhero', desc: isRTL ? 'إنقاذ المدينة بقوى خارقة' : 'Save the city with powers' },
    { id: 'princess', label: isRTL ? 'أميـرة' : 'Princess', desc: isRTL ? 'مهمات ملكية وقلاع' : 'Royal quests and castles' },
    { id: 'pirate', label: isRTL ? 'قرصان' : 'Pirate', desc: isRTL ? 'البحث عن الكنز في البحر' : 'Treasure hunting at sea' },
  ];

  if (!isLoggedIn) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('theme', selectedTheme);
      if (childName) formData.append('child_name', childName);
      if (childAge) formData.append('child_age', childAge);
      if (photo) formData.append('photo', photo);

      const { story } = await apiCreateStory(formData);
      setCreatedStory(story);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!createdStory) return;
    setGenerating(true);
    setError('');

    try {
      const { story } = await apiGenerateStory(createdStory.id);
      router.push(`/stories/${story.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate story');
      setGenerating(false);
    }
  };

  if (createdStory) {
    return (
      <div className="site-shell" style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isRTL ? 'rtl' : 'ltr'}>
        <CustomCursor />
        <Navbar />
        <div className="section" style={{ paddingTop: '8rem', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="text-indigo-400 mx-auto" size={64} style={{ marginBottom: '1.5rem' }} />
            <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              {t.storyCreated}
            </h2>
            <p style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>
              {t.storyCreatedDesc(createdStory.title)}
            </p>

            {photoPreview && (
              <div style={{ marginBottom: '2rem' }}>
                <Image src={photoPreview} alt="Uploaded" width={200} height={200} style={{ objectFit: "cover", borderRadius: "var(--r-lg)", border: "2px solid var(--border)" }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                className="btn btn-primary btn-lg"
                onClick={handleGenerate}
                disabled={generating}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {generating ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="spinner" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    {t.generatingBtn}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <Wand2 size={18} />
                    {t.generateBtn}
                  </span>
                )}
              </motion.button>
              <motion.button
                className="btn btn-ghost"
                onClick={() => router.push('/dashboard')}
                whileHover={{ scale: 1.02 }}
              >
                {t.backToDashboard}
              </motion.button>
            </div>

            {error && (
              <p style={{ color: 'var(--k-pink)', marginTop: '1rem' }}>{error}</p>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell" style={{ minHeight: '100vh', background: 'var(--bg)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <CustomCursor />
      <Navbar />
      <div className="section" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="kido-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
              <span className="kido-badge-star">✦</span> {t.badge}
            </span>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
              {t.titlePre}<span className="gradient-text">{t.titleGradient}</span>
            </h1>
            <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem' }}>
              {t.subtitle}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Photo Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: photoPreview ? 'transparent' : 'var(--surface)',
                transition: 'all 0.3s',
                position: 'relative',
              }}
            >
              {photoPreview ? (
                <Image src={photoPreview} alt="Preview" width={720} height={300} style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: "var(--r-md)" }} />
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: 'var(--text-2)' }}>
                    <Camera size={44} strokeWidth={1.5} />
                  </div>
                  <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1.1rem' }}>{t.uploadClick}</p>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{t.uploadDesc}</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                {t.storyTitle}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.storyTitlePlaceholder}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--r-md)',
                  border: '1.5px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Child Name & Age */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  {t.childName}
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder={t.childNamePlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--r-md)',
                    border: '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  {t.age}
                </label>
                <input
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  placeholder="5"
                  min={1}
                  max={18}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--r-md)',
                    border: '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '0.6rem', fontWeight: 600 }}>
                {t.chooseTheme}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                {themes.map((theme) => {
                  const isActive = selectedTheme === theme.id;
                  return (
                    <motion.button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '1.25rem 1rem',
                        borderRadius: 'var(--r-md)',
                        border: isActive ? '2px solid var(--k-blue)' : '1.5px solid var(--border)',
                        background: isActive ? 'rgba(84,120,255,0.08)' : 'var(--surface)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        color: 'var(--text)',
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                        {getThemeIcon(theme.id, isActive)}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{theme.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.25rem', lineHeight: '1.3' }}>{theme.desc}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--k-pink)', fontSize: '0.9rem' }}>{error}</p>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || !title}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="spinner" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  {t.creating}
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Sparkles size={18} />
                  {t.createBtn}
                </span>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
