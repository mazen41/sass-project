'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/context/LangContext';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Cpu,
  Loader2
} from 'lucide-react';
import { apiGetLandingSettings, LandingPageSettings } from '@/lib/api';

interface Position {
  id: string;
  title_en: string;
  title_ar: string;
  dept_en: string;
  dept_ar: string;
  type_en: string;
  type_ar: string;
  loc_en: string;
  loc_ar: string;
  desc_en: string;
  desc_ar: string;
  reqs_en: string[];
  reqs_ar: string[];
}

export default function CareersPage() {
  const { locale } = useLang();
  const isRTL = locale === 'ar';

  const [settings, setSettings] = useState<LandingPageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetLandingSettings()
      .then((res) => setSettings(res.settings))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const content = settings
    ? (isRTL ? settings.careers_content_ar : settings.careers_content_en)
    : '';

  // Simple, fast Markdown-to-JSX parser
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-bold text-white mt-8 mb-4 border-b border-white/5 pb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-white mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listText = line.replace(/^[-*]\s/, '');
        return (
          <li key={idx} className="ml-6 rtl:mr-6 list-disc text-gray-300 my-2 leading-relaxed">
            {parseBold(listText)}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        const listText = line.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-6 rtl:mr-6 list-decimal text-gray-300 my-2 leading-relaxed">
            {parseBold(listText)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-gray-300 leading-relaxed text-base mb-4">
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

  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolio: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = {
    title: isRTL ? 'انضم إلى فريق الإبداع' : 'Build the Future of Play',
    subtitle: isRTL ? 'نحن نبحث عن عقول مبدعة ومطوري برمجيات شغوفين بإعادة صياغة الخيال والقصص للأطفال.' : 'Join a senior team merging deep learning with cinematic narrative storytelling.',
    badge: isRTL ? 'وظائف شاغرة' : 'Careers at StoryHero',
    cultureTitle: isRTL ? 'ثقافتنا وقيمنا' : 'Our Culture',
    cultureDesc: isRTL ? 'المبادئ التي تقود عمليات الابتكار اليومي لدينا.' : 'The principles that guide our everyday engineering and design decisions.',
    openRoles: isRTL ? 'الفرص المتاحة حالياً' : 'Open Opportunities',
    requirements: isRTL ? 'المتطلبات الأساسية:' : 'Requirements:',
    applyBtn: isRTL ? 'تقدم للوظيفة' : 'Apply Now',
    formTitle: isRTL ? 'طلب الانضمام للفريق' : 'Submit Application',
    formDesc: isRTL ? 'املأ التفاصيل أدناه وسيتواصل معك فريق التوظيف في غضون أيام قليلة.' : 'Please provide your details below. Our team reviews all applications within 3 business days.',
    labelName: isRTL ? 'الاسم الكامل *' : 'Full Name *',
    labelEmail: isRTL ? 'البريد الإلكتروني *' : 'Email Address *',
    labelRole: isRTL ? 'الوظيفة المستهدفة *' : 'Target Role *',
    labelPortfolio: isRTL ? 'رابط السيرة الذاتية أو الأعمال *' : 'Resume or Portfolio URL *',
    labelMessage: isRTL ? 'لماذا تريد الانضمام إلينا؟' : 'Cover Message',
    submitBtn: isRTL ? 'إرسال الطلب' : 'Submit Application',
    submitting: isRTL ? 'جاري الإرسال...' : 'Submitting...',
    successTitle: isRTL ? 'تم استلام طلبك بنجاح!' : 'Application Received!',
    successDesc: isRTL ? 'شكرًا لاهتمامك بالانضمام إلى عائلة ستوري هيرو. سنقوم بمراجعة ملفك والتواصل معك قريباً.' : 'Thank you for your interest in StoryHero. We will be in touch shortly after reviewing your portfolio.',
  };

  const values = [
    {
      icon: Cpu,
      title_en: 'Engineering Excellence',
      title_ar: 'التميز الهندسي',
      desc_en: 'We prioritize clean code, instant query response, and highly optimized deep learning models.',
      desc_ar: 'نحن نضع جودة الكود وسرعة الاستجابة ونماذج التعلم العميق عالية التحسين في مقدمة أولوياتنا.'
    },
    {
      icon: ShieldCheck,
      title_en: 'Trust & Privacy',
      title_ar: 'الثقة والأمان',
      desc_en: 'We guarantee 100% child safety, strictly deleting metadata and raw inputs post-synthesis.',
      desc_ar: 'نحن نضمن سلامة الأطفال بنسبة ١٠٠٪، مع حذف تام للملفات والبيانات فور انتهاء توليد القصص.'
    },
    {
      icon: Sparkles,
      title_en: 'Artistic Integrity',
      title_ar: 'النزاهة الفنية',
      desc_en: 'We avoid simple generic AI output, tailoring neural structures to produce cinematic art.',
      desc_ar: 'نتجنب المخرجات الجاهزة والمبتذلة، ونطوع نماذجنا لتوليد لوحات سينمائية تليق بخيال الأطفال.'
    }
  ];

  const positions: Position[] = [
    {
      id: 'fullstack',
      title_en: 'Senior Full Stack Engineer',
      title_ar: 'مهندس برمجيات أول (Full Stack)',
      dept_en: 'Engineering',
      dept_ar: 'الهندسة والتطوير',
      type_en: 'Full-time / Remote',
      type_ar: 'دوام كامل / عن بعد',
      loc_en: 'Global',
      loc_ar: 'عالمي',
      desc_en: 'Lead our Next.js App Router frontend and Laravel REST API backend. You will optimize database indexing, cache layers, and real-time generation queues.',
      desc_ar: 'قيادة تطوير الواجهات الأمامية باستخدام Next.js والخلفية باستخدام Laravel. ستعمل على تحسين الفهرسة وقواعد البيانات، وإعداد طبقات التخزين المؤقت، وتنظيم طوابير المهام التوليدية.',
      reqs_en: [
        '5+ years experience with modern React/Next.js and PHP/Laravel',
        'Strong expertise in MySQL indexing, query optimization, and Redis caching',
        'Familiarity with AWS, Docker, and CI/CD pipelines',
        'Experience building clean, reusable components with Tailwind CSS'
      ],
      reqs_ar: [
        'خبرة لا تقل عن ٥ سنوات في العمل مع React/Next.js و PHP/Laravel',
        'معرفة ممتازة بفهرسة MySQL، تحسين الاستعلامات، والتخزين المؤقت عبر Redis',
        'دراية ببيئات العمل السحابية AWS و Docker والربط البرمجي المستمر CI/CD',
        'شغف ببناء مكونات واجهة مستخدم نظيفة وقابلة لإعادة الاستخدام عبر Tailwind CSS'
      ]
    },
    {
      id: 'prompt-artist',
      title_en: 'AI Visual Sequence Designer',
      title_ar: 'مصمم بصري لنماذج الذكاء الاصطناعي',
      dept_en: 'Creative Design',
      dept_ar: 'التصميم والإبداع',
      type_en: 'Full-time',
      type_ar: 'دوام كامل',
      loc_en: 'Remote / EMEA',
      loc_ar: 'عن بعد / منطقة أوروبا والشرق الأوسط',
      desc_en: 'Architect style-consistent prompts and reference-net layers for stable diffusion. You will build and control facial likeness translation filters to guarantee 100% aesthetic coherence.',
      desc_ar: 'بناء وتدريب موجهات ونماذج الاتساق البصري لـ Stable Diffusion. ستعمل على تكييف نماذج الملامح الشخصية لضمان تطابق الرسوم تماماً مع ملامح الطفل الحقيقية.',
      reqs_en: [
        'Deep understanding of Stable Diffusion, ControlNet, and IP-Adapter configurations',
        'Portfolio demonstrating style consistency and character training',
        'Strong sense of cinematic color palettes, lighting, and composition',
        'Python experience or familiarity with ComfyUI API is a major plus'
      ],
      reqs_ar: [
        'فهم عميق لتقنيات Stable Diffusion و ControlNet وإعدادات IP-Adapter',
        'معرض أعمال يثبت القدرة على توليد شخصيات ثابتة ومتسقة عبر مشاهد متعددة',
        'ذوق فني رفيع في تنسيق الألوان السينمائية، الإضاءة، والتركيب البصري',
        'خبرة برمجية في بايثون أو واجهة ComfyUI تعتبر ميزة إضافية قوية'
      ]
    },
    {
      id: 'writer',
      title_en: 'Narrative Scriptwriter & Story Designer',
      title_ar: 'كاتب نصوص ومصمم مغامرات قصصية',
      dept_en: 'Narrative',
      dept_ar: 'الكتابة والمحتوى',
      type_en: 'Contract / Part-time',
      type_ar: 'عقد / دوام جزئي',
      loc_en: 'Global',
      loc_ar: 'عالمي',
      desc_en: 'Develop branching story structures and bilingual (EN/AR) beds for children’s adventures. You will craft templates that allow the generation engine to insert personalized characters smoothly.',
      desc_ar: 'تطوير هياكل وبنيات قصصية تفاعلية وقوالب ثنائية اللغة (العربية والإنجليزية). ستقوم بصياغة مسارات سردية مرنة تسمح لمحرك التوليد بحقن أسماء ومغامرات الأطفال بسلاسة.',
      reqs_en: [
        'Proven track record writing creative children\'s literature or game narrative scriptwriting',
        'Perfect bilingual fluency in English and Arabic (both written)',
        'Understanding of pacing, conflict, and emotional resolution for ages 3-12',
        'Ability to write structured scripts containing template tags (e.g. {{hero_name}})'
      ],
      reqs_ar: [
        'سجل حافل في كتابة قصص الأطفال الإبداعية أو سيناريوهات الألعاب التفاعلية',
        'إتقان تام للغتين العربية والإنجليزية كتابةً وتدقيقاً',
        'فهم ممتاز لسرعة السرد وتصاعد الحبكة والتنظيم العاطفي للفئات العمرية ٣-١٢ سنة',
        'القدرة على كتابة نصوص هيكلية تدعم وسوم الدمج التلقائي (مثل {{اسم_البطل}})'
      ]
    }
  ];

  const toggleRole = (id: string) => {
    if (expandedRole === id) {
      setExpandedRole(null);
    } else {
      setExpandedRole(id);
    }
  };

  const handleApplyClick = (roleId: string, roleTitle: string) => {
    setSelectedRole(roleId);
    setExpandedRole(roleId);
    // Scroll to form
    const formEl = document.getElementById('application-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedRole || !formData.portfolio) {
      alert(isRTL ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', portfolio: '', message: '' });
    }, 1500);
  };

  return (
    <div className="site-shell min-h-screen flex flex-col" data-theme="dark" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#070707', color: '#ffffff' }}>
      <CustomCursor />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,179,8,0.06),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(236,72,153,0.04),_transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="kido-badge inline-flex">
              <span className="kido-badge-star" style={{ color: 'var(--k-yellow)' }}>✦</span>
              {t.badge}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 max-w-3xl mx-auto leading-tight"
          >
            {isRTL ? 'ساعدنا في بناء مستقبل' : 'Help us build the next'}{' '}
            <span className="gradient-text" style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isRTL ? 'رواية القصص الرقمية' : 'generation of narrative magic'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto mt-4 text-base sm:text-lg leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full space-y-20">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : content ? (
          <div className="prose prose-invert max-w-none space-y-6 bg-white/2 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.03),_transparent_60%)] pointer-events-none" />
            <div className="relative z-10">
              {renderMarkdown(content)}
            </div>
          </div>
        ) : (
          <>
            {/* Culture & Pillars */}
            <section className="space-y-12">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-3xl font-bold text-white">{t.cultureTitle}</h2>
                <p className="text-gray-400 mt-2 text-sm">{t.cultureDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((v, idx) => {
                  const Icon = v.icon;
                  return (
                    <div key={idx} className="bg-white/2 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-yellow-500/20 transition-all duration-300">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {isRTL ? v.title_ar : v.title_en}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {isRTL ? v.desc_ar : v.desc_en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Accordion List */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-white text-center">{t.openRoles}</h2>
              
              <div className="space-y-4">
                {positions.map((pos) => {
                  const isExpanded = expandedRole === pos.id;
                  return (
                    <div 
                      key={pos.id}
                      className="bg-white/2 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300"
                    >
                      {/* Accordion Title Trigger */}
                      <button
                        onClick={() => toggleRole(pos.id)}
                        className="w-full px-8 py-6 flex items-center justify-between text-left rtl:text-right hover:bg-white/5 transition-colors"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {isRTL ? pos.title_ar : pos.title_en}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Briefcase size={12} />
                              {isRTL ? pos.dept_ar : pos.dept_en}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {isRTL ? pos.type_ar : pos.type_en}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {isRTL ? pos.loc_ar : pos.loc_en}
                            </span>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-400"
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </button>

                      {/* Accordion Expand Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-white/10"
                          >
                            <div className="p-8 space-y-6">
                              <p className="text-gray-300 leading-relaxed text-sm">
                                {isRTL ? pos.desc_ar : pos.desc_en}
                              </p>

                              <div className="space-y-3">
                                <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wider">
                                  {t.requirements}
                                </h4>
                                <ul className="space-y-2">
                                  {(isRTL ? pos.reqs_ar : pos.reqs_en).map((req, rIdx) => (
                                    <li key={rIdx} className="text-gray-400 text-sm flex items-start gap-2">
                                      <span className="text-yellow-500/50 mt-1 shrink-0">✦</span>
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-4">
                                <button
                                  onClick={() => handleApplyClick(pos.id, isRTL ? pos.title_ar : pos.title_en)}
                                  className="btn btn-primary"
                                >
                                  {t.applyBtn}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}


        {/* Application Form */}
        <section 
          id="application-form-section" 
          className="bg-white/2 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.03),_transparent_60%)]" />

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6 relative z-10"
            >
              <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/5 animate-bounce">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-white">{t.successTitle}</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                {t.successDesc}
              </p>
            </motion.div>
          ) : (
            <div className="relative z-10 space-y-8">
              <div className="text-center sm:text-left rtl:sm:text-right">
                <h3 className="text-2xl font-bold text-white">{t.formTitle}</h3>
                <p className="text-gray-400 text-sm mt-1">{t.formDesc}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t.labelName}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-500/40 text-white"
                      placeholder="e.g. Liam Sterling"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t.labelEmail}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-500/40 text-white"
                      placeholder="e.g. liam@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t.labelRole}
                    </label>
                    <select
                      required
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-500/40 text-white"
                    >
                      <option value="">{isRTL ? '-- اختر وظيفة --' : '-- Select Role --'}</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {isRTL ? pos.title_ar : pos.title_en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t.labelPortfolio}
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-500/40 text-white"
                      placeholder="https://github.com/... or https://behance.net/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {t.labelMessage}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-500/40 text-white"
                    placeholder={isRTL ? 'أخبرنا عن خبرتك وشغفك...' : 'Tell us about your background and passion...'}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {t.submitBtn}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>

      <footer className="footer mt-auto" style={{ background: '#050505', color: '#ffffff', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} StoryHero. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
