import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../page';
import AppConnectionModal from './AppConnectionModal';

interface AppConnection {
  id: string;
  name: string;
  nameAr: string;
  logoUrl: string;
  color: string;
  category: 'productivity' | 'communication' | 'marketing' | 'technical' | 'financial';
  isConnected: boolean;
  description: string;
  descriptionAr: string;
  status: 'available' | 'coming-soon';
  automationTasks: string[];
  automationTasksAr: string[];
  benefits: string[];
  benefitsAr: string[];
  tools: string[];
  toolsAr: string[];
  howItWorks: string[];
  howItWorksAr: string[];
}

const AccountConnectionsSection = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const isRTL = i18n.language === 'ar';

  const [connections, setConnections] = useState<AppConnection[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      nameAr: 'جيميل',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png',
      color: '#EA4335',
      category: 'productivity',
      isConnected: false,
      description: 'Email management and automation',
      descriptionAr: 'إدارة وأتمتة البريد الإلكتروني',
      status: 'available',
      automationTasks: ['Auto-classify emails', 'Smart replies', 'Schedule sending'],
      automationTasksAr: ['تصنيف الإيميلات تلقائياً', 'ردود ذكية', 'جدولة الإرسال'],
      benefits: [
        'Save 2+ hours daily on email management',
        'Never miss important emails',
        'Auto-organize inbox by priority',
        'Smart reply suggestions'
      ],
      benefitsAr: [
        'وفر أكثر من ساعتين يومياً في إدارة البريد',
        'لن تفوتك أي رسالة مهمة',
        'تنظيم تلقائي حسب الأولوية',
        'اقتراحات ردود ذكية'
      ],
      tools: ['Gmail API', 'Natural Language Processing', 'Smart Filters', 'Auto-categorization'],
      toolsAr: ['Gmail API', 'معالجة اللغة الطبيعية', 'فلاتر ذكية', 'تصنيف تلقائي'],
      howItWorks: [
        'Connect your Gmail account securely',
        'Agent analyzes your email patterns',
        'Automatically categorizes incoming emails',
        'Suggests replies and actions'
      ],
      howItWorksAr: [
        'اربط حساب Gmail بشكل آمن',
        'الوكيل يحلل أنماط بريدك',
        'يصنف الرسائل الواردة تلقائياً',
        'يقترح ردود وإجراءات'
      ]
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      nameAr: 'واتساب',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      color: '#25D366',
      category: 'communication',
      isConnected: false,
      description: 'Messaging automation',
      descriptionAr: 'أتمتة الرسائل',
      status: 'available',
      automationTasks: ['Auto-reply messages', 'Send broadcasts', 'Schedule messages'],
      automationTasksAr: ['الرد التلقائي', 'إرسال رسائل جماعية', 'جدولة الرسائل'],
      benefits: [
        'Instant auto-replies to customers',
        'Schedule messages for perfect timing',
        'Broadcast to multiple contacts',
        'Never miss a customer message'
      ],
      benefitsAr: [
        'ردود فورية تلقائية للعملاء',
        'جدولة الرسائل في الوقت المثالي',
        'إرسال جماعي لعدة جهات اتصال',
        'لن تفوتك رسالة عميل'
      ],
      tools: ['WhatsApp Business API', 'Message Templates', 'Auto-responder', 'Broadcast System'],
      toolsAr: ['WhatsApp Business API', 'قوالب الرسائل', 'الرد التلقائي', 'نظام البث'],
      howItWorks: [
        'Connect WhatsApp Business account',
        'Set up auto-reply templates',
        'Agent responds to common queries',
        'Schedule broadcasts and reminders'
      ],
      howItWorksAr: [
        'اربط حساب واتساب بزنس',
        'أنشئ قوالب الرد التلقائي',
        'الوكيل يرد على الاستفسارات الشائعة',
        'جدولة البث والتذكيرات'
      ]
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      nameAr: 'مستندات قوقل',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png',
      color: '#4285F4',
      category: 'productivity',
      isConnected: false,
      description: 'Document creation and editing',
      descriptionAr: 'إنشاء وتحرير المستندات',
      status: 'available',
      automationTasks: ['Auto-generate documents', 'Format content', 'Export reports'],
      automationTasksAr: ['إنشاء المستندات تلقائياً', 'تنسيق المحتوى', 'تصدير التقارير'],
      benefits: [
        'Auto-generate reports from data',
        'Consistent document formatting',
        'Quick content creation',
        'Export to multiple formats'
      ],
      benefitsAr: [
        'إنشاء تقارير تلقائية من البيانات',
        'تنسيق موحد للمستندات',
        'إنشاء محتوى سريع',
        'تصدير لصيغ متعددة'
      ],
      tools: ['Google Docs API', 'Document Templates', 'Auto-formatting', 'Content Generator'],
      toolsAr: ['Google Docs API', 'قوالب المستندات', 'تنسيق تلقائي', 'مولد المحتوى'],
      howItWorks: [
        'Connect Google Docs account',
        'Choose document templates',
        'Agent generates content automatically',
        'Format and export as needed'
      ],
      howItWorksAr: [
        'اربط حساب مستندات قوقل',
        'اختر قوالب المستندات',
        'الوكيل ينشئ المحتوى تلقائياً',
        'تنسيق وتصدير حسب الحاجة'
      ]
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      nameAr: 'قوقل درايف',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png',
      color: '#0F9D58',
      category: 'productivity',
      isConnected: false,
      description: 'File storage and sharing',
      descriptionAr: 'تخزين ومشاركة الملفات',
      status: 'available',
      automationTasks: ['Auto-organize files', 'Backup documents', 'Share folders'],
      automationTasksAr: ['تنظيم الملفات تلقائياً', 'نسخ احتياطي', 'مشاركة المجلدات'],
      benefits: [
        'Auto-organize files by type',
        'Automatic backup scheduling',
        'Smart folder sharing',
        'Never lose important files'
      ],
      benefitsAr: [
        'تنظيم تلقائي حسب النوع',
        'جدولة نسخ احتياطي تلقائية',
        'مشاركة ذكية للمجلدات',
        'لن تفقد ملفات مهمة'
      ],
      tools: ['Google Drive API', 'File Organizer', 'Auto-backup', 'Smart Sharing'],
      toolsAr: ['Google Drive API', 'منظم الملفات', 'نسخ احتياطي تلقائي', 'مشاركة ذكية'],
      howItWorks: [
        'Connect Google Drive account',
        'Set organization rules',
        'Agent organizes files automatically',
        'Schedule backups and sharing'
      ],
      howItWorksAr: [
        'اربط حساب قوقل درايف',
        'حدد قواعد التنظيم',
        'الوكيل ينظم الملفات تلقائياً',
        'جدولة النسخ الاحتياطي والمشاركة'
      ]
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      nameAr: 'جداول قوقل',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png',
      color: '#0F9D58',
      category: 'productivity',
      isConnected: false,
      description: 'Spreadsheet automation',
      descriptionAr: 'أتمتة الجداول',
      status: 'available',
      automationTasks: ['Generate reports', 'Auto-calculate', 'Create charts'],
      automationTasksAr: ['إنشاء التقارير', 'حساب تلقائي', 'إنشاء الرسوم البيانية'],
      benefits: [
        'Auto-generate data reports',
        'Real-time calculations',
        'Visual charts and graphs',
        'Data analysis automation'
      ],
      benefitsAr: [
        'إنشاء تقارير بيانات تلقائية',
        'حسابات فورية',
        'رسوم بيانية مرئية',
        'أتمتة تحليل البيانات'
      ],
      tools: ['Google Sheets API', 'Formula Generator', 'Chart Creator', 'Data Analyzer'],
      toolsAr: ['Google Sheets API', 'مولد الصيغ', 'منشئ الرسوم', 'محلل البيانات'],
      howItWorks: [
        'Connect Google Sheets account',
        'Import your data',
        'Agent creates formulas and charts',
        'Generate automated reports'
      ],
      howItWorksAr: [
        'اربط حساب جداول قوقل',
        'استورد بياناتك',
        'الوكيل ينشئ الصيغ والرسوم',
        'إنشاء تقارير تلقائية'
      ]
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      nameAr: 'تقويم قوقل',
      logoUrl: 'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png',
      color: '#4285F4',
      category: 'productivity',
      isConnected: false,
      description: 'Schedule and meeting management',
      descriptionAr: 'إدارة المواعيد والاجتماعات',
      status: 'available',
      automationTasks: ['Auto-schedule meetings', 'Send reminders', 'Sync events'],
      automationTasksAr: ['جدولة الاجتماعات تلقائياً', 'إرسال التذكيرات', 'مزامنة الأحداث'],
      benefits: [
        'Smart meeting scheduling',
        'Automatic reminders',
        'Conflict detection',
        'Multi-calendar sync'
      ],
      benefitsAr: [
        'جدولة ذكية للاجتماعات',
        'تذكيرات تلقائية',
        'كشف التعارضات',
        'مزامنة عدة تقاويم'
      ],
      tools: ['Google Calendar API', 'Smart Scheduler', 'Reminder System', 'Conflict Detector'],
      toolsAr: ['Google Calendar API', 'جدولة ذكية', 'نظام التذكيرات', 'كاشف التعارضات'],
      howItWorks: [
        'Connect Google Calendar',
        'Set availability preferences',
        'Agent schedules meetings automatically',
        'Sends reminders before events'
      ],
      howItWorksAr: [
        'اربط تقويم قوقل',
        'حدد أوقات التوفر',
        'الوكيل يجدول الاجتماعات تلقائياً',
        'يرسل تذكيرات قبل المواعيد'
      ]
    },
    {
      id: 'notion',
      name: 'Notion',
      nameAr: 'نوشن',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      color: '#000000',
      category: 'productivity',
      isConnected: false,
      description: 'Workspace and notes management',
      descriptionAr: 'إدارة مساحة العمل والملاحظات',
      status: 'available',
      automationTasks: ['Create pages', 'Update databases', 'Organize notes'],
      automationTasksAr: ['إنشاء الصفحات', 'تحديث قواعد البيانات', 'تنظيم الملاحظات'],
      benefits: [
        'Auto-create project pages',
        'Database auto-updates',
        'Smart note organization',
        'Template automation'
      ],
      benefitsAr: [
        'إنشاء صفحات المشاريع تلقائياً',
        'تحديثات تلقائية لقواعد البيانات',
        'تنظيم ذكي للملاحظات',
        'أتمتة القوالب'
      ],
      tools: ['Notion API', 'Page Generator', 'Database Manager', 'Template System'],
      toolsAr: ['Notion API', 'مولد الصفحات', 'مدير قواعد البيانات', 'نظام القوالب'],
      howItWorks: [
        'Connect Notion workspace',
        'Set up templates',
        'Agent creates and updates pages',
        'Organize content automatically'
      ],
      howItWorksAr: [
        'اربط مساحة عمل نوشن',
        'أنشئ القوالب',
        'الوكيل ينشئ ويحدث الصفحات',
        'تنظيم المحتوى تلقائياً'
      ]
    },
    {
      id: 'trello',
      name: 'Trello',
      nameAr: 'تريلو',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/trello.svg',
      color: '#0079BF',
      category: 'productivity',
      isConnected: false,
      description: 'Project management',
      descriptionAr: 'إدارة المشاريع',
      status: 'available',
      automationTasks: ['Create cards', 'Move tasks', 'Assign members'],
      automationTasksAr: ['إنشاء البطاقات', 'نقل المهام', 'تعيين الأعضاء'],
      benefits: [
        'Auto-create task cards',
        'Smart task assignment',
        'Progress tracking',
        'Deadline reminders'
      ],
      benefitsAr: [
        'إنشاء بطاقات المهام تلقائياً',
        'تعيين ذكي للمهام',
        'تتبع التقدم',
        'تذكيرات المواعيد النهائية'
      ],
      tools: ['Trello API', 'Card Creator', 'Task Automator', 'Assignment System'],
      toolsAr: ['Trello API', 'منشئ البطاقات', 'مؤتمت المهام', 'نظام التعيين'],
      howItWorks: [
        'Connect Trello board',
        'Set automation rules',
        'Agent creates and moves cards',
        'Assigns tasks to team members'
      ],
      howItWorksAr: [
        'اربط لوحة تريلو',
        'حدد قواعد الأتمتة',
        'الوكيل ينشئ وينقل البطاقات',
        'يعين المهام لأعضاء الفريق'
      ]
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      nameAr: 'دروب بوكس',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/dropbox-1.svg',
      color: '#0061FF',
      category: 'productivity',
      isConnected: false,
      description: 'Cloud storage',
      descriptionAr: 'التخزين السحابي',
      status: 'coming-soon',
      automationTasks: ['Auto-sync files', 'Share folders', 'Backup data'],
      automationTasksAr: ['مزامنة الملفات تلقائياً', 'مشاركة المجلدات', 'نسخ احتياطي'],
      benefits: [
        'Automatic file synchronization',
        'Smart folder sharing',
        'Scheduled backups',
        'Version control'
      ],
      benefitsAr: [
        'مزامنة تلقائية للملفات',
        'مشاركة ذكية للمجلدات',
        'نسخ احتياطي مجدول',
        'التحكم في الإصدارات'
      ],
      tools: ['Dropbox API', 'Sync Engine', 'Backup Scheduler', 'Share Manager'],
      toolsAr: ['Dropbox API', 'محرك المزامنة', 'جدولة النسخ الاحتياطي', 'مدير المشاركة'],
      howItWorks: [
        'Connect Dropbox account',
        'Set sync preferences',
        'Agent syncs files automatically',
        'Schedule backups and sharing'
      ],
      howItWorksAr: [
        'اربط حساب دروب بوكس',
        'حدد تفضيلات المزامنة',
        'الوكيل يزامن الملفات تلقائياً',
        'جدولة النسخ الاحتياطي والمشاركة'
      ]
    },
    {
      id: 'asana',
      name: 'Asana',
      nameAr: 'أسانا',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/asana-logo.svg',
      color: '#F06A6A',
      category: 'productivity',
      isConnected: false,
      description: 'Task management',
      descriptionAr: 'إدارة المهام',
      status: 'coming-soon',
      automationTasks: ['Create tasks', 'Update status', 'Assign projects'],
      automationTasksAr: ['إنشاء المهام', 'تحديث الحالة', 'تعيين المشاريع'],
      benefits: [
        'Auto-create project tasks',
        'Status updates',
        'Team assignment',
        'Progress tracking'
      ],
      benefitsAr: [
        'إنشاء مهام المشروع تلقائياً',
        'تحديثات الحالة',
        'تعيين الفريق',
        'تتبع التقدم'
      ],
      tools: ['Asana API', 'Task Creator', 'Status Tracker', 'Assignment Engine'],
      toolsAr: ['Asana API', 'منشئ المهام', 'متتبع الحالة', 'محرك التعيين'],
      howItWorks: [
        'Connect Asana workspace',
        'Define task templates',
        'Agent creates tasks automatically',
        'Updates status and assigns team'
      ],
      howItWorksAr: [
        'اربط مساحة عمل أسانا',
        'حدد قوالب المهام',
        'الوكيل ينشئ المهام تلقائياً',
        'يحدث الحالة ويعين الفريق'
      ]
    },
    {
      id: 'slack',
      name: 'Slack',
      nameAr: 'سلاك',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
      color: '#4A154B',
      category: 'communication',
      isConnected: false,
      description: 'Team communication',
      descriptionAr: 'التواصل الجماعي',
      status: 'available',
      automationTasks: ['Send notifications', 'Create channels', 'Post updates'],
      automationTasksAr: ['إرسال الإشعارات', 'إنشاء القنوات', 'نشر التحديثات'],
      benefits: [
        'Auto-send team notifications',
        'Channel management',
        'Scheduled announcements',
        'Bot integration'
      ],
      benefitsAr: [
        'إرسال إشعارات الفريق تلقائياً',
        'إدارة القنوات',
        'إعلانات مجدولة',
        'تكامل البوت'
      ],
      tools: ['Slack API', 'Bot Framework', 'Notification System', 'Channel Manager'],
      toolsAr: ['Slack API', 'إطار البوت', 'نظام الإشعارات', 'مدير القنوات'],
      howItWorks: [
        'Connect Slack workspace',
        'Set up notification rules',
        'Agent sends messages automatically',
        'Manages channels and updates'
      ],
      howItWorksAr: [
        'اربط مساحة عمل سلاك',
        'حدد قواعد الإشعارات',
        'الوكيل يرسل الرسائل تلقائياً',
        'يدير القنوات والتحديثات'
      ]
    },
    {
      id: 'telegram',
      name: 'Telegram',
      nameAr: 'تيليجرام',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      color: '#229ED9',
      category: 'communication',
      isConnected: false,
      description: 'Messaging and channels',
      descriptionAr: 'الرسائل والقنوات',
      status: 'available',
      automationTasks: ['Send messages', 'Manage channels', 'Auto-respond'],
      automationTasksAr: ['إرسال الرسائل', 'إدارة القنوات', 'الرد التلقائي'],
      benefits: [
        'Auto-reply to messages',
        'Channel broadcasting',
        'Scheduled posts',
        'Bot commands'
      ],
      benefitsAr: [
        'الرد التلقائي على الرسائل',
        'البث عبر القنوات',
        'منشورات مجدولة',
        'أوامر البوت'
      ],
      tools: ['Telegram Bot API', 'Auto-responder', 'Broadcast System', 'Command Handler'],
      toolsAr: ['Telegram Bot API', 'الرد التلقائي', 'نظام البث', 'معالج الأوامر'],
      howItWorks: [
        'Create Telegram bot',
        'Connect to your channel',
        'Agent responds automatically',
        'Schedule broadcasts and posts'
      ],
      howItWorksAr: [
        'أنشئ بوت تيليجرام',
        'اربطه بقناتك',
        'الوكيل يرد تلقائياً',
        'جدولة البث والمنشورات'
      ]
    },
    {
      id: 'discord',
      name: 'Discord',
      nameAr: 'ديسكورد',
      logoUrl: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
      color: '#5865F2',
      category: 'communication',
      isConnected: false,
      description: 'Community management',
      descriptionAr: 'إدارة المجتمعات',
      status: 'coming-soon',
      automationTasks: ['Moderate channels', 'Send announcements', 'Manage roles'],
      automationTasksAr: ['إدارة القنوات', 'إرسال الإعلانات', 'إدارة الأدوار'],
      benefits: [
        'Auto-moderation',
        'Role management',
        'Scheduled announcements',
        'Welcome messages'
      ],
      benefitsAr: [
        'إشراف تلقائي',
        'إدارة الأدوار',
        'إعلانات مجدولة',
        'رسائل ترحيب'
      ],
      tools: ['Discord Bot API', 'Moderation Tools', 'Role Manager', 'Announcement System'],
      toolsAr: ['Discord Bot API', 'أدوات الإشراف', 'مدير الأدوار', 'نظام الإعلانات'],
      howItWorks: [
        'Create Discord bot',
        'Add to your server',
        'Set moderation rules',
        'Agent manages community automatically'
      ],
      howItWorksAr: [
        'أنشئ بوت ديسكورد',
        'أضفه لخادمك',
        'حدد قواعد الإشراف',
        'الوكيل يدير المجتمع تلقائياً'
      ]
    },
    {
      id: 'zoom',
      name: 'Zoom',
      nameAr: 'زووم',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/zoom-app.svg',
      color: '#2D8CFF',
      category: 'communication',
      isConnected: false,
      description: 'Video conferencing',
      descriptionAr: 'الاجتماعات المرئية',
      status: 'coming-soon',
      automationTasks: ['Schedule meetings', 'Send invites', 'Record sessions'],
      automationTasksAr: ['جدولة الاجتماعات', 'إرسال الدعوات', 'تسجيل الجلسات'],
      benefits: [
        'Auto-schedule meetings',
        'Send invites automatically',
        'Record and transcribe',
        'Meeting reminders'
      ],
      benefitsAr: [
        'جدولة الاجتماعات تلقائياً',
        'إرسال الدعوات تلقائياً',
        'تسجيل وتفريغ نصي',
        'تذكيرات الاجتماعات'
      ],
      tools: ['Zoom API', 'Meeting Scheduler', 'Recording System', 'Invite Manager'],
      toolsAr: ['Zoom API', 'جدولة الاجتماعات', 'نظام التسجيل', 'مدير الدعوات'],
      howItWorks: [
        'Connect Zoom account',
        'Set meeting preferences',
        'Agent schedules automatically',
        'Sends invites and reminders'
      ],
      howItWorksAr: [
        'اربط حساب زووم',
        'حدد تفضيلات الاجتماعات',
        'الوكيل يجدول تلقائياً',
        'يرسل الدعوات والتذكيرات'
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      nameAr: 'تويتر',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png',
      color: '#000000',
      category: 'marketing',
      isConnected: false,
      description: 'Social media posting and engagement',
      descriptionAr: 'النشر والتفاعل على وسائل التواصل',
      status: 'available',
      automationTasks: ['Schedule tweets', 'Auto-reply', 'Track mentions'],
      automationTasksAr: ['جدولة التغريدات', 'الرد التلقائي', 'تتبع الإشارات'],
      benefits: [
        'Schedule tweets in advance',
        'Auto-reply to mentions',
        'Track brand mentions',
        'Engagement analytics'
      ],
      benefitsAr: [
        'جدولة التغريدات مسبقاً',
        'الرد التلقائي على الإشارات',
        'تتبع إشارات العلامة التجارية',
        'تحليلات التفاعل'
      ],
      tools: ['Twitter API', 'Tweet Scheduler', 'Auto-responder', 'Mention Tracker'],
      toolsAr: ['Twitter API', 'جدولة التغريدات', 'الرد التلقائي', 'متتبع الإشارات'],
      howItWorks: [
        'Connect Twitter account',
        'Schedule your tweets',
        'Agent posts automatically',
        'Responds to mentions and DMs'
      ],
      howItWorksAr: [
        'اربط حساب تويتر',
        'جدول تغريداتك',
        'الوكيل ينشر تلقائياً',
        'يرد على الإشارات والرسائل'
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      nameAr: 'لينكد إن',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg',
      color: '#0A66C2',
      category: 'marketing',
      isConnected: false,
      description: 'Professional networking',
      descriptionAr: 'التواصل المهني',
      status: 'available',
      automationTasks: ['Post content', 'Connect with leads', 'Share articles'],
      automationTasksAr: ['نشر المحتوى', 'التواصل مع العملاء', 'مشاركة المقالات'],
      benefits: [
        'Auto-post professional content',
        'Connect with leads',
        'Share industry articles',
        'Network growth'
      ],
      benefitsAr: [
        'نشر محتوى مهني تلقائياً',
        'التواصل مع العملاء المحتملين',
        'مشاركة مقالات الصناعة',
        'نمو الشبكة'
      ],
      tools: ['LinkedIn API', 'Content Scheduler', 'Connection Manager', 'Article Sharer'],
      toolsAr: ['LinkedIn API', 'جدولة المحتوى', 'مدير الاتصالات', 'مشارك المقالات'],
      howItWorks: [
        'Connect LinkedIn profile',
        'Schedule professional posts',
        'Agent shares content automatically',
        'Connects with relevant leads'
      ],
      howItWorksAr: [
        'اربط ملف لينكد إن',
        'جدول المنشورات المهنية',
        'الوكيل يشارك المحتوى تلقائياً',
        'يتواصل مع العملاء المحتملين'
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      nameAr: 'يوتيوب',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg',
      color: '#FF0000',
      category: 'marketing',
      isConnected: false,
      description: 'Video content management',
      descriptionAr: 'إدارة محتوى الفيديو',
      status: 'available',
      automationTasks: ['Upload videos', 'Schedule posts', 'Manage comments'],
      automationTasksAr: ['رفع الفيديوهات', 'جدولة النشر', 'إدارة التعليقات'],
      benefits: [
        'Auto-upload videos',
        'Schedule video releases',
        'Moderate comments',
        'Analytics tracking'
      ],
      benefitsAr: [
        'رفع الفيديوهات تلقائياً',
        'جدولة إصدار الفيديوهات',
        'إدارة التعليقات',
        'تتبع التحليلات'
      ],
      tools: ['YouTube API', 'Video Uploader', 'Comment Moderator', 'Analytics Dashboard'],
      toolsAr: ['YouTube API', 'رافع الفيديو', 'مشرف التعليقات', 'لوحة التحليلات'],
      howItWorks: [
        'Connect YouTube channel',
        'Upload and schedule videos',
        'Agent publishes automatically',
        'Moderates comments and tracks analytics'
      ],
      howItWorksAr: [
        'اربط قناة يوتيوب',
        'ارفع وجدول الفيديوهات',
        'الوكيل ينشر تلقائياً',
        'يدير التعليقات ويتتبع التحليلات'
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      nameAr: 'إنستغرام',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/instagram-2016-5.svg',
      color: '#E4405F',
      category: 'marketing',
      isConnected: false,
      description: 'Visual content sharing',
      descriptionAr: 'مشاركة المحتوى المرئي',
      status: 'coming-soon',
      automationTasks: ['Schedule posts', 'Auto-reply DMs', 'Track hashtags'],
      automationTasksAr: ['جدولة المنشورات', 'الرد على الرسائل', 'تتبع الهاشتاقات'],
      benefits: [
        'Schedule posts and stories',
        'Auto-reply to DMs',
        'Hashtag tracking',
        'Engagement analytics'
      ],
      benefitsAr: [
        'جدولة المنشورات والقصص',
        'الرد التلقائي على الرسائل',
        'تتبع الهاشتاقات',
        'تحليلات التفاعل'
      ],
      tools: ['Instagram API', 'Post Scheduler', 'DM Auto-responder', 'Hashtag Tracker'],
      toolsAr: ['Instagram API', 'جدولة المنشورات', 'الرد التلقائي', 'متتبع الهاشتاقات'],
      howItWorks: [
        'Connect Instagram account',
        'Schedule posts and stories',
        'Agent publishes automatically',
        'Responds to DMs and tracks hashtags'
      ],
      howItWorksAr: [
        'اربط حساب إنستغرام',
        'جدول المنشورات والقصص',
        'الوكيل ينشر تلقائياً',
        'يرد على الرسائل ويتتبع الهاشتاقات'
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook',
      nameAr: 'فيسبوك',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/facebook-3.svg',
      color: '#1877F2',
      category: 'marketing',
      isConnected: false,
      description: 'Social media marketing',
      descriptionAr: 'التسويق عبر وسائل التواصل',
      status: 'coming-soon',
      automationTasks: ['Post updates', 'Manage pages', 'Run ads'],
      automationTasksAr: ['نشر التحديثات', 'إدارة الصفحات', 'إدارة الإعلانات'],
      benefits: [
        'Auto-post updates',
        'Page management',
        'Ad campaign automation',
        'Audience insights'
      ],
      benefitsAr: [
        'نشر التحديثات تلقائياً',
        'إدارة الصفحات',
        'أتمتة الحملات الإعلانية',
        'رؤى الجمهور'
      ],
      tools: ['Facebook API', 'Post Scheduler', 'Page Manager', 'Ad Automator'],
      toolsAr: ['Facebook API', 'جدولة المنشورات', 'مدير الصفحات', 'مؤتمت الإعلانات'],
      howItWorks: [
        'Connect Facebook page',
        'Schedule posts and ads',
        'Agent manages automatically',
        'Tracks engagement and insights'
      ],
      howItWorksAr: [
        'اربط صفحة فيسبوك',
        'جدول المنشورات والإعلانات',
        'الوكيل يدير تلقائياً',
        'يتتبع التفاعل والرؤى'
      ]
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      nameAr: 'ميل تشيمب',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/mailchimp.svg',
      color: '#FFE01B',
      category: 'marketing',
      isConnected: false,
      description: 'Email marketing',
      descriptionAr: 'التسويق عبر البريد الإلكتروني',
      status: 'coming-soon',
      automationTasks: ['Send campaigns', 'Manage lists', 'Track analytics'],
      automationTasksAr: ['إرسال الحملات', 'إدارة القوائم', 'تتبع التحليلات'],
      benefits: [
        'Automated email campaigns',
        'List segmentation',
        'A/B testing',
        'Performance analytics'
      ],
      benefitsAr: [
        'حملات بريد إلكتروني تلقائية',
        'تقسيم القوائم',
        'اختبار A/B',
        'تحليلات الأداء'
      ],
      tools: ['Mailchimp API', 'Campaign Builder', 'List Manager', 'Analytics Dashboard'],
      toolsAr: ['Mailchimp API', 'منشئ الحملات', 'مدير القوائم', 'لوحة التحليلات'],
      howItWorks: [
        'Connect Mailchimp account',
        'Create email campaigns',
        'Agent sends automatically',
        'Tracks opens and clicks'
      ],
      howItWorksAr: [
        'اربط حساب ميل تشيمب',
        'أنشئ حملات البريد',
        'الوكيل يرسل تلقائياً',
        'يتتبع الفتح والنقرات'
      ]
    },
    {
      id: 'github',
      name: 'GitHub',
      nameAr: 'جيت هاب',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/github-icon-2.svg',
      color: '#181717',
      category: 'technical',
      isConnected: false,
      description: 'Code repository management',
      descriptionAr: 'إدارة مستودعات الأكواد',
      status: 'available',
      automationTasks: ['Create repos', 'Manage issues', 'Deploy code'],
      automationTasksAr: ['إنشاء المستودعات', 'إدارة المشاكل', 'نشر الأكواد'],
      benefits: [
        'Auto-create repositories',
        'Issue management',
        'Automated deployments',
        'Code review automation'
      ],
      benefitsAr: [
        'إنشاء المستودعات تلقائياً',
        'إدارة المشاكل',
        'نشر تلقائي',
        'أتمتة مراجعة الأكواد'
      ],
      tools: ['GitHub API', 'Repo Manager', 'Issue Tracker', 'CI/CD Pipeline'],
      toolsAr: ['GitHub API', 'مدير المستودعات', 'متتبع المشاكل', 'خط CI/CD'],
      howItWorks: [
        'Connect GitHub account',
        'Set up automation rules',
        'Agent manages repos automatically',
        'Handles issues and deployments'
      ],
      howItWorksAr: [
        'اربط حساب جيت هاب',
        'حدد قواعد الأتمتة',
        'الوكيل يدير المستودعات تلقائياً',
        'يتعامل مع المشاكل والنشر'
      ]
    },
    {
      id: 'zapier',
      name: 'Zapier',
      nameAr: 'زابير',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/zapier-1.svg',
      color: '#FF4A00',
      category: 'technical',
      isConnected: false,
      description: 'Workflow automation',
      descriptionAr: 'أتمتة سير العمل',
      status: 'available',
      automationTasks: ['Create workflows', 'Connect apps', 'Automate tasks'],
      automationTasksAr: ['إنشاء سير العمل', 'ربط التطبيقات', 'أتمتة المهام'],
      benefits: [
        'Connect 5000+ apps',
        'Multi-step workflows',
        'No-code automation',
        'Trigger-based actions'
      ],
      benefitsAr: [
        'ربط أكثر من 5000 تطبيق',
        'سير عمل متعدد الخطوات',
        'أتمتة بدون كود',
        'إجراءات مبنية على المحفزات'
      ],
      tools: ['Zapier API', 'Workflow Builder', 'App Connector', 'Trigger System'],
      toolsAr: ['Zapier API', 'منشئ سير العمل', 'موصل التطبيقات', 'نظام المحفزات'],
      howItWorks: [
        'Connect Zapier account',
        'Create automation workflows',
        'Agent executes automatically',
        'Connects multiple apps seamlessly'
      ],
      howItWorksAr: [
        'اربط حساب زابير',
        'أنشئ سير عمل الأتمتة',
        'الوكيل ينفذ تلقائياً',
        'يربط عدة تطبيقات بسلاسة'
      ]
    },
    {
      id: 'make',
      name: 'Make',
      nameAr: 'ميك',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/make-seeklogo.svg',
      color: '#6D00CC',
      category: 'technical',
      isConnected: false,
      description: 'Advanced automation',
      descriptionAr: 'أتمتة متقدمة',
      status: 'coming-soon',
      automationTasks: ['Build scenarios', 'Connect services', 'Process data'],
      automationTasksAr: ['بناء السيناريوهات', 'ربط الخدمات', 'معالجة البيانات'],
      benefits: [
        'Visual automation builder',
        'Complex workflows',
        'Data transformation',
        'Error handling'
      ],
      benefitsAr: [
        'منشئ أتمتة مرئي',
        'سير عمل معقد',
        'تحويل البيانات',
        'معالجة الأخطاء'
      ],
      tools: ['Make API', 'Scenario Builder', 'Data Processor', 'Error Handler'],
      toolsAr: ['Make API', 'منشئ السيناريوهات', 'معالج البيانات', 'معالج الأخطاء'],
      howItWorks: [
        'Connect Make account',
        'Build visual scenarios',
        'Agent executes workflows',
        'Handles complex automations'
      ],
      howItWorksAr: [
        'اربط حساب ميك',
        'ابنِ سيناريوهات مرئية',
        'الوكيل ينفذ سير العمل',
        'يتعامل مع الأتمتة المعقدة'
      ]
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      nameAr: 'جيت لاب',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/gitlab.svg',
      color: '#FC6D26',
      category: 'technical',
      isConnected: false,
      description: 'DevOps platform',
      descriptionAr: 'منصة DevOps',
      status: 'coming-soon',
      automationTasks: ['Manage pipelines', 'Deploy apps', 'Track issues'],
      automationTasksAr: ['إدارة خطوط الإنتاج', 'نشر التطبيقات', 'تتبع المشاكل'],
      benefits: [
        'CI/CD automation',
        'Pipeline management',
        'Automated testing',
        'Deployment automation'
      ],
      benefitsAr: [
        'أتمتة CI/CD',
        'إدارة خطوط الإنتاج',
        'اختبار تلقائي',
        'أتمتة النشر'
      ],
      tools: ['GitLab API', 'Pipeline Manager', 'CI/CD System', 'Issue Tracker'],
      toolsAr: ['GitLab API', 'مدير خطوط الإنتاج', 'نظام CI/CD', 'متتبع المشاكل'],
      howItWorks: [
        'Connect GitLab account',
        'Set up pipelines',
        'Agent manages CI/CD automatically',
        'Deploys and tests code'
      ],
      howItWorksAr: [
        'اربط حساب جيت لاب',
        'أنشئ خطوط الإنتاج',
        'الوكيل يدير CI/CD تلقائياً',
        'ينشر ويختبر الأكواد'
      ]
    },
    {
      id: 'jira',
      name: 'Jira',
      nameAr: 'جيرا',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/jira-3.svg',
      color: '#0052CC',
      category: 'technical',
      isConnected: false,
      description: 'Issue tracking',
      descriptionAr: 'تتبع المشاكل',
      status: 'coming-soon',
      automationTasks: ['Create tickets', 'Update status', 'Assign tasks'],
      automationTasksAr: ['إنشاء التذاكر', 'تحديث الحالة', 'تعيين المهام'],
      benefits: [
        'Auto-create tickets',
        'Status automation',
        'Task assignment',
        'Sprint management'
      ],
      benefitsAr: [
        'إنشاء التذاكر تلقائياً',
        'أتمتة الحالة',
        'تعيين المهام',
        'إدارة السبرنت'
      ],
      tools: ['Jira API', 'Ticket Creator', 'Status Tracker', 'Sprint Manager'],
      toolsAr: ['Jira API', 'منشئ التذاكر', 'متتبع الحالة', 'مدير السبرنت'],
      howItWorks: [
        'Connect Jira workspace',
        'Set automation rules',
        'Agent creates tickets automatically',
        'Updates status and assigns tasks'
      ],
      howItWorksAr: [
        'اربط مساحة عمل جيرا',
        'حدد قواعد الأتمتة',
        'الوكيل ينشئ التذاكر تلقائياً',
        'يحدث الحالة ويعين المهام'
      ]
    },
    {
      id: 'stripe',
      name: 'Stripe',
      nameAr: 'سترايب',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
      color: '#635BFF',
      category: 'financial',
      isConnected: false,
      description: 'Payment processing',
      descriptionAr: 'معالجة المدفوعات',
      status: 'available',
      automationTasks: ['Process payments', 'Send invoices', 'Track revenue'],
      automationTasksAr: ['معالجة المدفوعات', 'إرسال الفواتير', 'تتبع الإيرادات'],
      benefits: [
        'Automated payment processing',
        'Invoice generation',
        'Revenue tracking',
        'Subscription management'
      ],
      benefitsAr: [
        'معالجة مدفوعات تلقائية',
        'إنشاء الفواتير',
        'تتبع الإيرادات',
        'إدارة الاشتراكات'
      ],
      tools: ['Stripe API', 'Payment Processor', 'Invoice Generator', 'Revenue Tracker'],
      toolsAr: ['Stripe API', 'معالج المدفوعات', 'مولد الفواتير', 'متتبع الإيرادات'],
      howItWorks: [
        'Connect Stripe account',
        'Set up payment flows',
        'Agent processes payments automatically',
        'Generates invoices and tracks revenue'
      ],
      howItWorksAr: [
        'اربط حساب سترايب',
        'أنشئ تدفقات الدفع',
        'الوكيل يعالج المدفوعات تلقائياً',
        'ينشئ الفواتير ويتتبع الإيرادات'
      ]
    },
    {
      id: 'paypal',
      name: 'PayPal',
      nameAr: 'باي بال',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/paypal-2.svg',
      color: '#00457C',
      category: 'financial',
      isConnected: false,
      description: 'Online payments',
      descriptionAr: 'المدفوعات الإلكترونية',
      status: 'coming-soon',
      automationTasks: ['Accept payments', 'Send money', 'Generate reports'],
      automationTasksAr: ['قبول المدفوعات', 'إرسال الأموال', 'إنشاء التقارير'],
      benefits: [
        'Accept online payments',
        'Automated transfers',
        'Transaction reports',
        'Refund management'
      ],
      benefitsAr: [
        'قبول المدفوعات الإلكترونية',
        'تحويلات تلقائية',
        'تقارير المعاملات',
        'إدارة الاسترداد'
      ],
      tools: ['PayPal API', 'Payment Gateway', 'Transfer System', 'Report Generator'],
      toolsAr: ['PayPal API', 'بوابة الدفع', 'نظام التحويل', 'مولد التقارير'],
      howItWorks: [
        'Connect PayPal account',
        'Set up payment options',
        'Agent processes transactions',
        'Generates financial reports'
      ],
      howItWorksAr: [
        'اربط حساب باي بال',
        'حدد خيارات الدفع',
        'الوكيل يعالج المعاملات',
        'ينشئ التقارير المالية'
      ]
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      nameAr: 'كويك بوكس',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/quickbooks-2.svg',
      color: '#2CA01C',
      category: 'financial',
      isConnected: false,
      description: 'Accounting software',
      descriptionAr: 'برنامج المحاسبة',
      status: 'coming-soon',
      automationTasks: ['Track expenses', 'Generate invoices', 'Financial reports'],
      automationTasksAr: ['تتبع المصروفات', 'إنشاء الفواتير', 'التقارير المالية'],
      benefits: [
        'Automated bookkeeping',
        'Expense tracking',
        'Invoice generation',
        'Financial reporting'
      ],
      benefitsAr: [
        'مسك دفاتر تلقائي',
        'تتبع المصروفات',
        'إنشاء الفواتير',
        'التقارير المالية'
      ],
      tools: ['QuickBooks API', 'Expense Tracker', 'Invoice Generator', 'Report Builder'],
      toolsAr: ['QuickBooks API', 'متتبع المصروفات', 'مولد الفواتير', 'منشئ التقارير'],
      howItWorks: [
        'Connect QuickBooks account',
        'Sync financial data',
        'Agent tracks expenses automatically',
        'Generates invoices and reports'
      ],
      howItWorksAr: [
        'اربط حساب كويك بوكس',
        'زامن البيانات المالية',
        'الوكيل يتتبع المصروفات تلقائياً',
        'ينشئ الفواتير والتقارير'
      ]
    },
    {
      id: 'xero',
      name: 'Xero',
      nameAr: 'زيرو',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/xero-2.svg',
      color: '#13B5EA',
      category: 'financial',
      isConnected: false,
      description: 'Cloud accounting',
      descriptionAr: 'المحاسبة السحابية',
      status: 'coming-soon',
      automationTasks: ['Manage accounts', 'Track invoices', 'Bank reconciliation'],
      automationTasksAr: ['إدارة الحسابات', 'تتبع الفواتير', 'تسوية البنوك'],
      benefits: [
        'Cloud-based accounting',
        'Real-time financial data',
        'Bank reconciliation',
        'Multi-currency support'
      ],
      benefitsAr: [
        'محاسبة سحابية',
        'بيانات مالية فورية',
        'تسوية بنكية',
        'دعم عملات متعددة'
      ],
      tools: ['Xero API', 'Account Manager', 'Invoice Tracker', 'Bank Reconciler'],
      toolsAr: ['Xero API', 'مدير الحسابات', 'متتبع الفواتير', 'مسوي البنوك'],
      howItWorks: [
        'Connect Xero account',
        'Sync bank accounts',
        'Agent manages accounting automatically',
        'Reconciles transactions and generates reports'
      ],
      howItWorksAr: [
        'اربط حساب زيرو',
        'زامن الحسابات البنكية',
        'الوكيل يدير المحاسبة تلقائياً',
        'يسوي المعاملات وينشئ التقارير'
      ]
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<AppConnection | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const INITIAL_SHOW = 14;

  const categories = [
    { id: 'all', nameEn: 'All Apps', nameAr: 'جميع التطبيقات', icon: 'ri-apps-line' },
    { id: 'productivity', nameEn: 'Productivity', nameAr: 'الإنتاجية', icon: 'ri-briefcase-line' },
    { id: 'communication', nameEn: 'Communication', nameAr: 'التواصل', icon: 'ri-chat-3-line' },
    { id: 'marketing', nameEn: 'Marketing', nameAr: 'التسويق', icon: 'ri-megaphone-line' },
    { id: 'technical', nameEn: 'Technical', nameAr: 'التقني', icon: 'ri-code-box-line' },
    { id: 'financial', nameEn: 'Financial', nameAr: 'المالي', icon: 'ri-money-dollar-circle-line' },
  ];

  const filteredConnections =
    selectedCategory === 'all'
      ? connections
      : connections.filter((conn) => conn.category === selectedCategory);

  const visibleConnections = showAll ? filteredConnections : filteredConnections.slice(0, INITIAL_SHOW);
  const hasMore = filteredConnections.length > INITIAL_SHOW;

  const handleConnect = (app: AppConnection) => {
    setSelectedApp(app);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  const handleConfirmConnection = () => {
    if (selectedApp) {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === selectedApp.id ? { ...conn, isConnected: !conn.isConnected } : conn
        )
      );
      setSelectedApp(null);
    }
  };

  const connectedCount = connections.filter((c) => c.isConnected).length;
  const availableCount = connections.filter((c) => c.status === 'available').length;
  const comingSoonCount = connections.filter((c) => c.status === 'coming-soon').length;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              isDark ? 'bg-teal-500/20' : 'bg-teal-50'
            }`}
          >
            <i className="ri-links-line text-xl text-teal-500"></i>
            <span className={`font-mono text-sm font-bold ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
              {isRTL ? 'ربط الحسابات' : 'Account Connections'}
            </span>
          </div>

          <h2 className={`font-mono text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isRTL ? 'اربط حساباتك وابدأ الأتمتة' : 'Connect Your Accounts and Start Automation'}
          </h2>

          <p className={`font-mono text-lg md:text-xl transition-colors duration-500 max-w-3xl mx-auto ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {isRTL
              ? 'اربط تطبيقاتك المفضلة ودع الوكلاء يديرون مهامك تلقائياً'
              : 'Connect your favorite apps and let agents manage your tasks automatically'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {[
              { value: connectedCount, label: isRTL ? 'متصل' : 'Connected', color: 'teal' },
              { value: availableCount, label: isRTL ? 'متاح الآن' : 'Available', color: 'green' },
              { value: comingSoonCount, label: isRTL ? 'قريباً' : 'Coming Soon', color: 'orange' },
            ].map((stat, i) => (
              <div key={i} className={`px-6 py-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <span className={`font-mono text-2xl font-bold text-${stat.color}-${isDark ? '400' : '600'}`}>{stat.value}</span>
                <span className={`font-mono text-sm mx-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setShowAll(false); }}
              className={`px-5 py-2 rounded-full font-mono text-sm font-bold transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                  : isDark
                  ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <i className={cat.icon}></i>
              {isRTL ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {visibleConnections.map((app) => (
            <div
              key={app.id}
              className="relative group"
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Icon Button */}
              <button
                onClick={() => handleConnect(app)}
                disabled={app.status === 'coming-soon'}
                className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer border-2 ${
                  app.isConnected
                    ? 'border-teal-400 shadow-lg shadow-teal-400/30 scale-105'
                    : app.status === 'coming-soon'
                    ? isDark
                      ? 'border-slate-700/40 bg-slate-800/30 opacity-50 cursor-not-allowed'
                      : 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                    : isDark
                    ? 'border-slate-700/40 bg-slate-800/50 hover:border-teal-500/60 hover:scale-110 hover:shadow-lg'
                    : 'border-slate-200 bg-white hover:border-teal-400 hover:scale-110 hover:shadow-lg shadow-sm'
                }`}
              >
                <img
                  src={app.logoUrl}
                  alt={app.name}
                  className="w-9 h-9 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.className = 'font-bold text-lg';
                      fallback.style.color = app.color;
                      fallback.textContent = app.name.charAt(0);
                      parent.appendChild(fallback);
                    }
                  }}
                />
                {/* Connected indicator */}
                {app.isConnected && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-white flex items-center justify-center">
                    <i className="ri-check-line text-white" style={{ fontSize: '8px' }}></i>
                  </span>
                )}
                {/* Coming soon indicator */}
                {app.status === 'coming-soon' && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 bg-orange-400 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Tooltip */}
              {hoveredApp === app.id && (
                <div
                  className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 px-3 py-2 rounded-xl shadow-xl whitespace-nowrap pointer-events-none ${
                    isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                  }`}
                >
                  <p className={`font-mono text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isRTL ? app.nameAr : app.name}
                  </p>
                  <p className={`font-mono text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {app.status === 'coming-soon'
                      ? isRTL ? '🔜 قريباً' : '🔜 Coming Soon'
                      : app.isConnected
                      ? isRTL ? '✅ متصل' : '✅ Connected'
                      : isRTL ? 'اضغط للربط' : 'Click to connect'}
                  </p>
                  {/* Arrow */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent ${isDark ? 'border-t-slate-800' : 'border-t-white'}`}></div>
                </div>
              )}
            </div>
          ))}

          {/* Show More Button */}
          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer border-2 border-dashed ${
                isDark
                  ? 'border-slate-600 text-slate-400 hover:border-teal-500 hover:text-teal-400 bg-slate-800/30'
                  : 'border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-600 bg-slate-50'
              }`}
            >
              <i className="ri-add-line text-xl"></i>
              <span className="font-mono text-xs font-bold mt-0.5">
                +{filteredConnections.length - INITIAL_SHOW}
              </span>
            </button>
          )}

          {/* Show Less Button */}
          {showAll && hasMore && (
            <button
              onClick={() => setShowAll(false)}
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer border-2 border-dashed ${
                isDark
                  ? 'border-slate-600 text-slate-400 hover:border-slate-500 bg-slate-800/30'
                  : 'border-slate-300 text-slate-500 hover:border-slate-400 bg-slate-50'
              }`}
            >
              <i className="ri-subtract-line text-xl"></i>
              <span className="font-mono text-xs font-bold mt-0.5">
                {isRTL ? 'أقل' : 'Less'}
              </span>
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-400"></span>
            <span className={`font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isRTL ? 'متصل' : 'Connected'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            <span className={`font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isRTL ? 'قريباً' : 'Coming Soon'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}></span>
            <span className={`font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isRTL ? 'متاح للربط' : 'Available'}
            </span>
          </div>
        </div>

        {/* Info Box */}
        <div className={`mt-4 p-6 rounded-2xl border-2 ${isDark ? 'bg-slate-800/40 border-slate-700/40' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
              <i className="ri-information-line text-2xl text-teal-500"></i>
            </div>
            <div>
              <h4 className={`font-mono text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isRTL ? 'كيف يعمل الربط؟' : 'How does connection work?'}
              </h4>
              <p className={`font-mono text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {isRTL
                  ? 'عند ربط حسابك، سيتمكن الوكلاء من الوصول إلى بياناتك بشكل آمن لتنفيذ المهام المطلوبة. جميع البيانات محمية ومشفرة، ويمكنك قطع الاتصال في أي وقت.'
                  : 'When you connect your account, agents will be able to securely access your data to perform requested tasks. All data is protected and encrypted, and you can disconnect at any time.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* App Connection Modal */}
      {selectedApp && (
        <AppConnectionModal
          app={selectedApp}
          isOpen={!!selectedApp}
          onClose={handleCloseModal}
          onConfirm={handleConfirmConnection}
        />
      )}
    </section>
  );
};

export default AccountConnectionsSection;