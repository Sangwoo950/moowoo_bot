// components/Chat.tsx

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle'; // ThemeToggle 컴포넌트 임포트

interface MessageType {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); // 입력 필드 ref 추가

  // 트리거 매핑
  const triggers: { [key: string]: string } = {
    안녕하세요: '안녕하세요! 무엇을 도와드릴까요?',
    고마워: '천만에요! 도움이 되어 기쁩니다.',
    민정이: '민정님은 귀엽습니다 :)',
    // 추가 트리거 및 응답
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (input.trim() === '') return;

    // 사용자 메시지 추가
    const userMessage: MessageType = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true); // 로딩 시작

    // 트리거 확인
    const userInput = input.trim();
    const botResponse = triggers[userInput];

    if (botResponse) {
      // 트리거에 해당하는 응답 추가
      const botMessage: MessageType = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false); // 로딩 종료
      setInput('');
      return;
    }

    // 트리거에 해당하지 않으면 API 호출
    try {
      // Axios POST 요청 시 응답 타입 지정
      const response = await axios.post<{ answer: string }>('/api/ask', {
        question: input,
      });

      const botAnswer = response.data.answer;

      // 봇 메시지 추가
      const botMessage: MessageType = {
        id: Date.now() + 1,
        text: botAnswer,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('API 요청 오류:', error);
      // AxiosError 타입 가드 사용
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        const errorMsg =
          axiosError.response?.data.error || '답변을 생성할 수 없습니다.';
        const errorMessage: MessageType = {
          id: Date.now() + 2,
          text: errorMsg,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const errorMessage: MessageType = {
          id: Date.now() + 3,
          text: '죄송합니다. 답변을 생성하는데 문제가 발생했습니다.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }

    setIsLoading(false); // 로딩 종료
    setInput('');
    // inputRef.current?.focus(); // handleSubmit에서 포커스 설정 제거
  };

  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  useEffect(() => {
    // 메시지 컨테이너 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // 메시지 업데이트 후 입력 필드에 포커스 설정
    inputRef.current?.focus();
  }, [messages]);

  return (
    <div className='fixed inset-0 flex items-center justify-center p-2 sm:p-4 bg-transparent'>
      {/* 채팅 컨테이너 */}
      <div className='flex flex-col h-full max-h-screen w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
        {/* 헤더 */}
        <div className='flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200 dark:border-gray-600'>
          <h1 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white'>
            호기심 진국이
          </h1>
          <ThemeToggle /> {/* 다크 모드 토글 버튼 추가 */}
        </div>

        {/* 메시지 영역 */}
        <div className='flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-100 dark:bg-gray-700'>
          {messages.length === 0 ? (
            <div className='text-center text-gray-500 dark:text-gray-400 mt-8 sm:mt-10'>
              아직 대화가 없습니다. 질문을 입력해보세요!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isUser ? 'justify-end' : 'justify-start'
                } mb-3 sm:mb-4 items-start`}
              >
                {/* 사용자 메시지: 메시지 말풍선이 먼저, 아이콘이 나중 */}
                {msg.isUser ? (
                  <>
                    <div
                      className={`relative max-w-xs sm:max-w-md px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-blue-500 text-white rounded-br-none`}
                    >
                      <p className='text-sm sm:text-base'>{msg.text}</p>
                      <span className='text-xs sm:text-sm text-gray-300 dark:text-gray-400 block mt-1'>
                        {msg.timestamp}
                      </span>
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className='absolute top-1 right-1 text-xs sm:text-sm text-red-500 hover:text-red-700'
                        aria-label='메시지 삭제'
                      >
                        &times;
                      </button>
                    </div>
                    {/* 라이트 모드 아이콘 */}
                    <Image
                      src='/user-icon.png' // 사용자 아이콘 경로
                      alt='User'
                      width={32} // 실제 이미지 너비 (w-8 = 32px)
                      height={32} // 실제 이미지 높이 (h-8 = 32px)
                      className='w-8 h-8 ml-2 sm:ml-3 flex-shrink-0 dark:hidden'
                    />
                    {/* 다크 모드 아이콘 */}
                    <Image
                      src='/user-icon-dark.png' // 다크 모드 사용자 아이콘 경로
                      alt='User Dark'
                      width={32}
                      height={32}
                      className='w-8 h-8 ml-2 sm:ml-3 flex-shrink-0 hidden dark:block'
                    />
                  </>
                ) : (
                  // 봇 메시지: 아이콘이 먼저, 메시지 말풍선이 나중
                  <>
                    {/* 라이트 모드 아이콘 */}
                    <Image
                      src='/bot-icon.png' // 봇 아이콘 경로
                      alt='Bot'
                      width={32} // 실제 이미지 너비 (w-8 = 32px)
                      height={32} // 실제 이미지 높이 (h-8 = 32px)
                      className='w-8 h-8 mr-2 sm:mr-3 flex-shrink-0 dark:hidden'
                    />
                    {/* 다크 모드 아이콘 */}
                    <Image
                      src='/bot-icon-dark.png' // 다크 모드 봇 아이콘 경로
                      alt='Bot Dark'
                      width={32}
                      height={32}
                      className='w-8 h-8 mr-2 sm:mr-3 flex-shrink-0 hidden dark:block'
                    />
                    <div
                      className={`relative max-w-xs sm:max-w-md px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-bl-none`}
                    >
                      <p className='text-sm sm:text-base'>{msg.text}</p>
                      <span className='text-xs sm:text-sm text-gray-300 dark:text-gray-400 block mt-1'>
                        {msg.timestamp}
                      </span>
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className='absolute top-1 right-1 text-xs sm:text-sm text-red-500 hover:text-red-700'
                        aria-label='메시지 삭제'
                      >
                        &times;
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 채팅 입력창 고정 */}
        <form
          onSubmit={handleSubmit}
          className='flex p-2 sm:p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
        >
          <input
            ref={inputRef} // ref 추가
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='질문을 입력하세요...'
            disabled={isLoading}
            className='flex-1 p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300'
          />
          <button
            type='submit'
            disabled={isLoading}
            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-r-lg bg-green-500 text-white font-semibold flex items-center justify-center ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:bg-green-600 transition-colors duration-300'
            }`}
          >
            {isLoading ? (
              <svg
                className='animate-spin h-5 w-5 mr-2 sm:mr-3 border-t-2 border-b-2 border-white rounded-full'
                viewBox='0 0 24 24'
              ></svg>
            ) : (
              '전송'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
