import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // إضافة ألوان مخصصة لتلبية الاستخدام في ملفات CSS
      colors: {
        background: '#ffffff',   // خلفية عامة (يمكن تعديلها لاحقًا لتتناسب مع التصميم)
        foreground: '#000000',   // لون النص الأساسي
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;