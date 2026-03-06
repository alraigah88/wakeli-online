import { useEffect, useRef } from 'react';
import { useTheme } from '../page';

export default function CalendlySection() {
  const { isDark } = useTheme();
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (calendlyRef.current && (window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: 'https://calendly.com/ai-maydhafer/30min',
          parentElement: calendlyRef.current,
          prefill: {},
          utm: {}
        });
      }
    };
  }, []);

  return null;
}
