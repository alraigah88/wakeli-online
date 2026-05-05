import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';

interface AIMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMeeting: (data: any) => void;
}

export default function AIMeetingModal({ isOpen, onClose, onStartMeeting }: AIMeetingModalProps) {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const departments = [
    { id: 'marketing', nameAr: 'التسويق', nameEn: 'Marketing', icon: 'ri-megaphone-line' },
    { id: 'engineering', nameAr: 'الهندسة', nameEn: 'Engineering', icon: 'ri-code-box-line' },
    { id: 'finance', nameAr: 'المالية', nameEn: 'Finance', icon: 'ri-money-dollar-circle-line' },
    { id: 'support', nameAr: 'الدعم', nameEn: 'Support', icon: 'ri-customer-service-line' }
  ];

  const handleStart = () => {
    onStartMeeting({
      department,
      topic,
      selectedAgents
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {i18n.language === 'ar' ? 'بدء اجتماع ذكاء اصطناعي' : 'Start AI Meeting'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {i18n.language === 'ar' ? 'اختر القسم الذي تريد عقد الاجتماع معه:' : 'Choose the department you want to meet with:'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {departments.map(dept => (
                    <button
                      key={dept.id}
                      onClick={() => { setDepartment(dept.id); setStep(2); }}
                      className={`p-6 rounded-2xl border-2 transition-all text-center group ${
                        department === dept.id ? 'border-primary bg-primary/5' : isDark ? 'border-gray-800 hover:border-gray-700' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <i className={`${dept.icon} text-3xl mb-3 block group-hover:scale-110 transition-transform ${department === dept.id ? 'text-primary' : ''}`}></i>
                      <span className="font-bold">{i18n.language === 'ar' ? dept.nameAr : dept.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {i18n.language === 'ar' ? 'موضوع الاجتماع:' : 'Meeting Topic:'}
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={i18n.language === 'ar' ? 'مثلاً: استراتيجية إطلاق المنتج الجديد...' : 'e.g., New product launch strategy...'}
                    className={`w-full p-4 rounded-xl border-2 focus:border-primary outline-none transition-all h-32 resize-none ${
                      isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'
                    }`}
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-200 dark:border-gray-700">
                    {i18n.language === 'ar' ? 'رجوع' : 'Back'}
                  </button>
                  <button 
                    onClick={handleStart}
                    disabled={!topic}
                    className="flex-[2] py-4 rounded-xl font-bold bg-primary text-white disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    {i18n.language === 'ar' ? 'بدء الاجتماع الآن' : 'Start Meeting Now'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
