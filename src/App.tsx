import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import { AppLayout } from './components/layout/AppLayout';
import { JapaneseLearning } from './components/JapaneseLearning';
import { WordList } from './components/vocabulary/WordList';
import { UserSettings } from './components/settings/UserSettings';
import { Statistics } from './components/progress/Statistics';
import './App.css';

function App() {
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
            <Route path="/" element={<JapaneseLearning />} />
            <Route path="/vocabulary" element={<WordList />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<UserSettings />} />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App; 