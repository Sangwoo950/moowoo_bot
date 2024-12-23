// pages/index.tsx
import React from 'react';
import Chat from '../components/Chat';

const HomePage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-4'>
      <Chat />
    </div>
  );
};

export default HomePage;
