import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const mockData = [
  { date: '2024-02-01', words: 10, score: 85 },
  { date: '2024-02-02', words: 15, score: 78 },
  { date: '2024-02-03', words: 20, score: 92 },
  { date: '2024-02-04', words: 12, score: 88 },
  { date: '2024-02-05', words: 18, score: 95 },
];

export const Statistics: React.FC = () => {
  return (
    <div className="statistics">
      <h2>学習統計</h2>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <h3>総単語数</h3>
            <Progress type="circle" percent={75} format={() => '150/200'} />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <h3>平均正解率</h3>
            <Progress type="circle" percent={87} status="success" />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <h3>学習時間</h3>
            <Progress type="circle" percent={60} format={() => '12時間'} />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <h3>継続日数</h3>
            <Progress type="circle" percent={100} format={() => '7日'} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <h3>学習進捗</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="words"
              stroke="#8884d8"
              name="学習単語数"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="score"
              stroke="#82ca9d"
              name="テストスコア"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <style jsx>{`
        .statistics {
          padding: 24px;
        }

        h2 {
          margin-bottom: 24px;
        }

        h3 {
          text-align: center;
          margin-bottom: 16px;
        }

        .ant-card {
          text-align: center;
        }
      `}</style>
    </div>
  );
}; 