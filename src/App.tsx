import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AppLayout } from './components/layout/AppLayout';
import { JapaneseLearning } from './components/JapaneseLearning';
import { WordList } from './components/vocabulary/WordList';
import { UserSettings } from './components/settings/UserSettings';
import { Statistics } from './components/progress/Statistics';
import 'antd/dist/reset.css';
import './App.css';

const App = () => {
  // This is a placeholder text. In a real app, this would come from an API or user input
  const sampleText = `
    私は日本語を勉強しています。
    毎日新しい単語を覚えます。
    日本の文化にも興味があります。
  `;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<JapaneseLearning text={sampleText} />} />
            <Route path="/vocabulary" element={<WordList />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
};

export default App; 