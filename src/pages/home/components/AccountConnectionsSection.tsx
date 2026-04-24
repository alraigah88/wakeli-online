import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../page';
import AppConnectionModal from './AppConnectionModal';
import { useAuth } from '../../../contexts/AuthContext';
import { UI_TO_DB_KEY, useIntegrations } from '../../../hooks/useIntegrations';

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
  const { user, isAuthenticated } = useAuth();
  const { enabledIntegrations, userStatusByKey, setStatus } = useIntegrations(user?.id);

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
      tools: ['Gmail API', 'AI Classifier', 'Auto Responder'],
      toolsAr: ['واجهة جيميل', 'مصنف ذكي', 'رد تلقائي'],
      howItWorks: [
        'Connect your Gmail account securely',
        'Choose automation rules and preferences',
        'AI manages your inbox automatically'
      ],
      howItWorksAr: [
        'اربط حساب جيميل بأمان',
        'اختر قواعد الأتمتة والتفضيلات',
        'الذكاء يدير بريدك تلقائياً'
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
      description: 'Customer messaging automation',
      descriptionAr: 'أتمتة رسائل العملاء',
      status: 'coming-soon',
      automationTasks: ['Auto-reply to messages', 'Send notifications', 'Customer support bot'],
      automationTasksAr: ['رد تلقائي على الرسائل', 'إرسال إشعارات', 'بوت دعم العملاء'],
      benefits: [
        '24/7 automated customer support',
        'Instant response to customers',
        'Bulk message broadcasting',
        'Lead generation automation'
      ],
      benefitsAr: [
        'دعم عملاء آلي 24/7',
        'رد فوري على العملاء',
        'إرسال رسائل جماعية',
        'أتمتة توليد العملاء المحتملين'
      ],
      tools: ['WhatsApp Business API', 'Chatbot AI', 'Message Scheduler'],
      toolsAr: ['واجهة واتساب بيزنس', 'بوت ذكي', 'جدولة الرسائل'],
      howItWorks: [
        'Connect WhatsApp Business account',
        'Set up automated responses',
        'Monitor and optimize conversations'
      ],
      howItWorksAr: [
        'اربط حساب واتساب بيزنس',
        'إعداد الردود التلقائية',
        'راقب وحسن المحادثات'
      ]
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      nameAr: 'مستندات جوجل',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Google_Docs_2020_Logo.svg',
      color: '#4285F4',
      category: 'productivity',
      isConnected: false,
      description: 'Document creation and management',
      descriptionAr: 'إنشاء وإدارة المستندات',
      status: 'available',
      automationTasks: ['Auto-generate reports', 'Template filling', 'Document sharing'],
      automationTasksAr: ['إنشاء تقارير تلقائياً', 'ملء القوالب', 'مشاركة المستندات'],
      benefits: [
        'Automatically generate professional documents',
        'Fill templates with your data',
        'Collaborative document workflows',
        'Version control and tracking'
      ],
      benefitsAr: [
        'إنشاء مستندات احترافية تلقائياً',
        'ملء القوالب ببياناتك',
        'تدفقات عمل تعاونية',
        'تتبع الإصدارات والتغييرات'
      ],
      tools: ['Google Docs API', 'Template Engine', 'Document Generator'],
      toolsAr: ['واجهة المستندات', 'محرك القوالب', 'مولد المستندات'],
      howItWorks: [
        'Connect your Google account',
        'Select document templates',
        'AI generates and manages documents'
      ],
      howItWorksAr: [
        'اربط حساب جوجل',
        'اختر قوالب المستندات',
        'الذكاء ينشئ ويدير المستندات'
      ]
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      nameAr: 'جوجل درايف',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png',
      color: '#0F9D58',
      category: 'productivity',
      isConnected: false,
      description: 'File storage and organization',
      descriptionAr: 'تخزين وتنظيم الملفات',
      status: 'available',
      automationTasks: ['Auto-organize files', 'Backup automation', 'Share management'],
      automationTasksAr: ['تنظيم الملفات تلقائياً', 'أتمتة النسخ الاحتياطي', 'إدارة المشاركة'],
      benefits: [
        'Automatic file organization',
        'Smart folder management',
        'Automated backups',
        'Secure file sharing'
      ],
      benefitsAr: [
        'تنظيم الملفات تلقائياً',
        'إدارة المجلدات بذكاء',
        'نسخ احتياطية تلقائية',
        'مشاركة آمنة للملفات'
      ],
      tools: ['Google Drive API', 'File Organizer', 'Backup Manager'],
      toolsAr: ['واجهة درايف', 'منظم الملفات', 'مدير النسخ'],
      howItWorks: [
        'Connect Google Drive account',
        'Set organization rules',
        'Files are managed automatically'
      ],
      howItWorksAr: [
        'اربط حساب جوجل درايف',
        'حدد قواعد التنظيم',
        'الملفات تُدار تلقائياً'
      ]
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      nameAr: 'جداول جوجل',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg',
      color: '#34A853',
      category: 'productivity',
      isConnected: false,
      description: 'Spreadsheet automation and reporting',
      descriptionAr: 'أتمتة الجداول والتقارير',
      status: 'available',
      automationTasks: ['Auto-update data', 'Generate charts', 'Send reports'],
      automationTasksAr: ['تحديث البيانات تلقائياً', 'إنشاء مخططات', 'إرسال تقارير'],
      benefits: [
        'Real-time data synchronization',
        'Automated report generation',
        'Smart data analysis',
        'Scheduled updates'
      ],
      benefitsAr: [
        'مزامنة البيانات فورياً',
        'إنشاء تقارير تلقائياً',
        'تحليل البيانات بذكاء',
        'تحديثات مجدولة'
      ],
      tools: ['Google Sheets API', 'Data Sync', 'Report Generator'],
      toolsAr: ['واجهة الجداول', 'مزامنة البيانات', 'مولد التقارير'],
      howItWorks: [
        'Connect Google Sheets',
        'Choose automation triggers',
        'Data updates automatically'
      ],
      howItWorksAr: [
        'اربط جداول جوجل',
        'اختر محفزات الأتمتة',
        'البيانات تتحدث تلقائياً'
      ]
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      nameAr: 'تقويم جوجل',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
      color: '#1A73E8',
      category: 'productivity',
      isConnected: false,
      description: 'Scheduling and meeting automation',
      descriptionAr: 'أتمتة الجدولة والاجتماعات',
      status: 'available',
      automationTasks: ['Auto-schedule meetings', 'Send reminders', 'Block focus time'],
      automationTasksAr: ['جدولة الاجتماعات تلقائياً', 'إرسال تذكيرات', 'حجز وقت التركيز'],
      benefits: [
        'Automatic meeting scheduling',
        'Smart reminders and follow-ups',
        'Time blocking automation',
        'Calendar conflict resolution'
      ],
      benefitsAr: [
        'جدولة اجتماعات تلقائية',
        'تذكيرات ومتابعات ذكية',
        'أتمتة حجز الأوقات',
        'حل تعارضات المواعيد'
      ],
      tools: ['Google Calendar API', 'Scheduler', 'Reminder Engine'],
      toolsAr: ['واجهة التقويم', 'الجدولة', 'محرك التذكير'],
      howItWorks: [
        'Connect Google Calendar',
        'Set scheduling preferences',
        'Meetings are managed automatically'
      ],
      howItWorksAr: [
        'اربط تقويم جوجل',
        'حدد تفضيلات الجدولة',
        'الاجتماعات تُدار تلقائياً'
      ]
    },
    {
      id: 'notion',
      name: 'Notion',
      nameAr: 'نوشن',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
      color: '#000000',
      category: 'productivity',
      isConnected: false,
      description: 'Workspace and knowledge management',
      descriptionAr: 'إدارة مساحة العمل والمعرفة',
      status: 'available',
      automationTasks: ['Auto-create tasks', 'Sync notes', 'Generate summaries'],
      automationTasksAr: ['إنشاء مهام تلقائياً', 'مزامنة الملاحظات', 'تلخيص تلقائي'],
      benefits: [
        'Automated workspace organization',
        'Smart task creation',
        'AI-powered summaries',
        'Knowledge base automation'
      ],
      benefitsAr: [
        'تنظيم مساحة العمل تلقائياً',
        'إنشاء مهام بذكاء',
        'تلخيصات بالذكاء الاصطناعي',
        'أتمتة قاعدة المعرفة'
      ],
      tools: ['Notion API', 'Task Manager', 'AI Summarizer'],
      toolsAr: ['واجهة نوشن', 'مدير المهام', 'ملخص ذكي'],
      howItWorks: [
        'Connect Notion workspace',
        'Choose automation templates',
        'Workspace updates automatically'
      ],
      howItWorksAr: [
        'اربط مساحة نوشن',
        'اختر قوالب الأتمتة',
        'المساحة تتحدث تلقائياً'
      ]
    },
    {
      id: 'trello',
      name: 'Trello',
      nameAr: 'تريلو',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Trello_logo.svg',
      color: '#0079BF',
      category: 'productivity',
      isConnected: false,
      description: 'Project management automation',
      descriptionAr: 'أتمتة إدارة المشاريع',
      status: 'coming-soon',
      automationTasks: ['Auto-create cards', 'Move tasks', 'Send notifications'],
      automationTasksAr: ['إنشاء بطاقات تلقائياً', 'نقل المهام', 'إرسال إشعارات'],
      benefits: [
        'Automated project tracking',
        'Smart task management',
        'Workflow automation',
        'Team collaboration enhancement'
      ],
      benefitsAr: [
        'تتبع المشاريع تلقائياً',
        'إدارة المهام بذكاء',
        'أتمتة سير العمل',
        'تحسين تعاون الفريق'
      ],
      tools: ['Trello API', 'Board Manager', 'Automation Engine'],
      toolsAr: ['واجهة تريلو', 'مدير اللوحات', 'محرك الأتمتة'],
      howItWorks: [
        'Connect Trello account',
        'Set automation rules',
        'Boards update automatically'
      ],
      howItWorksAr: [
        'اربط حساب تريلو',
        'حدد قواعد الأتمتة',
        'اللوحات تتحدث تلقائياً'
      ]
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      nameAr: 'دروب بوكس',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg',
      color: '#0061FF',
      category: 'productivity',
      isConnected: false,
      description: 'Cloud storage automation',
      descriptionAr: 'أتمتة التخزين السحابي',
      status: 'coming-soon',
      automationTasks: ['Auto-sync files', 'Backup automation', 'Share management'],
      automationTasksAr: ['مزامنة الملفات تلقائياً', 'أتمتة النسخ الاحتياطي', 'إدارة المشاركة'],
      benefits: [
        'Automated file synchronization',
        'Smart backup management',
        'Secure sharing automation',
        'Storage optimization'
      ],
      benefitsAr: [
        'مزامنة الملفات تلقائياً',
        'إدارة النسخ الاحتياطي بذكاء',
        'أتمتة المشاركة الآمنة',
        'تحسين التخزين'
      ],
      tools: ['Dropbox API', 'Sync Manager', 'Backup Engine'],
      toolsAr: ['واجهة دروب بوكس', 'مدير المزامنة', 'محرك النسخ'],
      howItWorks: [
        'Connect Dropbox account',
        'Set sync preferences',
        'Files sync automatically'
      ],
      howItWorksAr: [
        'اربط حساب دروب بوكس',
        'حدد تفضيلات المزامنة',
        'الملفات تتزامن تلقائياً'
      ]
    },
    {
      id: 'asana',
      name: 'Asana',
      nameAr: 'أسانا',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg',
      color: '#F06A6A',
      category: 'productivity',
      isConnected: false,
      description: 'Task management automation',
      descriptionAr: 'أتمتة إدارة المهام',
      status: 'coming-soon',
      automationTasks: ['Auto-assign tasks', 'Update progress', 'Send reminders'],
      automationTasksAr: ['تعيين المهام تلقائياً', 'تحديث التقدم', 'إرسال تذكيرات'],
      benefits: [
        'Automated task assignment',
        'Smart progress tracking',
        'Deadline reminders',
        'Team workflow optimization'
      ],
      benefitsAr: [
        'تعيين المهام تلقائياً',
        'تتبع التقدم بذكاء',
        'تذكيرات بالمواعيد النهائية',
        'تحسين سير عمل الفريق'
      ],
      tools: ['Asana API', 'Task Automator', 'Progress Tracker'],
      toolsAr: ['واجهة أسانا', 'أتمتة المهام', 'تتبع التقدم'],
      howItWorks: [
        'Connect Asana workspace',
        'Set task automation rules',
        'Tasks managed automatically'
      ],
      howItWorksAr: [
        'اربط مساحة أسانا',
        'حدد قواعد أتمتة المهام',
        'المهام تُدار تلقائياً'
      ]
    },
    {
      id: 'slack',
      name: 'Slack',
      nameAr: 'سلاك',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
      color: '#4A154B',
      category: 'communication',
      isConnected: false,
      description: 'Team communication automation',
      descriptionAr: 'أتمتة تواصل الفريق',
      status: 'available',
      automationTasks: ['Auto-post updates', 'Alert notifications', 'Channel management'],
      automationTasksAr: ['نشر تحديثات تلقائياً', 'تنبيهات', 'إدارة القنوات'],
      benefits: [
        'Automated team notifications',
        'Smart channel organization',
        'Workflow updates automation',
        'Integration with other tools'
      ],
      benefitsAr: [
        'تنبيهات فريق تلقائية',
        'تنظيم القنوات بذكاء',
        'أتمتة تحديثات العمل',
        'تكامل مع أدوات أخرى'
      ],
      tools: ['Slack API', 'Notification Bot', 'Channel Manager'],
      toolsAr: ['واجهة سلاك', 'بوت التنبيهات', 'مدير القنوات'],
      howItWorks: [
        'Connect Slack workspace',
        'Choose notification rules',
        'Messages posted automatically'
      ],
      howItWorksAr: [
        'اربط مساحة سلاك',
        'اختر قواعد التنبيهات',
        'الرسائل تُنشر تلقائياً'
      ]
    },
    {
      id: 'telegram',
      name: 'Telegram',
      nameAr: 'تيليجرام',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      color: '#0088CC',
      category: 'communication',
      isConnected: false,
      description: 'Messaging automation',
      descriptionAr: 'أتمتة الرسائل',
      status: 'coming-soon',
      automationTasks: ['Auto-respond', 'Broadcast messages', 'Bot management'],
      automationTasksAr: ['رد تلقائي', 'رسائل جماعية', 'إدارة البوت'],
      benefits: [
        'Automated messaging workflows',
        'Bot-powered customer support',
        'Bulk message automation',
        'Channel management'
      ],
      benefitsAr: [
        'أتمتة سير عمل الرسائل',
        'دعم العملاء عبر البوت',
        'أتمتة الرسائل الجماعية',
        'إدارة القنوات'
      ],
      tools: ['Telegram Bot API', 'Message Automator', 'Channel Manager'],
      toolsAr: ['واجهة بوت تيليجرام', 'أتمتة الرسائل', 'مدير القنوات'],
      howItWorks: [
        'Connect Telegram bot',
        'Configure automation flows',
        'Messages handled automatically'
      ],
      howItWorksAr: [
        'اربط بوت تيليجرام',
        'اضبط تدفقات الأتمتة',
        'الرسائل تُدار تلقائياً'
      ]
    },
    {
      id: 'discord',
      name: 'Discord',
      nameAr: 'ديسكورد',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Discord_logo.svg',
      color: '#5865F2',
      category: 'communication',
      isConnected: false,
      description: 'Community automation',
      descriptionAr: 'أتمتة المجتمع',
      status: 'coming-soon',
      automationTasks: ['Auto-moderation', 'Welcome messages', 'Role management'],
      automationTasksAr: ['إشراف تلقائي', 'رسائل ترحيب', 'إدارة الأدوار'],
      benefits: [
        'Automated community management',
        'Smart moderation tools',
        'Member onboarding automation',
        'Role assignment workflows'
      ],
      benefitsAr: [
        'إدارة المجتمع تلقائياً',
        'أدوات إشراف ذكية',
        'أتمتة ترحيب الأعضاء',
        'تدفقات تعيين الأدوار'
      ],
      tools: ['Discord API', 'Moderation Bot', 'Role Manager'],
      toolsAr: ['واجهة ديسكورد', 'بوت الإشراف', 'مدير الأدوار'],
      howItWorks: [
        'Connect Discord server',
        'Set moderation rules',
        'Community managed automatically'
      ],
      howItWorksAr: [
        'اربط سيرفر ديسكورد',
        'حدد قواعد الإشراف',
        'المجتمع يُدار تلقائياً'
      ]
    },
    {
      id: 'zoom',
      name: 'Zoom',
      nameAr: 'زووم',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Zoom_Logo_2022.svg',
      color: '#2D8CFF',
      category: 'communication',
      isConnected: false,
      description: 'Video meeting automation',
      descriptionAr: 'أتمتة الاجتماعات المرئية',
      status: 'coming-soon',
      automationTasks: ['Auto-schedule meetings', 'Send invitations', 'Record management'],
      automationTasksAr: ['جدولة الاجتماعات تلقائياً', 'إرسال دعوات', 'إدارة التسجيلات'],
      benefits: [
        'Automated meeting scheduling',
        'Smart invitation management',
        'Recording automation',
        'Meeting analytics'
      ],
      benefitsAr: [
        'جدولة اجتماعات تلقائية',
        'إدارة الدعوات بذكاء',
        'أتمتة التسجيلات',
        'تحليلات الاجتماعات'
      ],
      tools: ['Zoom API', 'Meeting Scheduler', 'Recording Manager'],
      toolsAr: ['واجهة زووم', 'جدولة الاجتماعات', 'مدير التسجيلات'],
      howItWorks: [
        'Connect Zoom account',
        'Set meeting preferences',
        'Meetings managed automatically'
      ],
      howItWorksAr: [
        'اربط حساب زووم',
        'حدد تفضيلات الاجتماعات',
        'الاجتماعات تُدار تلقائياً'
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      nameAr: 'تويتر/إكس',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg',
      color: '#000000',
      category: 'marketing',
      isConnected: false,
      description: 'Social media automation',
      descriptionAr: 'أتمتة التواصل الاجتماعي',
      status: 'coming-soon',
      automationTasks: ['Auto-post content', 'Engagement tracking', 'DM automation'],
      automationTasksAr: ['نشر محتوى تلقائياً', 'تتبع التفاعل', 'أتمتة الرسائل'],
      benefits: [
        'Automated content scheduling',
        'Engagement monitoring',
        'Smart posting times',
        'Audience growth automation'
      ],
      benefitsAr: [
        'جدولة المحتوى تلقائياً',
        'مراقبة التفاعل',
        'أوقات نشر ذكية',
        'أتمتة نمو الجمهور'
      ],
      tools: ['Twitter API', 'Content Scheduler', 'Analytics Engine'],
      toolsAr: ['واجهة تويتر', 'جدولة المحتوى', 'محرك التحليلات'],
      howItWorks: [
        'Connect Twitter/X account',
        'Schedule posts and content',
        'Monitor performance automatically'
      ],
      howItWorksAr: [
        'اربط حساب تويتر/إكس',
        'جدول المنشورات والمحتوى',
        'راقب الأداء تلقائياً'
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      nameAr: 'لينكد إن',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
      color: '#0A66C2',
      category: 'marketing',
      isConnected: false,
      description: 'Professional networking automation',
      descriptionAr: 'أتمتة التواصل المهني',
      status: 'coming-soon',
      automationTasks: ['Auto-connect requests', 'Post scheduling', 'Lead generation'],
      automationTasksAr: ['طلبات اتصال تلقائية', 'جدولة المنشورات', 'توليد العملاء'],
      benefits: [
        'Automated professional outreach',
        'Content scheduling',
        'Lead generation workflows',
        'Network growth automation'
      ],
      benefitsAr: [
        'تواصل مهني تلقائي',
        'جدولة المحتوى',
        'تدفقات توليد العملاء',
        'أتمتة نمو الشبكة'
      ],
      tools: ['LinkedIn API', 'Outreach Bot', 'Lead Tracker'],
      toolsAr: ['واجهة لينكد إن', 'بوت التواصل', 'تتبع العملاء'],
      howItWorks: [
        'Connect LinkedIn account',
        'Set outreach campaigns',
        'Network grows automatically'
      ],
      howItWorksAr: [
        'اربط حساب لينكد إن',
        'حدد حملات التواصل',
        'الشبكة تنمو تلقائياً'
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      nameAr: 'يوتيوب',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg',
      color: '#FF0000',
      category: 'marketing',
      isConnected: false,
      description: 'Video content automation',
      descriptionAr: 'أتمتة محتوى الفيديو',
      status: 'coming-soon',
      automationTasks: ['Auto-upload videos', 'Manage comments', 'Analytics reports'],
      automationTasksAr: ['رفع فيديوهات تلقائياً', 'إدارة التعليقات', 'تقارير التحليلات'],
      benefits: [
        'Automated video publishing',
        'Comment moderation',
        'Analytics automation',
        'Content scheduling'
      ],
      benefitsAr: [
        'نشر الفيديوهات تلقائياً',
        'إشراف على التعليقات',
        'أتمتة التحليلات',
        'جدولة المحتوى'
      ],
      tools: ['YouTube API', 'Upload Manager', 'Analytics Engine'],
      toolsAr: ['واجهة يوتيوب', 'مدير الرفع', 'محرك التحليلات'],
      howItWorks: [
        'Connect YouTube channel',
        'Schedule uploads',
        'Manage content automatically'
      ],
      howItWorksAr: [
        'اربط قناة يوتيوب',
        'جدول الرفع',
        'إدارة المحتوى تلقائياً'
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      nameAr: 'إنستجرام',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
      color: '#E4405F',
      category: 'marketing',
      isConnected: false,
      description: 'Instagram marketing automation',
      descriptionAr: 'أتمتة تسويق إنستجرام',
      status: 'coming-soon',
      automationTasks: ['Auto-post stories', 'Engagement tracking', 'DM responses'],
      automationTasksAr: ['نشر قصص تلقائياً', 'تتبع التفاعل', 'ردود الرسائل'],
      benefits: [
        'Automated content posting',
        'Engagement optimization',
        'Smart hashtag management',
        'Audience growth'
      ],
      benefitsAr: [
        'نشر المحتوى تلقائياً',
        'تحسين التفاعل',
        'إدارة الهاشتاقات',
        'نمو الجمهور'
      ],
      tools: ['Instagram API', 'Content Scheduler', 'Engagement Tracker'],
      toolsAr: ['واجهة إنستجرام', 'جدولة المحتوى', 'تتبع التفاعل'],
      howItWorks: [
        'Connect Instagram Business',
        'Schedule posts and stories',
        'Optimize engagement automatically'
      ],
      howItWorksAr: [
        'اربط إنستجرام بيزنس',
        'جدول المنشورات والقصص',
        'تحسين التفاعل تلقائياً'
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook',
      nameAr: 'فيسبوك',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
      color: '#1877F2',
      category: 'marketing',
      isConnected: false,
      description: 'Facebook page automation',
      descriptionAr: 'أتمتة صفحة فيسبوك',
      status: 'coming-soon',
      automationTasks: ['Auto-post updates', 'Manage comments', 'Send messages'],
      automationTasksAr: ['نشر تحديثات تلقائياً', 'إدارة التعليقات', 'إرسال رسائل'],
      benefits: [
        'Automated page management',
        'Content scheduling',
        'Engagement monitoring',
        'Customer communication'
      ],
      benefitsAr: [
        'إدارة الصفحة تلقائياً',
        'جدولة المحتوى',
        'مراقبة التفاعل',
        'تواصل مع العملاء'
      ],
      tools: ['Facebook API', 'Page Manager', 'Engagement Tools'],
      toolsAr: ['واجهة فيسبوك', 'مدير الصفحة', 'أدوات التفاعل'],
      howItWorks: [
        'Connect Facebook page',
        'Schedule content',
        'Manage page automatically'
      ],
      howItWorksAr: [
        'اربط صفحة فيسبوك',
        'جدول المحتوى',
        'إدارة الصفحة تلقائياً'
      ]
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      nameAr: 'ميل تشيمب',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mailchimp_Logo.svg/1200px-Mailchimp_Logo.svg.png',
      color: '#FFE01B',
      category: 'marketing',
      isConnected: false,
      description: 'Email marketing automation',
      descriptionAr: 'أتمتة التسويق بالإيميل',
      status: 'coming-soon',
      automationTasks: ['Auto-campaigns', 'List management', 'Analytics reports'],
      automationTasksAr: ['حملات تلقائية', 'إدارة القوائم', 'تقارير التحليلات'],
      benefits: [
        'Automated email campaigns',
        'Smart audience segmentation',
        'Performance analytics',
        'Lead nurturing automation'
      ],
      benefitsAr: [
        'حملات إيميل تلقائية',
        'تقسيم الجمهور بذكاء',
        'تحليلات الأداء',
        'أتمتة رعاية العملاء'
      ],
      tools: ['Mailchimp API', 'Campaign Manager', 'Analytics Dashboard'],
      toolsAr: ['واجهة ميل تشيمب', 'مدير الحملات', 'لوحة التحليلات'],
      howItWorks: [
        'Connect Mailchimp account',
        'Create automated campaigns',
        'Monitor results automatically'
      ],
      howItWorksAr: [
        'اربط حساب ميل تشيمب',
        'أنشئ حملات تلقائية',
        'راقب النتائج تلقائياً'
      ]
    },
    {
      id: 'github',
      name: 'GitHub',
      nameAr: 'جيت هب',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      color: '#24292e',
      category: 'technical',
      isConnected: false,
      description: 'Development workflow automation',
      descriptionAr: 'أتمتة سير العمل التطويري',
      status: 'coming-soon',
      automationTasks: ['Auto-create issues', 'PR notifications', 'Code review automation'],
      automationTasksAr: ['إنشاء مشاكل تلقائياً', 'تنبيهات Pull Request', 'أتمتة مراجعة الكود'],
      benefits: [
        'Automated issue management',
        'Smart PR workflows',
        'Code quality automation',
        'Development analytics'
      ],
      benefitsAr: [
        'إدارة المشاكل تلقائياً',
        'تدفقات PR ذكية',
        'أتمتة جودة الكود',
        'تحليلات التطوير'
      ],
      tools: ['GitHub API', 'Workflow Automator', 'PR Manager'],
      toolsAr: ['واجهة جيت هب', 'أتمتة التدفقات', 'مدير PR'],
      howItWorks: [
        'Connect GitHub repository',
        'Set automation rules',
        'Workflows run automatically'
      ],
      howItWorksAr: [
        'اربط مستودع جيت هب',
        'حدد قواعد الأتمتة',
        'التدفقات تعمل تلقائياً'
      ]
    },
    {
      id: 'zapier',
      name: 'Zapier',
      nameAr: 'زابيير',
      logoUrl: 'https://zapier.com/favicon.ico',
      color: '#FF4A00',
      category: 'technical',
      isConnected: false,
      description: 'Automation platform integration',
      descriptionAr: 'منصة الأتمتة',
      status: 'coming-soon',
      automationTasks: ['Connect apps', 'Build zaps', 'Workflow automation'],
      automationTasksAr: ['ربط التطبيقات', 'بناء زابس', 'أتمتة التدفقات'],
      benefits: [
        'Connect 5000+ apps',
        'No-code automation',
        'Custom workflows',
        'Easy integration setup'
      ],
      benefitsAr: [
        'ربط أكثر من 5000 تطبيق',
        'أتمتة بدون كود',
        'تدفقات مخصصة',
        'إعداد سهل للتكاملات'
      ],
      tools: ['Zapier API', 'Workflow Builder', 'App Connector'],
      toolsAr: ['واجهة زابيير', 'بناء التدفقات', 'ربط التطبيقات'],
      howItWorks: [
        'Connect Zapier account',
        'Choose apps to integrate',
        'Build automation workflows'
      ],
      howItWorksAr: [
        'اربط حساب زابيير',
        'اختر التطبيقات للربط',
        'ابن تدفقات الأتمتة'
      ]
    },
    {
      id: 'make',
      name: 'Make.com',
      nameAr: 'ميك',
      logoUrl: 'https://www.make.com/favicon.ico',
      color: '#8B5CF6',
      category: 'technical',
      isConnected: false,
      description: 'Visual automation builder',
      descriptionAr: 'بناء الأتمتة المرئية',
      status: 'coming-soon',
      automationTasks: ['Visual workflows', 'App connections', 'Scenario automation'],
      automationTasksAr: ['تدفقات مرئية', 'ربط التطبيقات', 'أتمتة السيناريوهات'],
      benefits: [
        'Visual workflow builder',
        'Advanced automation scenarios',
        'Multiple app integrations',
        'Real-time automation'
      ],
      benefitsAr: [
        'بناء تدفقات مرئية',
        'سيناريوهات أتمتة متقدمة',
        'تكاملات متعددة',
        'أتمتة فورية'
      ],
      tools: ['Make API', 'Scenario Builder', 'Automation Engine'],
      toolsAr: ['واجهة ميك', 'بناء السيناريوهات', 'محرك الأتمتة'],
      howItWorks: [
        'Connect Make account',
        'Build visual scenarios',
        'Run automation workflows'
      ],
      howItWorksAr: [
        'اربط حساب ميك',
        'ابن سيناريوهات مرئية',
        'شغل تدفقات الأتمتة'
      ]
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      nameAr: 'جيت لاب',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg',
      color: '#FC6D26',
      category: 'technical',
      isConnected: false,
      description: 'DevOps automation',
      descriptionAr: 'أتمتة DevOps',
      status: 'coming-soon',
      automationTasks: ['CI/CD automation', 'Issue management', 'Pipeline notifications'],
      automationTasksAr: ['أتمتة CI/CD', 'إدارة المشاكل', 'تنبيهات البايبلاين'],
      benefits: [
        'Automated CI/CD workflows',
        'DevOps pipeline automation',
        'Issue tracking',
        'Deployment automation'
      ],
      benefitsAr: [
        'تدفقات CI/CD تلقائية',
        'أتمتة بايبلاين',
        'تتبع المشاكل',
        'أتمتة النشر'
      ],
      tools: ['GitLab API', 'Pipeline Manager', 'DevOps Automator'],
      toolsAr: ['واجهة جيت لاب', 'مدير البايبلاين', 'أتمتة DevOps'],
      howItWorks: [
        'Connect GitLab project',
        'Set CI/CD rules',
        'Pipelines run automatically'
      ],
      howItWorksAr: [
        'اربط مشروع جيت لاب',
        'حدد قواعد CI/CD',
        'البايبلاين تعمل تلقائياً'
      ]
    },
    {
      id: 'jira',
      name: 'Jira',
      nameAr: 'جيرا',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Jira_Logo.svg',
      color: '#0052CC',
      category: 'technical',
      isConnected: false,
      description: 'Issue tracking automation',
      descriptionAr: 'أتمتة تتبع المشاكل',
      status: 'coming-soon',
      automationTasks: ['Auto-create tickets', 'Status updates', 'Team notifications'],
      automationTasksAr: ['إنشاء تذاكر تلقائياً', 'تحديث الحالات', 'تنبيهات الفريق'],
      benefits: [
        'Automated ticket management',
        'Smart status tracking',
        'Team workflow optimization',
        'Project analytics'
      ],
      benefitsAr: [
        'إدارة التذاكر تلقائياً',
        'تتبع الحالات بذكاء',
        'تحسين سير عمل الفريق',
        'تحليلات المشاريع'
      ],
      tools: ['Jira API', 'Ticket Automator', 'Workflow Manager'],
      toolsAr: ['واجهة جيرا', 'أتمتة التذاكر', 'مدير التدفقات'],
      howItWorks: [
        'Connect Jira project',
        'Set automation triggers',
        'Tickets updated automatically'
      ],
      howItWorksAr: [
        'اربط مشروع جيرا',
        'حدد محفزات الأتمتة',
        'التذاكر تتحدث تلقائياً'
      ]
    },
    {
      id: 'stripe',
      name: 'Stripe',
      nameAr: 'سترايب',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Stripe_logo%2C_revised_2016.svg',
      color: '#635BFF',
      category: 'financial',
      isConnected: false,
      description: 'Payment automation',
      descriptionAr: 'أتمتة المدفوعات',
      status: 'coming-soon',
      automationTasks: ['Auto-invoicing', 'Payment tracking', 'Receipt generation'],
      automationTasksAr: ['فواتير تلقائية', 'تتبع المدفوعات', 'إنشاء إيصالات'],
      benefits: [
        'Automated payment processing',
        'Smart invoicing',
        'Payment analytics',
        'Customer billing automation'
      ],
      benefitsAr: [
        'معالجة المدفوعات تلقائياً',
        'فواتير ذكية',
        'تحليلات المدفوعات',
        'أتمتة فواتير العملاء'
      ],
      tools: ['Stripe API', 'Invoice Generator', 'Payment Tracker'],
      toolsAr: ['واجهة سترايب', 'مولد الفواتير', 'تتبع المدفوعات'],
      howItWorks: [
        'Connect Stripe account',
        'Set billing automation',
        'Payments processed automatically'
      ],
      howItWorksAr: [
        'اربط حساب سترايب',
        'حدد أتمتة الفوترة',
        'المدفوعات تُعالج تلقائياً'
      ]
    },
    {
      id: 'paypal',
      name: 'PayPal',
      nameAr: 'باي بال',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
      color: '#003087',
      category: 'financial',
      isConnected: false,
      description: 'Payment automation',
      descriptionAr: 'أتمتة المدفوعات',
      status: 'coming-soon',
      automationTasks: ['Auto-invoicing', 'Payment notifications', 'Transaction tracking'],
      automationTasksAr: ['فواتير تلقائية', 'تنبيهات المدفوعات', 'تتبع المعاملات'],
      benefits: [
        'Automated PayPal transactions',
        'Payment notifications',
        'Transaction management',
        'Financial reporting'
      ],
      benefitsAr: [
        'معاملات باي بال تلقائية',
        'تنبيهات المدفوعات',
        'إدارة المعاملات',
        'تقارير مالية'
      ],
      tools: ['PayPal API', 'Transaction Manager', 'Reporting Engine'],
      toolsAr: ['واجهة باي بال', 'مدير المعاملات', 'محرك التقارير'],
      howItWorks: [
        'Connect PayPal account',
        'Set payment automation',
        'Transactions tracked automatically'
      ],
      howItWorksAr: [
        'اربط حساب باي بال',
        'حدد أتمتة المدفوعات',
        'المعاملات تُتبع تلقائياً'
      ]
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      nameAr: 'كويك بوكس',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/QuickBooks_logo.svg/1200px-QuickBooks_logo.svg.png',
      color: '#2CA01C',
      category: 'financial',
      isConnected: false,
      description: 'Accounting automation',
      descriptionAr: 'أتمتة المحاسبة',
      status: 'coming-soon',
      automationTasks: ['Auto-bookkeeping', 'Invoice automation', 'Expense tracking'],
      automationTasksAr: ['مسك دفاتر تلقائي', 'أتمتة الفواتير', 'تتبع المصروفات'],
      benefits: [
        'Automated accounting workflows',
        'Smart expense categorization',
        'Invoice automation',
        'Financial insights'
      ],
      benefitsAr: [
        'تدفقات محاسبة تلقائية',
        'تصنيف المصروفات بذكاء',
        'أتمتة الفواتير',
        'رؤى مالية'
      ],
      tools: ['QuickBooks API', 'Bookkeeping Bot', 'Finance Analyzer'],
      toolsAr: ['واجهة كويك بوكس', 'بوت المحاسبة', 'محلل مالي'],
      howItWorks: [
        'Connect QuickBooks account',
        'Set bookkeeping rules',
        'Accounting done automatically'
      ],
      howItWorksAr: [
        'اربط حساب كويك بوكس',
        'حدد قواعد المحاسبة',
        'المحاسبة تتم تلقائياً'
      ]
    },
    {
      id: 'xero',
      name: 'Xero',
      nameAr: 'زيرو',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Xero_logo.svg/1200px-Xero_logo.svg.png',
      color: '#13B5EA',
      category: 'financial',
      isConnected: false,
      description: 'Accounting automation',
      descriptionAr: 'أتمتة المحاسبة',
      status: 'coming-soon',
      automationTasks: ['Auto-reconciliation', 'Invoice management', 'Report generation'],
      automationTasksAr: ['مطابقة تلقائية', 'إدارة الفواتير', 'إنشاء التقارير'],
      benefits: [
        'Automated financial reconciliation',
        'Smart invoice management',
        'Automated reporting',
        'Real-time financial insights'
      ],
      benefitsAr: [
        'مطابقة مالية تلقائية',
        'إدارة فواتير ذكية',
        'تقارير تلقائية',
        'رؤى مالية فورية'
      ],
      tools: ['Xero API', 'Reconciliation Engine', 'Report Generator'],
      toolsAr: ['واجهة زيرو', 'محرك المطابقة', 'مولد التقارير'],
      howItWorks: [
        'Connect Xero account',
        'Set reconciliation rules',
        'Finances managed automatically'
      ],
      howItWorksAr: [
        'اربط حساب زيرو',
        'حدد قواعد المطابقة',
        'الأموال تُدار تلقائياً'
      ]
    },
    {
      id: 'all',
      name: 'All Apps',
      nameAr: 'جميع التطبيقات',
      logoUrl: '',
      color: '#8B5CF6',
      category: 'productivity',
      isConnected: false,
      description: 'View all available integrations',
      descriptionAr: 'عرض جميع التكاملات المتاحة',
      status: 'available',
      automationTasks: ['Browse integrations', 'Connect accounts', 'Start automations'],
      automationTasksAr: ['تصفح التكاملات', 'ربط الحسابات', 'بدء الأتمتة'],
      benefits: ['Access all integrations', 'Easy account connection', 'Comprehensive automation'],
      benefitsAr: ['الوصول لجميع التكاملات', 'ربط الحسابات بسهولة', 'أتمتة شاملة'],
      tools: ['Integration Hub', 'Account Manager', 'Automation Builder'],
      toolsAr: ['مركز التكاملات', 'مدير الحسابات', 'بناء الأتمتة'],
      howItWorks: ['Browse all integrations', 'Select and connect', 'Start automating'],
      howItWorksAr: ['تصفح جميع التكاملات', 'اختر واربط', 'ابدأ الأتمتة']
    }
  ]);

  const displayConnections = useMemo(() => {
    return connections.map((c) => {
      const dbKey = UI_TO_DB_KEY[c.id];
      if (!dbKey) return c;

      const enabled = enabledIntegrations[dbKey]?.enabled ?? false;
      const connected = userStatusByKey[dbKey] === 'connected';

      return {
        ...c,
        isConnected: connected,
        status: enabled ? 'available' : 'coming-soon',
      };