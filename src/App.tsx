import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Alert, Spin, Typography, Button, Space, Collapse } from 'antd';
import { AppLayout } from './components/layout/AppLayout';
import { JapaneseLearning } from './components/JapaneseLearning';
import { WordList } from './components/vocabulary/WordList';
import { UserSettings } from './components/settings/UserSettings';
import { Statistics } from './components/progress/Statistics';
import { initializeKuromoji } from './utils/kuromojiUtil';
import 'antd/dist/reset.css';
import './App.css';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

const App = () => {
  // This is a placeholder text. In a real app, this would come from an API or user input
  const sampleText = `
    私は日本語を勉強しています。
    毎日新しい単語を覚えます。
    日本の文化にも興味があります。
  `;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [triedPaths, setTriedPaths] = useState<string[]>([]);

  // 重试加载
  const retryLoading = () => {
    console.log('重新尝试加载Kuromoji...');
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    setTriedPaths([]);
    
    initializeKuromoji()
      .then(() => {
        console.log('重试成功：Kuromoji initialized successfully');
        setLoading(false);
      })
      .catch((err) => {
        console.error('重试失败：Failed to initialize Kuromoji:', err);
        setError(err instanceof Error ? err.message : '加载日语分析工具失败');
        setErrorDetails(err instanceof Error && err.stack ? err.stack : null);
        setLoading(false);
      });
  };

  useEffect(() => {
    const initKuromoji = async () => {
      try {
        setLoading(true);
        // 添加全局错误捕获以记录路径尝试信息
        const originalConsoleLog = console.log;
        const logs: string[] = [];
        
        console.log = (...args) => {
          originalConsoleLog(...args);
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
          ).join(' ');
          
          if (message.includes('尝试从') || message.includes('将尝试以下字典路径')) {
            logs.push(message);
          }
        };
        
        await initializeKuromoji();
        console.log = originalConsoleLog;
        setTriedPaths(logs);
        console.log('Kuromoji initialized successfully');
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize Kuromoji:', error);
        setError(error instanceof Error ? error.message : '加载日语分析工具失败');
        setErrorDetails(error instanceof Error && error.stack ? error.stack : null);
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <Spin tip="加载中..." size="large" />
          <Text style={{ marginTop: 20 }}>正在加载日语分析工具，请稍候...</Text>
        </div>
      ) : error ? (
        <div style={{ padding: '20px' }}>
          <Alert
            message="加载错误"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Paragraph>
                  <Text strong>错误信息：</Text> {error}
                </Paragraph>
                
                <Collapse>
                  <Panel header="查看详细错误信息" key="1">
                    {errorDetails && (
                      <Paragraph>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{errorDetails}</pre>
                      </Paragraph>
                    )}
                    
                    {triedPaths.length > 0 && (
                      <Paragraph>
                        <Text strong>尝试的字典路径：</Text>
                        <ul>
                          {triedPaths.map((path, index) => (
                            <li key={index}>{path}</li>
                          ))}
                        </ul>
                      </Paragraph>
                    )}
                  </Panel>
                </Collapse>
                
                <Paragraph>
                  请确保字典文件已正确部署到 /dict 目录下，并且可以通过HTTP访问。
                </Paragraph>
                
                <Paragraph>
                  当前URL：{window.location.href}
                </Paragraph>
                
                <Paragraph>
                  <Button type="primary" onClick={retryLoading}>
                    重新加载
                  </Button>
                </Paragraph>
              </Space>
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