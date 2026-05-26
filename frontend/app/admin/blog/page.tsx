'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import {
  apiGetAdminBlogPosts,
  apiCreateBlogPost,
  apiUpdateBlogPost,
  apiDeleteBlogPost,
  apiUploadBlogPostImage,
  BlogPost
} from '@/lib/api';
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Search,
  Eye,
  EyeOff,
  User,
  Tag,
  Calendar,
  X,
  Save
} from 'lucide-react';

export default function AdminBlogPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const res = await apiUploadBlogPostImage(file);
      setCurrentPost(prev => prev ? { ...prev, image_url: res.url } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await apiGetAdminBlogPosts({
        page: page.toString(),
        search: search
      });
      setPosts(res.data || []);
      setTotalPages(res.last_page || 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentPost({
      title_en: '',
      title_ar: '',
      slug: '',
      category_en: '',
      category_ar: '',
      content_en: '',
      content_ar: '',
      image_url: '',
      author_en: 'StoryHero Team',
      author_ar: 'فريق ستوري هيرو',
      is_published: true
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPost) => {
    setCurrentPost(post);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      if (currentPost.id) {
        await apiUpdateBlogPost(currentPost.id, currentPost);
        setSuccess(isRTL ? 'تم تحديث المقال بنجاح' : 'Blog post updated successfully');
      } else {
        await apiCreateBlogPost(currentPost);
        setSuccess(isRTL ? 'تم إنشاء المقال بنجاح' : 'Blog post created successfully');
      }
      setIsModalOpen(false);
      fetchPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this blog post?')) return;
    try {
      await apiDeleteBlogPost(id);
      setSuccess(isRTL ? 'تم حذف المقال' : 'Blog post deleted');
      fetchPosts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" />
            {isRTL ? 'إدارة مقالات المدونة' : 'Blog Article Manager'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRTL
              ? 'إنشاء وتعديل وحذف المقالات المخصصة للمدونة لدعم السيو والتسويق.'
              : 'Create, edit, and delete articles for the blog to drive SEO and organic growth.'}
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          {isRTL ? 'إضافة مقال جديد' : 'Add New Post'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
          {success}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={isRTL ? 'البحث في المقالات...' : 'Search articles...'}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p>{isRTL ? 'لم يتم العثور على أي مقالات.' : 'No blog posts found.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">{isRTL ? 'المقال' : 'Article'}</th>
                  <th className="px-6 py-4">{isRTL ? 'التصنيف' : 'Category'}</th>
                  <th className="px-6 py-4">{isRTL ? 'الكاتب' : 'Author'}</th>
                  <th className="px-6 py-4">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4">{isRTL ? 'تاريخ النشر' : 'Published Date'}</th>
                  <th className="px-6 py-4 text-center">{isRTL ? 'العمليات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                        )}
                        <div className="truncate max-w-[240px]">
                          <span className="font-semibold text-gray-900 dark:text-white block truncate">
                            {isRTL ? post.title_ar : post.title_en}
                          </span>
                          <span className="text-xs text-gray-400 font-mono block truncate">
                            /{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <Tag size={12} />
                        {isRTL ? post.category_ar : post.category_en}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {isRTL ? post.author_ar : post.author_en}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold text-xs bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full">
                          <Eye size={12} />
                          {isRTL ? 'منشور' : 'Published'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 font-semibold text-xs bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                          <EyeOff size={12} />
                          {isRTL ? 'مسودة' : 'Draft'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        {post.published_at ? new Date(post.published_at).toLocaleDateString(locale) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(post)}
                          className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                          title={isRTL ? 'تعديل' : 'Edit'}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => post.id && handleDelete(post.id)}
                          className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                          title={isRTL ? 'حذف' : 'Delete'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 font-medium"
            >
              {isRTL ? 'السابق' : 'Previous'}
            </button>
            <span className="text-gray-500">
              {isRTL ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 font-medium"
            >
              {isRTL ? 'التالي' : 'Next'}
            </button>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && currentPost && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/55 shrink-0">
                <span className="font-bold text-gray-900 dark:text-white">
                  {currentPost.id
                    ? (isRTL ? 'تعديل مقال المدونة' : 'Edit Blog Post')
                    : (isRTL ? 'إنشاء مقال جديد' : 'Create New Blog Post')}
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* EN Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Article Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentPost.title_en}
                      onChange={(e) => setCurrentPost({ ...currentPost, title_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      placeholder="e.g. Nurturing Creativity..."
                    />
                  </div>

                  {/* AR Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" dir="rtl">
                      عنوان المقال (العربية) *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentPost.title_ar}
                      onChange={(e) => setCurrentPost({ ...currentPost, title_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      placeholder="مثال: رعاية الإبداع..."
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category EN */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Category (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentPost.category_en}
                      onChange={(e) => setCurrentPost({ ...currentPost, category_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      placeholder="e.g. Technology"
                    />
                  </div>

                  {/* Category AR */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" dir="rtl">
                      التصنيف (العربية) *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentPost.category_ar}
                      onChange={(e) => setCurrentPost({ ...currentPost, category_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      placeholder="مثال: التكنولوجيا"
                      dir="rtl"
                    />
                  </div>

                  {/* Custom Slug */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Slug URL (English)
                    </label>
                    <input
                      type="text"
                      value={currentPost.slug}
                      onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="e.g. nurturing-creativity-tips"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image URL & File Upload */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {isRTL ? 'صورة الغلاف' : 'Cover Image'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={currentPost.image_url || ''}
                          onChange={(e) => setCurrentPost({ ...currentPost, image_url: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="shrink-0 relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="blog-image-upload-input"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="blog-image-upload-input"
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50 transition-colors bg-white dark:bg-gray-800"
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2 size={16} className="animate-spin text-indigo-500" />
                              {isRTL ? 'جاري الرفع...' : 'Uploading...'}
                            </>
                          ) : (
                            <>
                              {isRTL ? 'رفع ملف' : 'Upload File'}
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      {isRTL ? 'الحالة والمشاهدة' : 'Publication Status'}
                    </label>
                    <div className="flex items-center gap-3 h-10">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={currentPost.is_published}
                        onChange={(e) => setCurrentPost({ ...currentPost, is_published: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="is_published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {isRTL ? 'نشر المقال فوراً' : 'Publish Article'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Author EN */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Author Name (English)
                    </label>
                    <input
                      type="text"
                      value={currentPost.author_en}
                      onChange={(e) => setCurrentPost({ ...currentPost, author_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    />
                  </div>

                  {/* Author AR */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" dir="rtl">
                      اسم الكاتب (العربية)
                    </label>
                    <input
                      type="text"
                      value={currentPost.author_ar}
                      onChange={(e) => setCurrentPost({ ...currentPost, author_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* EN Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Article Content (English - Markdown supported) *
                  </label>
                  <textarea
                    rows={12}
                    required
                    value={currentPost.content_en}
                    onChange={(e) => setCurrentPost({ ...currentPost, content_en: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                    placeholder="Write body content here..."
                  />
                </div>

                {/* AR Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5" dir="rtl">
                    محتوى المقال (العربية - يدعم تنسيق ماركداون) *
                  </label>
                  <textarea
                    rows={12}
                    required
                    value={currentPost.content_ar}
                    onChange={(e) => setCurrentPost({ ...currentPost, content_ar: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                    placeholder="اكتب المحتوى هنا..."
                    dir="rtl"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isRTL ? 'حفظ المقال' : 'Save Article'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
