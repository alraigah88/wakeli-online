import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Template {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  tools: string[];
}

export default function AgentTemplatesSection() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const templates: Template[] = [
    {
      id: 'email-assistant',
      titleAr: 'مساعد البريد الذكي',
      titleEn: 'Smart Email Assistant',
      descriptionAr: 'يقوم بفرز رسائل Gmail، وتلخيصها، واقتراح ردود احترافية تلقائياً.',
      descriptionEn: 'Sorts Gmail messages, summarizes them, and suggests professional replies automatically.',
      tools: ['https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png', 'https://cdn.worldvectorlogo.com/logos/openai-2.svg']
    },
    {
      id: 'meeting-summarizer',
      titleAr: 'ملخص الاجتماعات',
      titleEn: 'Meeting Summarizer',
      descriptionAr: 'يسحب تسجيلات Zoom، يحولها لنص، ويرسل ملخصاً لأهم القرارات عبر Slack.',
      descriptionEn: 'Pulls Zoom recordings, transcribes them, and sends a summary of key decisions via Slack.',
      tools: ['https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg']
    },
    {
      id: 'task-manager',
      titleAr: 'منظم المهام التلقائي',
      titleEn: 'Auto Task Manager',
      descriptionAr: 'يستخرج المهام من محادثات Discord ويضيفها مباشرة إلى Notion أو Trello.',
      descriptionEn: 'Extracts tasks from Discord chats and adds them directly to Notion or Trello.',
      tools: ['https://cdn.worldvectorlogo.com/logos/discord-6.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png']
    },
    {
      id: 'social-media-bot',
      titleAr: 'مدير التواصل الاجتماعي',
      titleEn: 'Social Media Manager',
      descriptionAr: 'ينشئ محتوى تسويقي بناءً على ملفات Google Docs وينشره في المواعيد المحددة.',
      descriptionEn: 'Creates marketing content based on Google Docs and schedules posts.',
      tools: ['https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png', 'https://cdn.worldvectorlogo.com/logos/figma-1.svg']
    },
    {
      id: 'research-agent',
      titleAr: 'الباحث العميق',
      titleEn: 'Deep Researcher',
      descriptionAr: 'يجري أبحاثاً متعددة الخطوات على الويب مع ترتيب المصادر والاستشهادات في ملف PDF.',
      descriptionEn: 'Conducts multi-step web research with sources and citations in a PDF file.',
      tools: ['https://cdn.worldvectorlogo.com/logos/google-icon.svg', 'https://cdn.worldvectorlogo.com/logos/openai-2.svg']
    },
    {
      id: 'customer-support',
      titleAr: 'وكيل الدعم الفني',
      titleEn: 'Support Agent',
      descriptionAr: 'يجيب على أسئلة العملاء من المستندات وقاعدة المعارف، ويتصاعد عند الحاجة.',
      descriptionEn: 'Answers customer questions from docs and knowledge base, escalates when needed.',
      tools: ['https://cdn.worldvectorlogo.com/logos/intercom.svg', 'https://cdn.worldvectorlogo.com/logos/hubspot.svg']
    }
  ];

  const filteredTemplates = templates.filter(t => 
    (isRTL ? t.titleAr : t.titleEn).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? 'تصفح القوالب الجاهزة' : 'Browse Ready Templates'}
          </h2>
          <div className="relative w-full md:w-96">
            <i className={`ri-search-line absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`}></i>
            <input
              type="text"
              placeholder={isRTL ? 'ابحث عن قالب...' : 'Search for a template...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-teal-500/5 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {isRTL ? template.titleAr : template.titleEn}
                </h3>
                <div className="flex -space-x-2">
                  {template.tools.map((tool, index) => (
                    <img key={index} src={tool} alt="tool" className="w-6 h-6 rounded-full border-2 border-white bg-white" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {isRTL ? template.descriptionAr : template.descriptionEn}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  {isRTL ? 'جاهز للتفعيل' : 'Ready to use'}
                </span>
                <button className="text-sm font-bold text-gray-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                  {isRTL ? 'استخدام القالب' : 'Use Template'}
                  <i className={`ri-arrow-${isRTL ? 'left' : 'right'}-line`}></i>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
