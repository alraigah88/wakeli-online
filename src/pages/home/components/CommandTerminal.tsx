
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../page';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const getNow = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

interface AgentInfo {
  name: string;
  nameEn: string;
  emoji: string;
  role: string;
  roleEn: string;
  keywords: string[];
  keywordsEn: string[];
  howHelps: string[];
  howHelpsEn: string[];
  steps: string[];
  stepsEn: string[];
}

const agents: AgentInfo[] = [
  {
    name: 'وكيل التسويق',
    nameEn: 'Marketing Agent',
    emoji: '📣',
    role: 'متخصص تسويق رقمي',
    roleEn: 'Digital Marketing Specialist',
    keywords: ['تسويق', 'إعلان', 'حملة', 'سوشيال ميديا', 'محتوى', 'ترويج', 'مبيعات', 'عملاء'],
    keywordsEn: ['marketing', 'ads', 'campaign', 'social media', 'content', 'promotion', 'sales', 'customers'],
    howHelps: ['إنشاء استراتيجية تسويقية متكاملة', 'كتابة محتوى إعلاني جذاب', 'تحليل الجمهور المستهدف', 'إدارة حملات السوشيال ميديا'],
    howHelpsEn: ['Create a comprehensive marketing strategy', 'Write compelling ad content', 'Analyze target audience', 'Manage social media campaigns'],
    steps: ['تحليل السوق والمنافسين', 'تحديد الجمهور المستهدف', 'بناء الرسالة التسويقية', 'إطلاق الحملة وقياس النتائج'],
    stepsEn: ['Analyze market and competitors', 'Define target audience', 'Build marketing message', 'Launch campaign and measure results'],
  },
  {
    name: 'وكيل المبيعات',
    nameEn: 'Sales Agent',
    emoji: '💼',
    role: 'متخصص مبيعات',
    roleEn: 'Sales Specialist',
    keywords: ['مبيعات', 'بيع', 'عرض', 'صفقة', 'عميل', 'إيرادات', 'أرباح'],
    keywordsEn: ['sales', 'sell', 'deal', 'revenue', 'profit', 'client', 'offer'],
    howHelps: ['تحسين عملية البيع', 'كتابة عروض مقنعة', 'متابعة العملاء المحتملين', 'زيادة معدل التحويل'],
    howHelpsEn: ['Improve sales process', 'Write persuasive proposals', 'Follow up with leads', 'Increase conversion rate'],
    steps: ['تحديد العملاء المحتملين', 'التواصل الأولي', 'تقديم العرض', 'إغلاق الصفقة'],
    stepsEn: ['Identify leads', 'Initial outreach', 'Present offer', 'Close the deal'],
  },
  {
    name: 'وكيل خدمة العملاء',
    nameEn: 'Customer Service Agent',
    emoji: '🎧',
    role: 'متخصص خدمة عملاء',
    roleEn: 'Customer Service Specialist',
    keywords: ['خدمة عملاء', 'شكوى', 'دعم', 'مساعدة', 'استفسار', 'رد', 'تواصل'],
    keywordsEn: ['customer service', 'complaint', 'support', 'help', 'inquiry', 'response'],
    howHelps: ['الرد على استفسارات العملاء', 'حل المشكلات بسرعة', 'تحسين تجربة العميل', 'بناء ولاء العملاء'],
    howHelpsEn: ['Answer customer inquiries', 'Resolve issues quickly', 'Improve customer experience', 'Build customer loyalty'],
    steps: ['استقبال الطلب', 'تحليل المشكلة', 'تقديم الحل', 'متابعة رضا العميل'],
    stepsEn: ['Receive request', 'Analyze problem', 'Provide solution', 'Follow up on satisfaction'],
  },
  {
    name: 'وكيل المحتوى',
    nameEn: 'Content Agent',
    emoji: '✍️',
    role: 'كاتب محتوى إبداعي',
    roleEn: 'Creative Content Writer',
    keywords: ['محتوى', 'كتابة', 'مقال', 'بوست', 'نص', 'سكريبت', 'قصة', 'إبداع'],
    keywordsEn: ['content', 'writing', 'article', 'post', 'text', 'script', 'story', 'creative'],
    howHelps: ['كتابة مقالات احترافية', 'إنشاء محتوى سوشيال ميديا', 'كتابة سكريبتات فيديو', 'تحسين المحتوى لمحركات البحث'],
    howHelpsEn: ['Write professional articles', 'Create social media content', 'Write video scripts', 'Optimize content for SEO'],
    steps: ['تحديد الهدف من المحتوى', 'البحث والتخطيط', 'الكتابة والتحرير', 'النشر والتوزيع'],
    stepsEn: ['Define content goal', 'Research and plan', 'Write and edit', 'Publish and distribute'],
  },
  {
    name: 'وكيل التحليل',
    nameEn: 'Analytics Agent',
    emoji: '📊',
    role: 'محلل بيانات وأعمال',
    roleEn: 'Data & Business Analyst',
    keywords: ['تحليل', 'بيانات', 'إحصاء', 'تقرير', 'أداء', 'مؤشرات', 'نمو'],
    keywordsEn: ['analysis', 'data', 'statistics', 'report', 'performance', 'metrics', 'growth'],
    howHelps: ['تحليل بيانات الأعمال', 'إنشاء تقارير شاملة', 'تحديد فرص النمو', 'قياس مؤشرات الأداء'],
    howHelpsEn: ['Analyze business data', 'Create comprehensive reports', 'Identify growth opportunities', 'Measure KPIs'],
    steps: ['جمع البيانات', 'تنظيف وتحليل البيانات', 'استخراج الرؤى', 'تقديم التوصيات'],
    stepsEn: ['Collect data', 'Clean and analyze data', 'Extract insights', 'Present recommendations'],
  },
];

type ConversationState = 'idle' | 'recommended' | 'asked_details' | 'showed_details';

/* Voice wave animation component */
function VoiceWave({ isActive, isDark }: { isActive: boolean; isDark: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-6">
      {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
        <motion.div
          key={i}
          className={`w-[3px] rounded-full ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`}
          animate={isActive ? {
            height: [`${h * 3}px`, `${h * 8}px`, `${h * 3}px`],
          } : { height: '3px' }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.07,
            ease: 'easeInOut',
          }}
          style={{ height: '3px' }}
        />
      ))}
    </div>
  );
}

/* Typing dots */
function TypingDots({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-400' : 'bg-slate-400'}`}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export default function CommandTerminal() {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === 'ar';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [convState, setConvState] = useState<ConversationState>('idle');
  const [currentAgent, setCurrentAgent] = useState<AgentInfo | null>(null);
  const [msgCounter, setMsgCounter] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 0,
      text: isArabic
        ? 'مرحباً! أنا مساعدك الذكي. أخبرني عن مشكلتك أو احتياجك وسأرشح لك الوكيل المناسب 👋'
        : "Hello! I'm your smart assistant. Tell me about your problem or need and I'll recommend the right agent for you 👋",
      sender: 'bot',
      timestamp: getNow(),
    };
    setMessages([welcomeMsg]);
    setConvState('idle');
    setCurrentAgent(null);
    setMsgCounter(0);
  }, [isArabic]);

  const findAgent = useCallback((text: string): AgentInfo | null => {
    const lower = text.toLowerCase();
    let bestMatch: AgentInfo | null = null;
    let bestScore = 0;
    for (const agent of agents) {
      const kws = isArabic ? agent.keywords : agent.keywordsEn;
      let score = 0;
      for (const kw of kws) {
        if (lower.includes(kw.toLowerCase())) score++;
      }
      if (score > bestScore) { bestScore = score; bestMatch = agent; }
    }
    return bestMatch;
  }, [isArabic]);

  const addBotMessage = useCallback((text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMsgCounter((prev) => {
        const newId = prev + 1;
        setMessages((prev2) => [...prev2, { id: newId, text, sender: 'bot', timestamp: getNow() }]);
        return newId;
      });
    }, 700 + Math.random() * 500);
  }, []);

  const handleNewQuery = useCallback((text: string) => {
    const found = findAgent(text);
    if (found) {
      setCurrentAgent(found);
      setConvState('recommended');
      const name = isArabic ? found.name : found.nameEn;
      const howHelps = isArabic ? found.howHelps : found.howHelpsEn;
      addBotMessage(
        isArabic
          ? `أقترح عليك الوكيل ${found.emoji} **${name}**\n\nيمكنه مساعدتك في:\n${howHelps.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nهل تريد معرفة تفاصيل أكثر؟`
          : `I recommend ${found.emoji} **${name}**\n\nThey can help you with:\n${howHelps.map((h, i) => `${i + 1}. ${h}`).join('\n')}\n\nWould you like more details?`
      );
    } else {
      addBotMessage(
        isArabic
          ? 'عذرًا، لم أجد وكيلاً مناسباً. هل يمكنك توضيح احتياجك أكثر؟ 🤔'
          : "Sorry, I couldn't find a suitable agent. Could you elaborate a bit? 🤔"
      );
    }
  }, [findAgent, isArabic, addBotMessage]);

  const processUserMessage = useCallback((text: string) => {
    const lower = text.toLowerCase();
    const yesWords = ['نعم', 'ايه', 'اه', 'اي', 'طبعا', 'أكيد', 'موافق', 'تمام', 'أبي', 'أريد', 'yes', 'yeah', 'sure', 'ok', 'okay', 'yep', 'want', 'please'];
    const noWords = ['لا', 'مابي', 'لاشكرا', 'no', 'nope', 'not'];
    const isYes = yesWords.some((w) => lower.includes(w));
    const isNo = noWords.some((w) => lower.includes(w));

    if (convState === 'recommended' && currentAgent) {
      if (isYes) {
        setConvState('asked_details');
        const name = isArabic ? currentAgent.name : currentAgent.nameEn;
        const steps = isArabic ? currentAgent.steps : currentAgent.stepsEn;
        addBotMessage(
          isArabic
            ? `ممتاز! هذه خطوات عمل ${currentAgent.emoji} ${name}:\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nهل تريد البدء الآن؟`
            : `Excellent! Here are ${currentAgent.emoji} ${name}'s steps:\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nReady to get started?`
        );
      } else if (isNo) {
        setConvState('idle');
        setCurrentAgent(null);
        addBotMessage(isArabic ? 'تمام! أخبرني إذا احتجت شيئاً آخر 😊' : 'Alright! Let me know if you need anything else 😊');
      } else {
        handleNewQuery(text);
      }
      return;
    }

    if (convState === 'asked_details' && currentAgent) {
      if (isYes) {
        setConvState('showed_details');
        addBotMessage(
          isArabic
            ? `رائع! يمكنك الآن الضغط على بطاقة الوكيل ${currentAgent.emoji} في القسم أعلاه لبدء العمل معه مباشرة. هل تحتاج مساعدة في شيء آخر؟`
            : `Great! You can now click on the ${currentAgent.emoji} agent card above to start working with them directly. Need help with anything else?`
        );
      } else if (isNo) {
        setConvState('idle');
        setCurrentAgent(null);
        addBotMessage(isArabic ? 'حسناً، أنا هنا إذا احتجتني 😊' : 'No problem, I\'m here if you need me 😊');
      } else {
        handleNewQuery(text);
      }
      return;
    }

    handleNewQuery(text);
  }, [convState, currentAgent, isArabic, addBotMessage, handleNewQuery]);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    const newId = msgCounter + 1;
    setMessages((prev) => [...prev, { id: newId, text: trimmed, sender: 'user', timestamp: getNow() }]);
    setMsgCounter(newId);
    setInput('');
    processUserMessage(trimmed);
    inputRef.current?.focus();
  }, [input, isTyping, msgCounter, processUserMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* Voice recognition */
  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addBotMessage(isArabic ? 'عذراً، متصفحك لا يدعم التعرف على الصوت.' : 'Sorry, your browser does not support voice recognition.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isArabic ? 'ar-SA' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => {
        const newId = msgCounter + 1;
        setMessages((prev) => [...prev, { id: newId, text: transcript, sender: 'user', timestamp: getNow() }]);
        setMsgCounter(newId);
        setInput('');
        processUserMessage(transcript);
      }, 300);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, isArabic, addBotMessage, msgCounter, processUserMessage]);

  /* Quick suggestion chips */
  const suggestions = isArabic
    ? ['أحتاج مساعدة في التسويق', 'كيف أزيد مبيعاتي؟', 'أريد كتابة محتوى', 'تحليل أداء أعمالي']
    : ['I need marketing help', 'How to increase sales?', 'I want to write content', 'Analyze my business'];

  const handleSuggestion = (s: string) => {
    if (isTyping) return;
    const newId = msgCounter + 1;
    setMessages((prev) => [...prev, { id: newId, text: s, sender: 'user', timestamp: getNow() }]);
    setMsgCounter(newId);
    processUserMessage(s);
  };

  /* Format message text with bold */
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-4 ${
            isDark ? 'bg-teal-500/10 text-teal-300/80' : 'bg-teal-50 text-teal-600'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            {isArabic ? 'مساعد ذكي تفاعلي' : 'Interactive AI Assistant'}
          </div>
          <h2 className={`font-mono text-2xl md:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isArabic ? 'تحدث مع مساعدك الذكي' : 'Talk to Your Smart Assistant'}
          </h2>
          <p className={`font-mono text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isArabic
              ? 'أخبره عن احتياجك وسيرشدك للوكيل المناسب'
              : 'Tell it your need and it will guide you to the right agent'}
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
            isDark
              ? 'bg-[#0f1520]/90 border-slate-700/40 shadow-2xl shadow-black/40'
              : 'bg-white border-slate-200/80 shadow-xl shadow-slate-200/60'
          }`}
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {/* Chat header bar */}
          <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
            isDark ? 'border-slate-700/40 bg-slate-800/30' : 'border-slate-100 bg-slate-50/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                isDark ? 'bg-teal-500/20' : 'bg-teal-50'
              }`}>
                🤖
              </div>
              <div>
                <p className={`font-mono text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {isArabic ? 'المساعد الذكي' : 'Smart Assistant'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className={`font-mono text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isArabic ? 'متاح الآن' : 'Online now'}
                  </span>
                </div>
              </div>
            </div>
            {/* Voice wave indicator */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono ${
                  isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-50 text-teal-600'
                }`}
              >
                <VoiceWave isActive={true} isDark={isDark} />
                <span>{isArabic ? 'جارٍ الاستماع...' : 'Listening...'}</span>
              </motion.div>
            )}
          </div>

          {/* Messages area */}
          <div
            className="overflow-y-auto px-5 py-5 space-y-4"
            style={{ height: '380px', direction: isArabic ? 'rtl' : 'ltr' }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  {msg.sender === 'bot' && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mb-1 ${
                      isDark ? 'bg-teal-500/20' : 'bg-teal-50'
                    }`}>
                      🤖
                    </div>
                  )}
                  {msg.sender === 'user' && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mb-1 ${
                      isDark ? 'bg-slate-700' : 'bg-slate-100'
                    }`}>
                      <i className={`ri-user-line text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'}`}></i>
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? isDark
                            ? 'bg-teal-500/25 text-teal-100 rounded-br-sm'
                            : 'bg-teal-500 text-white rounded-br-sm'
                          : isDark
                          ? 'bg-slate-800/80 text-slate-200 rounded-bl-sm'
                          : 'bg-slate-50 text-slate-700 rounded-bl-sm border border-slate-100'
                      }`}
                    >
                      {formatText(msg.text)}
                    </div>
                    <span className={`text-[10px] font-mono px-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end gap-2.5"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                    isDark ? 'bg-teal-500/20' : 'bg-teal-50'
                  }`}>
                    🤖
                  </div>
                  <div className={`rounded-2xl rounded-bl-sm ${
                    isDark ? 'bg-slate-800/80' : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <TypingDots isDark={isDark} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`px-5 pb-3 flex flex-wrap gap-2 ${isArabic ? 'justify-end' : 'justify-start'}`}
              style={{ direction: isArabic ? 'rtl' : 'ltr' }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap hover:scale-105 ${
                    isDark
                      ? 'border-slate-700 text-slate-400 hover:border-teal-500/50 hover:text-teal-300 hover:bg-teal-500/10'
                      : 'border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {/* Input area */}
          <div className={`px-4 pb-4 pt-2 border-t ${isDark ? 'border-slate-700/40' : 'border-slate-100'}`}>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all ${
              isDark
                ? 'bg-slate-800/60 border border-slate-700/50 focus-within:border-teal-500/40'
                : 'bg-slate-50 border border-slate-200 focus-within:border-teal-400'
            }`}>
              {/* Voice button */}
              <button
                onClick={toggleVoice}
                className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all cursor-pointer ${
                  isListening
                    ? isDark
                      ? 'bg-teal-500/30 text-teal-300'
                      : 'bg-teal-100 text-teal-600'
                    : isDark
                    ? 'text-slate-500 hover:text-teal-400 hover:bg-teal-500/10'
                    : 'text-slate-400 hover:text-teal-500 hover:bg-teal-50'
                }`}
                title={isArabic ? 'تحدث بصوتك' : 'Speak'}
              >
                {isListening ? (
                  <VoiceWave isActive={true} isDark={isDark} />
                ) : (
                  <i className="ri-mic-line text-base"></i>
                )}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isListening}
                placeholder={
                  isListening
                    ? (isArabic ? 'جارٍ الاستماع...' : 'Listening...')
                    : (isArabic ? 'اكتب رسالتك أو تحدث بصوتك...' : 'Type or speak your message...')
                }
                className={`flex-1 bg-transparent text-sm font-mono outline-none placeholder:text-slate-400 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
                style={{ direction: isArabic ? 'rtl' : 'ltr' }}
              />

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all cursor-pointer ${
                  input.trim() && !isTyping
                    ? isDark
                      ? 'bg-teal-500/30 text-teal-300 hover:bg-teal-500/50'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                    : isDark
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <i className={`ri-send-plane-fill text-sm ${isArabic ? 'scale-x-[-1]' : ''}`}></i>
              </button>
            </div>
            <p className={`text-center text-[10px] font-mono mt-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              {isArabic ? 'اضغط Enter للإرسال • أو استخدم الميكروفون للتحدث' : 'Press Enter to send • or use mic to speak'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
