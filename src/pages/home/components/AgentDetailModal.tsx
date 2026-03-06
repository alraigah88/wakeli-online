import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import type { Agent } from '../page';

interface AgentDetailModalProps {
  agent: Agent;
  onClose: () => void;
}

const agentAvatars: Record<string, string> = {
  reem: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png',
  ahmed: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png',
  sara: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png',
  khalid: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png',
  nora: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/a922778b168be8b83e02c082538079fd.png',
  omar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/fa141410ac8972062d76be8f0ec890b4.png',
};

// App icons mapping
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

export default function AgentDetailModal({ agent, onClose }: AgentDetailModalProps) {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const avatarSrc = agent.isCustom
    ? agent.avatar
    : agentAvatars[agent.id] || agent.avatar;

  const tasks: string[] = agent.isCustom
    ? (agent.system || '')
        .split('.')
        .filter((s: string) => s.trim().length > 3)
        .slice(0, 4)
    : (t(`agentsList.${agent.id}.tasks`, { returnObjects: true }) as string[]);

  const automations = !agent.isCustom
    ? (t(`agentsList.${agent.id}.automations`, { returnObjects: true }) as string[])
    : [];

  const connectedApps = !agent.isCustom
    ? (t(`agentsList.${agent.id}.connectedApps`, { returnObjects: true }) as string[])
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border transition-colors duration-500 ${
          isDark ? 'bg-[#2a2458] border-[#5a5490]/50' : 'bg-white border-gray-200'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-5 end-5 z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isDark
              ? 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60'
              : 'bg-white/90 text-gray-500 hover:text-gray-800 hover:bg-white'
          }`}
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Large Image */}
          <div className="relative w-full md:w-1/2 h-80 md:h-auto md:min-h-[580px]">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={agent.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-9xl"
                style={{ background: agent.bg }}
              >
                {agent.emoji}
              </div>
            )}
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 ${
                isDark
                  ? 'bg-gradient-to-t md:bg-gradient-to-l from-[#2a2458] via-transparent to-transparent'
                  : 'bg-gradient-to-t md:bg-gradient-to-l from-white via-transparent to-transparent'
              }`}
            />
            {/* Name overlay on image (mobile) */}
            <div className="absolute bottom-5 start-5 md:hidden">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{agent.emoji}</span>
                <div>
                  <h2 className="text-white font-bold text-3xl font-mono drop-shadow-lg">
                    {agent.name}
                  </h2>
                  <p className="text-white/80 font-mono text-base drop-shadow-lg">
                    {agent.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-7 md:p-10 flex flex-col justify-center">
            {/* Name (desktop) */}
            <div className="hidden md:flex items-center gap-4 mb-8">
              <span className="text-5xl">{agent.emoji}</span>
              <div>
                <h2
                  className={`font-mono font-bold text-4xl transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {agent.name}
                </h2>
                <p
                  className="font-mono text-lg mt-1.5 transition-colors duration-500"
                  style={{ color: agent.color }}
                >
                  {agent.role}
                </p>
              </div>
            </div>

            {/* Connected Apps Section */}
            {Array.isArray(connectedApps) && connectedApps.length > 0 && (
              <>
                <div
                  className={`h-px mb-5 transition-colors duration-500 ${
                    isDark ? 'bg-[#5a5490]/40' : 'bg-gray-200'
                  }`}
                />
                <div className="mb-6">
                  <h3
                    className={`font-mono text-sm font-bold mb-3 flex items-center gap-2 transition-colors duration-500 ${
                      isDark ? 'text-white/80' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-links-line text-base" style={{ color: agent.color }}></i>
                    </div>
                    {isArabic ? 'التطبيقات المرتبطة' : 'Connected Apps'}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {connectedApps.map((app: string, idx: number) => (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          isDark
                            ? 'bg-[#3a3568]/50 text-slate-300 hover:bg-[#3a3568]/80'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <i className={`${appIcons[app] || 'ri-link-line'} text-base`}></i>
                        <span className="font-mono text-sm">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Divider */}
            <div
              className={`h-px mb-5 transition-colors duration-500 ${
                isDark ? 'bg-[#5a5490]/40' : 'bg-gray-200'
              }`}
            />

            {/* Automations title */}
            <h3
              className={`font-mono text-base font-bold mb-5 flex items-center gap-2.5 transition-colors duration-500 ${
                isDark ? 'text-white/80' : 'text-gray-700'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-flashlight-line text-lg" style={{ color: agent.color }}></i>
              </div>
              {isArabic ? 'مهام الأتمتة' : 'Automation Tasks'}
            </h3>

            {/* Automations list */}
            <div className="space-y-3.5">
              {Array.isArray(automations) && automations.length > 0 ? (
                automations.map((automation: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-3.5 p-4 rounded-xl transition-colors duration-500 ${
                      isDark
                        ? 'bg-[#3a3568]/50 hover:bg-[#3a3568]/80'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isDark
                          ? `${agent.color}20`
                          : `${agent.color}15`,
                      }}
                    >
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: agent.color }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-base leading-relaxed transition-colors duration-500 ${
                        isDark ? 'text-white/80' : 'text-gray-700'
                      }`}
                    >
                      {automation}
                    </span>
                  </motion.div>
                ))
              ) : (
                tasks.map((task: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-3.5 p-4 rounded-xl transition-colors duration-500 ${
                      isDark
                        ? 'bg-[#3a3568]/50 hover:bg-[#3a3568]/80'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isDark
                          ? `${agent.color}20`
                          : `${agent.color}15`,
                      }}
                    >
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: agent.color }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-base leading-relaxed transition-colors duration-500 ${
                        isDark ? 'text-white/80' : 'text-gray-700'
                      }`}
                    >
                      {task}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Agent status */}
            <div
              className={`mt-8 pt-6 border-t flex items-center gap-3 transition-colors duration-500 ${
                isDark ? 'border-[#5a5490]/40' : 'border-gray-200'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <span
                className={`font-mono text-sm transition-colors duration-500 ${
                  isDark ? 'text-white/50' : 'text-gray-400'
                }`}
              >
                {isArabic ? 'متاح الآن • جاهز للعمل 24/7' : 'Available now \u2022 Ready 24/7'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}