import React, { useEffect, useState } from 'react';
import { Card, Typography, Space, Divider, Button } from 'antd';
import { supabase } from '../utils/auth';

const { Title, Text, Paragraph } = Typography;

interface DebugInfo {
  env: {
    window: Record<string, any>;
    process: string[];
  };
  supabase: {
    url: string;
    configured: boolean;
  };
  build: {
    time: string;
    env: string;
  };
  network: {
    online: boolean;
    url: string;
  };
}

const DebugInfo = () => {
  const [info, setInfo] = useState({
    env: { window: {}, process: [] },
    supabase: { url: '', configured: false },
    build: { time: '', env: '' },
    network: { online: false, url: '' }
  });
  const [authStatus, setAuthStatus] = useState('unknown');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Collect debug info
    const windowEnv = window.env || {};
    
    const debugInfo = {
      env: {
        window: windowEnv,
        process: Object.keys(process.env).filter(k => k.startsWith('REACT_APP_'))
      },
      supabase: {
        url: windowEnv.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '',
        configured: !!(windowEnv.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL)
      },
      build: {
        time: windowEnv.REACT_APP_BUILD_TIME || process.env.REACT_APP_BUILD_TIME || '',
        env: process.env.NODE_ENV || ''
      },
      network: {
        online: navigator.onLine,
        url: window.location.href
      }
    };
    
    setInfo(debugInfo);
    
    // Check auth status
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthStatus(session ? 'authenticated' : 'not authenticated');
      } catch (error) {
        setAuthStatus(`error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <Card 
      title="Application Debug Info" 
      size="small"
      style={{ marginBottom: 20, opacity: 0.9 }}
      extra={<Button type="link" onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide Details' : 'Show Details'}</Button>}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Paragraph>
          <Text strong>Supabase URL:</Text> {info.supabase.url ? `${info.supabase.url.substring(0, 15)}...` : 'Not configured'}
        </Paragraph>
        
        <Paragraph>
          <Text strong>Authentication Status:</Text> {authStatus}
        </Paragraph>
        
        <Paragraph>
          <Text strong>Build Time:</Text> {info.build.time || 'Unknown'}
        </Paragraph>
        
        <Paragraph>
          <Text strong>Environment:</Text> {info.build.env}
        </Paragraph>
        
        {expanded && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            
            <Title level={5}>Window Environment Variables</Title>
            <Paragraph>
              <pre style={{ background: '#f0f0f0', padding: 8, borderRadius: 4, fontSize: 12 }}>
                {JSON.stringify(info.env.window, null, 2)}
              </pre>
            </Paragraph>
            
            <Title level={5}>Process Environment Variables</Title>
            <Paragraph>
              <Text code>{info.env.process.join(', ')}</Text>
            </Paragraph>
            
            <Title level={5}>Network Information</Title>
            <Paragraph>
              <Text strong>Online:</Text> {info.network.online.toString()}
            </Paragraph>
            <Paragraph>
              <Text strong>URL:</Text> {info.network.url}
            </Paragraph>
            
            <Divider style={{ margin: '8px 0' }} />
            
            <Button 
              type="primary" 
              onClick={async () => {
                try {
                  await fetch('/build-info.json');
                  alert('Successfully fetched build-info.json');
                } catch (error) {
                  alert(`Error fetching build-info.json: ${error}`);
                }
              }}
            >
              Test Fetch build-info.json
            </Button>
          </>
        )}
      </Space>
    </Card>
  );
};

export default DebugInfo; 