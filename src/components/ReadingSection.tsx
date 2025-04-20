import React, { useState } from 'react';
import { Card, Typography, Tooltip, Button, Space } from 'antd';
import { SoundOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { toHiragana, toRomaji } from 'wanakana';

const { Paragraph, Text } = Typography;

interface VocabularyItem {
  word: string;
  reading: string;
  meaning: string;
}

interface ReadingSectionProps {
  sentences: string[];
  vocabulary: VocabularyItem[];
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({ sentences, vocabulary }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReading, setShowReading] = useState(false);

  const currentSentence = sentences[currentIndex];

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowReading(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowReading(false);
    }
  };

  const playAudio = (text: string) => {
    // TODO: Implement TTS functionality
    console.log('Playing audio for:', text);
  };

  const findVocabularyItem = (word: string) => {
    return vocabulary.find(item => item.word === word);
  };

  if (!sentences.length) {
    return <div>文章がありません。</div>;
  }

  return (
    <div className="reading-section">
      <Card>
        <div className="sentence-section">
          <Paragraph>
            {currentSentence.split('').map((char, index) => {
              const vocabItem = findVocabularyItem(char);
              return vocabItem ? (
                <Tooltip 
                  key={index}
                  title={
                    <>
                      <div>{vocabItem.reading}</div>
                      <div>{vocabItem.meaning}</div>
                    </>
                  }
                >
                  <Text className="vocabulary-word">
                    {char}
                  </Text>
                </Tooltip>
              ) : (
                <Text key={index}>{char}</Text>
              );
            })}
          </Paragraph>
        </div>

        <Space className="controls">
          <Button
            icon={<SoundOutlined />}
            onClick={() => playAudio(currentSentence)}
          >
            音声
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setShowReading(!showReading)}
          >
            {showReading ? '読み方を隠す' : '読み方を表示'}
          </Button>
        </Space>

        {showReading && (
          <div className="reading-info">
            <Paragraph>
              <Text type="secondary">
                {toHiragana(currentSentence)}
              </Text>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">
                {toRomaji(currentSentence)}
              </Text>
            </Paragraph>
          </div>
        )}

        <div className="navigation">
          <Button 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            前へ
          </Button>
          <Text type="secondary">
            {currentIndex + 1} / {sentences.length}
          </Text>
          <Button 
            onClick={handleNext}
            disabled={currentIndex === sentences.length - 1}
          >
            次へ
          </Button>
        </div>
      </Card>

      <style jsx>{`
        .reading-section {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .sentence-section {
          font-size: 24px;
          line-height: 2;
          margin-bottom: 20px;
        }

        .vocabulary-word {
          cursor: pointer;
          border-bottom: 1px dashed #1890ff;
        }

        .controls {
          margin-bottom: 20px;
        }

        .reading-info {
          margin: 20px 0;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}; 