import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';

interface Agent {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  avatar: string;
  color: string;
  category: string;
  skills: string[];
}

const initialAgents: Agent[] = [
  {
    id: 'reem',
    nameAr: 'ريم',
    nameEn: 'Reem',
    roleAr: 'مديرة التسويق الرقمي',
    roleEn: 'Digital Marketing Manager',
    descriptionAr: 'خبيرة في استراتيجيات النمو، تحسين محركات البحث، وإدارة الحملات الإعلانية المتقدمة.',
    descriptionEn: 'Expert in growth strategies, SEO, and advanced ad campaign management.',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png',
    color: '#e91e8c',
    category: 'Marketing',
    skills: ['SEO', 'SEM', 'Social Media', 'Analytics']
  },
  {
    id: 'ahmed',
    nameAr: 'أحمد',
    nameEn: 'Ahmed',
    roleAr: 'خبير صناعة المحتوى',
    roleEn: 'Content Specialist',
    descriptionAr: 'متخصص في كتابة المحتوى الإبداعي، السيناريوهات، والتدقيق اللغوي الاحترافي.',
    descriptionEn: 'Specialist in creative writing, scriptwriting, and professional proofreading.',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png',
    color: '#7c3aed',
    category: 'Content',
    skills: ['Copywriting', 'Storytelling', 'Editing', 'Translation']
  },
  {
    id: 'sara',
    nameAr: 'سارة',
    nameEn: 'Sara',
    roleAr: 'أخصائية تجربة العملاء',
    roleEn: 'Customer Experience Specialist',
    descriptionAr: 'تضمن رضا العملاء من خلال الدعم الذكي، حل المشكلات، وتحليل الملاحظات.',
    descriptionEn: 'Ensures customer satisfaction through smart support, problem-solving, and feedback analysis.',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png',
    color: '#0ea5e9',
    category: 'Support',
    skills: ['CRM', 'Support', 'Feedback Analysis', 'Loyalty']
  },
  {
    id: 'khalid',
    nameAr: 'خالد',
    nameEn: 'Khalid',
    roleAr: 'محلل البيانات الاستراتيجي',
    roleEn: 'Strategic Data Analyst',
    descriptionAr: 'يحول البيانات المعقدة إلى رؤى تجارية قابلة للتنفيذ وتقارير ذكاء أعمال.',
    descriptionEn: 'Transforms complex data into actionable business insights and BI reports.',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png',
    color: '#ef4444',
    category: 'Data',
    skills: ['BI', 'Data Mining', 'Forecasting', 'SQL']
  },
  {
    id: 'omar',
    nameAr: 'عمر',
    nameEn: 'Omar',
    roleAr: 'مهندس برمجيات AI',
    roleEn: 'AI Software Engineer',
    descriptionAr: 'متخصص في بناء الأنظمة الذكية، دمج الـ APIs، وتطوير تطبيقات الويب المتقدمة.',
    descriptionEn: 'Specialist in building smart systems, API integration, and advanced web app development.',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/58a3c131bdee158e559bc599498f0dd3.jpeg',
    color: '#10b981',
    category: 'Engineering',
    skills: ['Python', 'React', 'Node.js', 'LLMs']
  },
  {
    id: 'laila',
    nameAr: 'ليلى',
    nameEn: 'Laila',
    roleAr: 'مستشارة مالية ذكية',
    roleEn: 'Smart Financial Advisor',
    descriptionAr: 'خبيرة في التخطيط المالي، إدارة الميزانيات، وتحليل المخاطر الاستثمارية.',
    descriptionEn: 'Expert in financial planning, budget management, and investment risk analysis.',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d4a98132b4c7bfb8a15b56d046ddf8d5.png',
    color: '#f59e0b',
    category: 'Finance',
    skills: ['Accounting', 'Budgeting', 'Risk Analysis', 'Tax']
  }
];

export default function AgentsGrid({ onAgentClick, onCreateClick }: { onAgentClick: (agent: Agent) => void, onCreateClick: () => void }) {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Marketing', 'Content', 'Support', 'Data', 'Engineering', 'Finance'];

  const filteredAgents = filter === 'All' ? agents : agents.filter(a => a.category === filter);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {i18n.language === 'ar' ? 'فريقك من الوكلاء الأذكياء' : 'Your Team of Smart Agents'}
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {i18n.language === 'ar' ? 'اختر الخبراء المناسبين لأتمتة أعمالك' : 'Choose the right experts to automate your business'}
          </p>
        </div>
        <button 
          onClick={onCreateClick}
          className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
        >
          {i18n.language === 'ar' ? '+ إنشاء وكيل مخصص' : '+ Create Custom Agent'}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat 
                ? 'bg-primary text-white' 
                : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredAgents.map((agent) => (
            <motion.div
              key={agent.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -10 }}
              onClick={() => onAgentClick(agent)}
              className={`cursor-pointer rounded-3xl p-6 border transition-all ${
                isDark ? 'bg-gray-800/50 border-gray-700 hover:border-primary/50' : 'bg-white border-gray-100 hover:border-primary/50 shadow-xl shadow-gray-200/50'
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <img src={agent.avatar} alt={agent.nameEn} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800" style={{ backgroundColor: agent.color }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{i18n.language === 'ar' ? agent.nameAr : agent.nameEn}</h3>
                  <p className="text-primary font-medium text-sm">{i18n.language === 'ar' ? agent.roleAr : agent.roleEn}</p>
                </div>
              </div>
              <p className={`text-sm mb-6 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {i18n.language === 'ar' ? agent.descriptionAr : agent.descriptionEn}
              </p>
              <div className="flex flex-wrap gap-2">
                {agent.skills.map(skill => (
                  <span key={skill} className={`px-3 py-1 rounded-lg text-xs font-mono ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
                    #{skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
