import React, { useState } from 'react';
import { Card, Button, Progress, Space } from 'antd';
import { SoundOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Howl } from 'howler';

interface VocabularyItem {
  word: string;
  reading: string;
  meaning: string;
  example: string;
}

interface FlashcardSectionProps {
  vocabulary: VocabularyItem[];
}

export const FlashcardSection: React.FC<FlashcardSectionProps> = ({ vocabulary }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState<Record<string, 'correct' | 'incorrect' | null>>({});

  const currentWord = vocabulary[currentIndex];
  const progressPercent = (Object.keys(progress).length / vocabulary.length) * 100;

  const playAudio = (text: string) => {
    // TODO: Implement TTS functionality
    console.log('Playing audio for:', text);
  };

  const handleNext = (result: 'correct' | 'incorrect') => {
    setProgress(prev => ({
      ...prev,
      [currentWord.word]: result
    }));
    
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setProgress({});
  };

  if (!vocabulary.length) {
    return <div>単語がありません。</div>;
  }

  if (currentIndex >= vocabulary.length) {
    return (
      <Card className="text-center">
        <h2>学習完了！</h2>
        <Progress type="circle" percent={100} />
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" onClick={handleReset}>
            もう一度
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flashcard-section">
      <Progress percent={progressPercent} />
      
      <Card className="flashcard">
        <div className="word-section">
          <h2>{currentWord.word}</h2>
          <Button 
            icon={<SoundOutlined />} 
            onClick={() => playAudio(currentWord.word)}
          />
        </div>

        {showAnswer ? (
          <>
            <div className="reading-section">
              <p>読み方: {currentWord.reading}</p>
              <p>意味: {currentWord.meaning}</p>
            </div>
            <div className="example-section">
              <p>例文:</p>
              <p>{currentWord.example}</p>
            </div>
            <Space size="middle" className="action-buttons">
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                onClick={() => handleNext('correct')}
              >
                覚えた
              </Button>
              <Button 
                danger
                icon={<CloseOutlined />}
                onClick={() => handleNext('incorrect')}
              >
                まだ
              </Button>
            </Space>
          </>
        ) : (
          <Button type="primary" onClick={() => setShowAnswer(true)}>
            答えを見る
          </Button>
        )}
      </Card>

      <style jsx>{`
        .flashcard-section {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .flashcard {
          margin-top: 20px;
          text-align: center;
        }

        .word-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .reading-section,
        .example-section {
          margin: 20px 0;
        }

        .action-buttons {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}; 