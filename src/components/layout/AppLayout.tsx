import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOutlined,
  ReadOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <ReadOutlined />,
      label: <Link to="/">学習</Link>,
    },
    {
      key: '/vocabulary',
      icon: <BookOutlined />,
      label: <Link to="/vocabulary">単語帳</Link>,
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: <Link to="/statistics">統計</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">設定</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <div style={{ float: 'left', marginRight: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', lineHeight: '64px' }}>
            日本語学習アプリ
          </h1>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ 
            background: '#fff', 
            padding: 24, 
            margin: 0,
            minHeight: 280,
            borderRadius: '4px'
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}; 