'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { apiGetLandingSettings, apiUpdateLandingSettings, LandingPageSettings, FAQItem } from '@/lib/api';
import { Loader2, Save, Globe, Plus, Trash2, Mail, Phone, Share2, Info, BookOpen, LayoutList } from 'lucide-react';

export default function LandingSettingsPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'faqs' | 'policies' | 'footer' | 'pages'>('general');

  const [settings, setSettings] = useState<LandingPageSettings>({
    faqs: [],
    footer_tagline_en: '',
    footer_tagline_ar: '',
    contact_email: '',
    contact_phone: '',
    social_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    privacy_policy_en: '',
    privacy_policy_ar: '',
    terms_of_service_en: '',
    terms_of_service_ar: '',
    footer_sections: [],
    about_content_en: '',
    about_content_ar: '',
    careers_content_en: '',
    careers_content_ar: '',
    examples_content_en: '',
    examples_content_ar: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiGetLandingSettings();
      const fetched = res.settings;
      if (fetched && !fetched.footer_sections) {
        fetched.footer_sections = [];
      }
      setSettings(fetched || {
        faqs: [],
        footer_tagline_en: '',
        footer_tagline_ar: '',
        contact_email: '',
        contact_phone: '',
        social_links: { facebook: '', twitter: '', instagram: '', youtube: '' },
        privacy_policy_en: '',
        privacy_policy_ar: '',
        terms_of_service_en: '',
        terms_of_service_ar: '',
        footer_sections: [],
        about_content_en: '',
        about_content_ar: '',
        careers_content_en: '',
        careers_content_ar: '',
        examples_content_en: '',
        examples_content_ar: ''
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiUpdateLandingSettings(settings);
      setSettings(res.settings);
      setSuccess(isRTL ? 'تم حفظ إعدادات الصفحة الرئيسية بنجاح' : 'Landing settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFaq = () => {
    setSettings({
      ...settings,
      faqs: [
        ...settings.faqs,
        { q_en: '', a_en: '', q_ar: '', a_ar: '' }
      ]
    });
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...settings.faqs];
    newFaqs.splice(index, 1);
    setSettings({ ...settings, faqs: newFaqs });
  };

  const handleFaqChange = (index: number, field: keyof FAQItem, value: string) => {
    const newFaqs = [...settings.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setSettings({ ...settings, faqs: newFaqs });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="text-indigo-600 dark:text-indigo-400" />
            {isRTL ? 'إعدادات الصفحة الرئيسية' : 'Landing Page Settings'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRTL
              ? 'تعديل وتحديث محتويات الصفحة الرئيسية مثل الأسئلة الشائعة، معلومات الاتصال، والسياسات.'
              : 'Edit and update homepage contents such as FAQs, contact info, and policies.'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
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

      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'general'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          {isRTL ? 'معلومات عامة والتواصل' : 'General & Contact'}
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'faqs'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          {isRTL ? 'الأسئلة الشائعة' : 'FAQs'}
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'policies'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          {isRTL ? 'السياسات والبنود' : 'Policies & Terms'}
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'footer'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          {isRTL ? 'أقسام التذييل' : 'Footer Columns'}
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`py-3 px-6 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'pages'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          {isRTL ? 'الصفحات الثابتة' : 'Static Pages'}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        
        {/* TAB 1: GENERAL & CONTACT */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Info size={20} className="text-indigo-600 dark:text-indigo-400" />
              {isRTL ? 'تذييل الصفحة والتسمية' : 'Footer Tagline'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tagline (English)
                </label>
                <input
                  type="text"
                  value={settings.footer_tagline_en}
                  onChange={(e) => setSettings({ ...settings, footer_tagline_en: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Every child deserves to be the hero..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" dir="rtl">
                  شعار التذييل (العربية)
                </label>
                <input
                  type="text"
                  value={settings.footer_tagline_ar}
                  onChange={(e) => setSettings({ ...settings, footer_tagline_ar: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="مثال: كل طفل يستحق أن يكون بطلاً..."
                  dir="rtl"
                />
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-6" />

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail size={20} className="text-indigo-600 dark:text-indigo-400" />
              {isRTL ? 'بيانات الاتصال الدعم' : 'Support Contact Info'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? 'البريد الإلكتروني للاتصال' : 'Contact Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    placeholder="support@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isRTL ? 'رقم الهاتف' : 'Contact Phone'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-6" />

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 size={20} className="text-indigo-600 dark:text-indigo-400" />
              {isRTL ? 'روابط مواقع التواصل' : 'Social Media Links'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facebook URL</label>
                <input
                  type="text"
                  value={settings.social_links?.facebook || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, facebook: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter / X URL</label>
                <input
                  type="text"
                  value={settings.social_links?.twitter || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, twitter: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram URL</label>
                <input
                  type="text"
                  value={settings.social_links?.instagram || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, instagram: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">YouTube URL</label>
                <input
                  type="text"
                  value={settings.social_links?.youtube || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, youtube: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FAQS */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isRTL ? 'الأسئلة الشائعة المضافة' : 'Frequently Asked Questions'}
              </h3>
              <button
                onClick={handleAddFaq}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus size={14} />
                {isRTL ? 'إضافة سؤال جديد' : 'Add FAQ'}
              </button>
            </div>

            <div className="space-y-6">
              {settings.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 relative"
                >
                  <button
                    onClick={() => handleRemoveFaq(idx)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    title={isRTL ? 'إلغاء السؤال' : 'Remove FAQ'}
                  >
                    <Trash2 size={18} />
                  </button>

                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
                    FAQ #{idx + 1}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* EN FAQ */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Question (English)</label>
                        <input
                          type="text"
                          value={faq.q_en}
                          onChange={(e) => handleFaqChange(idx, 'q_en', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                          placeholder="e.g. What is the pricing?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Answer (English)</label>
                        <textarea
                          rows={2}
                          value={faq.a_en}
                          onChange={(e) => handleFaqChange(idx, 'a_en', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                          placeholder="Answer here..."
                        />
                      </div>
                    </div>

                    {/* AR FAQ */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1" dir="rtl">السؤال (العربية)</label>
                        <input
                          type="text"
                          value={faq.q_ar}
                          onChange={(e) => handleFaqChange(idx, 'q_ar', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                          placeholder="مثال: كيف يعمل البرنامج؟"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1" dir="rtl">الإجابة (العربية)</label>
                        <textarea
                          rows={2}
                          value={faq.a_ar}
                          onChange={(e) => handleFaqChange(idx, 'a_ar', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                          placeholder="اكتب الإجابة هنا..."
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {settings.faqs.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {isRTL ? 'لا يوجد أسئلة شائعة مضافة حالياً. اضغط على إضافة سؤال للبدء.' : 'No FAQs added yet. Click "Add FAQ" to start.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: POLICIES & TERMS */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
              {isRTL ? 'إدارة بنود الخدمة وسياسة الخصوصية' : 'Policies & Agreements'}
            </h3>

            <div className="grid grid-cols-1 gap-8">
              {/* Privacy Policy */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  {isRTL ? 'سياسة الخصوصية (Privacy Policy)' : 'Privacy Policy'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">English Version</label>
                    <textarea
                      rows={8}
                      value={settings.privacy_policy_en}
                      onChange={(e) => setSettings({ ...settings, privacy_policy_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# Privacy Policy..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" dir="rtl">النسخة العربية</label>
                    <textarea
                      rows={8}
                      value={settings.privacy_policy_ar}
                      onChange={(e) => setSettings({ ...settings, privacy_policy_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# سياسة الخصوصية..."
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Terms of Service */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  {isRTL ? 'شروط الخدمة (Terms of Service)' : 'Terms of Service'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">English Version</label>
                    <textarea
                      rows={8}
                      value={settings.terms_of_service_en}
                      onChange={(e) => setSettings({ ...settings, terms_of_service_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# Terms of Service..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" dir="rtl">النسخة العربية</label>
                    <textarea
                      rows={8}
                      value={settings.terms_of_service_ar}
                      onChange={(e) => setSettings({ ...settings, terms_of_service_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# شروط الخدمة..."
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FOOTER SECTIONS */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <LayoutList size={20} className="text-indigo-600 dark:text-indigo-400" />
                {isRTL ? 'إدارة أقسام التذييل' : 'Manage Footer Sections'}
              </h3>
              <button
                onClick={() => {
                  setSettings({
                    ...settings,
                    footer_sections: [
                      ...(settings.footer_sections || []),
                      { title_en: '', title_ar: '', links: [] }
                    ]
                  });
                }}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus size={14} />
                {isRTL ? 'إضافة قسم جديد' : 'Add Section'}
              </button>
            </div>

            <div className="space-y-6">
              {(settings.footer_sections || []).map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 relative space-y-4"
                >
                  <button
                    onClick={() => {
                      const newSections = [...(settings.footer_sections || [])];
                      newSections.splice(sIdx, 1);
                      setSettings({ ...settings, footer_sections: newSections });
                    }}
                    className="absolute top-5 right-5 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    title={isRTL ? 'إلغاء القسم' : 'Remove Section'}
                  >
                    <Trash2 size={18} />
                  </button>

                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {isRTL ? `قسم التذييل #${sIdx + 1}` : `Footer Section #${sIdx + 1}`}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Section Title (English)</label>
                      <input
                        type="text"
                        value={section.title_en}
                        onChange={(e) => {
                          const newSections = [...(settings.footer_sections || [])];
                          newSections[sIdx] = { ...newSections[sIdx], title_en: e.target.value };
                          setSettings({ ...settings, footer_sections: newSections });
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="e.g. Products"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1" dir="rtl">عنوان القسم (العربية)</label>
                      <input
                        type="text"
                        value={section.title_ar}
                        onChange={(e) => {
                          const newSections = [...(settings.footer_sections || [])];
                          newSections[sIdx] = { ...newSections[sIdx], title_ar: e.target.value };
                          setSettings({ ...settings, footer_sections: newSections });
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="مثال: المنتجات"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {isRTL ? 'الروابط' : 'Links'}
                      </span>
                      <button
                        onClick={() => {
                          const newSections = [...(settings.footer_sections || [])];
                          newSections[sIdx].links = [
                            ...(newSections[sIdx].links || []),
                            { label_en: '', label_ar: '', url: '' }
                          ];
                          setSettings({ ...settings, footer_sections: newSections });
                        }}
                        className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} />
                        {isRTL ? 'إضافة رابط' : 'Add Link'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(section.links || []).map((link, lIdx) => (
                        <div
                          key={lIdx}
                          className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 relative"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                            <input
                              type="text"
                              value={link.label_en}
                              onChange={(e) => {
                                const newSections = [...(settings.footer_sections || [])];
                                newSections[sIdx].links[lIdx] = {
                                  ...newSections[sIdx].links[lIdx],
                                  label_en: e.target.value
                                };
                                setSettings({ ...settings, footer_sections: newSections });
                              }}
                              className="px-2 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs"
                              placeholder="Label (EN) e.g. Pricing"
                            />
                            <input
                              type="text"
                              value={link.label_ar}
                              onChange={(e) => {
                                const newSections = [...(settings.footer_sections || [])];
                                newSections[sIdx].links[lIdx] = {
                                  ...newSections[sIdx].links[lIdx],
                                  label_ar: e.target.value
                                };
                                setSettings({ ...settings, footer_sections: newSections });
                              }}
                              className="px-2 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs"
                              placeholder="العنوان (AR) مثال: الأسعار"
                              dir="rtl"
                            />
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => {
                                const newSections = [...(settings.footer_sections || [])];
                                newSections[sIdx].links[lIdx] = {
                                  ...newSections[sIdx].links[lIdx],
                                  url: e.target.value
                                };
                                setSettings({ ...settings, footer_sections: newSections });
                              }}
                              className="px-2 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs"
                              placeholder="URL e.g. #pricing, /privacy"
                            />
                          </div>

                          <button
                            onClick={() => {
                              const newSections = [...(settings.footer_sections || [])];
                              newSections[sIdx].links.splice(lIdx, 1);
                              setSettings({ ...settings, footer_sections: newSections });
                            }}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-1 md:self-center"
                            title={isRTL ? 'إلغاء الرابط' : 'Remove Link'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {(section.links || []).length === 0 && (
                        <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
                          {isRTL ? 'لا يوجد روابط مضافة في هذا القسم.' : 'No links added in this section.'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(settings.footer_sections || []).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {isRTL ? 'لا يوجد أقسام تذييل مضافة حالياً. اضغط على إضافة قسم للبدء.' : 'No footer sections added yet. Click "Add Section" to start.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: STATIC PAGES */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
              {isRTL ? 'إدارة محتوى الصفحات الثابتة' : 'Manage Static Pages Content'}
            </h3>

            <div className="grid grid-cols-1 gap-8">
              {/* About Us Page */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {isRTL ? 'صفحة من نحن (About Us)' : 'About Us Page'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">English Version (Markdown)</label>
                    <textarea
                      rows={10}
                      value={settings.about_content_en || ''}
                      onChange={(e) => setSettings({ ...settings, about_content_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# Who We Are..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" dir="rtl">النسخة العربية (ماركداون)</label>
                    <textarea
                      rows={10}
                      value={settings.about_content_ar || ''}
                      onChange={(e) => setSettings({ ...settings, about_content_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# من نحن..."
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Careers Page */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {isRTL ? 'صفحة الوظائف (Careers)' : 'Careers Page'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">English Version (Markdown)</label>
                    <textarea
                      rows={10}
                      value={settings.careers_content_en || ''}
                      onChange={(e) => setSettings({ ...settings, careers_content_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# Build the Future of Play..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" dir="rtl">النسخة العربية (ماركداون)</label>
                    <textarea
                      rows={10}
                      value={settings.careers_content_ar || ''}
                      onChange={(e) => setSettings({ ...settings, careers_content_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# انضم إلى فريق الإبداع..."
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Examples Page */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {isRTL ? 'صفحة المعرض والأمثلة (Examples)' : 'Examples Gallery Page'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">English Version (Markdown)</label>
                    <textarea
                      rows={10}
                      value={settings.examples_content_en || ''}
                      onChange={(e) => setSettings({ ...settings, examples_content_en: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# Cinematic Adventure Gallery..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2" dir="rtl">النسخة العربية (ماركداون)</label>
                    <textarea
                      rows={10}
                      value={settings.examples_content_ar || ''}
                      onChange={(e) => setSettings({ ...settings, examples_content_ar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
                      placeholder="# معرض المغامرات السينمائية..."
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
