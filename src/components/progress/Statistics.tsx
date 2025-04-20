import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';

const mockStats = [
  {
    title: '学習した単語',
    value: 150,
    icon: <BookOutlined />,
    prefix: '',
    suffix: '単語'
  },
  {
    title: '正解率',
    value: 85,
    icon: <CheckCircleOutlined />,
    prefix: '',
    suffix: '%'
  },
  {
    title: '総学習時間',
    value: 24,
    icon: <ClockCircleOutlined />,
    prefix: '',
    suffix: '時間'
  },
  {
    title: '連続学習日数',
    value: 7,
    icon: <FireOutlined />,
    prefix: '',
    suffix: '日'
  }
];

export const Statistics = (): JSX.Element => {
  return (
    <div className="statistics">
      <h2>学習統計</h2>
      <Row gutter={[16, 16]}>
        {mockStats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}; 