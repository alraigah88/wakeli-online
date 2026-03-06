
interface MobileNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDark: boolean;
}

export default function MobileNavBar({ activeTab, onTabChange, isDark }: MobileNavBarProps) {
  const tabs = [
    { id: 'home',    label: 'الرئيسية', icon: 'ri-home-5-line',      activeIcon: 'ri-home-5-fill' },
    { id: 'agents',  label: 'الوكلاء',  icon: 'ri-robot-2-line',     activeIcon: 'ri-robot-2-fill' },
    { id: 'apps',    label: 'التطبيقات',icon: 'ri-apps-line',         activeIcon: 'ri-apps-fill' },
    { id: 'pricing', label: 'الأسعار',  icon: 'ri-price-tag-3-line', activeIcon: 'ri-price-tag-3-fill' },
    { id: 'profile', label: 'الحساب',   icon: 'ri-user-line',         activeIcon: 'ri-user-fill' },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t transition-colors duration-300 ${
        isDark
          ? 'bg-[#131720]/95 border-[#5a5490]/20 backdrop-blur-xl'
          : 'bg-white/95 border-gray-200/60 backdrop-blur-xl shadow-sm'
      }`}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? isDark ? 'text-teal-400' : 'text-teal-600'
                  : isDark ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={`${isActive ? tab.activeIcon : tab.icon} text-xl`}></i>
              </div>
              <span className={`font-mono text-[10px] whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`}></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
