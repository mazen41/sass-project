'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { apiGetBlogPost, BlogPost } from '@/lib/api';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { Loader2, ArrowLeft, ArrowRight, Tag, Calendar, User, BookOpen } from 'lucide-react';

export default function BlogPostReaderPage() {
  const router = useRouter();
  const params = useParams();
  const { locale } = useLang();
  const isRTL = locale === 'ar';
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await apiGetBlogPost(slug);
      setPost(res.post);
    } catch (err: unknown) {
      setError(isRTL ? 'المقال غير موجود أو غير منشور.' : 'Article not found or unpublished.');
    } finally {
      setLoading(false);
    }
  };

  // Simple, fast, secure JSX Markdown parser
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      // Headings
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-bold text-white mt-8 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Bullet list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listText = line.replace(/^[-*]\s/, '');
        return (
          <li key={idx} className="ml-6 rtl:mr-6 list-disc text-gray-300 my-1.5 leading-relaxed">
            {parseBold(listText)}
          </li>
        );
      }
      // Ordered list items
      if (line.match(/^\d+\.\s/)) {
        const listText = line.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-6 rtl:mr-6 list-decimal text-gray-300 my-1.5 leading-relaxed">
            {parseBold(listText)}
          </li>
        );
      }
      // Spacers
      if (line.trim() === '') {
        return <div key={idx} className="h-3" />;
      }
      // Standard paragraph
      return (
        <p key={idx} className="text-gray-300 leading-relaxed text-base mb-5">
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

  const title = post ? (isRTL ? post.title_ar : post.title_en) : '';
  const content = post ? (isRTL ? post.content_ar : post.content_en) : '';
  const category = post ? (isRTL ? post.category_ar : post.category_en) : '';
  const author = post ? (isRTL ? post.author_ar : post.author_en) : '';

  return (
    <div className="site-shell min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <CustomCursor />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-500 hover:text-yellow-400 transition-colors mb-8"
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {isRTL ? 'العودة للمدونة' : 'Back to Blog'}
        </Link>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-950/20 text-red-400 p-6 rounded-2xl border border-red-900/30 text-center">
            {error}
          </div>
        ) : !post ? null : (
          <article className="space-y-8">
            {/* Header info */}
            <div className="space-y-4 text-center sm:text-left rtl:sm:text-right">
              <span className="kido-badge inline-flex">
                <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
                {category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {title}
              </h1>

              {/* Meta details */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm text-gray-500 font-medium pt-2">
                <span className="flex items-center gap-1.5">
                  <User size={16} className="text-gray-400" />
                  {author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-gray-400" />
                  {post.published_at ? new Date(post.published_at).toLocaleDateString(locale) : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-gray-400" />
                  {isRTL ? 'قراءة ٣ دقائق' : '3 min read'}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {post.image_url && (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src={post.image_url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Markdown Body Content */}
            <div className="bg-white/2 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(content)}
              </div>
            </div>
          </article>
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
