/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta do portal do médico: roxo #5C3078 como primária
        brand: {
          DEFAULT: '#5C3078', // roxo primário — botões e cards de destaque
          soft: '#8C5FA8', // tom mais claro, acentos
          bg: '#F2EAF6', // tom mais claro, secundária/background
          deep: '#2B1638', // roxo bem escuro p/ superfícies premium (hero, login)
        },
        ink: {
          DEFAULT: '#241E29', // quase-preto com leve tom roxo
          sub: '#726B78',
        },
        line: '#E6E1EA',
        canvas: '#F7F4F8', // papel neutro levemente roxo
        brandgreen: '#0F9D6B',
      },
      borderRadius: {
        card: '18px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Hanken Grotesk', 'sans-serif'],
      },
      boxShadow: {
        phone: '0 30px 60px rgba(43,22,56,0.28), 0 4px 12px rgba(43,22,56,0.18)',
        card: '0 1px 2px rgba(43,22,56,0.05)',
        soft: '0 6px 24px rgba(43,22,56,0.08)',
        sheet: '0 -8px 40px rgba(43,22,56,0.18)',
        glow: '0 0 60px rgba(140,95,168,0.45), 0 8px 32px rgba(43,22,56,0.35)',
        'glow-sm': '0 0 24px rgba(140,95,168,0.35), 0 4px 16px rgba(43,22,56,0.2)',
        lift: '0 16px 40px rgba(43,22,56,0.14), 0 2px 8px rgba(43,22,56,0.06)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(6%, -8%) scale(1.08)' },
          '66%': { transform: 'translate(-5%, 6%) scale(0.94)' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.28s ease',
        'fade-in': 'fade-in 0.2s ease',
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
        aurora: 'aurora 12s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
