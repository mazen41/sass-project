'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import { apiGetAuthSettings, apiUpdateAuthSettings, AuthSettings } from '@/lib/api';
import { Loader2, Save, Shield } from 'lucide-react';

export default function AuthSettingsPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [settings, setSettings] = useState<AuthSettings>({
    allow_admin_social_auth: true,
    allow_admin_signup: true,
    google_active: false,
    google_client_id: '',
    google_client_secret: '',
    facebook_active: false,
    facebook_client_id: '',
    facebook_client_secret: '',
    apple_active: false,
    apple_client_id: '',
    apple_client_secret: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await apiGetAuthSettings();
      setSettings(res.settings);
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
      const res = await apiUpdateAuthSettings(settings);
      setSettings(res.settings);
      setSuccess(isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
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
            <Shield className="text-indigo-600 dark:text-indigo-400" />
            {isRTL ? 'إعدادات الدخول (المدير)' : 'Admin Auth Settings'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRTL 
              ? 'إدارة خيارات تسجيل الدخول والإنشاء لحسابات المديرين.' 
              : 'Manage login and signup options for admin accounts.'}
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isRTL ? 'السماح بتسجيل الدخول الاجتماعي' : 'Allow Social Auth'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {isRTL 
                  ? 'إذا تم تفعيله، ستتمكن من إعداد مزودي الدخول (جوجل، فيسبوك، آبل).' 
                  : 'If enabled, you can configure social providers (Google, Facebook, Apple).'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.allow_admin_social_auth}
                onChange={(e) => setSettings({ ...settings, allow_admin_social_auth: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {settings.allow_admin_social_auth && (
            <div className="pl-6 border-l-2 border-gray-100 dark:border-gray-700 space-y-8 mt-6">
              
              {/* Google Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Google Auth</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.google_active}
                      onChange={(e) => setSettings({ ...settings, google_active: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {settings.google_active && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                      <input 
                        type="text" 
                        value={settings.google_client_id || ''}
                        onChange={(e) => setSettings({ ...settings, google_client_id: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="Google Client ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
                      <input 
                        type="password" 
                        value={settings.google_client_secret || ''}
                        onChange={(e) => setSettings({ ...settings, google_client_secret: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Callback URL</label>
                      <input 
                        type="text" 
                        value={settings.google_callback_url || ''}
                        onChange={(e) => setSettings({ ...settings, google_callback_url: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="https://yourdomain.com/api/auth/google/callback"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Facebook Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Facebook Auth</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.facebook_active}
                      onChange={(e) => setSettings({ ...settings, facebook_active: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {settings.facebook_active && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                      <input 
                        type="text" 
                        value={settings.facebook_client_id || ''}
                        onChange={(e) => setSettings({ ...settings, facebook_client_id: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="Facebook Client ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
                      <input 
                        type="password" 
                        value={settings.facebook_client_secret || ''}
                        onChange={(e) => setSettings({ ...settings, facebook_client_secret: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Callback URL</label>
                      <input 
                        type="text" 
                        value={settings.facebook_callback_url || ''}
                        onChange={(e) => setSettings({ ...settings, facebook_callback_url: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="https://yourdomain.com/api/auth/facebook/callback"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Apple Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Apple Auth</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.apple_active}
                      onChange={(e) => setSettings({ ...settings, apple_active: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                {settings.apple_active && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                      <input 
                        type="text" 
                        value={settings.apple_client_id || ''}
                        onChange={(e) => setSettings({ ...settings, apple_client_id: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="Apple Client ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
                      <input 
                        type="password" 
                        value={settings.apple_client_secret || ''}
                        onChange={(e) => setSettings({ ...settings, apple_client_secret: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Callback URL</label>
                      <input 
                        type="text" 
                        value={settings.apple_callback_url || ''}
                        onChange={(e) => setSettings({ ...settings, apple_callback_url: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        placeholder="https://yourdomain.com/api/auth/apple/callback"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isRTL ? 'السماح بإنشاء حسابات إدارية جديدة' : 'Allow Admin Sign Up'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {isRTL 
                  ? 'إذا تم تفعيله، سيتمكن الزوار من رؤية رابط لإنشاء حساب إداري جديد.' 
                  : 'If enabled, visitors will see a link to create a new admin account.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.allow_admin_signup}
                onChange={(e) => setSettings({ ...settings, allow_admin_signup: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
