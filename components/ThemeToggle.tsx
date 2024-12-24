// components/ThemeToggle.tsx

import { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // 초기 테마 설정: 로컬 스토리지 또는 시스템 설정 기반
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      // 시스템 설정에 따라 테마 설정
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
      aria-label='테마 전환'
    >
      {isDark ? (
        // 다크 모드일 때 표시할 아이콘 (예: 해)
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 text-yellow-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3v1m0 16v1m8.66-8.66h-1M4.34 12.34h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 000 14 7 7 0 000-14z'
          />
        </svg>
      ) : (
        // 라이트 모드일 때 표시할 아이콘 (예: 달)
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 text-gray-800'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3c.132 0 .263.004.394.012A9 9 0 0021 12a9 9 0 01-9 9 9 9 0 010-18z'
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
