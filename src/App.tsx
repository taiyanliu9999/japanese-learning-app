import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Alert, Spin } from 'antd';
import { AppLayout } from './components/layout/AppLayout';
import { JapaneseLearning } from './components/JapaneseLearning';
import { WordList } from './components/vocabulary/WordList';
import { UserSettings } from './components/settings/UserSettings';
import { Statistics } from './components/progress/Statistics';
import { initializeKuromoji } from './utils/kuromojiUtil';
import 'antd/dist/reset.css';
import './App.css';

const App = () => {
  // This is a placeholder text. In a real app, this would come from an API or user input
  const sampleText = `
    私は日本語を勉強しています。
    毎日新しい単語を覚えます。
    日本の文化にも興味があります。
  `;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initKuromoji = async () => {
      try {
        setLoading(true);
        await initializeKuromoji();
        console.log('Kuromoji initialized successfully');
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize Kuromoji:', error);
        setError(error instanceof Error ? error.message : '加载日语分析工具失败');
        setLoading(false);
      }
    };

    initKuromoji();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin tip="加载中..." size="large" />
        </div>
      ) : error ? (
        <div style={{ padding: '20px' }}>
          <Alert
            message="加载错误"
            description={
              <>
                <p>{error}</p>
                <p>请确保字典文件已正确部署到 /dict 目录下。</p>
              </>
            }
            type="error"
            showIcon
          />
        </div>
      ) : (
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
      )}
    </ConfigProvider>
  );
};

export default App;