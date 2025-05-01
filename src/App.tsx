import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Alert, Spin, Typography, Button, Space, Collapse, Tabs } from 'antd';
import { AppLayout } from './components/layout/AppLayout';
import { JapaneseLearning } from './components/JapaneseLearning';
import { WordList } from './components/vocabulary/WordList';
import { UserSettings } from './components/settings/UserSettings';
import { Statistics } from './components/progress/Statistics';
import { initializeKuromoji } from './utils/kuromojiUtil';
import { isAuthenticated } from './utils/auth';
import 'antd/dist/reset.css';
import './App.css';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const App = () => {
  // This is a placeholder text. In a real app, this would come from an API or user input
  const sampleText = `
    私は日本語を勉強しています。
    毎日新しい単語を覚えます。
    日本の文化にも興味があります。
  `;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [triedPaths, setTriedPaths] = useState([]);
  const [envInfo, setEnvInfo] = useState({});
  const [authStatus, setAuthStatus] = useState(null);

  // 收集环境信息
  const collectEnvInfo = () => {
    return {
      publicUrl: process.env.PUBLIC_URL || '',
      nodeEnv: process.env.NODE_ENV || '',
      buildTime: process.env.REACT_APP_BUILD_TIME || '未知',
      supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? '已配置' : '未配置',
      supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? '已配置' : '未配置',
      userAgent: navigator.userAgent,
      currentUrl: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname
    };
  };

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
    const initApp = async () => {
      try {
        setLoading(true);
        // 收集环境信息
        const info = collectEnvInfo();
        setEnvInfo(info);
        console.log('环境信息:', info);

        // 检查身份验证状态
        const isAuth = await isAuthenticated();
        setAuthStatus(isAuth ? '已登录' : '未登录');
        console.log('身份验证状态:', isAuth ? '已登录' : '未登录或未配置');

        // 添加全局错误捕获以记录路径尝试信息
        const originalConsoleLog = console.log;
        const logs = [];
        
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
        console.error('Failed to initialize app:', error);
        setError(error instanceof Error ? error.message : '应用初始化失败');
        setErrorDetails(error instanceof Error && error.stack ? error.stack : null);
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // 加载中显示内容
  const renderLoading = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <Spin tip="加载中..." size="large" />
      <Text style={{ marginTop: 20 }}>正在加载日语分析工具，请稍候...</Text>
    </div>
  );

  // 错误信息显示内容
  const renderError = () => (
    <div style={{ padding: '20px' }}>
      <Alert
        message="加载错误"
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Paragraph>
              <Text strong>错误信息：</Text> {error}
            </Paragraph>
            
            <Tabs defaultActiveKey="1">
              <TabPane tab="错误详情" key="1">
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
              </TabPane>
              
              <TabPane tab="环境信息" key="2">
                <Paragraph>
                  <Text strong>身份验证状态：</Text> {authStatus || '未知'}
                </Paragraph>
                <Paragraph>
                  <Text strong>当前URL：</Text> {envInfo.currentUrl}
                </Paragraph>
                <Paragraph>
                  <Text strong>构建时间：</Text> {envInfo.buildTime}
                </Paragraph>
                <Paragraph>
                  <Text strong>环境：</Text> {envInfo.nodeEnv}
                </Paragraph>
                <Paragraph>
                  <Text strong>Supabase URL：</Text> {envInfo.supabaseUrl}
                </Paragraph>
                <Paragraph>
                  <Text strong>Supabase Key：</Text> {envInfo.supabaseKey}
                </Paragraph>
              </TabPane>
              
              <TabPane tab="解决建议" key="3">
                <Paragraph>
                  <ul>
                    <li>确保字典文件已正确部署到 /dict 目录下，并且可以通过HTTP访问</li>
                    <li>检查Supabase环境变量是否正确配置</li>
                    <li>尝试清除浏览器缓存或使用隐私模式访问</li>
                    <li>检查网络连接是否正常</li>
                  </ul>
                </Paragraph>
              </TabPane>
            </Tabs>
            
            <Paragraph>
              <Button type="primary" onClick={retryLoading}>
                重新加载
              </Button>
              
              <Button 
                style={{ marginLeft: 8 }} 
                onClick={() => window.location.href = window.location.origin + '/dict/test-access.txt'}>
                测试字典访问
              </Button>
              
              <Button 
                style={{ marginLeft: 8 }} 
                onClick={() => window.location.href = window.location.origin + '/build-info.json'}>
                查看构建信息
              </Button>
            </Paragraph>
          </Space>
        }
        type="error"
        showIcon
      />
    </div>
  );

  // 主应用内容
  const renderApp = () => (
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
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      {loading ? renderLoading() : error ? renderError() : renderApp()}
    </ConfigProvider>
  );
};

export default App;