import React, { useState } from 'react';
import { Form, Switch, Select, InputNumber, Button, message } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;

interface SettingsForm {
  darkMode: boolean;
  furiganaDisplay: 'always' | 'hover' | 'never';
  audioAutoPlay: boolean;
  dailyGoal: number;
  notificationsEnabled: boolean;
}

export const UserSettings: React.FC = () => {
  const [form] = Form.useForm<SettingsForm>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SettingsForm) => {
    setLoading(true);
    try {
      // 这里应该调用API保存设置
      console.log('Saving settings:', values);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      message.success('設定を保存しました。');
    } catch (error) {
      message.error('設定の保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      <h2>ユーザー設定</h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          darkMode: false,
          furiganaDisplay: 'hover',
          audioAutoPlay: true,
          dailyGoal: 20,
          notificationsEnabled: true,
        }}
      >
        <Form.Item
          name="darkMode"
          label="ダークモード"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="furiganaDisplay"
          label="振り仮名の表示"
        >
          <Select>
            <Option value="always">常に表示</Option>
            <Option value="hover">ホバー時に表示</Option>
            <Option value="never">表示しない</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="audioAutoPlay"
          label="音声の自動再生"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="dailyGoal"
          label="1日の目標単語数"
          rules={[
            {
              type: 'number',
              min: 1,
              max: 100,
              message: '1から100までの数字を入力してください。',
            },
          ]}
        >
          <InputNumber min={1} max={100} />
        </Form.Item>

        <Form.Item
          name="notificationsEnabled"
          label="通知"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            設定を保存
          </Button>
        </Form.Item>
      </Form>

      <style jsx>{`
        .settings {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
        }

        h2 {
          margin-bottom: 24px;
        }

        .ant-form-item {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
}; 