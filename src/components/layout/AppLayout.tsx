import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  BookOutlined,
  ReadOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import './AppLayout.css';

const { Header, Content, Sider } = Layout;

interface AppLayoutProps {
  children: JSX.Element | JSX.Element[];
}

export const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  return (
    <Layout className="app-layout">
      <Header className="header">
        <div className="logo">日本語学習</div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<BookOutlined />}>
              <Link to="/">学習</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<ReadOutlined />}>
              <Link to="/vocabulary">単語リスト</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BarChartOutlined />}>
              <Link to="/statistics">統計</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              <Link to="/settings">設定</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content className="site-layout-background content">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}; 