import React, { useState, useEffect } from 'react';
import { Typography, Card, Tabs, Alert } from 'antd';
import { FlashcardSection } from './FlashcardSection';
import { ReadingSection } from './ReadingSection';
import { QuizSection } from './QuizSection';
import { processJapaneseText } from '../utils/textProcessor';
import { DebugInfo } from './DebugInfo';
import type { VocabularyItem, QuizQuestion } from '../utils/textProcessor';

const { Title } = Typography;

interface JapaneseLearningProps {
  text: string;
}

// Default empty state
const DEFAULT_DATA = {
  vocabulary: [] as VocabularyItem[],
  sentences: [] as string[],
  quizzes: [] as QuizQuestion[]
};

export const JapaneseLearning = ({ text }: JapaneseLearningProps): JSX.Element => {
  const [processedData, setProcessedData] = useState(DEFAULT_DATA);
  const [showDebug, setShowDebug] = useState(
    process.env.NODE_ENV !== 'production' || 
    window.location.search.includes('debug=true')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get current environment information
  const getCurrentEnv = () => {
    return {
      PUBLIC_URL: process.env.PUBLIC_URL || '.',
      NODE_ENV: process.env.NODE_ENV || 'development',
      BASE_URL: window.location.origin,
      CURRENT_URL: window.location.href
    };
  };

  useEffect(() => {
    // Log environment information for debugging
    const envInfo = getCurrentEnv();
    console.log('当前环境信息:');
    Object.entries(envInfo).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    
    try {
      // Process the text
      const data = processJapaneseText(text || '日本語');
      setProcessedData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing text:', err);
      setError('テキスト処理中にエラーが発生しました。');
      setIsLoading(false);
    }
  }, [text]);

  const items = [
    {
      key: 'flashcards',
      label: '単語カード',
      children: <FlashcardSection vocabulary={processedData.vocabulary} />
    },
    {
      key: 'reading',
      label: '読解練習',
      children: <ReadingSection 
        sentences={processedData.sentences}
        vocabulary={processedData.vocabulary}
      />
    },
    {
      key: 'quiz',
      label: '理解テスト',
      children: <QuizSection quizData={processedData.quizzes} />
    }
  ];

  return (
    <>
      {showDebug && <DebugInfo showDetails={true} />}
      <Card>
        <Title level={2}>日本語学習</Title>
        {process.env.NODE_ENV !== 'production' && (
          <div style={{ marginBottom: 16 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowDebug(!showDebug); }}>
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </a>
          </div>
        )}
        
        {error && (
          <Alert
            message="エラー"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        {isLoading ? (
          <div>読み込み中...</div>
        ) : (
          <Tabs defaultActiveKey="flashcards" items={items} />
        )}
      </Card>
    </>
  );
}; 