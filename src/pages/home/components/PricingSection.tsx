
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import { useState, useRef, useEffect } from 'react';
import AgentSelectionModal from './AgentSelectionModal';

interface PricingSectionProps {
  onSelectPackage: (packageType: 'trial' | 'agent' | 'corporate') => void;
}

const agentAvatars: Record<string, string> = {
  reem: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png',
  ahmed: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png',
  sara: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png',
  khalid: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png',
  nora: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/a922778b168be8b83e02c082538079fd.png',
  omar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/fa141410ac8972062d76be8f0ec890b4.png',
};

const agentEmojis: Record<string, string> = {
  reem: '📢', ahmed: '✍️', sara: '💬', khalid: '📊', nora: '🗂️', omar: '💻',
};

const agentColors: Record<string, string> = {
  reem: '#e91e8c', ahmed: '#7c3aed', sara: '#0ea5e9', khalid: '#10b981', nora: '#f59e0b', omar: '#ef4444',
};

const agentGenders: Record<string, 'male' | 'female'> = {
  reem: 'female', ahmed: 'male', sara: 'female', khalid: 'male', nora: 'female', omar: 'male',
};

const agentKeys = ['reem', 'ahmed', 'sara', 'khalid', 'nora', 'omar'] as const;

// ─── Floating Skills Popup ───────────────────────────────────────────────────
function SkillsPopup({
  agentKey,
  anchorRef,
  isDark,
  isArabic,
  selectedSkills,
  onToggleSkill,
  onSelectAll,
  onClose,
  selectedAgents,
  onToggleAgent,
}: {
  agentKey: string;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  isDark: boolean;
  isArabic: boolean;
  selectedSkills: Record<string, string[]>;
  onToggleSkill: (key: string, skill: string) => void;
  onSelectAll: (key: string) => void;
  onClose: () => void;
  selectedAgents: string[];
  onToggleAgent: (key: string) => void;
}) {
  const { t } = useTranslation();
  const tasks = t(`agentsList.${agentKey}.tasks`, { returnObjects: true }) as string[];
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updatePosition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const popupWidth = Math.min(300, window.innerWidth - 24);
      let left = rect.left + rect.width / 2 - popupWidth / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popupWidth - 12));
      // If popup would go below viewport, show above
      const estimatedHeight = 380;
      const spaceBelow = window.innerHeight - rect.bottom - 10;
      const top = spaceBelow > estimatedHeight
        ? rect.bottom + 8
        : rect.top - estimatedHeight - 8;
      setStyle({ position: 'fixed', top, left, width: popupWidth, zIndex: 9999 });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      style={style}
      data-skills-popup="true"
    >
      <div className={`rounded-xl backdrop-blur-xl border shadow-2xl overflow-hidden ${
        isDark ? 'bg-[#161a24]/98 border-slate-600/50' : 'bg-white/99 border-slate-200 shadow-xl'
      }`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-slate-600/30' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{agentEmojis[agentKey]}</span>
            <div>
              <h4 className={`font-mono text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t(`agentsList.${agentKey}.name`)}
              </h4>
              <p className="font-mono text-xs" style={{ color: agentColors[agentKey] }}>
                {t(`agentsList.${agentKey}.role`)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onSelectAll(agentKey); if (!selectedAgents.includes(agentKey)) onToggleAgent(agentKey); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isDark ? 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-600/50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>
        </div>

        {/* Skills List */}
        <div className="p-2.5 max-h-64 overflow-y-auto space-y-1.5">
          {Array.isArray(tasks) && tasks.map((task: string, i: number) => {
            const isSkillSelected = selectedSkills[agentKey]?.includes(task);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isArabic ? 8 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!selectedAgents.includes(agentKey)) onToggleAgent(agentKey);
                  onToggleSkill(agentKey, task);
                }}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all ${
                  isSkillSelected
                    ? isDark ? 'bg-teal-500/15 border-2 border-teal-400/40' : 'bg-teal-50 border-2 border-teal-300'
                    : isDark ? 'bg-slate-700/40 hover:bg-slate-700/60 border-2 border-transparent' : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all mt-0.5 ${
                  isSkillSelected ? 'border-teal-500 bg-teal-500' : isDark ? 'border-white/25' : 'border-gray-300'
                }`}>
                  {isSkillSelected && <i className="ri-check-line text-white text-[9px]"></i>}
                </div>
                <div className="flex-1">
                  <p className={`font-mono text-xs leading-relaxed ${isDark ? 'text-slate-200/90' : 'text-slate-700'}`}>{task}</p>
                  <p className={`font-mono text-[10px] mt-0.5 ${isDark ? 'text-slate-400/60' : 'text-slate-400'}`}>
                    99 {t('pricing.currency')} / {isArabic ? 'ساعتين' : '2 hours'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PricingSection({ onSelectPackage }: PricingSectionProps) {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === 'ar';
  const [openAgent, setOpenAgent] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string[]>>({});
  const [showModal, setShowModal] = useState(false);

  // Refs for each agent card
  const anchorRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  agentKeys.forEach((key) => {
    if (!anchorRefs.current[key]) anchorRefs.current[key] = { current: null };
  });

  // Close popup on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-pricing-card]') && !target.closest('[data-skills-popup]')) {
        setOpenAgent(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const getGenderGradient = (key: string) => {
    const gender = agentGenders[key];
    if (gender === 'female') {
      return isDark
        ? 'bg-gradient-to-br from-violet-500/70 via-pink-500/60 to-fuchsia-500/70'
        : 'bg-gradient-to-br from-violet-400/80 via-pink-400/70 to-fuchsia-400/80';
    }
    return isDark
      ? 'bg-gradient-to-br from-teal-500/70 via-cyan-500/60 to-emerald-500/70'
      : 'bg-gradient-to-br from-teal-400/80 via-cyan-400/70 to-emerald-400/80';
  };

  const getGenderGlow = (key: string) => {
    const gender = agentGenders[key];
    if (gender === 'female') {
      return isDark
        ? '0 0 25px rgba(167,139,250,0.5), 0 0 50px rgba(236,72,153,0.3)'
        : '0 0 20px rgba(167,139,250,0.4), 0 0 40px rgba(236,72,153,0.2)';
    }
    return isDark
      ? '0 0 25px rgba(45,212,191,0.5), 0 0 50px rgba(6,182,212,0.3)'
      : '0 0 20px rgba(45,212,191,0.4), 0 0 40px rgba(6,182,212,0.2)';
  };

  const toggleAgentSelection = (agentKey: string) => {
    if (selectedAgents.includes(agentKey)) {
      setSelectedAgents(selectedAgents.filter(a => a !== agentKey));
      const newSkills = { ...selectedSkills };
      delete newSkills[agentKey];
      setSelectedSkills(newSkills);
    } else {
      setSelectedAgents([...selectedAgents, agentKey]);
    }
  };

  const toggleSkillSelection = (agentKey: string, skill: string) => {
    const currentSkills = selectedSkills[agentKey] || [];
    if (currentSkills.includes(skill)) {
      setSelectedSkills({ ...selectedSkills, [agentKey]: currentSkills.filter(s => s !== skill) });
    } else {
      setSelectedSkills({ ...selectedSkills, [agentKey]: [...currentSkills, skill] });
    }
  };

  const selectAllSkills = (agentKey: string) => {
    const tasks = t(`agentsList.${agentKey}.tasks`, { returnObjects: true }) as string[];
    setSelectedSkills({ ...selectedSkills, [agentKey]: tasks });
  };

  const handleAgentClick = (key: string) => {
    setOpenAgent(openAgent === key ? null : key);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedAgents.forEach(agentKey => {
      const skills = selectedSkills[agentKey] || [];
      if (skills.length > 0) total += skills.length * 99;
    });
    return total;
  };

  return (
    <>
      <section className="py-10 md:py-14 px-3 sm:px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className={`font-mono text-2xl md:text-3xl font-bold mb-3 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('pricing.title')}
              </h2>
              <p className={`font-mono text-base md:text-lg font-semibold transition-colors duration-500 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {t('pricing.subtitle')}
              </p>
            </motion.div>
          </div>

          {/* Agents Selection Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-5 mb-8">
            {agentKeys.map((key, index) => {
              const isSelected = selectedAgents.includes(key);
              const selectedSkillsCount = selectedSkills[key]?.length || 0;
              const isOpen = openAgent === key;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="relative flex flex-col items-center"
                  data-pricing-card="true"
                  ref={(el) => { anchorRefs.current[key].current = el; }}
                >
                  {/* Agent Avatar */}
                  <div onClick={() => handleAgentClick(key)} className="relative cursor-pointer">
                    <motion.div
                      animate={isSelected ? { scale: 1.08 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative"
                      style={{
                        boxShadow: isSelected || isOpen ? getGenderGlow(key) : 'none',
                        borderRadius: '50%',
                        transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      <div className={`p-[3px] rounded-full ${getGenderGradient(key)}`}>
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden ${isDark ? 'bg-[#2e2a50]' : 'bg-white'}`}>
                          <img
                            src={agentAvatars[key]}
                            alt={t(`agentsList.${key}.name`)}
                            className="w-full h-full object-cover object-top"
                            draggable={false}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Selection Badge */}
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -end-1 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center shadow-lg z-10">
                        <i className="ri-check-line text-white text-xs"></i>
                      </motion.div>
                    )}

                    {/* Skills Count Badge */}
                    {selectedSkillsCount > 0 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-10" style={{ backgroundColor: agentColors[key] }}>
                        <span className="text-white text-[10px] font-bold">{selectedSkillsCount}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Agent Name & Role */}
                  <div className="text-center mt-2.5">
                    <p className={`font-mono text-xs sm:text-sm font-medium ${isDark ? 'text-slate-200/80' : 'text-slate-700'}`}>
                      {t(`agentsList.${key}.name`)}
                    </p>
                    <p className="font-mono text-[10px] sm:text-xs mt-0.5" style={{ color: agentColors[key] }}>
                      {agentEmojis[key]} {t(`agentsList.${key}.role`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Selection Summary & Checkout */}
          {selectedAgents.length > 0 && calculateTotal() > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border-2 p-4 md:p-6 ${isDark ? 'bg-slate-800/40 border-teal-500/30' : 'bg-teal-50/60 border-teal-200 shadow-sm'}`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex-1 w-full">
                  <h3 className={`font-mono text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isArabic ? 'ملخص اختيارك' : 'Your Selection'}
                  </h3>
                  <div className="space-y-2">
                    {selectedAgents.map(agentKey => {
                      const skillsCount = selectedSkills[agentKey]?.length || 0;
                      if (skillsCount === 0) return null;
                      return (
                        <div key={agentKey} className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                            <img src={agentAvatars[agentKey]} alt="" className="w-full h-full object-cover object-top" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-mono text-sm font-medium ${isDark ? 'text-slate-200/90' : 'text-slate-800'}`}>
                              {agentEmojis[agentKey]} {t(`agentsList.${agentKey}.name`)}
                            </p>
                            <p className={`font-mono text-xs ${isDark ? 'text-slate-400/60' : 'text-slate-500'}`}>
                              {skillsCount} {isArabic ? 'مهارة' : 'skills'} × 99 {t('pricing.currency')}
                            </p>
                          </div>
                          <p className={`font-mono text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {skillsCount * 99} {t('pricing.currency')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                  <div className="text-start md:text-end">
                    <p className={`font-mono text-xs mb-1 ${isDark ? 'text-slate-400/60' : 'text-slate-500'}`}>{t('purchase.total')}</p>
                    <p className={`font-mono text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{calculateTotal()}</p>
                    <p className={`font-mono text-xs ${isDark ? 'text-slate-500/50' : 'text-slate-400'}`}>{t('pricing.currency')}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    disabled
                    className="relative px-6 py-3 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed opacity-70 whitespace-nowrap"
                  >
                    <i className="ri-shopping-cart-2-line text-base me-2"></i>
                    {isArabic ? 'إتمام الطلب' : 'Proceed to Checkout'}
                    <span className={`absolute -top-2.5 -end-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? 'bg-amber-400 text-black' : 'bg-amber-500 text-white'}`}>
                      {isArabic ? 'قريباً' : 'Soon'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {selectedAgents.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm ${isDark ? 'bg-slate-800/40 text-slate-400/60' : 'bg-slate-100 text-slate-500'}`}>
                <i className="ri-hand-coin-line text-base"></i>
                <span>{isArabic ? 'اختر الوكلاء والمهارات التي تحتاجها' : 'Select agents and skills you need'}</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Payment Methods */}
      <div className="pb-10 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-2xl border px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-[#1e1b38]/60 border-[#5a5490]/20' : 'bg-white/80 border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={`ri-shield-check-line text-lg ${isDark ? 'text-teal-400' : 'text-teal-500'}`}></i>
              </div>
              <span className={`font-mono text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                {isArabic ? 'وسائل الدفع المتاحة' : 'Accepted Payment Methods'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className={`flex items-center justify-center px-3 py-1.5 rounded-lg border ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <span className="font-bold text-sm tracking-widest" style={{ color: '#1A1F71', fontFamily: 'serif' }}>VISA</span>
              </div>
              <div className={`flex items-center justify-center px-3 py-1.5 rounded-lg border gap-1 ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="w-4 h-4 rounded-full bg-red-500 opacity-90"></div>
                <div className="w-4 h-4 rounded-full bg-amber-400 opacity-90 -ms-2"></div>
                <span className={`font-bold text-[10px] ms-1 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Mastercard</span>
              </div>
              <div className={`flex items-center justify-center px-3 py-1.5 rounded-lg border ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <span className="font-bold text-sm" style={{ color: '#00A651' }}>mada</span>
              </div>
              <div className={`flex items-center justify-center px-3 py-1.5 rounded-lg border gap-1.5 ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`ri-apple-fill text-sm ${isDark ? 'text-white' : 'text-black'}`}></i>
                </div>
                <span className={`font-semibold text-xs ${isDark ? 'text-white/90' : 'text-black'}`}>Pay</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-teal-500/10 border-teal-500/20 text-teal-300' : 'bg-teal-50 border-teal-200 text-teal-700'}`}>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-lock-line text-xs"></i>
                </div>
                <span className="font-mono text-xs font-medium">{isArabic ? 'دفع آمن 100%' : '100% Secure'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Popup Portal */}
      <AnimatePresence>
        {openAgent && (
          <SkillsPopup
            key={openAgent}
            agentKey={openAgent}
            anchorRef={anchorRefs.current[openAgent]}
            isDark={isDark}
            isArabic={isArabic}
            selectedSkills={selectedSkills}
            onToggleSkill={toggleSkillSelection}
            onSelectAll={selectAllSkills}
            onClose={() => setOpenAgent(null)}
            selectedAgents={selectedAgents}
            onToggleAgent={toggleAgentSelection}
          />
        )}
      </AnimatePresence>

      {showModal && (
        <AgentSelectionModal isOpen={showModal} onClose={() => setShowModal(false)} packageType="agent" />
      )}
    </>
  );
}
