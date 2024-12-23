// tailwind.config.js
module.exports = {
  darkMode: 'class', // 'media' 또는 'class'로 설정
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        '192': '48rem', // 768px
      },
      width: {
        '96': '24rem', // 384px
      },
    },
  },
  plugins: [],
};