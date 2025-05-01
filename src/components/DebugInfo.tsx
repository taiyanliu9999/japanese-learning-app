import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Space, Divider, Alert, List } from 'antd';

const { Title, Text, Paragraph } = Typography;

interface DebugInfoProps {
  showDetails?: boolean;
}

type StatusType = 'idle' | 'loading' | 'success' | 'error';

interface TestStatus {
  status: StatusType;
  message: string;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ showDetails = true }) => {
  const [envInfo, setEnvInfo] = useState<Record<string, any>>({});
  const [supabaseTest, setSupabaseTest] = useState<TestStatus>({
    status: 'idle',
    message: 'Not tested'
  });
  const [dictTest, setDictTest] = useState<TestStatus>({
    status: 'idle',
    message: 'Not tested'
  });

  useEffect(() => {
    // Collect environment information
    const env = window.env || {};
    const supabaseUrl = env.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
    const supabaseKey = env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
    
    setEnvInfo({
      url: window.location.href,
      origin: window.location.origin,
      supabaseUrl: supabaseUrl.substring(0, 15) + '...',
      supabaseKeyConfigured: !!supabaseKey,
      windowEnvExists: !!window.env,
      processBuildTime: process.env.REACT_APP_BUILD_TIME || 'Not set',
      windowBuildTime: window.env?.REACT_APP_BUILD_TIME || 'Not set',
      processEnvKeys: Object.keys(process.env).filter(k => k.startsWith('REACT_APP')),
      windowEnvKeys: window.env ? Object.keys(window.env) : []
    });
  }, []);

  const testSupabaseConnection = async () => {
    setSupabaseTest({ status: 'loading', message: 'Testing Supabase connection...' });
    
    try {
      const env = window.env || {};
      const supabaseUrl = env.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setSupabaseTest({ 
          status: 'error', 
          message: 'Supabase credentials not configured' 
        });
        return;
      }
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setSupabaseTest({ 
        status: 'success', 
        message: `Connection successful: ${JSON.stringify(data).substring(0, 50)}...` 
      });
    } catch (error) {
      setSupabaseTest({ 
        status: 'error', 
        message: `Connection failed: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  };

  const testDictAccess = async () => {
    setDictTest({ status: 'loading', message: 'Testing dictionary access...' });
    
    try {
      const dictPaths = [
        '/dict/test-access.txt',
        '/dict/README.md',
        '/dict/unk.dat.gz'
      ];
      
      for (const path of dictPaths) {
        const response = await fetch(path);
        if (response.ok) {
          setDictTest({ 
            status: 'success', 
            message: `Successfully accessed ${path}` 
          });
          return;
        }
      }
      
      setDictTest({ 
        status: 'error', 
        message: 'Could not access any dictionary files' 
      });
    } catch (error) {
      setDictTest({ 
        status: 'error', 
        message: `Dictionary access failed: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  };

  const renderStatus = (status: StatusType, message: string) => {
    const colors = {
      idle: '#999',
      loading: '#1677ff',
      success: '#52c41a',
      error: '#ff4d4f'
    };
    
    return (
      <Text style={{ color: colors[status] }}>
        {status === 'loading' ? '⏳' : status === 'success' ? '✅' : status === 'error' ? '❌' : '🔄'} {message}
      </Text>
    );
  };

  return (
    <Card title="Debug Information" style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>Environment</Title>
        <Paragraph>
          <Text strong>Current URL:</Text> {envInfo.url}
        </Paragraph>
        <Paragraph>
          <Text strong>Supabase URL:</Text> {envInfo.supabaseUrl}
        </Paragraph>
        <Paragraph>
          <Text strong>Supabase Key Configured:</Text> {envInfo.supabaseKeyConfigured ? 'Yes' : 'No'}
        </Paragraph>
        <Paragraph>
          <Text strong>window.env Available:</Text> {envInfo.windowEnvExists ? 'Yes' : 'No'}
        </Paragraph>
        
        {showDetails && (
          <>
            <Divider />
            <Title level={4}>Diagnostics</Title>
            <Paragraph>
              <Button type="primary" onClick={testSupabaseConnection} style={{ marginRight: 8 }}>
                Test Supabase
              </Button>
              <Button onClick={testDictAccess}>
                Test Dictionary
              </Button>
            </Paragraph>
            
            <List
              size="small"
              bordered
              dataSource={[
                { label: 'Supabase Connection', ...supabaseTest },
                { label: 'Dictionary Access', ...dictTest }
              ]}
              renderItem={item => (
                <List.Item>
                  <Text strong>{item.label}:</Text> {renderStatus(item.status, item.message)}
                </List.Item>
              )}
            />
            
            <Divider />
            <Title level={4}>Environment Variables</Title>
            
            <Paragraph>
              <Text strong>Build Time (process.env):</Text> {envInfo.processBuildTime}
            </Paragraph>
            <Paragraph>
              <Text strong>Build Time (window.env):</Text> {envInfo.windowBuildTime}
            </Paragraph>
            
            <Paragraph>
              <Text strong>process.env Keys:</Text> {envInfo.processEnvKeys?.join(', ')}
            </Paragraph>
            <Paragraph>
              <Text strong>window.env Keys:</Text> {envInfo.windowEnvKeys?.join(', ')}
            </Paragraph>
          </>
        )}
      </Space>
    </Card>
  );
}; 