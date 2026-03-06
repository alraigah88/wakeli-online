import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';

interface LiveMeetingRoomProps {
  isOpen: boolean;
  onClose: () => void;
  department: string;
  selectedAgents: string[];
  topic: string;
  onMeetingComplete: (summary: MeetingSummary) => void;
}

interface Agent {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  avatar: string;
  color: string;
  bgImage: string;
}

interface Message {
  agentId: string;
  agentName: string;
  agentRole: string;
  avatar: string;
  color: string;
  content: string;
  type: 'introduction' | 'analysis' | 'response' | 'agreement' | 'disagreement';
}

export interface MeetingSummary {
  executiveSummary: string;
  actionPlan: string[];
  riskWarnings: string[];
  nextSteps: string[];
}

const agents: Record<string, Agent> = {
  reem: {
    id: 'reem',
    nameAr: 'ريم',
    nameEn: 'Reem',
    roleAr: 'مديرة التسويق',
    roleEn: 'Marketing Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/08e35bd501e5a2d6d2ff171d05b7d173.png',
    color: '#e91e8c',
    bgImage: 'https://readdy.ai/api/search-image?query=modern%20bright%20home%20office%20interior%20with%20bookshelf%20plants%20white%20walls%20natural%20light%20clean%20minimal%20workspace%20professional%20setting%20warm%20tones&width=400&height=300&seq=bg_reem_01&orientation=landscape',
  },
  ahmed: {
    id: 'ahmed',
    nameAr: 'أحمد',
    nameEn: 'Ahmed',
    roleAr: 'مدير المحتوى',
    roleEn: 'Content Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/59218b313e14349b70fb37702eac1ccc.png',
    color: '#7c3aed',
    bgImage: 'https://readdy.ai/api/search-image?query=cozy%20modern%20office%20room%20dark%20wood%20desk%20ambient%20lighting%20bookshelves%20professional%20background%20soft%20warm%20light%20interior%20design&width=400&height=300&seq=bg_ahmed_02&orientation=landscape',
  },
  sara: {
    id: 'sara',
    nameAr: 'سارة',
    nameEn: 'Sara',
    roleAr: 'مديرة خدمة العملاء',
    roleEn: 'Customer Service Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/8baffcad8834a6c1c5230c3a18bc131d.png',
    color: '#0ea5e9',
    bgImage: 'https://readdy.ai/api/search-image?query=bright%20airy%20home%20office%20white%20walls%20plants%20window%20light%20minimal%20clean%20desk%20setup%20professional%20video%20call%20background%20modern&width=400&height=300&seq=bg_sara_03&orientation=landscape',
  },
  khalid: {
    id: 'khalid',
    nameAr: 'خالد',
    nameEn: 'Khalid',
    roleAr: 'محلل الأداء',
    roleEn: 'Performance Analyst',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d009a972e1c6c65e35a1a50b4e276a4b.png',
    color: '#ef4444',
    bgImage: 'https://readdy.ai/api/search-image?query=modern%20tech%20office%20dark%20background%20monitors%20ambient%20blue%20light%20professional%20workspace%20clean%20minimal%20interior%20corporate&width=400&height=300&seq=bg_khalid_04&orientation=landscape',
  },
  nora: {
    id: 'nora',
    nameAr: 'نورة',
    nameEn: 'Nora',
    roleAr: 'مديرة المشاريع',
    roleEn: 'Project Manager',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/a922778b168be8b83e02c082538079fd.png',
    color: '#f59e0b',
    bgImage: 'https://readdy.ai/api/search-image?query=elegant%20home%20office%20warm%20lighting%20wooden%20shelves%20plants%20neutral%20tones%20professional%20background%20video%20conference%20setup&width=400&height=300&seq=bg_nora_05&orientation=landscape',
  },
  omar: {
    id: 'omar',
    nameAr: 'عمر',
    nameEn: 'Omar',
    roleAr: 'مطور تقني',
    roleEn: 'Technical Developer',
    avatar: 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/fa141410ac8972062d76be8f0ec890b4.png',
    color: '#10b981',
    bgImage: 'https://readdy.ai/api/search-image?query=developer%20workspace%20multiple%20screens%20dark%20room%20code%20on%20screen%20ambient%20green%20light%20tech%20setup%20professional%20modern%20office&width=400&height=300&seq=bg_omar_06&orientation=landscape',
  },
};

const departmentNames: Record<string, { ar: string; en: string }> = {
  marketing: { ar: 'التسويق', en: 'Marketing' },
  finance: { ar: 'المالية', en: 'Finance' },
  product: { ar: 'المنتجات', en: 'Product' },
  operations: { ar: 'العمليات', en: 'Operations' },
  strategy: { ar: 'الاستراتيجية', en: 'Strategy' },
};

// Moderator background
const MODERATOR_BG = 'https://readdy.ai/api/search-image?query=large%20modern%20conference%20room%20professional%20meeting%20space%20clean%20white%20walls%20long%20table%20corporate%20interior%20bright%20natural%20light%20executive%20boardroom&width=800&height=500&seq=moderator_bg_01&orientation=landscape';

const MODERATOR_AVATAR = 'https://static.readdy.ai/image/c6f8f37d0887e9699cff9db0069d6acd/d7dcf47e327bbe75c64f75b9472ecdb0.png';

export default function LiveMeetingRoom({
  isOpen,
  onClose,
  department,
  selectedAgents,
  topic,
  onMeetingComplete,
}: LiveMeetingRoomProps) {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === 'ar';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<'starting' | 'live' | 'completed'>('starting');
  const [isComplete, setIsComplete] = useState(false);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const agentsList = selectedAgents.map((id) => agents[id]).filter(Boolean) as Agent[];

  useEffect(() => {
    if (isOpen && selectedAgents.length > 0) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
      startMeeting().catch(console.error);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, selectedAgents]);

  useEffect(() => {
    if (isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => setShowUpgradePrompt(true), 2000);
    }
  }, [isComplete]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentMessage]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleUpgrade = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const getAgentName = (agent: Agent) => (isArabic ? agent.nameAr : agent.nameEn);
  const getAgentRole = (agent: Agent) => (isArabic ? agent.roleAr : agent.roleEn);

  const startMeeting = async (): Promise<void> => {
    try {
      setMeetingStatus('live');
      setMessages([]);
      setCurrentMessage('');
      setIsComplete(false);
      setActiveAgentId('moderator');

      await typeMessage({
        agentId: 'moderator',
        agentName: isArabic ? 'المنسق' : 'Moderator',
        agentRole: isArabic ? 'منسق الاجتماع' : 'Meeting Coordinator',
        avatar: '',
        color: '#6366f1',
        content: isArabic
          ? `مرحباً بكم في اجتماع الوكلاء. موضوعنا:\n"${topic}"`
          : `Welcome to the agents meeting. Our topic:\n"${topic}"`,
        type: 'introduction',
      }, 1500);

      const conversationFlow = [
        { agentIndex: 0, delay: 2000 },
        { agentIndex: 1, delay: 2000 },
        { agentIndex: 2, delay: 2000 },
        { agentIndex: 0, delay: 2000 },
      ];

      for (const { agentIndex, delay } of conversationFlow) {
        if (agentIndex < selectedAgents.length) {
          await new Promise((r) => setTimeout(r, delay));
          await simulateQuickResponse(selectedAgents[agentIndex], topic, agentIndex);
        }
      }

      await new Promise((r) => setTimeout(r, 2000));
      setActiveAgentId('moderator');
      await typeMessage({
        agentId: 'moderator',
        agentName: isArabic ? 'المنسق' : 'Moderator',
        agentRole: isArabic ? 'منسق الاجتماع' : 'Meeting Coordinator',
        avatar: '',
        color: '#6366f1',
        content: isArabic
          ? 'ممتاز! الآن كل وكيل يعطينا حله النهائي...'
          : 'Excellent! Now each agent will give us their final solution...',
        type: 'introduction',
      }, 1500);

      for (let i = 0; i < selectedAgents.length; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        await simulateFinalSolution(selectedAgents[i], topic);
      }

      await new Promise((r) => setTimeout(r, 2000));
      setActiveAgentId('moderator');
      await typeMessage({
        agentId: 'moderator',
        agentName: isArabic ? 'المنسق' : 'Moderator',
        agentRole: isArabic ? 'منسق الاجتماع' : 'Meeting Coordinator',
        avatar: '',
        color: '#6366f1',
        content: isArabic
          ? 'شكراً للجميع. الآن سنعد التقرير النهائي...'
          : 'Thank you all. Now preparing the final report...',
        type: 'introduction',
      }, 1500);

      const generatedSummary = generateMeetingSummary(topic);
      setSummary(generatedSummary);
      setIsComplete(true);
      setMeetingStatus('completed');
      setActiveAgentId(null);
      onMeetingComplete(generatedSummary);
    } catch (e) {
      console.error('Meeting error:', e);
      setMeetingStatus('completed');
    }
  };

  const simulateQuickResponse = async (agentId: string, topicText: string, roundIndex: number): Promise<void> => {
    const agent = agents[agentId];
    if (!agent) return;
    setActiveAgentId(agentId);
    const content = getQuickResponse(agent, topicText, roundIndex);
    await typeMessage({
      agentId: agent.id,
      agentName: getAgentName(agent),
      agentRole: getAgentRole(agent),
      avatar: agent.avatar,
      color: agent.color,
      content,
      type: 'response',
    }, 1500);
  };

  const simulateFinalSolution = async (agentId: string, topicText: string): Promise<void> => {
    const agent = agents[agentId];
    if (!agent) return;
    setActiveAgentId(agentId);
    const content = getFinalSolution(agent, topicText);
    await typeMessage({
      agentId: agent.id,
      agentName: getAgentName(agent),
      agentRole: getAgentRole(agent),
      avatar: agent.avatar,
      color: agent.color,
      content,
      type: 'agreement',
    }, 1500);
  };

  const typeMessage = async (message: Message, baseDelay: number = 0): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setCurrentMessage('');
      setCurrentAgent(message.agentId !== 'moderator' ? agents[message.agentId] || null : null);

      const words = message.content.split(' ');
      let index = 0;
      const interval = setInterval(() => {
        if (index < words.length) {
          setCurrentMessage((prev) => (prev ? `${prev} ${words[index]}` : words[index]));
          index += 1;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setCurrentAgent(null);
          setMessages((prev) => [...prev, { ...message }]);
          setCurrentMessage('');
          setTimeout(resolve, baseDelay);
        }
      }, 140);
    });
  };

  const getQuickResponse = (agent: Agent, topic: string, roundIndex: number): string => {
    const responses: Record<string, string[]> = {
      reem: [
        isArabic ? 'من خبرتي بالتسويق، المشكلة الأساسية إن ما عندك هوية واضحة تميزك عن المنافسين.' : 'From my marketing experience, the core issue is you lack a clear identity.',
        isArabic ? 'صحيح، وأضيف إن الحملة لازم تكون مبنية على بيانات حقيقية مو مجرد حدس.' : 'True, and the campaign must be data-driven, not just intuition.',
        isArabic ? 'ممتاز! أنا بجهز استراتيجية تسويقية متكاملة مع حملات مستهدفة على كل القنوات.' : 'Excellent! I\'ll prepare a complete marketing strategy with targeted campaigns.',
        isArabic ? 'أتفق تماماً، وبنركز على بناء علاقة طويلة مع العملاء مو مجرد بيع.' : 'I totally agree, we\'ll focus on long-term customer relationships.',
      ],
      ahmed: [
        isArabic ? 'المحتوى هو المفتاح. لازم نسوي قصص حقيقية تلمس مشاعر الجمهور.' : 'Content is key. We need real stories that touch the audience\'s emotions.',
        isArabic ? 'بالضبط، وأنا أقترح نسوي محتوى يومي يربط العملاء بالواقع.' : 'Exactly, I suggest daily content that connects customers to reality.',
        isArabic ? 'رائع! بجهز خطة محتوى شهرية كاملة مع أفكار إبداعية لكل منصة.' : 'Great! I\'ll prepare a full monthly content plan for each platform.',
        isArabic ? 'معكم، وبضمن إن كل قطعة محتوى تخدم الهدف الكبير.' : 'With you, every content piece will serve the big goal.',
      ],
      sara: [
        isArabic ? 'تجربة العميل هي كل شي. لو العميل ما حس بالاهتمام، بيروح للمنافس.' : 'Customer experience is everything. If they don\'t feel valued, they\'ll leave.',
        isArabic ? 'صحيح، وأنا أقترح نظام دعم فوري يرد بأقل من دقيقة.' : 'True, I suggest an instant support system responding in under a minute.',
        isArabic ? 'ممتاز! بسوي نظام دعم متكامل وبدرب الفريق على التعامل الاحترافي.' : 'Excellent! I\'ll build a complete support system and train the team.',
        isArabic ? 'أتفق، وبضمن إن كل عميل يحس إنه VIP ويرجع لنا دائماً.' : 'I agree, every customer will feel like a VIP.',
      ],
      khalid: [
        isArabic ? 'خلوني أكون واقعي: بدون أرقام واضحة، ما نقدر نقيس النجاح.' : 'Let me be realistic: without clear numbers, we can\'t measure success.',
        isArabic ? 'بالضبط، وأنا أقترح نتابع KPIs أسبوعياً ونعدل الخطة.' : 'Exactly, I suggest tracking KPIs weekly and adjusting the plan.',
        isArabic ? 'رائع! بجهز dashboard مشترك يعرض الأرقام لحظياً لكل الفريق.' : 'Great! I\'ll set up a shared real-time dashboard for the whole team.',
        isArabic ? 'معكم، وبضمن إن كل واحد يعرف بالضبط وش المطلوب منه.' : 'With you, we\'ll catch problems early and fix them.',
      ],
      nora: [
        isArabic ? 'التنظيم أساسي. بدون خطة واضحة ومراحل محددة، كل الأفكار بتضيع.' : 'Organization is essential. Without a clear plan, all ideas will be lost.',
        isArabic ? 'صحيح، وأنا أقترح نقسم المشروع لثلاث مراحل: تأسيس، إطلاق، توسع.' : 'True, I suggest splitting the project into three phases.',
        isArabic ? 'ممتاز! بجهز خارطة طريق تفصيلية مع مهام واضحة ومواعيد نهائية.' : 'Excellent! I\'ll prepare a detailed roadmap with clear tasks and deadlines.',
        isArabic ? 'أتفق، وبضمن إن كل واحد يعرف بالضبط وش المطلوب منه.' : 'I agree, everyone will know exactly what\'s expected.',
      ],
      omar: [
        isArabic ? 'من الناحية التقنية، البنية التحتية لازم تكون قوية وسريعة من البداية.' : 'Technically, the infrastructure must be solid and fast from the start.',
        isArabic ? 'بالضبط، وأنا بستخدم أحدث التقنيات لضمان سرعة وأمان عاليين.' : 'Exactly, I\'ll use the latest technologies for high speed and security.',
        isArabic ? 'رائع! بضمن إن الموقع يشتغل بسلاسة على كل الأجهزة بدون مشاكل.' : 'Great! I guarantee the site works smoothly on all devices.',
        isArabic ? 'معكم، وبضيف ميزات ذكاء اصطناعي تخلي التجربة مخصصة لكل مستخدم.' : 'With you, I\'ll add AI features for personalized experience.',
      ],
    };
    const agentResponses = responses[agent.id] || [];
    return agentResponses[roundIndex % agentResponses.length] || '';
  };

  const getFinalSolution = (agent: Agent, _topic: string): string => {
    const solutions: Record<string, { ar: string; en: string }> = {
      reem: {
        ar: 'الحل النهائي: بناء هوية تسويقية قوية مع حملات مستهدفة على كل القنوات. بنستخدم A/B testing لكل إعلان ونعدل الاستراتيجية أسبوعياً. الهدف: زيادة الوعي بالعلامة التجارية 300% خلال 3 أشهر.',
        en: 'Final solution: Build a strong marketing identity with targeted campaigns. We\'ll use A/B testing for every ad. Goal: Increase brand awareness 300% within 3 months.',
      },
      ahmed: {
        ar: 'الحل النهائي: خطة محتوى شاملة تركز على قصص نجاح حقيقية. بننشر محتوى يومي على كل المنصات. النتيجة: بناء مجتمع مخلص يثق بالعلامة التجارية.',
        en: 'Final solution: Comprehensive content plan focusing on real success stories. Daily content on all platforms. Result: Build a loyal community that trusts the brand.',
      },
      sara: {
        ar: 'الحل النهائي: نظام دعم فوري متاح 24/7. كل عميل يحصل على رد خلال 60 ثانية. الهدف: رفع رضا العملاء لـ 95%.',
        en: 'Final solution: 24/7 instant support system. Every customer gets a reply within 60 seconds. Goal: Raise customer satisfaction to 95%.',
      },
      khalid: {
        ar: 'الحل النهائي: لوحة تحكم شاملة تعرض كل المؤشرات لحظياً مع تقارير أسبوعية. النتيجة: قرارات ذكية مبنية على بيانات حقيقية.',
        en: 'Final solution: Comprehensive dashboard showing all metrics in real-time. Result: Smart decisions based on real data.',
      },
      nora: {
        ar: 'الحل النهائي: خارطة طريق تفصيلية مقسمة لثلاث مراحل مع مهام واضحة. الهدف: تسليم المشروع في الوقت المحدد بجودة عالية.',
        en: 'Final solution: Detailed roadmap split into three phases with clear tasks. Goal: Deliver the project on time with high quality.',
      },
      omar: {
        ar: 'الحل النهائي: بنية تحتية قوية مع أحدث التقنيات وسرعة تحميل أقل من ثانية. النتيجة: تجربة استثنائية تبهر كل زائر.',
        en: 'Final solution: Solid infrastructure with latest technologies and loading speed under one second. Result: Exceptional experience that wows every visitor.',
      },
    };
    return solutions[agent.id]?.[isArabic ? 'ar' : 'en'] ?? '';
  };

  const generateMeetingSummary = (topicText: string): MeetingSummary => ({
    executiveSummary: isArabic
      ? `بعد نقاش معمق بين اجتماع الوكلاء حول "${topicText}"، توصلنا لحلول عملية تجمع بين التسويق والمحتوى وتجربة العميل مع قياس دقيق للنتائج.`
      : `After deep discussion among the agents team about "${topicText}", we reached practical solutions combining marketing, content, and customer experience.`,
    actionPlan: isArabic
      ? ['بناء استراتيجية تسويقية مستهدفة', 'إنشاء محتوى يومي جذاب', 'تحسين تجربة العميل والدعم', 'قياس KPIs أسبوعياً', 'تنفيذ على مراحل محددة', 'تحسين البنية التقنية']
      : ['Build targeted marketing strategy', 'Create engaging daily content', 'Improve customer experience', 'Measure KPIs weekly', 'Execute in defined phases', 'Improve technology infrastructure'],
    riskWarnings: isArabic
      ? ['⚠️ عدم التركيز على الجمهور المستهدف', '⚠️ إهمال تجربة العميل', '⚠️ عدم قياس النتائج', '⚠️ ضعف البنية التقنية']
      : ['⚠️ Not focusing on target audience', '⚠️ Neglecting customer experience', '⚠️ Not measuring results', '⚠️ Weak technical infrastructure'],
    nextSteps: isArabic
      ? ['🎯 تحديد الجمهور بدقة', '📝 إنشاء محتوى', '📞 بناء نظام دعم', '📊 إعداد لوحة KPIs', '🔧 تحسين التقنية', '🚀 البدء بالتنفيذ']
      : ['🎯 Define audience precisely', '📝 Create content plan', '📞 Build support system', '📊 Setup KPI dashboard', '🔧 Improve technology', '🚀 Start execution'],
  });

  const downloadReport = () => {
    if (!summary) return;
    const content = `${isArabic ? 'تقرير الاجتماع' : 'Meeting Report'}\n${isArabic ? 'الموضوع' : 'Topic'}: ${topic}\n${'='.repeat(50)}\n\n${isArabic ? 'الملخص التنفيذي' : 'Executive Summary'}:\n${summary.executiveSummary}\n\n${isArabic ? 'خطة العمل' : 'Action Plan'}:\n${summary.actionPlan.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\n${isArabic ? 'تحذيرات المخاطر' : 'Risk Warnings'}:\n${summary.riskWarnings.join('\n')}\n\n${isArabic ? 'الخطوات التالية' : 'Next Steps'}:\n${summary.nextSteps.join('\n')}`.trim();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // Determine who is speaking now
  const speakingAgentId = isTyping ? (currentAgent?.id ?? 'moderator') : activeAgentId;

  // ── THEME VARIABLES ──
  const bg = isDark ? 'bg-[#0d0d1f] text-white' : 'bg-white text-gray-900';
  const topBarBg = isDark ? 'bg-[#12122a] border-white/10' : 'bg-gray-50 border-gray-200';
  const bottomBarBg = isDark ? 'bg-[#12122a] border-white/10' : 'bg-gray-50 border-gray-200';
  const chatBg = isDark ? 'bg-[#0f0f24]' : 'bg-gray-50';
  const chatHeaderBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const chatTitleColor = isDark ? 'text-white' : 'text-gray-800';
  const chatCountColor = isDark ? 'text-white/40' : 'text-gray-400';
  const liveTextColor = isDark ? 'text-white/60' : 'text-gray-500';
  const deptTextColor = isDark ? 'text-white/40' : 'text-gray-400';
  const topicTextColor = isDark ? 'text-white/70' : 'text-gray-600';
  const controlBtnBase = isDark
    ? 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200';
  const modBubbleBg = isDark ? 'bg-teal-500/10 border-teal-400/20' : 'bg-teal-50 border-teal-200';
  const modNameColor = isDark ? 'text-teal-400' : 'text-teal-600';
  const modTextColor = isDark ? 'text-white/80' : 'text-gray-700';
  const msgBubbleBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200';
  const msgTextColor = isDark ? 'text-white/80' : 'text-gray-700';
  const speakingStatusBg = isDark ? 'bg-teal-500/10 border-teal-400/20' : 'bg-teal-50 border-teal-200';

  // تناوب الرسائل يمين ويسار
  let agentMessageIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col ${bg}`}
    >
      {/* ── TOP BAR ── */}
      <div className={`flex items-center justify-between px-4 py-2 border-b flex-shrink-0 ${topBarBg}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 text-xs font-bold font-mono">
              {meetingStatus === 'completed' ? (isArabic ? 'انتهى' : 'Ended') : (isArabic ? 'مباشر' : 'LIVE')}
            </span>
          </div>
          <span className={`text-xs font-mono ${liveTextColor}`}>{formatTime(elapsedTime)}</span>
          <span className={`text-xs hidden sm:block ${deptTextColor}`}>|</span>
          <span className={`text-xs hidden sm:block truncate max-w-[200px] ${topicTextColor}`}>{topic}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono ${deptTextColor}`}>
            {departmentNames[department]?.[isArabic ? 'ar' : 'en'] || department}
          </span>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${controlBtnBase}`}
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT: vertical split ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── TOP SECTION: AGENTS VIDEO GRID (full-fill rectangles, no circles) ── */}
        <div className="flex gap-2 p-2 flex-shrink-0" style={{ height: '55%' }}>

          {/* MODERATOR tile — full image fill */}
          <div className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: agentsList.length === 0 ? '100%' : '22%', minWidth: 160 }}>
            <img
              src={MODERATOR_AVATAR}
              alt="Moderator"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>

            {speakingAgentId === 'moderator' && (
              <div className="absolute inset-0 rounded-2xl border-[3px] border-teal-400 animate-pulse pointer-events-none"></div>
            )}

            {/* Live typing bubble for moderator */}
            {isTyping && !currentAgent && currentMessage && (
              <div className="absolute top-3 left-2 right-2 px-3 py-2 rounded-xl bg-black/75 backdrop-blur-sm border border-teal-400/40">
                <p className="text-white text-sm font-mono leading-relaxed whitespace-pre-line text-center line-clamp-4">
                  {currentMessage}
                  <span className="animate-pulse text-teal-400 ml-1">|</span>
                </p>
              </div>
            )}

            {/* Name tag */}
            <div className="absolute bottom-3 left-2 right-2">
              <div className="px-3 py-2 rounded-xl bg-black/65 backdrop-blur-sm flex items-center gap-2">
                {speakingAgentId === 'moderator' && (
                  <div className="flex gap-0.5 items-end h-4">
                    {[1,2,3,4].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-teal-400 rounded-full animate-bounce"
                        style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                )}
                <span className="text-white text-sm font-bold">
                  {isArabic ? 'المنسق' : 'Moderator'}
                </span>
                <span className="text-white/50 text-xs">{isArabic ? 'منسق الاجتماع' : 'Meeting Coordinator'}</span>
              </div>
            </div>
          </div>

          {/* AGENTS tiles — full image fill, no circles */}
          <div className="flex gap-2 flex-1 overflow-hidden">
            {agentsList.length === 0 ? (
              <div className={`flex-1 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                <span className={`text-sm ${deptTextColor}`}>{isArabic ? 'لا يوجد وكلاء' : 'No agents selected'}</span>
              </div>
            ) : (
              agentsList.map((agent) => {
                const isSpeaking = speakingAgentId === agent.id;
                return (
                  <div
                    key={agent.id}
                    className="relative rounded-2xl overflow-hidden flex-1"
                    style={{ minWidth: 0 }}
                  >
                    {/* صورة الوكيل تملأ البطاقة بالكامل */}
                    <img
                      src={agent.avatar}
                      alt={getAgentName(agent)}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    {/* خلفية طبيعية خفيفة */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, transparent 40%, ${agent.color}22 70%, ${agent.color}55 100%)`,
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {isSpeaking && (
                      <div
                        className="absolute inset-0 rounded-2xl border-[3px] animate-pulse pointer-events-none"
                        style={{ borderColor: agent.color }}
                      ></div>
                    )}

                    {/* اسم الوكيل في الأسفل */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/65 backdrop-blur-sm">
                        {isSpeaking && (
                          <div className="flex gap-0.5 items-end h-4">
                            {[1,2,3].map((i) => (
                              <div
                                key={i}
                                className="w-1 rounded-full animate-bounce"
                                style={{
                                  height: `${6 + i * 3}px`,
                                  backgroundColor: agent.color,
                                  animationDelay: `${i * 0.12}s`,
                                }}
                              ></div>
                            ))}
                          </div>
                        )}
                        <span className="text-white text-sm font-bold truncate">{getAgentName(agent)}</span>
                        <span className="text-white/50 text-xs truncate hidden sm:block">{getAgentRole(agent)}</span>
                      </div>
                    </div>

                    {/* نص الكتابة المباشرة فوق الصورة */}
                    {isSpeaking && isTyping && currentAgent?.id === agent.id && currentMessage && (
                      <div className="absolute top-2 left-2 right-2 px-3 py-2 rounded-xl bg-black/80 backdrop-blur-sm border"
                        style={{ borderColor: `${agent.color}60` }}>
                        <p className="text-white text-sm font-mono leading-relaxed line-clamp-4">
                          {currentMessage}
                          <span className="animate-pulse ml-0.5" style={{ color: agent.color }}>|</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── BOTTOM SECTION: CHAT كدردشة حقيقية ── */}
        <div className={`flex flex-1 overflow-hidden border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className={`flex flex-col w-full ${chatBg}`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between flex-shrink-0 ${chatHeaderBorder}`}>
              <div className="flex items-center gap-2">
                <i className={`ri-chat-3-line text-base ${isDark ? 'text-teal-400' : 'text-teal-600'}`}></i>
                <span className={`text-base font-bold ${chatTitleColor}`}>{isArabic ? 'محادثة الاجتماع' : 'Meeting Chat'}</span>
              </div>
              <span className={`text-sm ${chatCountColor}`}>{messages.length} {isArabic ? 'رسالة' : 'msgs'}</span>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => {
                const isMod = msg.agentId === 'moderator';
                // تناوب يمين ويسار للوكلاء
                let isRight = false;
                if (!isMod) {
                  // نحسب ترتيب رسائل الوكلاء فقط
                  const agentMsgs = messages.slice(0, idx + 1).filter(m => m.agentId !== 'moderator');
                  isRight = agentMsgs.length % 2 === 1;
                }
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${isMod ? 'justify-center' : isRight ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {isMod ? (
                      <div className={`max-w-2xl w-full px-5 py-3 rounded-2xl border text-center ${modBubbleBg}`}>
                        <p className={`text-sm font-bold mb-1 ${modNameColor}`}>{isArabic ? '🎙 المنسق' : '🎙 Moderator'}</p>
                        <p className={`text-base leading-relaxed whitespace-pre-line ${modTextColor}`}>{msg.content}</p>
                      </div>
                    ) : (
                      <>
                        {/* صورة الوكيل مستطيلة صغيرة */}
                        <div
                          className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2"
                          style={{ borderColor: msg.color }}
                        >
                          <img src={msg.avatar} alt={msg.agentName} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className={`flex-1 min-w-0 max-w-xl ${isRight ? 'items-end' : 'items-start'} flex flex-col`}>
                          <p className="text-sm font-bold mb-1" style={{ color: msg.color }}>
                            {msg.agentName}
                            <span className={`font-normal ms-2 text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{msg.agentRole}</span>
                          </p>
                          <div
                            className={`px-5 py-3 rounded-2xl border ${msgBubbleBg} ${isRight ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                          >
                            <p className={`text-base leading-relaxed ${msgTextColor}`}>{msg.content}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && currentMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex gap-3 ${currentAgent ? (
                    (() => {
                      const agentMsgs = messages.filter(m => m.agentId !== 'moderator');
                      return agentMsgs.length % 2 === 0 ? 'flex-row' : 'flex-row-reverse';
                    })()
                  ) : 'justify-center'}`}
                >
                  {currentAgent ? (
                    <>
                      <div
                        className="w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2"
                        style={{ borderColor: currentAgent.color }}
                      >
                        <img src={currentAgent.avatar} alt={getAgentName(currentAgent)} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0 max-w-xl flex flex-col">
                        <p className="text-sm font-bold mb-1" style={{ color: currentAgent.color }}>{getAgentName(currentAgent)}</p>
                        <div className={`px-5 py-3 rounded-2xl border ${msgBubbleBg}`}>
                          <p className={`text-base leading-relaxed ${msgTextColor}`}>
                            {currentMessage}
                            <span className="animate-pulse ml-0.5" style={{ color: currentAgent.color }}>|</span>
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={`max-w-2xl w-full px-5 py-3 rounded-2xl border text-center ${modBubbleBg}`}>
                      <p className={`text-sm font-bold mb-1 ${modNameColor}`}>{isArabic ? '🎙 المنسق' : '🎙 Moderator'}</p>
                      <p className={`text-base leading-relaxed whitespace-pre-line ${modTextColor}`}>
                        {currentMessage}
                        <span className="animate-pulse text-teal-400 ml-0.5">|</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      {!isComplete && (
        <div className={`flex items-center justify-between px-6 py-3 border-t flex-shrink-0 ${bottomBarBg}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer ${isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : controlBtnBase}`}
            >
              <i className={`${isMuted ? 'ri-mic-off-line' : 'ri-mic-line'} text-lg`}></i>
            </button>
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer ${isCameraOff ? 'bg-red-500/20 text-red-400 border border-red-500/40' : controlBtnBase}`}
            >
              <i className={`${isCameraOff ? 'ri-camera-off-line' : 'ri-camera-line'} text-lg`}></i>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${speakingStatusBg}`}>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span className={`text-sm font-mono ${liveTextColor}`}>
                {isArabic ? 'الوكلاء يتحدثون...' : 'Agents speaking...'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-phone-line text-base rotate-[135deg]"></i>
            {isArabic ? 'إنهاء الاجتماع' : 'End Meeting'}
          </button>
        </div>
      )}

      {/* ── SUMMARY OVERLAY ── */}
      <AnimatePresence>
        {isComplete && summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 backdrop-blur-md z-10 flex items-center justify-center p-4 overflow-y-auto ${isDark ? 'bg-black/85' : 'bg-white/85'}`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden ${isDark ? 'bg-[#12122a] border-white/10' : 'bg-white border-gray-200'}`}
            >
              {/* Summary header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-white/10' : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <i className="ri-file-text-line text-teal-500 text-xl"></i>
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{isArabic ? 'تقرير الاجتماع' : 'Meeting Report'}</h3>
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{formatTime(elapsedTime)} {isArabic ? 'مدة الاجتماع' : 'meeting duration'}</p>
                  </div>
                </div>
                <button onClick={downloadReport} className="px-4 py-2 rounded-xl bg-teal-500/20 text-teal-600 border border-teal-500/30 text-sm font-bold hover:bg-teal-500/30 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2">
                  <i className="ri-download-line"></i>
                  {isArabic ? 'تحميل' : 'Download'}
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-teal-400/20' : 'bg-teal-50 border-teal-200'}`}>
                  <h4 className="text-teal-500 font-bold text-sm mb-2 flex items-center gap-2">
                    <i className="ri-file-text-line"></i>
                    {isArabic ? 'الملخص التنفيذي' : 'Executive Summary'}
                  </h4>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{summary.executiveSummary}</p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-violet-400/20' : 'bg-indigo-50 border-indigo-200'}`}>
                  <h4 className="text-indigo-500 font-bold text-sm mb-3 flex items-center gap-2">
                    <i className="ri-task-line"></i>
                    {isArabic ? 'خطة العمل' : 'Action Plan'}
                  </h4>
                  <ul className="space-y-2">
                    {summary.actionPlan.map((item, i) => (
                      <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                        <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-500 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-amber-400/20' : 'bg-amber-50 border-amber-200'}`}>
                    <h4 className="text-amber-500 font-bold text-sm mb-3 flex items-center gap-2">
                      <i className="ri-alert-line"></i>
                      {isArabic ? 'تحذيرات' : 'Risks'}
                    </h4>
                    <ul className="space-y-1.5">
                      {summary.riskWarnings.map((r, i) => (
                        <li key={i} className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-emerald-400/20' : 'bg-emerald-50 border-emerald-200'}`}>
                    <h4 className="text-emerald-500 font-bold text-sm mb-3 flex items-center gap-2">
                      <i className="ri-arrow-right-circle-line"></i>
                      {isArabic ? 'الخطوات التالية' : 'Next Steps'}
                    </h4>
                    <ul className="space-y-1.5">
                      {summary.nextSteps.map((s, i) => (
                        <li key={i} className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showUpgradePrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`px-6 py-5 rounded-xl border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-white/10' : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-gray-200'}`}
                  >
                    <div>
                      <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>{isArabic ? 'هذه كانت تجربتك المجانية 🎉' : 'This was your free trial 🎉'}</p>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{isArabic ? 'قم بالترقية للحصول على اجتماعات غير محدودة' : 'Upgrade for unlimited meetings'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={handleUpgrade} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all cursor-pointer whitespace-nowrap">
                        <i className="ri-vip-crown-line me-2"></i>
                        {isArabic ? 'ترقية الآن' : 'Upgrade Now'}
                      </button>
                      <button onClick={onClose} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${isDark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {isArabic ? 'العودة' : 'Back'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
