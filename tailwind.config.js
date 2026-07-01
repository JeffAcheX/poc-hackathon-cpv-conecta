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
      },
      animation: {
        'slide-up': 'slide-up 0.28s ease',
        'fade-in': 'fade-in 0.2s ease',
      },
    },
  },
  plugins: [],
};
