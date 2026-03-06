import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../page';
import type { Agent } from '../page';

const agentKeys = ['reem', 'ahmed', 'sara', 'khalid', 'nora', 'omar'] as const;

const agentGenders: Record<string, 'male' | 'female'> = {
  reem: 'female',
  ahmed: 'male',
  sara: 'female',
  khalid: 'male',
  nora: 'female',
  omar: 'male',
};

const agentAvatars: Record<string, string> = {
  reem: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png',
  ahmed: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png',
  sara: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png',
  khalid: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png',
  nora: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/a922778b168be8b83e02c082538079fd.png',
  omar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/fa141410ac8972062d76be8f0ec890b4.png',
};

const agentEmojis: Record<string, string> = {
  reem: '📢',
  ahmed: '✍️',
  sara: '💬',
  khalid: '📊',
  nora: '🗂️',
  omar: '💻',
};

const agentColors: Record<string, string> = {
  reem: '#e91e8c',
  ahmed: '#7c3aed',
  sara: '#0ea5e9',
  khalid: '#10b981',
  nora: '#f59e0b',
  omar: '#ef4444',
};

const appIcons: Record<string, string> = {
  Twitter: 'ri-twitter-x-line',
  LinkedIn: 'ri-linkedin-box-line',
  YouTube: 'ri-youtube-line',
  Instagram: 'ri-instagram-line',
  'Google Docs': 'ri-file-text-line',
  Notion: 'ri-notion-line',
  'Google Drive': 'ri-google-drive-line',
  Dropbox: 'ri-dropbox-line',
  Gmail: 'ri-mail-line',
  WhatsApp: 'ri-whatsapp-line',
  Telegram: 'ri-telegram-line',
  Slack: 'ri-slack-line',
  'Google Sheets': 'ri-file-excel-2-line',
  Excel: 'ri-file-excel-line',
  Trello: 'ri-trello-line',
  'Google Calendar': 'ri-calendar-line',
  GitHub: 'ri-github-line',
  GitLab: 'ri-gitlab-line',
};

interface AgentsGridProps {
  onAgentSelect: (agent: Agent) => void;
  onCreateAgent: () => void;
  customAgents: Agent[];
  onEditAgent?: (agent: Agent) => void;
  onDeleteAgent?: (agentId: string) => void;
}

function TypewriterText({ text, delay = 0, speed = 10 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setStarted(false);
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed]);

  return (
    <>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse opacity-60">|</span>}
    </>
  );
}

// Popup positioned relative to the agent card, centered below it
function AgentPopup({
  agentKey,
  anchorRef,
  isDark,
  isArabic,
  onClose,
  isMobile,
}: {
  agentKey: string;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  isDark: boolean;
  isArabic: boolean;
  onClose: () => void;
  isMobile?: boolean;
}) {
  const { t } = useTranslation();
  const popupRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const tasks = t(`agentsList.${agentKey}.tasks`, { returnObjects: true }) as string[];
  const automations = t(`agentsList.${agentKey}.automations`, { returnObjects: true }) as string[];
  const connectedApps = t(`agentsList.${agentKey}.connectedApps`, { returnObjects: true }) as string[];

  useEffect(() => {
    if (isMobile) return; // على الجوال نستخدم inline
    const updatePosition = () => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const popupWidth = Math.min(340, window.innerWidth - 24);
      let left = rect.left + rect.width / 2 - popupWidth / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - popupWidth - 12));
      setStyle({
        position: 'fixed',
        top: rect.bottom + 10,
        left,
        width: popupWidth,
        zIndex: 9999,
      });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef, isMobile]);

  const popupContent = (
    <div
      className={`backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl ${
        isDark ? 'bg-[#161a24]/98 border-slate-600/50' : 'bg-white border-slate-200 shadow-xl'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 flex items-center gap-2.5 border-b ${isDark ? 'border-slate-600/30' : 'border-slate-100'}`}>
        <div className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 p-[1.5px] ${
          agentGenders[agentKey] === 'female'
            ? isDark ? 'bg-gradient-to-br from-violet-500/70 via-pink-500/60 to-fuchsia-500/70' : 'bg-gradient-to-br from-violet-400/80 via-pink-400/70 to-fuchsia-400/80'
            : isDark ? 'bg-gradient-to-br from-teal-500/70 via-cyan-500/60 to-emerald-500/70' : 'bg-gradient-to-br from-teal-400/80 via-cyan-400/70 to-emerald-400/80'
        }`}>
          <div className={`w-full h-full rounded-full overflow-hidden ${isDark ? 'bg-[#2e2a50]' : 'bg-white'}`}>
            <img src={agentAvatars[agentKey]} alt="" className="w-full h-full object-cover object-top" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-mono font-bold text-sm ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
            {t(`agentsList.${agentKey}.name`)}
          </h3>
          <p className="font-mono text-xs" style={{ color: agentColors[agentKey] }}>
            {agentEmojis[agentKey]} {t(`agentsList.${agentKey}.role`)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className={`font-mono text-[10px] ${isDark ? 'text-white/40' : 'text-gray-400'}`}>24/7</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className={`w-6 h-6 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
      </div>

      {/* Connected Apps */}
      {Array.isArray(connectedApps) && connectedApps.length > 0 && (
        <div className={`px-4 py-2.5 border-b ${isDark ? 'border-slate-600/30' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-mono text-[10px] ${isDark ? 'text-slate-400/60' : 'text-slate-500'}`}>
              {isArabic ? '// التطبيقات المرتبطة' : '// connected apps'}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {connectedApps.map((app: string, idx: number) => (
                <div key={idx} className={`px-2 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                  isDark ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                  <i className={`${appIcons[app] || 'ri-link-line'} text-xs`}></i>
                  <span className="font-mono text-[10px]">{app}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automations */}
      <div className="p-3 space-y-1.5 max-h-64 overflow-y-auto">
        <div className={`font-mono text-xs mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-slate-400/60' : 'text-slate-500'}`}>
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-flashlight-line text-xs" style={{ color: agentColors[agentKey] }}></i>
          </div>
          {isArabic ? '// مهام الأتمتة' : '// automations'}
        </div>
        {Array.isArray(automations) && automations.map((automation: string, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-start gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'}`}
          >
            <span className="font-mono text-xs mt-0.5 flex-shrink-0" style={{ color: agentColors[agentKey] }}>
              {isArabic ? '◂' : '▸'}
            </span>
            <span className={`font-mono text-sm leading-relaxed ${isDark ? 'text-slate-200/90' : 'text-slate-700'}`}>
              {automation}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // على الجوال: inline تحت الكارد مباشرة بدون fixed
  if (isMobile) {
    return (
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, y: -6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full mt-2"
        style={{ zIndex: 10 }}
      >
        {popupContent}
      </motion.div>
    );
  }

  // على الديسكتوب: fixed positioning
  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={style}
    >
      {popupContent}
    </motion.div>
  );
}

export default function AgentsGrid({
  onAgentSelect,
  onCreateAgent,
  customAgents,
  onEditAgent,
  onDeleteAgent,
}: AgentsGridProps) {
  const { t, i18n } = useTranslation();
  const { isDark, setHoverGender } = useTheme();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [expandedCustom, setExpandedCustom] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  // كشف الجوال
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Refs for each agent card anchor
  const anchorRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  agentKeys.forEach((key) => {
    if (!anchorRefs.current[key]) {
      anchorRefs.current[key] = { current: null };
    }
  });

  const handleToggleAgent = useCallback(
    (key: string) => {
      if (activeAgent === key) {
        setActiveAgent(null);
        setHoverGender(null);
      } else {
        setActiveAgent(key);
        setHoverGender(agentGenders[key]);
      }
    },
    [activeAgent, setHoverGender]
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return; // على الجوال لا نغلق عند مغادرة الماوس
    setActiveAgent(null);
    setHoverGender(null);
  }, [setHoverGender, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-agent-card]') && !target.closest('[data-agent-popup]')) {
        setActiveAgent(null);
        setHoverGender(null);
        setExpandedCustom(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setHoverGender]);

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
        ? '0 0 20px rgba(167,139,250,0.4), 0 0 40px rgba(236,72,153,0.2)'
        : '0 0 15px rgba(167,139,250,0.35), 0 0 30px rgba(236,72,153,0.15)';
    }
    return isDark
      ? '0 0 20px rgba(45,212,191,0.4), 0 0 40px rgba(6,182,212,0.2)'
      : '0 0 15px rgba(45,212,191,0.35), 0 0 30px rgba(6,182,212,0.15)';
  };

  const getHoverGlow = (key: string) => {
    const gender = agentGenders[key];
    if (gender === 'female') {
      return isDark
        ? '0 0 35px rgba(167,139,250,0.5), 0 0 60px rgba(236,72,153,0.3)'
        : '0 0 25px rgba(167,139,250,0.45), 0 0 50px rgba(236,72,153,0.25)';
    }
    return isDark
      ? '0 0 35px rgba(45,212,191,0.5), 0 0 60px rgba(6,182,212,0.3)'
      : '0 0 25px rgba(45,212,191,0.45), 0 0 50px rgba(6,182,212,0.25)';
  };

  const getAccentColor = (key: string) => {
    const gender = agentGenders[key];
    return gender === 'female'
      ? isDark ? 'text-violet-400' : 'text-[#5B4A9E]'
      : isDark ? 'text-teal-400' : 'text-teal-600';
  };

  return (
    <section className="py-10 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <h2 className={`font-mono text-xl md:text-2xl font-bold transition-colors duration-500 ${isDark ? 'text-[#9B8EC4]' : 'text-[#4a3a8e]'}`}>
            {t('agents.title')}
          </h2>
        </div>

        <p className={`font-mono text-base md:text-lg font-semibold mb-8 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          {t('agents.subtitle')}
        </p>

        {/* Agents grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-x-2 sm:gap-x-4 gap-y-4">
          {agentKeys.map((key) => {
            const isActive = activeAgent === key;
            const connectedApps = t(`agentsList.${key}.connectedApps`, { returnObjects: true }) as string[];

            return (
              <div
                key={key}
                data-agent-card="true"
                className="flex flex-col items-center cursor-pointer relative"
                ref={(el) => { anchorRefs.current[key].current = el; }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAgent(key);
                }}
                onMouseLeave={handleMouseLeave}
              >
                {/* Avatar */}
                <motion.div
                  animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, duration: 0.15 }}
                  className="relative"
                  style={{
                    boxShadow: isActive ? getHoverGlow(key) : getGenderGlow(key),
                    borderRadius: '50%',
                    transition: 'box-shadow 0.2s ease',
                  }}
                >
                  <div className={`p-[2.5px] rounded-[50%] ${getGenderGradient(key)}`}>
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-[76px] md:h-[76px] rounded-[50%] overflow-hidden ${isDark ? 'bg-[#2e2a50]' : 'bg-white'}`}>
                      <img
                        src={agentAvatars[key]}
                        alt={t(`agentsList.${key}.name`)}
                        className="w-full h-full object-cover object-top"
                        draggable={false}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Name & Role */}
                <span className={`font-mono text-xs sm:text-sm mt-2 text-center font-medium transition-colors duration-500 ${isDark ? 'text-slate-200/90' : 'text-slate-700'}`}>
                  {t(`agentsList.${key}.name`)}
                </span>
                <span className={`font-mono text-[10px] sm:text-xs text-center font-medium ${getAccentColor(key)}`}>
                  {agentEmojis[key]} {t(`agentsList.${key}.role`)}
                </span>

                {/* Connected Apps Icons */}
                {Array.isArray(connectedApps) && connectedApps.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap justify-center">
                    {connectedApps.slice(0, 3).map((app: string, idx: number) => (
                      <div
                        key={idx}
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center transition-all ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                        title={app}
                      >
                        <i className={`${appIcons[app] || 'ri-link-line'} text-[9px] sm:text-[10px]`}></i>
                      </div>
                    ))}
                  </div>
                )}

                {/* على الجوال: القائمة تنزل تحت الوكيل مباشرة inline */}
                {isMobile && (
                  <AnimatePresence>
                    {isActive && (
                      <div
                        data-agent-popup="true"
                        className="col-span-3 w-screen max-w-[calc(100vw-24px)] -mx-[50vw] relative left-1/2 right-1/2"
                        style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: 'calc(100vw - 24px)' }}
                      >
                        <AgentPopup
                          key={activeAgent}
                          agentKey={activeAgent!}
                          anchorRef={anchorRefs.current[activeAgent!]}
                          isDark={isDark}
                          isArabic={isArabic}
                          onClose={() => { setActiveAgent(null); setHoverGender(null); }}
                          isMobile={true}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}

          {/* Create Agent Card */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateAgent}
              className="relative cursor-pointer"
            >
              <div className={`p-[2.5px] rounded-[50%] border-2 border-dashed transition-all duration-300 ${isDark ? 'border-slate-600/50 hover:border-[#9B8EC4]/70' : 'border-[#4a3a8e]/30 hover:border-[#4a3a8e]/70'}`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-[76px] md:h-[76px] rounded-[50%] flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-slate-800/50 hover:bg-slate-800/80' : 'bg-[#4a3a8e]/5 hover:bg-[#4a3a8e]/10'}`}>
                  <i className={`ri-add-line text-2xl sm:text-3xl transition-colors duration-500 ${isDark ? 'text-[#9B8EC4]' : 'text-[#4a3a8e]'}`}></i>
                </div>
              </div>
            </motion.div>
            <span className={`font-mono text-xs sm:text-sm mt-2 text-center transition-colors duration-500 ${isDark ? 'text-slate-400/70' : 'text-slate-600'}`}>
              {t('agents.create')}
            </span>
            <span className={`font-mono text-[10px] text-center transition-colors duration-500 ${isDark ? 'text-[#9B8EC4]' : 'text-[#4a3a8e]'}`}>
              ✨ {t('agents.custom')}
            </span>
          </div>
        </div>

        {/* Custom Agents Section */}
        {customAgents.length > 0 && (
          <div className="mt-8">
            <p className={`font-mono text-sm mb-4 ${isDark ? 'text-slate-500/50' : 'text-slate-500'}`}>
              {'// '} {t('agents.custom')}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-x-2 sm:gap-x-4 gap-y-4">
              {customAgents.map((agent) => {
                const isExpCustom = expandedCustom === agent.id;
                const customGender = agent.gender || 'male';
                const isConfirmingDelete = confirmDeleteId === agent.id;
                return (
                  <div
                    key={agent.id}
                    data-agent-card="true"
                    className="flex flex-col items-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCustom(isExpCustom ? null : agent.id);
                      setConfirmDeleteId(null);
                    }}
                  >
                    <motion.div
                      animate={isExpCustom ? { scale: 1.2 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="relative"
                      style={{
                        boxShadow: isExpCustom
                          ? customGender === 'female'
                            ? '0 0 35px rgba(167,139,250,0.5), 0 0 60px rgba(236,72,153,0.3)'
                            : '0 0 35px rgba(45,212,191,0.5), 0 0 60px rgba(6,182,212,0.3)'
                          : customGender === 'female'
                          ? '0 0 20px rgba(167,139,250,0.4)'
                          : '0 0 20px rgba(45,212,191,0.4)',
                        borderRadius: '50%',
                        transition: 'box-shadow 0.2s ease',
                      }}
                    >
                      <div className={`p-[2.5px] rounded-[50%] ${customGender === 'female' ? 'bg-gradient-to-br from-violet-500/70 via-pink-500/60 to-fuchsia-500/70' : 'bg-gradient-to-br from-teal-500/70 via-cyan-500/60 to-emerald-500/70'}`}>
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-[76px] md:h-[76px] rounded-[50%] overflow-hidden ${isDark ? 'bg-[#2e2a50]' : 'bg-white'}`}>
                          {agent.avatar ? (
                            <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover object-top" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: agent.bg }}>
                              {agent.emoji}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <span className={`font-mono text-xs sm:text-sm mt-2 text-center transition-colors duration-500 ${isDark ? 'text-slate-400/70' : 'text-slate-600'}`}>
                      {agent.name}
                    </span>
                    <span className="font-mono text-[10px] text-center transition-colors duration-500" style={{ color: agent.color }}>
                      {agent.emoji} {agent.role}
                    </span>

                    <AnimatePresence>
                      {isExpCustom && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="w-full overflow-hidden mt-3"
                        >
                          <div className={`w-full backdrop-blur-xl border rounded-xl overflow-hidden ${isDark ? 'bg-[#0d1117]/95 border-slate-700/50' : 'bg-white border-slate-200 shadow-lg'}`}>
                            <div className={`px-3 py-2 flex items-center gap-2 border-b ${isDark ? 'border-slate-700/30' : 'border-slate-100'}`}>
                              <span className="text-lg">{agent.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-mono font-bold text-xs ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{agent.name}</h3>
                                <p className="font-mono text-[9px]" style={{ color: agent.color }}>{agent.role}</p>
                              </div>
                            </div>
                            <div className="p-2.5">
                              <p className={`font-mono text-[11px] leading-relaxed ${isDark ? 'text-slate-300/70' : 'text-slate-600'}`}>{agent.system}</p>
                              <div className={`mt-2 pt-2 border-t flex items-center gap-2 ${isDark ? 'border-slate-700/30' : 'border-slate-200'}`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                <span className={`font-mono text-[9px] ${isDark ? 'text-slate-500/40' : 'text-slate-400'}`}>
                                  {isArabic ? 'متاح الآن • جاهز 24/7' : 'Available now • Ready 24/7'}
                                </span>
                              </div>
                              <div className={`mt-2.5 pt-2.5 border-t flex items-center gap-2 ${isDark ? 'border-slate-700/30' : 'border-slate-200'}`}>
                                {isConfirmingDelete ? (
                                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col gap-2">
                                    <p className={`font-mono text-[10px] text-center ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                                      {isArabic ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteAgent?.(agent.id); setConfirmDeleteId(null); setExpandedCustom(null); }}
                                        className="flex-1 px-2 py-1.5 rounded-lg font-mono text-[10px] font-bold bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1"
                                      >
                                        <div className="w-3 h-3 flex items-center justify-center"><i className="ri-delete-bin-line text-[10px]"></i></div>
                                        {isArabic ? 'نعم، احذف' : 'Yes, Delete'}
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                        className={`flex-1 px-2 py-1.5 rounded-lg font-mono text-[10px] transition-all cursor-pointer whitespace-nowrap ${isDark ? 'bg-[#484270]/60 text-white/60 hover:bg-[#484270]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                      >
                                        {isArabic ? 'إلغاء' : 'Cancel'}
                                      </button>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); onEditAgent?.(agent); }}
                                      className={`flex-1 px-2 py-1.5 rounded-lg font-mono text-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${isDark ? 'bg-slate-700/50 text-slate-300/80 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700'}`}
                                    >
                                      <div className="w-3 h-3 flex items-center justify-center"><i className="ri-edit-line text-[10px]"></i></div>
                                      {isArabic ? 'تعديل' : 'Edit'}
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(agent.id); }}
                                      className={`flex-1 px-2 py-1.5 rounded-lg font-mono text-[10px] transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${isDark ? 'bg-red-500/15 text-red-400/80 hover:bg-red-500/30 hover:text-red-400' : 'bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600'}`}
                                    >
                                      <div className="w-3 h-3 flex items-center justify-center"><i className="ri-delete-bin-line text-[10px]"></i></div>
                                      {isArabic ? 'حذف' : 'Delete'}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Popup على الديسكتوب فقط - خارج الـ grid لتجنب overflow clipping */}
      {!isMobile && (
        <AnimatePresence>
          {activeAgent && (
            <div data-agent-popup="true">
              <AgentPopup
                key={activeAgent}
                agentKey={activeAgent}
                anchorRef={anchorRefs.current[activeAgent]}
                isDark={isDark}
                isArabic={isArabic}
                onClose={() => { setActiveAgent(null); setHoverGender(null); }}
                isMobile={false}
              />
            </div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
