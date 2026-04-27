
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const IntegrationsStrip = () => {
  const { t } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { signInWithMicrosoft, signInWithGoogle, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const platforms = [
    // Communication & Social
    { name: 'Slack', icon: 'ri-slack-fill', color: '#4A154B' },
    { name: 'Discord', icon: 'ri-discord-fill', color: '#5865F2' },
    { name: 'Microsoft Teams', icon: 'ri-microsoft-fill', color: '#6264A7' },
    { name: 'Zoom', icon: 'ri-vidicon-fill', color: '#2D8CFF' },
    { name: 'WhatsApp', icon: 'ri-whatsapp-fill', color: '#25D366' },
    { name: 'Telegram', icon: 'ri-telegram-fill', color: '#0088cc' },

    // Email & Calendar
    { name: 'Gmail', icon: 'ri-gmail-fill', color: '#EA4335' },
    { name: 'Outlook', icon: 'ri-mail-fill', color: '#0078D4' },
    { name: 'Calendly', icon: 'ri-calendar-fill', color: '#006BFF' },

    // Productivity & Project Management
    { name: 'Notion', icon: 'ri-notion-fill', color: '#000000' },
    { name: 'Asana', icon: 'ri-task-fill', color: '#F06A6A' },
    { name: 'Linear', icon: 'ri-line-chart-fill', color: '#5E6AD2' },
    { name: 'Airtable', icon: 'ri-table-fill', color: '#18BFFF' },

    // Development & Design
    { name: 'GitHub', icon: 'ri-github-fill', color: '#181717' },
    { name: 'Figma', icon: 'ri-pencil-ruler-2-fill', color: '#F24E1E' },
    { name: 'Canva', icon: 'ri-palette-fill', color: '#00C4CC' },

    // Cloud Storage
    { name: 'Google Drive', icon: 'ri-google-drive-fill', color: '#4285F4' },
    { name: 'Dropbox', icon: 'ri-dropbox-fill', color: '#0061FF' },
    { name: 'OneDrive', icon: 'ri-microsoft-fill', color: '#0078D4' },

    // Social Media
    { name: 'Instagram', icon: 'ri-instagram-fill', color: '#E4405F' },
    { name: 'Twitter', icon: 'ri-twitter-x-fill', color: '#000000' },
    { name: 'LinkedIn', icon: 'ri-linkedin-fill', color: '#0A66C2' },
    { name: 'YouTube', icon: 'ri-youtube-fill', color: '#FF0000' },
    { name: 'TikTok', icon: 'ri-tiktok-fill', color: '#000000' },
    { name: 'Facebook', icon: 'ri-facebook-fill', color: '#1877F2' },

    // E-commerce & Payments
    { name: 'Shopify', icon: 'ri-shopping-bag-fill', color: '#96BF48' },
    { name: 'Stripe', icon: 'ri-bank-card-fill', color: '#635BFF' },
    { name: 'PayPal', icon: 'ri-paypal-fill', color: '#00457C' },

    // Business & CRM
    { name: 'Salesforce', icon: 'ri-cloud-fill', color: '#00A1E0' },
    { name: 'HubSpot', icon: 'ri-contacts-book-fill', color: '#FF7A59' },
    { name: 'Intercom', icon: 'ri-customer-service-2-fill', color: '#0099F7' },

    // Forms & Surveys
    { name: 'Typeform', icon: 'ri-questionnaire-fill', color: '#262627' },
    { name: 'Google Forms', icon: 'ri-file-list-3-fill', color: '#673AB7' },

    // Analytics & Marketing
    { name: 'Google Analytics', icon: 'ri-line-chart-fill', color: '#E37400' },
    { name: 'Mailchimp', icon: 'ri-mail-send-fill', color: '#FFE01B' },

    // Entertainment & Media
    { name: 'Spotify', icon: 'ri-spotify-fill', color: '#1DB954' },
    { name: 'Netflix', icon: 'ri-netflix-fill', color: '#E50914' },

    // AI & Automation
    { name: 'OpenAI', icon: 'ri-robot-fill', color: '#412991' },
    { name: 'Zapier', icon: 'ri-links-fill', color: '#FF4A00' },

    // More platforms (reaching 50+ integrations)
    { name: 'WordPress', icon: 'ri-wordpress-fill', color: '#21759B' },
    { name: 'Webflow', icon: 'ri-window-fill', color: '#4353FF' },
    { name: 'Vercel', icon: 'ri-triangle-fill', color: '#000000' },
    { name: 'Netlify', icon: 'ri-global-fill', color: '#00C7B7' },
    { name: 'AWS', icon: 'ri-cloud-fill', color: '#FF9900' },
    { name: 'Google Cloud', icon: 'ri-google-fill', color: '#4285F4' },
    { name: 'Azure', icon: 'ri-microsoft-fill', color: '#0078D4' },
    { name: 'DigitalOcean', icon: 'ri-water-drop-fill', color: '#0080FF' },
    { name: 'Heroku', icon: 'ri-cloud-fill', color: '#430098' },
    { name: 'MongoDB', icon: 'ri-database-2-fill', color: '#47A248' },
    { name: 'PostgreSQL', icon: 'ri-database-fill', color: '#336791' },
    { name: 'Redis', icon: 'ri-database-2-fill', color: '#DC382D' }
  ];

  // Neural network background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const initNodes = () => {
      nodes = [];
      const count = 35;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(20, 184, 166, 0.2)';
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Move
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initNodes();
    draw();

    window.addEventListener('resize', () => {
      resize();
      initNodes();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSyncClick = async () => {
    if (isAuthenticated) return;
    setShowAuthModal(true);
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      await signInWithMicrosoft();
    } catch (err) {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLoading(false);
    }
  };

  // Split into 2 orbits
  const orbit1 = platforms.slice(0, 9);
  const orbit2 = platforms.slice(9, 18);

  return (
    <>
      <section className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Sync Button */}
          <div className="flex justify-center mb-10">
            <button
              onClick={handleSyncClick}
              className="px-8 py-3 bg-transparent border-2 border-gray-200 text-gray-600 rounded-full font-medium hover:border-teal-400 hover:text-teal-600 hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-3"
            >
              <i className="ri-refresh-line text-xl"></i>
              {t('integrations.syncCta')}
            </button>
          </div>

          {/* Orbital Container */}
          <div ref={containerRef} className="relative w-full flex items-center justify-center" style={{ height: '420px' }}>
            {/* Neural Network Canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 0 }}
            />

            {/* Center Brain Icon */}
            <div className="absolute z-20 flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 flex items-center justify-center animate-pulse-slow">
                  <i className="ri-brain-line text-4xl text-teal-500"></i>
                </div>
                {/* Glow rings */}
                <div className="absolute inset-[-12px] rounded-full border border-teal-400/10 animate-ping-slow"></div>
                <div className="absolute inset-[-28px] rounded-full border border-teal-400/5"></div>
              </div>
            </div>

            {/* Orbit 1 - Inner */}
            <div className="absolute z-10 w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full border border-dashed border-gray-200/40 animate-orbit-cw">
              {orbit1.map((platform, index) => {
                const angle = (index / orbit1.length) * 360;
                return (
                  <div
                    key={platform.name}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${angle}deg) translateY(-50%) translateX(-50%)`,
                    }}
                  >
                    <div
                      className="absolute animate-counter-rotate-cw"
                      style={{
                        top: '-140px',
                        left: '-24px',
                      }}
                    >
                      <div className="group relative cursor-pointer">
                        <div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg"
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <i
                            className={`${platform.icon} text-2xl md:text-3xl transition-all duration-300`}
                            style={{ color: platform.color }}
                          ></i>
                        </div>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {platform.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Orbit 2 - Outer */}
            <div className="absolute z-10 w-[400px] h-[400px] md:w-[460px] md:h-[460px] rounded-full border border-dashed border-gray-200/20 animate-orbit-ccw">
              {orbit2.map((platform, index) => {
                const angle = (index / orbit2.length) * 360;
                return (
                  <div
                    key={platform.name}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${angle}deg) translateY(-50%) translateX(-50%)`,
                    }}
                  >
                    <div
                      className="absolute animate-counter-rotate-ccw"
                      style={{
                        top: '-200px',
                        left: '-24px',
                      }}
                    >
                      <div className="group relative cursor-pointer">
                        <div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg"
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <i
                            className={`${platform.icon} text-2xl md:text-3xl transition-all duration-300`}
                            style={{ color: platform.color }}
                          ></i>
                        </div>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {platform.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('auth.subtitle')}
            </p>

            <div className="space-y-3">
              <button 
                onClick={handleMicrosoftLogin}
                disabled={loading}
                className="w-full px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-teal-400 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <i className="ri-microsoft-fill text-2xl" style={{ color: '#00A4EF' }}></i>
                <span className="font-medium text-gray-700">
                  {t('auth.microsoft')}
                </span>
              </button>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-red-400 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <i className="ri-google-fill text-2xl" style={{ color: '#4285F4' }}></i>
                <span className="font-medium text-gray-700">
                  {t('auth.google')}
                </span>
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              {t('auth.note')}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes counter-rotate-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes counter-rotate-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-orbit-cw {
          animation: orbit-cw 45s linear infinite;
        }
        .animate-orbit-ccw {
          animation: orbit-ccw 60s linear infinite;
        }
        .animate-counter-rotate-cw {
          animation: counter-rotate-cw 45s linear infinite;
        }
        .animate-counter-rotate-ccw {
          animation: counter-rotate-ccw 60s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s ease-out infinite;
        }
      `}</style>
    </>
  );
};

export default IntegrationsStrip;
