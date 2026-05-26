'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import {
  apiGetBillingPlans,
  apiGetActiveSubscription,
  apiSubscribeStripe,
  apiSubscribePaypal,
  apiUserCancelSubscription,
  apiUpgradePlan,
  apiDowngradePlan,
  apiGetAddons,
  apiPurchaseAddon,
  apiGetUserInvoices,
  Plan,
  Subscription,
  PlanAddon,
  InvoiceRecord,
} from '@/lib/api';
import Navbar from '@/components/Navbar';
import {
  CreditCard,
  Wallet,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
  Tag,
  Download,
  X
} from 'lucide-react';

export default function BillingPage() {
  const { isLoggedIn } = useAuth();
  const { locale } = useLang();
  const router = useRouter();
  const isRTL = locale === 'ar';

  const t = {
    title: isRTL ? 'خطط الاشتراك والترقية' : 'Choose Your Plan',
    subtitle: isRTL ? 'اختر الخطة المثالية لفتح عوالم سحرية وسينمائية لطفلك.' : 'Unlock magical, cinematic AI adventures for your child.',
    activeSubTitle: isRTL ? 'اشتراكك الحالي' : 'Your Active Subscription',
    activeSubDesc: isRTL ? 'أنت مشترك حالياً في هذه الخطة.' : 'You are currently subscribed to this plan.',
    nextBilling: isRTL ? 'تاريخ التجديد القادم:' : 'Next billing date:',
    cancelSub: isRTL ? 'إلغاء الاشتراك' : 'Cancel Subscription',
    canceling: isRTL ? 'جاري الإلغاء...' : 'Canceling...',
    cancelConfirm: isRTL ? 'هل أنت متأكد من إلغاء اشتراكك؟ ستبقى ميزاتك نشطة حتى نهاية الفترة الحالية.' : 'Are you sure you want to cancel your subscription? Your access will remain active until the end of the current billing cycle.',
    selectPayment: isRTL ? 'اختر بوابة الدفع المفضلة' : 'Select Payment Method',
    popular: isRTL ? 'الأكثر شعبية' : 'Most Popular',
    subscribeBtn: isRTL ? 'اشترك الآن' : 'Subscribe Now',
    checkoutRedirecting: isRTL ? 'جاري توجيهك إلى بوابة الدفع...' : 'Redirecting to payment gateway...',
    upgradeBtn: isRTL ? 'ترقية الخطة' : 'Upgrade Plan',
    downgradeBtn: isRTL ? 'تخفيض الخطة' : 'Downgrade Plan',
    currentPlanBtn: isRTL ? 'خطتك الحالية' : 'Current Plan',
    addonsTitle: isRTL ? 'الخدمات والإضافات الخاصة' : 'Available Add-Ons & Extras',
    addonsSubtitle: isRTL ? 'قم بشراء ميزات إضافية لمرة واحدة لزيادة طاقتك الإنتاجية.' : 'Purchase one-time extra usage limits for your projects.',
    purchaseAddon: isRTL ? 'شراء الخدمة' : 'Purchase Add-On',
    addonPurchased: isRTL ? 'تم شراء الخدمة الإضافية بنجاح!' : 'Add-on purchased successfully!',
    invoicesTitle: isRTL ? 'سجل الفواتير والمدفوعات' : 'Invoices & Billing History',
    invoiceNo: isRTL ? 'رقم الفاتورة' : 'Invoice Number',
    invoiceDate: isRTL ? 'التاريخ' : 'Date',
    invoiceAmount: isRTL ? 'المبلغ' : 'Amount',
    invoiceStatus: isRTL ? 'الحالة' : 'Status',
    invoiceActions: isRTL ? 'الإجراءات' : 'Actions',
    invoiceView: isRTL ? 'عرض' : 'View',
    noInvoices: isRTL ? 'لا توجد فواتير سابقة' : 'No previous invoices found',
    faqTitle: isRTL ? 'الأسئلة المتكررة حول الدفع' : 'Frequently Asked Questions',
    faq1Q: isRTL ? 'هل يمكنني تغيير خطتي لاحقاً؟' : 'Can I change my plan later?',
    faq1A: isRTL ? 'نعم، يمكنك الترقية أو التخفيض في أي وقت من إعدادات حسابك.' : 'Yes, you can upgrade, downgrade, or cancel your subscription at any time.',
    faq2Q: isRTL ? 'ما هي بوابات الدفع المدعومة؟' : 'Which payment gateways are supported?',
    faq2A: isRTL ? 'نحن ندعم الدفع الآمن بنسبة 100٪ عن طريق Stripe (بطاقات الائتمان) و PayPal.' : 'We support completely secure payments via Stripe (Credit Cards) and PayPal.',
    faq3Q: isRTL ? 'هل هناك فترة التزام؟' : 'Is there a minimum contract period?',
    faq3A: isRTL ? 'لا، خططنا شهرية مرنة ويمكنك إلغاؤها بضغطة زر دون أي التزامات.' : 'No, all plans are billed monthly and you can cancel anytime without cancellation fees.',
    invoiceDetails: isRTL ? 'تفاصيل الفاتورة' : 'Invoice Details',
    close: isRTL ? 'إغلاق' : 'Close',
  };

  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [activeSub, setActiveSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [gateway, setGateway] = useState<'stripe' | 'paypal'>('stripe');
  const [checkoutPlanId, setCheckoutPlanId] = useState<number | null>(null);
  const [addonActionId, setAddonActionId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [allowedGateways, setAllowedGateways] = useState<string[]>(['stripe', 'paypal']);

  const loadBillingData = useCallback(async () => {
    try {
      const [plansRes, subRes, addonsRes, invoicesRes] = await Promise.all([
        apiGetBillingPlans(),
        apiGetActiveSubscription(),
        apiGetAddons(),
        apiGetUserInvoices()
      ]);
      setPlans(plansRes.plans);
      setActiveSub(subRes.subscription);
      setAddons(addonsRes.addons);
      setInvoices(invoicesRes.data || []);
      
      const gws = plansRes.gateways || subRes.gateways;
      if (gws) {
        setAllowedGateways(gws);
        if (gws.length > 0 && !gws.includes(gateway)) {
          setGateway(gws[0] as 'stripe' | 'paypal');
        }
      }
    } catch (err) {
      console.error('Error loading billing data', err);
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadBillingData();
  }, [isLoggedIn, loadBillingData]);

  const handleSubscribe = async (planId: number) => {
    if (allowedGateways.length === 0) {
      alert(isRTL ? 'لا توجد بوابات دفع مهيأة حالياً.' : 'No payment gateways are configured.');
      return;
    }
    setCheckoutPlanId(planId);
    setActionLoading(true);
    try {
      let url = '';
      if (gateway === 'stripe') {
        const response = await apiSubscribeStripe(planId);
        url = response.url;
      } else {
        const response = await apiSubscribePaypal(planId);
        url = response.url;
      }
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Redirection URL not returned.');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Checkout failed');
      setActionLoading(false);
      setCheckoutPlanId(null);
    }
  };

  const handleUpgrade = async (planId: number) => {
    if (!confirm(isRTL ? 'هل تريد بالتأكيد ترقية اشتراكك؟ سيتم تفعيل باقتك الجديدة فوراً.' : 'Are you sure you want to upgrade your plan? The new features will be unlocked immediately.')) return;
    setActionLoading(true);
    try {
      const res = await apiUpgradePlan(planId);
      alert(res.message);
      loadBillingData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upgrade failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDowngrade = async (planId: number) => {
    if (!confirm(isRTL ? 'هل تريد بالتأكيد تخفيض اشتراكك؟ سيتم التطبيق في نهاية دورة الفوترة الحالية.' : 'Are you sure you want to downgrade your plan? Changes will apply at the end of the current billing cycle.')) return;
    setActionLoading(true);
    try {
      const res = await apiDowngradePlan(planId);
      alert(res.message);
      loadBillingData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Downgrade failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurchaseAddon = async (addonId: number) => {
    setAddonActionId(addonId);
    setActionLoading(true);
    try {
      const res = await apiPurchaseAddon(addonId);
      alert(t.addonPurchased);
      loadBillingData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setActionLoading(false);
      setAddonActionId(null);
    }
  };

  const handleCancelSub = async () => {
    if (!confirm(t.cancelConfirm)) return;
    setActionLoading(true);
    try {
      const response = await apiUserCancelSubscription();
      alert(response.message);
      loadBillingData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cancellation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'refunded':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070708]">
        <Loader2 size={40} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] text-gray-100 pb-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300 mb-4">
            <Layers size={14} />
            {isRTL ? 'عضويات وخدمات إضافية' : 'Plans & Upgrades'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Active Subscription Banner */}
        {activeSub && (
          <div className="mb-10 bg-gradient-to-r from-indigo-950/20 to-indigo-900/10 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shadow-md shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t.activeSubTitle}</h3>
                <p className="text-sm font-semibold text-indigo-400 mt-1 uppercase">
                  {activeSub.plan?.name} — ${parseFloat(activeSub.plan?.price || '0').toFixed(2)}/{isRTL ? 'شهر' : 'mo'}
                </p>
                {activeSub.current_period_end && (
                  <div className="flex flex-col gap-0.5 mt-1.5">
                    <p className="text-xs text-gray-500">
                      {t.nextBilling} {new Date(activeSub.current_period_end).toLocaleDateString(locale)}
                    </p>
                    <p className="text-xs text-indigo-400 font-medium">
                      {isRTL ? 'الأيام المتبقية:' : 'Days remaining:'} {
                        Math.max(0, Math.ceil((new Date(activeSub.current_period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                      } {isRTL ? 'يوم' : 'days'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {activeSub.status !== 'canceled' ? (
              <button
                onClick={handleCancelSub}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold border border-red-500/20 transition-colors disabled:opacity-50 shrink-0"
              >
                {actionLoading ? t.canceling : t.cancelSub}
              </button>
            ) : (
              <span className="text-sm font-semibold text-amber-400">
                {isRTL ? 'سينتهي اشتراكك في نهاية الدورة' : 'Subscription pending cancellation'}
              </span>
            )}
          </div>
        )}

        {/* Pricing Layout */}
        <div className="space-y-6 mb-16">
          {!activeSub && allowedGateways.length > 0 && (
            <div className="flex flex-col items-center gap-3 mb-8">
              <span className="text-sm font-bold text-gray-400">{t.selectPayment}</span>
              <div className="flex items-center gap-3 bg-[#0f0f12] p-1.5 border border-gray-800 rounded-2xl shadow-sm">
                {allowedGateways.includes('stripe') && (
                  <button
                    onClick={() => setGateway('stripe')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      gateway === 'stripe'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <CreditCard size={16} />
                    Stripe
                  </button>
                )}
                {allowedGateways.includes('paypal') && (
                  <button
                    onClick={() => setGateway('paypal')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      gateway === 'paypal'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Wallet size={16} />
                    PayPal
                  </button>
                )}
              </div>
            </div>
          )}

          {!activeSub && allowedGateways.length === 0 && (
            <div className="mb-8 flex items-center justify-center gap-2 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl max-w-md mx-auto">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">
                {isRTL 
                  ? 'لم يتم تهيئة أي بوابة دفع بعد. يرجى الاتصال بالدعم.' 
                  : 'No payment gateways are currently configured. Please contact support.'}
              </span>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isFeatured = plan.is_featured;
              const featuresList = plan.features || [];
              const isActivePlan = activeSub?.plan_id === plan.id;
              
              // Upgrade / Downgrade check
              const isUpgrade = activeSub && parseFloat(plan.price) > parseFloat(activeSub.plan?.price || '0');
              const isDowngrade = activeSub && parseFloat(plan.price) < parseFloat(activeSub.plan?.price || '0');

              return (
                <div
                  key={plan.id}
                  className={`relative bg-[#0f0f12] border rounded-3xl p-6 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-200
                    ${isFeatured ? 'border-indigo-500 scale-[1.02] md:scale-105' : 'border-gray-800'}`}
                >
                  {isFeatured && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                      {t.popular}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                    
                    <div className="my-6">
                      <span className="text-4xl font-extrabold text-white">${parseFloat(plan.price).toFixed(2)}</span>
                      <span className="text-xs text-gray-500 ml-1">/{isRTL ? 'شهرياً' : 'mo'}</span>
                    </div>

                    <div className="mb-6 bg-[#070708] p-4 rounded-2xl border border-gray-800/80 space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>{isRTL ? 'حد القصص شهرياً:' : 'Monthly Stories:'}</span>
                        <span className="font-bold text-white">
                          {plan.story_limit && plan.story_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.story_limit ?? 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isRTL ? 'حد الفيديوهات شهرياً:' : 'Monthly Videos:'}</span>
                        <span className="font-bold text-white">
                          {plan.video_limit && plan.video_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.video_limit ?? 0)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gray-800/40">
                        <span>{isRTL ? 'حد القصص يومياً:' : 'Daily Stories:'}</span>
                        <span className="font-bold text-white">
                          {plan.daily_story_limit && plan.daily_story_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.daily_story_limit ?? 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isRTL ? 'حد الفيديوهات يومياً:' : 'Daily Videos:'}</span>
                        <span className="font-bold text-white">
                          {plan.daily_video_limit && plan.daily_video_limit >= 999999 ? (isRTL ? 'غير محدود' : 'Unlimited') : (plan.daily_video_limit ?? 0)}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {featuresList.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5 text-sm text-gray-300">
                          <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Action Button */}
                  {activeSub ? (
                    isActivePlan ? (
                      <button
                        disabled
                        className="w-full py-3 rounded-xl text-sm font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 cursor-default"
                      >
                        {t.currentPlanBtn}
                      </button>
                    ) : isUpgrade ? (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : t.upgradeBtn}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDowngrade(plan.id)}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-gray-800 hover:bg-gray-700 text-white transition-all disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : t.downgradeBtn}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={actionLoading}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm
                        ${isFeatured ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}
                        disabled:opacity-50`}
                    >
                      {actionLoading && checkoutPlanId === plan.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {isRTL ? 'جاري التحويل...' : 'Redirecting...'}
                        </>
                      ) : (
                        <>
                          {t.subscribeBtn}
                          <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Add-Ons Section */}
        {addons.length > 0 && (
          <div className="mb-16">
            <div className="text-center md:text-left rtl:md:text-right mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                <Tag className="text-indigo-400" />
                {t.addonsTitle}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{t.addonsSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {addons.map((addon) => (
                <div key={addon.id} className="bg-[#0f0f12] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Tag size={14} className="text-indigo-400" />
                      {addon.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{addon.description}</p>
                    
                    <div className="mt-4 bg-[#070708] p-3 rounded-xl border border-gray-850 text-xs text-gray-400 space-y-1.5">
                      {addon.story_limit && addon.story_limit > 0 ? (
                        <div className="flex justify-between">
                          <span>{isRTL ? 'قصص إضافية:' : 'Extra Stories:'}</span>
                          <span className="font-semibold text-emerald-400">+{addon.story_limit}</span>
                        </div>
                      ) : null}
                      {addon.video_limit && addon.video_limit > 0 ? (
                        <div className="flex justify-between">
                          <span>{isRTL ? 'فيديوهات إضافية:' : 'Extra Videos:'}</span>
                          <span className="font-semibold text-emerald-400">+{addon.video_limit}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xl font-extrabold text-white">${parseFloat(addon.price).toFixed(2)}</span>
                      <span className="text-[10px] text-gray-500 ml-1">/{isRTL ? 'مرة واحدة' : 'one-time'}</span>
                    </div>

                    <button
                      onClick={() => handlePurchaseAddon(addon.id)}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 disabled:opacity-50"
                    >
                      {actionLoading && addonActionId === addon.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        t.purchaseAddon
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoice History Section */}
        <div className="bg-[#0f0f12] border border-gray-800 rounded-3xl p-6 mb-16">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="text-indigo-400" size={20} />
            {t.invoicesTitle}
          </h3>

          {invoices.length === 0 ? (
            <div className="text-center py-10">
              <FileText size={32} className="text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-gray-500">{t.noInvoices}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-400">
                <thead className="text-xs uppercase bg-[#070708] text-gray-400 border-b border-gray-800">
                  <tr>
                    <th scope="col" className="px-4 py-3">{t.invoiceNo}</th>
                    <th scope="col" className="px-4 py-3">{t.invoiceDate}</th>
                    <th scope="col" className="px-4 py-3">{t.invoiceAmount}</th>
                    <th scope="col" className="px-4 py-3">{t.invoiceStatus}</th>
                    <th scope="col" className="px-4 py-3 text-right rtl:text-left">{t.invoiceActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-800/10 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-gray-200">{inv.invoice_number}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString(locale) : 'N/A'}
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-white">${inv.amount}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${getStatusBadge(inv.status)}`}>
                          {t[inv.status as keyof typeof t] || inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right rtl:text-left">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 bg-indigo-600/10 hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-semibold transition-all"
                        >
                          {t.invoiceView}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="bg-[#0f0f12] border border-gray-800 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="text-indigo-400" size={20} />
            {t.faqTitle}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-white text-sm">{t.faq1Q}</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.faq1A}</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t.faq2Q}</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.faq2A}</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t.faq3Q}</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.faq3A}</p>
            </div>
          </div>
        </div>

      </div>

      {/* USER INVOICE DETAIL MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedInvoice(null)}>
          <div 
            className="w-full max-w-lg bg-[#0f0f12] border border-gray-800 rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {t.invoiceDetails}: <span className="font-mono text-gray-300">{selectedInvoice.invoice_number}</span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="p-1 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-gray-300">
              <div className="grid grid-cols-2 gap-4 bg-[#070708] p-4 rounded-xl border border-gray-800">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">{isRTL ? 'التاريخ' : 'Date'}</span>
                  <span className="font-bold text-white mt-1 block">
                    {selectedInvoice.issued_at ? new Date(selectedInvoice.issued_at).toLocaleDateString(locale) : 'N/A'}
                  </span>
                </div>
                <div className="text-right rtl:text-left">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">{t.invoiceStatus}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider inline-block mt-1 ${getStatusBadge(selectedInvoice.status)}`}>
                    {t[selectedInvoice.status as keyof typeof t] || selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 block mb-2 font-bold uppercase tracking-wider">{isRTL ? 'البنود' : 'Items'}</span>
                <div className="border border-gray-800 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left rtl:text-right text-gray-400">
                    <thead className="bg-[#070708] border-b border-gray-800 text-[10px] uppercase font-bold text-gray-500">
                      <tr>
                        <th className="px-4 py-2">{isRTL ? 'البند' : 'Item'}</th>
                        <th className="px-4 py-2 text-right rtl:text-left">{isRTL ? 'المبلغ' : 'Price'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2.5 font-medium text-white">{item.name}</td>
                          <td className="px-4 py-2.5 text-right rtl:text-left font-bold text-white">${item.price}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#070708] font-bold text-white text-sm">
                        <td className="px-4 py-3">{isRTL ? 'الإجمالي' : 'Total'}</td>
                        <td className="px-4 py-3 text-right rtl:text-left text-indigo-400 font-black">${selectedInvoice.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedInvoice.gateway && (
                <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-800 text-gray-400">
                  <div>
                    <span className="block text-gray-500 font-bold uppercase tracking-wider">{isRTL ? 'بوابة الدفع' : 'Payment Method'}</span>
                    <span className="font-semibold text-white capitalize mt-1 block">{selectedInvoice.gateway}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 font-bold uppercase tracking-wider">{isRTL ? 'معرف العملية' : 'Transaction ID'}</span>
                    <span className="font-mono text-gray-300 mt-1 block break-all">{selectedInvoice.gateway_transaction_id || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end bg-[#070708] shrink-0">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-all"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
