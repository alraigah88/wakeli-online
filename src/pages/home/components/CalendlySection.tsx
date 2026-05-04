import { useTheme } from '../page';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface CalendlySectionProps {
  onMeetingClick: () => void;
}

const agentAvatars = [
  { key: 'reem',   src: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png', nameAr: 'ريم',  nameEn: 'Reem'   },
  { key: 'ahmed',  src: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png', nameAr: 'أحمد', nameEn: 'Ahmed'  },
  { key: 'sara',   src: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png', nameAr: 'سارة', nameEn: 'Sara'   },
  { key: 'khalid', src: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png', nameAr: 'خالد', nameEn: 'Khalid' },
  { key: 'nora',   src: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/a922778b168be8b83e02c082538079fd.png', nameAr: 'نورة', nameEn: 'Nora'   },
  { key: 'omar',   src: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/fa141410ac8972062d76be8f0ec890b4.png', nameAr: 'عمر',  nameEn: 'Omar'   },
];

export default function CalendlySection({ onMeetingClick }: CalendlySectionProps) {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <section className={`py-20 px-4 ${isDark ? 'bg-[#1a1a2e]' : 'bg-gradient-to-b from-teal-50/60 to-white'}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isArabic
              ? 'ناقش فكرتك مع وكلاء مختصين بالأسواق المحلية والعالمية باحتراف'
              : 'Discuss Your Idea with Expert Agents in Local & Global Markets'}
          </h2>
          <p className={`text-base md:text-lg mb-10 max-w-2xl mx-auto ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            {isArabic
              ? 'اكتب مشكلتك أو فكرتك مرة واحدة، وشاهد فريق الوكلاء المتخصصين يتنافلون ويحللون من جميع النواحي ويقدمون لك خطة عمل متكاملة'
              : 'Write your problem or idea once and watch a team of specialized agents analyze it from all angles and deliver a complete action plan'}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
            {agentAvatars.map((agent, idx) => (
              <motion.div
                key={agent.key}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-400 shadow-md">
                  <img src={agent.src} alt={isArabic ? agent.nameAr : agent.nameEn} className="w-full h-full object-cover object-top" />
                </div>
                <span className={`text-xs font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  {isArabic ? agent.nameAr : agent.nameEn}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={onMeetingClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-full shadow-lg transition-colors cursor-pointer"
          >
            <i className="ri-video-chat-line text-xl"></i>
            {isArabic ? 'ابدأ الاجتماع المجاني الآن' : 'Start Free Meeting Now'}
          </motion.button>

          <p className={`mt-4 text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            {isArabic
              ? 'تجربة مجانية واحدة • للاستمرار سجّل بإيميلك أو Google'
              : 'One free trial • Continue by registering with email or Google'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
