// integrations-manager.js - إدارة التكاملات ديناميكياً
// تحديث موقع وكيلي لعرض 24 تكامل

const INTEGRATIONS_DATA = {
    active: [
        {name: 'Gmail', icon: '✉️', desc: 'البريد الإلكتروني والرسائل', category: 'google'},
        {name: 'Google Calendar', icon: '📅', desc: 'التقويم والمواعيد', category: 'google'},
        {name: 'Google Docs', icon: '📄', desc: 'إنشاء المستندات', category: 'google'},
        {name: 'Google Drive', icon: '💽', desc: 'التخزين السحابي', category: 'google'},
        {name: 'Google Sheets', icon: '📊', desc: 'الجداول والبيانات', category: 'google'},
        {name: 'GitHub', icon: '🐙', desc: 'إدارة الكود والمشاريع', category: 'dev'},
        {name: 'Vercel', icon: '▲', desc: 'النشر والاستضافة', category: 'dev'},
        {name: 'Supabase', icon: '🗄️', desc: 'قاعدة البيانات', category: 'dev'},
        {name: 'Notion', icon: '📝', desc: 'الملاحظات والتنظيم', category: 'productivity'},
        {name: 'Canva', icon: '🎨', desc: 'التصميم والمحتوى البصري', category: 'design'},
        {name: 'Gemini AI', icon: '🤖', desc: 'الذكاء الاصطناعي المتقدم', category: 'ai'},
        {name: 'Firecrawl', icon: '🕷️', desc: 'استخراج المحتوى من المواقع', category: 'dev'}
    ],
    available: [
        {name: 'Discord', icon: '🎮', desc: 'مجتمعات وشات', category: 'social'},
        {name: 'Reddit', icon: '📖', desc: 'منتديات ومحتوى', category: 'social'},
        {name: 'Dropbox', icon: '📦', desc: 'تخزين سحابي', category: 'storage'},
        {name: 'Box', icon: '📁', desc: 'تخزين مؤسسي', category: 'storage'},
        {name: 'Figma', icon: '🎯', desc: 'تصميم واجهات', category: 'design'},
        {name: 'Miro', icon: '🧩', desc: 'لوحات إبداعية', category: 'design'},
        {name: 'Asana', icon: '✅', desc: 'إدارة مهام', category: 'productivity'},
        {name: 'Monday', icon: '📋', desc: 'إدارة مشاريع', category: 'productivity'},
        {name: 'Typeform', icon: '📝', desc: 'استطلاعات ونماذج', category: 'forms'},
        {name: 'Calendly', icon: '🗓️', desc: 'حجز مواعيد', category: 'calendar'},
        {name: 'Zoom', icon: '🎥', desc: 'اجتماعات فيديو', category: 'meeting'},
        {name: 'Airtable', icon: '🗂️', desc: 'قاعدة بيانات مرنة', category: 'database'}
    ]
};

function renderIntegrationsSection() {
    const container = document.querySelector('.integrations-container') || 
                     document.querySelector('#integrations-container') ||
                     document.querySelector('[data-integrations]');

    if (!container) {
        console.log('Integrations container not found');
        return;
    }

    const totalCount = INTEGRATIONS_DATA.active.length + INTEGRATIONS_DATA.available.length;

    const html = `
        <div class="wakeli-integrations-showcase">
            <div class="integrations-header">
                <h2 class="integrations-main-title">🔗 التكاملات المتاحة</h2>
                <div class="integrations-counter">${totalCount} تكامل</div>
            </div>

            <div class="integrations-stats">
                <div class="stat-card active-stat">
                    <div class="stat-number">${INTEGRATIONS_DATA.active.length}</div>
                    <div class="stat-label">نشط ومتصل ✅</div>
                </div>
                <div class="stat-card available-stat">
                    <div class="stat-number">${INTEGRATIONS_DATA.available.length}</div>
                    <div class="stat-label">جاهز للربط 🔗</div>
                </div>
            </div>

            <div class="integrations-sections">
                <div class="integration-section active-section">
                    <h3 class="section-title">✅ التكاملات النشطة</h3>
                    <div class="integrations-grid">
                        ${INTEGRATIONS_DATA.active.map(integration => `
                            <div class="integration-card active-card" data-category="${integration.category}">
                                <div class="integration-icon">${integration.icon}</div>
                                <div class="integration-name">${integration.name}</div>
                                <div class="integration-desc">${integration.desc}</div>
                                <div class="integration-status status-connected">متصل</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="integration-section available-section">
                    <h3 class="section-title">🔗 جاهز للربط</h3>
                    <div class="integrations-grid">
                        ${INTEGRATIONS_DATA.available.map(integration => `
                            <div class="integration-card available-card" data-category="${integration.category}">
                                <div class="integration-icon">${integration.icon}</div>
                                <div class="integration-name">${integration.name}</div>
                                <div class="integration-desc">${integration.desc}</div>
                                <div class="integration-status status-connect">اربط الآن</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    console.log(`✅ تم تحديث التكاملات: ${totalCount} تكامل معروض`);
}

// CSS للتصميم الجديد
const integrationsCSS = `
.wakeli-integrations-showcase {
    padding: 3rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px;
    margin: 3rem 0;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.integrations-header {
    text-align: center;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.integrations-main-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
    background: linear-gradient(45deg, #fff, #e3f2fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.integrations-counter {
    background: rgba(255,255,255,0.2);
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-weight: bold;
    font-size: 1.1rem;
    backdrop-filter: blur(10px);
}

.integrations-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0 3rem 0;
    flex-wrap: wrap;
}

.stat-card {
    background: rgba(255,255,255,0.15);
    padding: 1.5rem;
    border-radius: 15px;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    min-width: 120px;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
}

.integration-section {
    margin: 3rem 0;
}

.section-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    text-align: center;
    background: rgba(255,255,255,0.1);
    padding: 1rem;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.integrations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.integration-card {
    background: rgba(255,255,255,0.1);
    padding: 1.5rem;
    border-radius: 15px;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.integration-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
}

.integration-card:hover::before {
    transform: translateX(100%);
}

.integration-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}

.active-card {
    border-color: #4CAF50;
    background: rgba(76, 175, 80, 0.2);
}

.available-card {
    border-color: #2196F3;
    background: rgba(33, 150, 243, 0.2);
}

.integration-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.integration-name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    color: white;
}

.integration-desc {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 1rem;
    line-height: 1.4;
}

.integration-status {
    padding: 0.5rem 1rem;
    border-radius: 25px;
    font-size: 0.8rem;
    font-weight: bold;
    display: inline-block;
    min-width: 80px;
}

.status-connected {
    background: rgba(76, 175, 80, 0.3);
    color: #4CAF50;
    border: 1px solid #4CAF50;
}

.status-connect {
    background: rgba(33, 150, 243, 0.3);
    color: #2196F3;
    border: 1px solid #2196F3;
    cursor: pointer;
    transition: all 0.3s ease;
}

.status-connect:hover {
    background: #2196F3;
    color: white;
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .wakeli-integrations-showcase {
        padding: 2rem 1rem;
        margin: 2rem 0;
    }

    .integrations-main-title {
        font-size: 2rem;
    }

    .integrations-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .integrations-header {
        flex-direction: column;
        gap: 0.5rem;
    }

    .integrations-stats {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .integrations-grid {
        grid-template-columns: 1fr;
    }
}
`;

// إضافة CSS للصفحة
function injectIntegrationsCSS() {
    const existingStyle = document.getElementById('wakeli-integrations-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    const styleElement = document.createElement('style');
    styleElement.id = 'wakeli-integrations-style';
    styleElement.textContent = integrationsCSS;
    document.head.appendChild(styleElement);
}

// تشغيل عند تحميل الصفحة
function initializeIntegrations() {
    injectIntegrationsCSS();
    renderIntegrationsSection();
    console.log('🚀 تم تفعيل مدير التكاملات الجديد - 24 تكامل');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIntegrations);
} else {
    initializeIntegrations();
}

// Export functions for manual use
window.wakeliIntegrations = {
    render: renderIntegrationsSection,
    data: INTEGRATIONS_DATA,
    init: initializeIntegrations
};
