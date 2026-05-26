'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { apiGetBlogPosts, BlogPost } from '@/lib/api';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { Loader2, Search, ArrowRight, ArrowLeft, Tag, Calendar, User } from 'lucide-react';

export default function BlogIndexPage() {
  const { locale, t } = useLang();
  const isRTL = locale === 'ar';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Categories list
  const categories = isRTL 
    ? ['', 'التكنولوجيا', 'التربية', 'الحياة الأسرية']
    : ['', 'Technology', 'Parenting', 'Family Life'];

  useEffect(() => {
    fetchPosts();
  }, [page, search, category]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await apiGetBlogPosts({
        page: page.toString(),
        search,
        ...(category ? { category } : {})
      });
      setPosts(res.data || []);
      setTotalPages(res.last_page || 1);
    } catch (err: unknown) {
      console.error('Failed to load blog posts', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <CustomCursor />
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-36 pb-20 border-b border-white/10 bg-[#070707]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,179,8,0.06),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(236,72,153,0.04),_transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="kido-badge inline-flex">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {isRTL ? 'مدونة ستوري هيرو' : 'StoryHero Blog'}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4"
          >
            {isRTL ? 'قصص ورؤى من' : 'Stories & Insights from'}{' '}
            <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isRTL ? 'عالم الخيال' : 'our Universe'}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 max-w-xl mx-auto mt-4 text-base sm:text-lg leading-relaxed"
          >
            {isRTL 
              ? 'نصائح لتربية الأطفال، استكشاف تكنولوجيا الذكاء الاصطناعي، وإلهام قصص خيالية إبداعية.' 
              : 'Parenting tips, exploring AI technology, and inspiring creative bedtime narratives for children.'}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
          {/* Categories Tab strip */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                  category === cat
                    ? 'bg-gradient-to-r from-yellow-500 to-pink-500 border-transparent text-black shadow-lg shadow-pink-500/10'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat === '' ? (isRTL ? 'الكل' : 'All Categories') : cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={isRTL ? 'البحث عن المقالات...' : 'Search articles...'}
              className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 focus:border-yellow-500/50 rounded-full text-sm text-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Blog Post List */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-yellow-500" size={40} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 border border-white/5 bg-white/2 backdrop-blur rounded-3xl">
            <p className="text-gray-400 text-lg">{isRTL ? 'لا توجد مقالات مطابقة حالياً.' : 'No blog posts match your criteria.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col bg-white/2 hover:bg-white/5 border border-white/10 hover:border-yellow-500/30 rounded-3xl overflow-hidden transition-all duration-300"
              >
                {/* Thumbnail */}
                <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden shrink-0">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#222] flex items-center justify-center">
                      <span className="text-yellow-500/30 font-bold text-3xl font-display">StoryHero</span>
                    </div>
                  )}
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-yellow-500 flex items-center gap-1">
                    <Tag size={10} />
                    {isRTL ? post.category_ar : post.category_en}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {isRTL ? post.author_ar : post.author_en}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.published_at ? new Date(post.published_at).toLocaleDateString(locale) : ''}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold leading-snug group-hover:text-yellow-500 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {isRTL ? post.title_ar : post.title_en}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                      {isRTL 
                        ? post.content_ar.replace(/[#*`]/g, '').substring(0, 120) + '...'
                        : post.content_en.replace(/[#*`]/g, '').substring(0, 120) + '...'}
                    </p>
                  </div>

                  {/* Read More button */}
                  <div className="pt-6 border-t border-white/5 mt-6">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="inline-flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors group-hover:underline"
                    >
                      {isRTL ? 'اقرأ المزيد' : 'Read Article'}
                      {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/10 text-sm text-gray-400">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-50 transition-colors"
            >
              {isRTL ? 'السابق' : 'Previous'}
            </button>
            <span>
              {isRTL ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-50 transition-colors"
            >
              {isRTL ? 'التالي' : 'Next'}
            </button>
          </div>
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
