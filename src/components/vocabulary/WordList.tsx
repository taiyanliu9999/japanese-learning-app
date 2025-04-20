import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message } from 'antd';
import { SoundOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { Howl } from 'howler';
import type { ColumnsType } from 'antd/es/table';

interface VocabularyItem {
  id: string;
  kanji: string;
  hiragana: string;
  meaning: string;
  example: string;
  isFavorite: boolean;
  lastReviewed?: Date;
  proficiency: number; // 0-100
}

export const WordList: React.FC = () => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 这里应该从本地存储或API加载词汇
    const loadVocabulary = async () => {
      try {
        // 模拟加载数据
        const mockData: VocabularyItem[] = [
          {
            id: '1',
            kanji: '勉強',
            hiragana: 'べんきょう',
            meaning: '学习',
            example: '毎日日本語を勉強します。',
            isFavorite: false,
            proficiency: 80,
          },
          {
            id: '2',
            kanji: '図書館',
            hiragana: 'としょかん',
            meaning: '图书馆',
            example: '図書館で本を借ります。',
            isFavorite: true,
            proficiency: 60,
          },
        ];
        setVocabulary(mockData);
        setLoading(false);
      } catch (error) {
        message.error('単語の読み込みに失敗しました。');
        setLoading(false);
      }
    };

    loadVocabulary();
  }, []);

  const playAudio = (word: string) => {
    // 这里应该使用真实的TTS服务
    message.info(`Playing audio for: ${word}`);
  };

  const toggleFavorite = (id: string) => {
    setVocabulary(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'green';
    if (proficiency >= 60) return 'blue';
    if (proficiency >= 40) return 'orange';
    return 'red';
  };

  const columns: ColumnsType<VocabularyItem> = [
    {
      title: '漢字',
      dataIndex: 'kanji',
      key: 'kanji',
      sorter: (a, b) => a.kanji.localeCompare(b.kanji),
    },
    {
      title: '読み方',
      dataIndex: 'hiragana',
      key: 'hiragana',
      sorter: (a, b) => a.hiragana.localeCompare(b.hiragana),
    },
    {
      title: '意味',
      dataIndex: 'meaning',
      key: 'meaning',
    },
    {
      title: '例文',
      dataIndex: 'example',
      key: 'example',
      responsive: ['md'],
    },
    {
      title: '熟練度',
      dataIndex: 'proficiency',
      key: 'proficiency',
      render: (proficiency: number) => (
        <Tag color={getProficiencyColor(proficiency)}>
          {proficiency}%
        </Tag>
      ),
      sorter: (a, b) => a.proficiency - b.proficiency,
    },
    {
      title: 'アクション',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<SoundOutlined />}
            onClick={() => playAudio(record.kanji)}
          />
          <Button
            type="text"
            icon={record.isFavorite ? <StarFilled /> : <StarOutlined />}
            onClick={() => toggleFavorite(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="word-list">
      <h2>単語帳</h2>
      <Table
        columns={columns}
        dataSource={vocabulary}
        loading={loading}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
}; 