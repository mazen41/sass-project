'use client';

import { useCallback, useEffect, useState } from 'react';
import { 
  apiGetPlans, apiCreatePlan, apiUpdatePlan, apiDeletePlan, Plan,
  apiGetAdminAddons, apiCreateAddon, apiUpdateAddon, apiDeleteAddon, PlanAddon 
} from '@/lib/api';
import { useLang } from '@/context/LangContext';
import { Plus, Edit2, Trash2, Check, AlertCircle, X, Star, Loader2, Layers, Tag } from 'lucide-react';

export default function PlansPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';
  
  const [activeTab, setActiveTab] = useState<'plans' | 'addons'>('plans');

  const t = {
    title: isRTL ? 'إدارة الاشتراكات والخدمات الإضافية' : 'Subscriptions & Add-Ons',
    plansTab: isRTL ? 'خطط الاشتراك' : 'Subscription Plans',
    addonsTab: isRTL ? 'الخدمات الإضافية' : 'Add-Ons',
    addPlan: isRTL ? 'إضافة خطة' : 'Add Plan',
    editPlan: isRTL ? 'تعديل خطة' : 'Edit Plan',
    createPlan: isRTL ? 'إنشاء خطة' : 'Create Plan',
    addAddon: isRTL ? 'إضافة خدمة إضافية' : 'Add Add-On',
    editAddon: isRTL ? 'تعديل الخدمة الإضافية' : 'Edit Add-On',
    createAddon: isRTL ? 'إنشاء خدمة إضافية' : 'Create Add-On',
    featured: isRTL ? 'مميز' : 'Featured',
    inactive: isRTL ? 'غير نشط' : 'Inactive',
    edit: isRTL ? 'تعديل' : 'Edit',
    delete: isRTL ? 'حذف' : 'Delete',
    deleteConfirm: isRTL ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this?',
    deleteError: isRTL ? 'فشل الحذف' : 'Failed to delete',
    saveError: isRTL ? 'فشل الحفظ' : 'Failed to save',
    name: isRTL ? 'الاسم' : 'Name',
    slug: isRTL ? 'المعرف الفريد (Slug)' : 'Slug',
    description: isRTL ? 'الوصف' : 'Description',
    price: isRTL ? 'السعر' : 'Price',
    billingPeriod: isRTL ? 'فترة الفوترة' : 'Billing Period',
    monthly: isRTL ? 'شهري' : 'Monthly',
    yearly: isRTL ? 'سنوي' : 'Yearly',
    features: isRTL ? 'المميزات (سطر لكل ميزة)' : 'Features (one per line)',
    stripePriceId: isRTL ? 'معرف سعر Stripe' : 'Stripe Price ID',
    paypalPlanId: isRTL ? 'معرف خطة PayPal' : 'PayPal Plan ID',
    active: isRTL ? 'نشط' : 'Active',
    cancel: isRTL ? 'إلغاء' : 'Cancel',
    update: isRTL ? 'تحديث' : 'Update',
    create: isRTL ? 'إنشاء' : 'Create',
    mo: isRTL ? 'شهر' : 'mo',
    yr: isRTL ? 'سنة' : 'yr',
    stripe: isRTL ? 'Stripe' : 'Stripe',
    paypal: isRTL ? 'PayPal' : 'PayPal',
    notSet: isRTL ? 'غير محدد' : 'Not set',
    activeSubscriptions: isRTL ? 'اشتراكات نشطة' : 'active subscriptions',
    noPlans: isRTL ? 'لا توجد خطط' : 'No plans found',
    noAddons: isRTL ? 'لا توجد خدمات إضافية' : 'No add-ons found',
    storyLimit: isRTL ? 'حد القصص الشهري' : 'Monthly Story Limit',
    videoLimit: isRTL ? 'حد الفيديو الشهري' : 'Monthly Video Limit',
    dailyStoryLimit: isRTL ? 'حد القصص اليومي' : 'Daily Story Limit',
    dailyVideoLimit: isRTL ? 'حد الفيديو اليومي' : 'Daily Video Limit',
    unlimitedHint: isRTL ? 'استخدم 999999 لغير محدود' : 'Use 999999 for unlimited',
  };

  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Plan Modal & State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    story_limit: 0,
    video_limit: 0,
    daily_story_limit: 0,
    daily_video_limit: 0,
    billing_period: 'monthly' as 'monthly' | 'yearly',
    features: '',
    is_active: true,
    is_featured: false,
    stripe_price_id: '',
    paypal_plan_id: '',
  });
  // Addon Modal & State
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [editingAddon, setEditingAddon] = useState<PlanAddon | null>(null);
  const [addonFormData, setAddonFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    story_limit: 0,
    video_limit: 0,
    daily_story_limit: 0,
    daily_video_limit: 0,
    is_active: true,
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { plans } = await apiGetPlans();
      setPlans(plans);
      
      const { addons } = await apiGetAdminAddons();
      setAddons(addons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Plan actions
  const openCreatePlanModal = () => {
    setEditingPlan(null);
    setPlanFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      story_limit: 0,
      video_limit: 0,
      daily_story_limit: 0,
      daily_video_limit: 0,
      billing_period: 'monthly',
      features: '',
      is_active: true,
      is_featured: false,
      stripe_price_id: '',
      paypal_plan_id: '',
    });
    setShowPlanModal(true);
  };

  const openEditPlanModal = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || '',
      price: plan.price,
      story_limit: plan.story_limit || 0,
      video_limit: plan.video_limit || 0,
      daily_story_limit: plan.daily_story_limit || 0,
      daily_video_limit: plan.daily_video_limit || 0,
      billing_period: plan.billing_period,
      features: plan.features?.join('\n') || '',
      is_active: plan.is_active,
      is_featured: plan.is_featured,
      stripe_price_id: plan.stripe_price_id || '',
      paypal_plan_id: plan.paypal_plan_id || '',
    });
    setShowPlanModal(true);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...planFormData,
        features: planFormData.features.split('\n').filter(f => f.trim()),
      };

      if (editingPlan) {
        await apiUpdatePlan(editingPlan.id, data as Partial<Plan>);
      } else {
        await apiCreatePlan(data as Partial<Plan>);
      }
      setShowPlanModal(false);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handlePlanDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await apiDeletePlan(id);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : t.deleteError);
    }
  };

  // Addon actions
  const openCreateAddonModal = () => {
    setEditingAddon(null);
    setAddonFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      story_limit: 0,
      video_limit: 0,
      daily_story_limit: 0,
      daily_video_limit: 0,
      is_active: true,
      sort_order: 0,
    });
    setShowAddonModal(true);
  };

  const openEditAddonModal = (addon: PlanAddon) => {
    setEditingAddon(addon);
    setAddonFormData({
      name: addon.name,
      slug: addon.slug,
      description: addon.description || '',
      price: addon.price,
      story_limit: addon.story_limit || 0,
      video_limit: addon.video_limit || 0,
      daily_story_limit: addon.daily_story_limit || 0,
      daily_video_limit: addon.daily_video_limit || 0,
      is_active: addon.is_active,
      sort_order: addon.sort_order,
    });
    setShowAddonModal(true);
  };

  const handleAddonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...addonFormData,
        price: addonFormData.price,
      };

      if (editingAddon) {
        await apiUpdateAddon(editingAddon.id, data as Partial<PlanAddon>);
      } else {
        await apiCreateAddon(data as Partial<PlanAddon>);
      }
      setShowAddonModal(false);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleAddonDelete = async (id: number) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      await apiDeleteAddon(id);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : t.deleteError);
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
    <div className="flex flex-col gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="text-indigo-600 dark:text-indigo-400" />
            {t.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isRTL 
              ? 'إدارة باقات الاشتراك المدفوعة والخدمات المضافة التي يمكن شراؤها كإضافات.' 
              : 'Manage paid membership plans and purchasable addon features.'}
          </p>
        </div>
        
        {activeTab === 'plans' ? (
          <button 
            onClick={openCreatePlanModal} 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            {t.addPlan}
          </button>
        ) : (
          <button 
            onClick={openCreateAddonModal} 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            {t.addAddon}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2.5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'plans'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {t.plansTab}
        </button>
        <button
          onClick={() => setActiveTab('addons')}
          className={`px-4 py-2.5 border-b-2 font-medium text-sm transition-all ${
            activeTab === 'addons'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {t.addonsTab}
        </button>
      </div>

      {/* TAB CONTENT: PLANS */}
      {activeTab === 'plans' && (
        plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
            <AlertCircle size={48} className="text-gray-400 dark:text-gray-500 mb-4 opacity-50" />
            <p className="text-lg text-gray-600 dark:text-gray-400">{t.noPlans}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative bg-white dark:bg-gray-800 border rounded-2xl p-6 transition-all duration-200 flex flex-col h-full
                  ${plan.is_featured 
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02] md:scale-105 z-10' 
                    : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
                  }
                `}
              >
                {plan.is_featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    <Star size={12} className="fill-current" />
                    {t.featured}
                  </div>
                )}
                
                {!plan.is_active && (
                  <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-md`}>
                    {t.inactive}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 h-10 overflow-hidden line-clamp-2">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 mb-1 font-medium">/{plan.billing_period === 'monthly' ? t.mo : t.yr}</span>
                  </div>
                </div>

                <div className="mb-4 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>{t.storyLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {plan.story_limit && plan.story_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.story_limit ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.videoLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {plan.video_limit && plan.video_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.video_limit ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                    <span>{t.dailyStoryLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {plan.daily_story_limit && plan.daily_story_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.daily_story_limit ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.dailyVideoLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {plan.daily_video_limit && plan.daily_video_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.daily_video_limit ?? 0)}
                    </span>
                  </div>
                </div>

                <ul className="flex-1 space-y-3 mb-6">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 space-y-2 mb-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                    <span>{t.stripe}</span>
                    <span className="font-mono">{plan.stripe_price_id || t.notSet}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                    <span>{t.paypal}</span>
                    <span className="font-mono">{plan.paypal_plan_id || t.notSet}</span>
                  </div>
                  <div className="text-center font-medium text-indigo-600 dark:text-indigo-400 pt-2">
                    {plan.active_subscriptions_count || 0} {t.activeSubscriptions}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => openEditPlanModal(plan)} 
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit2 size={16} />
                    {t.edit}
                  </button>
                  <button 
                    onClick={() => handlePlanDelete(plan.id)} 
                    className="flex items-center justify-center px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    title={t.delete}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* TAB CONTENT: ADDONS */}
      {activeTab === 'addons' && (
        addons.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
            <AlertCircle size={48} className="text-gray-400 dark:text-gray-500 mb-4 opacity-50" />
            <p className="text-lg text-gray-600 dark:text-gray-400">{t.noAddons}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon) => (
              <div 
                key={addon.id} 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
              >
                {!addon.is_active && (
                  <div className={`self-end px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-md mb-2`}>
                    {t.inactive}
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{addon.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 h-10 overflow-hidden line-clamp-2">{addon.description}</p>
                </div>

                <div className="mb-4 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>{t.storyLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {addon.story_limit && addon.story_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : `+${addon.story_limit ?? 0}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.videoLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {addon.video_limit && addon.video_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : `+${addon.video_limit ?? 0}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
                    <span>{t.dailyStoryLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {addon.daily_story_limit && addon.daily_story_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : `+${addon.daily_story_limit ?? 0}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.dailyVideoLimit}:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {addon.daily_video_limit && addon.daily_video_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : `+${addon.daily_video_limit ?? 0}`}
                    </span>
                  </div>
                </div>

                <div className="mb-6 mt-auto">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">${addon.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 mb-0.5 text-xs font-medium">/{isRTL ? 'دفعة واحدة' : 'one-time'}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 font-mono">
                    Slug: {addon.slug}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <button 
                    onClick={() => openEditAddonModal(addon)} 
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit2 size={16} />
                    {t.edit}
                  </button>
                  <button 
                    onClick={() => handleAddonDelete(addon.id)} 
                    className="flex items-center justify-center px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    title={t.delete}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6" onClick={() => setShowPlanModal(false)}>
          <div 
            className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingPlan ? t.editPlan : t.createPlan}
              </h3>
              <button 
                onClick={() => setShowPlanModal(false)} 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePlanSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.name}</label>
                    <input
                      type="text"
                      value={planFormData.name}
                      onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.slug}</label>
                    <input
                      type="text"
                      value={planFormData.slug}
                      onChange={(e) => setPlanFormData({ ...planFormData, slug: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t.description}</label>
                  <textarea
                    value={planFormData.description}
                    onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                    className={inputClass}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.price}</label>
                    <div className="relative">
                      <span className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${isRTL ? 'right-4' : 'left-4'}`}>$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={planFormData.price}
                        onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                        className={`${inputClass} ${isRTL ? 'pr-8' : 'pl-8'}`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t.billingPeriod}</label>
                    <select
                      value={planFormData.billing_period}
                      onChange={(e) => setPlanFormData({ ...planFormData, billing_period: e.target.value as 'monthly' | 'yearly' })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="monthly">{t.monthly}</option>
                      <option value="yearly">{t.yearly}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      {t.storyLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planFormData.story_limit}
                      onChange={(e) => setPlanFormData({ ...planFormData, story_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      {t.videoLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planFormData.video_limit}
                      onChange={(e) => setPlanFormData({ ...planFormData, video_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      {t.dailyStoryLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planFormData.daily_story_limit}
                      onChange={(e) => setPlanFormData({ ...planFormData, daily_story_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      {t.dailyVideoLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={planFormData.daily_video_limit}
                      onChange={(e) => setPlanFormData({ ...planFormData, daily_video_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t.features}</label>
                  <textarea
                    value={planFormData.features}
                    onChange={(e) => setPlanFormData({ ...planFormData, features: e.target.value })}
                    className={inputClass}
                    rows={4}
                    placeholder={`Feature 1\nFeature 2\nFeature 3`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.stripePriceId}</label>
                    <input
                      type="text"
                      value={planFormData.stripe_price_id}
                      onChange={(e) => setPlanFormData({ ...planFormData, stripe_price_id: e.target.value })}
                      placeholder="price_xxx"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.paypalPlanId}</label>
                    <input
                      type="text"
                      value={planFormData.paypal_plan_id}
                      onChange={(e) => setPlanFormData({ ...planFormData, paypal_plan_id: e.target.value })}
                      placeholder="P-xxx"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planFormData.is_active}
                      onChange={(e) => setPlanFormData({ ...planFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.active}</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planFormData.is_featured}
                      onChange={(e) => setPlanFormData({ ...planFormData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.featured}</span>
                  </label>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setShowPlanModal(false)} 
                  className="flex-1 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors shadow-sm"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editingPlan ? t.update : t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADDON MODAL */}
      {showAddonModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6" onClick={() => setShowAddonModal(false)}>
          <div 
            className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingAddon ? t.editAddon : t.createAddon}
              </h3>
              <button 
                onClick={() => setShowAddonModal(false)} 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddonSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.name}</label>
                    <input
                      type="text"
                      value={addonFormData.name}
                      onChange={(e) => setAddonFormData({ ...addonFormData, name: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t.slug}</label>
                    <input
                      type="text"
                      value={addonFormData.slug}
                      onChange={(e) => setAddonFormData({ ...addonFormData, slug: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t.description}</label>
                  <textarea
                    value={addonFormData.description}
                    onChange={(e) => setAddonFormData({ ...addonFormData, description: e.target.value })}
                    className={inputClass}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.price}</label>
                    <div className="relative">
                      <span className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${isRTL ? 'right-4' : 'left-4'}`}>$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={addonFormData.price}
                        onChange={(e) => setAddonFormData({ ...addonFormData, price: e.target.value })}
                        className={`${inputClass} ${isRTL ? 'pr-8' : 'pl-8'}`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{isRTL ? 'الترتيب' : 'Sort Order'}</label>
                    <input
                      type="number"
                      value={addonFormData.sort_order}
                      onChange={(e) => setAddonFormData({ ...addonFormData, sort_order: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      {t.storyLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addonFormData.story_limit}
                      onChange={(e) => setAddonFormData({ ...addonFormData, story_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      {t.videoLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addonFormData.video_limit}
                      onChange={(e) => setAddonFormData({ ...addonFormData, video_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      {t.dailyStoryLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addonFormData.daily_story_limit}
                      onChange={(e) => setAddonFormData({ ...addonFormData, daily_story_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      {t.dailyVideoLimit}
                      <span className="text-xs text-gray-400 font-normal block">({t.unlimitedHint})</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={addonFormData.daily_video_limit}
                      onChange={(e) => setAddonFormData({ ...addonFormData, daily_video_limit: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="flex pt-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addonFormData.is_active}
                      onChange={(e) => setAddonFormData({ ...addonFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.active}</span>
                  </label>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 shrink-0 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setShowAddonModal(false)} 
                  className="flex-1 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors shadow-sm"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editingAddon ? t.update : t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
