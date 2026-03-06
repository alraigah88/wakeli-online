
import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceDetection() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent;
      const width = window.innerWidth;

      const isTabletUA =
        /iPad|Android(?!.*Mobile)|Tablet|Kindle|Silk|PlayBook/i.test(ua) ||
        (ua.includes('Mac') && navigator.maxTouchPoints > 1);

      if (isTabletUA || (width >= 768 && width < 1024 && navigator.maxTouchPoints > 0)) {
        setDeviceType('tablet');
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setDeviceType('desktop');
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // isMobile دائماً false — نعرض نفس الموقع على جميع الأجهزة
  return { deviceType, isMobile: false, isTablet, isDesktop };
}

export default useDeviceDetection;
