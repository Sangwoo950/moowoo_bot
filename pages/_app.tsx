// pages/_app.tsx
import '../src/styles/global.css'; // Tailwind CSS 임포트
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '../components/ThemeToggle'; // 다크 모드 토글 버튼 컴포넌트

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class'>
      <ThemeToggle /> {/* 다크 모드 토글 버튼 */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
