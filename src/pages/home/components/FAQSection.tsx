import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqsAr: FAQItem[] = [
    {
      question: 'ما هو وكيلي AI؟',
      answer: 'وكيلي AI منصة ذكاء اصطناعي تتيح لك اختيار فريق من الوكلاء الأذكياء المتخصصين لأتمتة أعمالك في التسويق وكتابة المحتوى وخدمة العملاء وتحليل البيانات. كل وكيل مصمم بخبرة متخصصة لمساعدتك في تحقيق أهدافك بكفاءة عالية.'
    },
    {
      question: 'هل يمكنني تجربة وكيلي AI مجاناً؟',
      answer: 'نعم، يمكنك تجربة اجتماع الوكلاء الذكي مجاناً مرتين بدون تسجيل. للمزيد من الاجتماعات والميزات المتقدمة، يمكنك التسجيل بإيميل Google أو إيميلك الشخصي والاستفادة من الباقات المتاحة.'
    },
    {
      question: 'ما هي تخصصات الوكلاء المتاحة؟',
      answer: 'يشمل وكيلي AI وكلاء متخصصين في مجالات متعددة: التسويق الرقمي، كتابة المحتوى الإبداعي، خدمة العملاء، تحليل البيانات والإحصاءات، البرمجة وتطوير الحلول التقنية، التخطيط الاستراتيجي، وإدارة المشاريع. يمكنك أيضاً إنشاء وكلاء مخصصين حسب احتياجاتك.'
    },
    {
      question: 'كيف يعمل اجتماع الوكلاء الذكي؟',
      answer: 'اكتب مشكلتك أو فكرتك مرة واحدة، واختر القسم والوكلاء المناسبين. سيبدأ الوكلاء بالتناقش والتحليل من جميع النواحي أمام عينيك مباشرة، ثم يقدمون لك خطة عمل متكاملة مع تحذيرات المخاطر والفرص المتاحة.'
    },
    {
      question: 'هل وكيلي AI يدعم اللغة العربية؟',
      answer: 'نعم، وكيلي AI مصمم بالكامل لدعم اللغة العربية وخصوصيات الأسواق المحلية والعالمية. جميع الوكلاء يتحدثون العربية بطلاقة ويفهمون السياق الثقافي والتجاري للمنطقة، مع دعم كامل للغة الإنجليزية أيضاً.'
    },
    {
      question: 'ما هي الباقات المتاحة وأسعارها؟',
      answer: 'نوفر ثلاث باقات: باقة التجربة المجانية (مرتين بدون تسجيل)، باقة الوكيل الواحد للأفراد والمشاريع الصغيرة، وباقة الشركات للفرق والمؤسسات. الأسعار تنافسية وتناسب جميع الاحتياجات. تواصل معنا للحصول على عرض سعر مخصص.'
    },
    {
      question: 'كيف يمكنني أن أصبح شريكاً أو مستثمراً؟',
      answer: 'نرحب بالشراكات الاستراتيجية والاستثمارات التي تساهم في نمو المنصة. يمكنك التواصل معنا عبر قسم "نبحث عن شريك تجاري أو مستثمر" في الموقع، أو مراسلتنا مباشرة على cvlink2030@gmail.com. سنقوم بمراجعة طلبك والرد عليك في أقرب وقت.'
    },
    {
      question: 'هل بياناتي آمنة مع وكيلي AI؟',
      answer: 'نعم، أمان بياناتك أولويتنا القصوى. نستخدم تقنيات تشفير متقدمة ونلتزم بأعلى معايير الخصوصية والأمان. جميع المحادثات والبيانات محمية ولا يتم مشاركتها مع أي طرف ثالث. نحن نحترم خصوصيتك ونحافظ على سرية معلوماتك.'
    }
  ];

  const faqsEn: FAQItem[] = [
    {
      question: 'What is Wakili AI?',
      answer: 'Wakili AI is an artificial intelligence platform that allows you to choose a team of specialized smart agents to automate your work in marketing, content writing, customer service, and data analysis. Each agent is designed with specialized expertise to help you achieve your goals efficiently.'
    },
    {
      question: 'Can I try Wakili AI for free?',
      answer: 'Yes, you can try the smart agents meeting for free twice without registration. For more meetings and advanced features, you can register with your Google email or personal email and benefit from the available packages.'
    },
    {
      question: 'What are the available agent specializations?',
      answer: 'Wakili AI includes agents specialized in multiple fields: digital marketing, creative content writing, customer service, data analysis and statistics, programming and technical solutions development, strategic planning, and project management. You can also create custom agents according to your needs.'
    },
    {
      question: 'How does the smart agents meeting work?',
      answer: 'Write your problem or idea once, and choose the appropriate department and agents. The agents will start discussing and analyzing from all aspects right before your eyes, then provide you with a comprehensive action plan with risk warnings and available opportunities.'
    },
    {
      question: 'Does Wakili AI support Arabic?',
      answer: 'Yes, Wakili AI is fully designed to support Arabic and the specificities of local and global markets. All agents speak Arabic fluently and understand the cultural and commercial context of the region, with full support for English as well.'
    },
    {
      question: 'What are the available packages and prices?',
      answer: 'We offer three packages: free trial package (twice without registration), single agent package for individuals and small projects, and corporate package for teams and organizations. Prices are competitive and suit all needs. Contact us for a custom quote.'
    },
    {
      question: 'How can I become a partner or investor?',
      answer: 'We welcome strategic partnerships and investments that contribute to the platform\'s growth. You can contact us through the "Looking for Business Partner or Investor" section on the website, or email us directly at cvlink2030@gmail.com. We will review your request and respond as soon as possible.'
    },
    {
      question: 'Is my data safe with Wakili AI?',
      answer: 'Yes, your data security is our top priority. We use advanced encryption technologies and adhere to the highest privacy and security standards. All conversations and data are protected and not shared with any third party. We respect your privacy and maintain the confidentiality of your information.'
    }
  ];

  const faqs = i18n.language === 'ar' ? faqsAr : faqsEn;
  const isRTL = i18n.language === 'ar';

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <section className="py-20 px-4">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className={`font-mono text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {i18n.language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <p
            className={`font-mono text-lg font-semibold transition-colors duration-500 ${
              isDark ? 'text-slate-100' : 'text-slate-700'
            }`}
          >
            {i18n.language === 'ar'
              ? 'إجابات على أكثر الأسئلة شيوعاً حول وكيلي AI'
              : 'Answers to the most common questions about Wakili AI'}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                isDark
                  ? 'bg-[#0f1520]/80 backdrop-blur-xl border-slate-700/40'
                  : 'bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-${
                  isRTL ? 'right' : 'left'
                } transition-colors duration-200 cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/80'
                }`}
              >
                <h3
                  className={`font-mono text-lg font-bold transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {faq.question}
                </h3>
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-300 ${
                    openIndex === index ? 'rotate-180' : 'rotate-0'
                  } ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}
                >
                  <i
                    className={`ri-arrow-down-s-line text-xl transition-colors duration-500 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  ></i>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div
                  className={`px-6 pb-5 pt-2 font-mono text-base leading-relaxed transition-colors duration-500 ${
                    isDark ? 'text-slate-300/70' : 'text-slate-700'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div
          className={`mt-12 p-8 rounded-xl text-center border transition-all duration-300 ${
            isDark
              ? 'bg-[#0f1520]/60 backdrop-blur-xl border-slate-700/40'
              : 'bg-slate-50/80 backdrop-blur-xl border-slate-200/80'
          }`}
        >
          <h3
            className={`font-mono text-xl font-bold mb-3 transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {i18n.language === 'ar' ? 'لديك سؤال آخر؟' : 'Have another question?'}
          </h3>
          <p
            className={`font-mono text-base font-medium mb-6 transition-colors duration-500 ${
              isDark ? 'text-slate-100' : 'text-slate-700'
            }`}
          >
            {i18n.language === 'ar'
              ? 'تواصل معنا وسنكون سعداء بمساعدتك'
              : 'Contact us and we\'ll be happy to help you'}
          </p>
          <a
            href="mailto:cvlink2030@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap"
          >
            <i className="ri-mail-line text-lg"></i>
            <span>{i18n.language === 'ar' ? 'راسلنا الآن' : 'Contact Us Now'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}