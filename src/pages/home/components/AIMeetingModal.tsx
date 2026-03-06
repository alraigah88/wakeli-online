import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import { useAuth } from '@/contexts/AuthContext';
import LiveMeetingRoom, { MeetingSummary } from './LiveMeetingRoom';

interface AIMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMeeting: (department: string, selectedAgents: string[], topic: string) => void;
}

interface Department {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
}

interface Agent {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  avatar: string;
  departments: string[];
  color: string;
}

const departments: Department[] = [
  {
    id: 'marketing',
    nameAr: 'التسويق',
    nameEn: 'Marketing',
    icon: 'ri-megaphone-line',
    color: '#e91e8c',
  },
  {
    id: 'finance',
    nameAr: 'المالية',
    nameEn: 'Finance',
    icon: 'ri-line-chart-line',
    color: '#10b981',
  },
  {
    id: 'product',
    nameAr: 'المنتجات',
    nameEn: 'Product',
    icon: 'ri-box-3-line',
    color: '#f59e0b',
  },
  {
    id: 'operations',
    nameAr: 'العمليات',
    nameEn: 'Operations',
    icon: 'ri-settings-3-line',
    color: '#0ea5e9',
  },
  {
    id: 'strategy',
    nameAr: 'الاستراتيجية',
    nameEn: 'Strategy',
    icon: 'ri-lightbulb-line',
    color: '#7c3aed',
  },
];

const agents: Agent[] = [
  {
    id: 'reem',
    nameAr: 'ريم',
    nameEn: 'Reem',
    roleAr: 'مديرة التسويق',
    roleEn: 'Marketing Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png',
    departments: ['marketing', 'strategy'],
    color: '#e91e8c',
  },
  {
    id: 'ahmed',
    nameAr: 'أحمد',
    nameEn: 'Ahmed',
    roleAr: 'مدير المحتوى',
    roleEn: 'Content Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png',
    departments: ['marketing', 'product'],
    color: '#7c3aed',
  },
  {
    id: 'sara',
    nameAr: 'سارة',
    nameEn: 'Sara',
    roleAr: 'مديرة خدمة العملاء',
    roleEn: 'Customer Service Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png',
    departments: ['operations', 'strategy'],
    color: '#0ea5e9',
  },
  {
    id: 'khalid',
    nameAr: 'خالد',
    nameEn: 'Khalid',
    roleAr: 'محلل الأداء',
    roleEn: 'Performance Analyst',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png',
    departments: ['finance', 'strategy'],
    color: '#10b981',
  },
  {
    id: 'nora',
    nameAr: 'نورة',
    nameEn: 'Nora',
    roleAr: 'مديرة المشاريع',
    roleEn: 'Project Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/a922778b168be8b83e02c082538079fd.png',
    departments: ['operations', 'product'],
    color: '#f59e0b',
  },
  {
    id: 'omar',
    nameAr: 'عمر',
    nameEn: 'Omar',
    roleAr: 'مطور تقني',
    roleEn: 'Technical Developer',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/fa141410ac8972062d76be8f0ec890b4.png',
    departments: ['product', 'operations'],
    color: '#ef4444',
  },
];

export default function AIMeetingModal({ isOpen, onClose, onStartMeeting }: AIMeetingModalProps) {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isArabic = i18n.language === 'ar';

  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [meetingTopic, setMeetingTopic] = useState('');
  const [showLiveMeeting, setShowLiveMeeting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedDepartment('');
      setSelectedAgents([]);
      setMeetingTopic('');
      setShowLiveMeeting(false);
    }
  }, [isOpen]);

  const filteredAgents = selectedDepartment
    ? agents.filter((agent) => agent.departments.includes(selectedDepartment))
    : [];

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const handleStartMeeting = () => {
    if (!selectedDepartment || selectedAgents.length === 0 || !meetingTopic.trim()) {
      return;
    }

    // Increment guest meeting count
    if (!user) {
      const currentCount = parseInt(localStorage.getItem('guest_meeting_count') || '0', 10);
      localStorage.setItem('guest_meeting_count', String(currentCount + 1));
    }

    // Don't call onStartMeeting - just show live meeting directly
    setShowLiveMeeting(true);
  };

  const handleMeetingComplete = (summary: MeetingSummary) => {
    // Will be handled in next step
    console.log('Meeting completed', summary);
  };

  const canStartMeeting = selectedDepartment && selectedAgents.length > 0 && meetingTopic.trim().length > 0;

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {!showLiveMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                isDark ? 'bg-[#2a2458]' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div
                className={`sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 py-5 border-b backdrop-blur-xl ${
                  isDark ? 'bg-[#2a2458]/95 border-[#5a5490]/30' : 'bg-white/95 border-gray-200'
                }`}
              >
                <div>
                  <h2
                    className={`text-2xl md:text-3xl font-bold font-mono ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {isArabic ? 'ابدأ اجتماع الوكلاء الذكي' : 'Start AI Agents Meeting'}
                  </h2>
                  <p className={`text-sm font-mono mt-1 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                    {isArabic
                      ? 'اختر القسم والوكلاء واكتب موضوعك'
                      : 'Select department, agents, and enter your topic'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Step 1: Select Department */}
                <div>
                  <h3
                    className={`text-xl font-bold font-mono mb-4 flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    {isArabic ? 'اختر القسم' : 'Select Department'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {departments.map((dept) => (
                      <motion.button
                        key={dept.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedDepartment(dept.id);
                          setSelectedAgents([]);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedDepartment === dept.id
                            ? isDark
                              ? 'bg-teal-500/15 border-teal-400/50'
                              : 'bg-teal-50 border-teal-400'
                            : isDark
                            ? 'bg-[#3a3568]/40 border-[#5a5490]/30 hover:border-[#5a5490]/60'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${dept.color}20` }}
                        >
                          <i className={`${dept.icon} text-2xl`} style={{ color: dept.color }}></i>
                        </div>
                        <p
                          className={`font-mono text-sm font-bold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {isArabic ? dept.nameAr : dept.nameEn}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select Agents - Multi-select Grid */}
                {selectedDepartment && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      className={`text-xl font-bold font-mono mb-4 flex items-center gap-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      {isArabic ? 'اختر الوكلاء' : 'Choose Agents'}
                      <span
                        className={`text-sm font-normal ${isDark ? 'text-white/50' : 'text-gray-500'}`}
                      >
                        ({selectedAgents.length} {isArabic ? 'محدد' : 'selected'})
                      </span>
                    </h3>
                    <p className={`text-sm font-mono mb-6 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                      {isArabic ? 'اختر وكيل أو أكثر للاجتماع' : 'Select one or more agents for the meeting'}
                    </p>

                    {/* Grid of all agents */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredAgents.map((agent) => (
                        <motion.div
                          key={agent.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleAgentSelection(agent.id)}
                          className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                            selectedAgents.includes(agent.id)
                              ? 'border-teal-400 shadow-lg'
                              : isDark
                              ? 'border-[#5a5490]/30 hover:border-[#5a5490]/60'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {/* Agent Image */}
                          <div className="relative w-full h-48 md:h-56">
                            <img
                              src={agent.avatar}
                              alt={isArabic ? agent.nameAr : agent.nameEn}
                              className="w-full h-full object-cover object-top"
                            />
                            {/* Gradient overlay */}
                            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#2a2458]/90 via-transparent to-transparent' : 'bg-gradient-to-t from-white/90 via-transparent to-transparent'}`} />
                            
                            {/* Selected badge */}
                            {selectedAgents.includes(agent.id) && (
                              <div className="absolute top-3 end-3 w-8 h-8 flex items-center justify-center rounded-full bg-teal-500 shadow-lg z-10">
                                <i className="ri-check-line text-white text-lg"></i>
                              </div>
                            )}

                            {/* Name on image */}
                            <div className="absolute bottom-3 start-3 end-3 z-10">
                              <div className={`px-3 py-2 rounded-xl backdrop-blur-md ${isDark ? 'bg-black/30' : 'bg-white/60'}`}>
                                <p className={`font-mono font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {isArabic ? agent.nameAr : agent.nameEn}
                                </p>
                                <p className="font-mono text-xs" style={{ color: agent.color }}>
                                  {isArabic ? agent.roleAr : agent.roleEn}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Agent departments */}
                          <div className={`p-3 ${isDark ? 'bg-[#3a3568]/40' : 'bg-gray-50'}`}>
                            <div className="flex flex-wrap gap-1.5">
                              {agent.departments.map((deptId: string) => {
                                const dept = departments.find(d => d.id === deptId);
                                if (!dept) return null;
                                return (
                                  <span
                                    key={deptId}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] ${
                                      isDark ? 'bg-white/5 text-white/50' : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    <i className={`${dept.icon} text-[10px]`} style={{ color: dept.color }}></i>
                                    {isArabic ? dept.nameAr : dept.nameEn}
                                  </span>
                                );
                              })}
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                {isArabic ? 'متاح 24/7' : 'Available 24/7'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Enter Meeting Topic */}
                {selectedAgents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      className={`text-xl font-bold font-mono mb-4 flex items-center gap-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      {isArabic ? 'اكتب موضوع الاجتماع' : 'Enter Meeting Topic'}
                    </h3>
                    <textarea
                      value={meetingTopic}
                      onChange={(e) => setMeetingTopic(e.target.value)}
                      placeholder={
                        isArabic
                          ? 'اكتب فكرتك أو مشكلتك بالتفصيل... مثال: لدي تطبيق توصيل طعام لكن المبيعات ضعيفة ولا أعرف السبب'
                          : 'Describe your idea or problem in detail... Example: I have a food delivery app but sales are weak and I don\'t know why'
                      }
                      rows={6}
                      className={`w-full px-5 py-4 rounded-xl border-2 font-mono text-base resize-none transition-all ${
                        isDark
                          ? 'bg-[#3a3568]/40 border-[#5a5490]/30 text-white placeholder:text-white/30 focus:border-teal-400/50 focus:bg-[#3a3568]/60'
                          : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-teal-400 focus:bg-gray-50'
                      } focus:outline-none`}
                    />
                    <p
                      className={`text-sm font-mono mt-2 ${
                        isDark ? 'text-white/40' : 'text-gray-500'
                      }`}
                    >
                      {isArabic
                        ? 'ملاحظة: ستكتب موضوعك مرة واحدة فقط، والوكلاء سيتناقشون ويحللون ويقدمون الحلول'
                        : 'Note: You will write your topic once only, and agents will discuss, analyze, and provide solutions'}
                    </p>
                  </motion.div>
                )}

                {/* Start Meeting Button */}
                {selectedAgents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center pt-4"
                  >
                    <button
                      onClick={handleStartMeeting}
                      disabled={!canStartMeeting}
                      className={`px-10 py-4 rounded-xl font-mono font-bold text-lg transition-all cursor-pointer whitespace-nowrap ${
                        canStartMeeting
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 hover:scale-105 shadow-lg hover:shadow-xl'
                          : isDark
                          ? 'bg-white/10 text-white/30 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <i className="ri-play-circle-line text-xl me-2"></i>
                      {isArabic ? 'ابدأ الاجتماع المباشر' : 'Start Live Meeting'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLiveMeeting && (
        <LiveMeetingRoom
          isOpen={showLiveMeeting}
          onClose={() => {
            setShowLiveMeeting(false);
            onClose();
          }}
          department={selectedDepartment}
          selectedAgents={selectedAgents}
          topic={meetingTopic}
          onMeetingComplete={handleMeetingComplete}
        />
      )}
    </>
  );
}
