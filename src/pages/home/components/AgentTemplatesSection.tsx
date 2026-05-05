import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';

const templates = [
  {
    id: 'seo-expert',
    titleAr: 'خبير تحسين محركات البحث',
    titleEn: 'SEO Expert',
    descAr: 'أتمتة تحليل الكلمات المفتاحية وبناء الروابط.',
    descEn: 'Automate keyword analysis and link building.',
    icon: 'ri-search-line',
    color: 'bg-blue-500'
  },
  {
    id: 'code-reviewer',
    titleAr: 'مراجع الكود الذكي',
    titleEn: 'Smart Code Reviewer',
    descAr: 'فحص الأخطاء البرمجية واقتراح التحسينات.',
    descEn: 'Check code errors and suggest improvements.',
    icon: 'ri-code-s-slash-line',
    color: 'bg-green-500'
  },
  {
    id: 'social-growth',
    titleAr: 'مدير نمو التواصل',
    titleEn: 'Social Growth Manager',
    descAr: 'جدولة المنشورات وتحليل التفاعل تلقائياً.',
    descEn: 'Schedule posts and analyze engagement automatically.',
    icon: 'ri-share-line',
    color: 'bg-pink-500'
  },
  {
    id: 'tax-planner',
    titleAr: 'مخطط الضرائب',
    titleEn: 'Tax Planner',
    descAr: 'حساب الضرائب وتقديم تقارير مالية دقيقة.',
    descEn: 'Calculate taxes and provide accurate financial reports.',
    icon: 'ri-calculator-line',
    color: 'bg-yellow-500'
  },
  {
    id: 'customer-support',
    titleAr: 'دعم العملاء الآلي',
    titleEn: 'Automated Customer Support',
    descAr: 'الرد على استفسارات العملاء على مدار الساعة.',
    descEn: 'Respond to customer inquiries 24/7.',
    icon: 'ri-customer-service-2-line',
    color: 'bg-purple-500'
  },
  {
    id: 'data-visualizer',
    titleAr: 'مصور البيانات',
    titleEn: 'Data Visualizer',
    descAr: 'تحويل البيانات الخام إلى رسوم بيانية تفاعلية.',
    descEn: 'Transform raw data into interactive charts.',
    icon: 'ri-bar-chart-line',
    color: 'bg-red-500'
  }
];

export default function AgentTemplatesSection() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {i18n.language === 'ar' ? 'قوالب الوكلاء الجاهزة' : 'Ready-to-use Agent Templates'}
        </h2>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {i18n.language === 'ar' ? 'ابدأ فوراً باستخدام قوالب مصممة مسبقاً لأكثر المهام شيوعاً' : 'Start immediately with pre-designed templates for common tasks'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-3xl border transition-all hover:shadow-lg ${
              isDark ? 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50' : 'bg-white border-gray-100 hover:shadow-gray-200/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl ${template.color} flex items-center justify-center mb-6 text-white text-2xl shadow-lg`}>
              <i className={template.icon}></i>
            </div>
            <h3 className="text-xl font-bold mb-2">{i18n.language === 'ar' ? template.titleAr : template.titleEn}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {i18n.language === 'ar' ? template.descAr : template.descEn}
            </p>
            <button className="mt-6 text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              {i18n.language === 'ar' ? 'استخدم هذا القالب' : 'Use this template'}
              <i className={`ri-arrow-${i18n.language === 'ar' ? 'left' : 'right'}-line`}></i>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
