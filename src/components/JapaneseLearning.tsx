import React, { useState, useEffect } from 'react';
import { Typography, Card, Tabs } from 'antd';
import { FlashcardSection } from './FlashcardSection';
import { ReadingSection } from './ReadingSection';
import { QuizSection } from './QuizSection';
import { processJapaneseText } from '../utils/textProcessor';
import { DebugInfo } from './DebugInfo';

const { Title } = Typography;

interface JapaneseLearningProps {
  text: string;
}

export const JapaneseLearning = ({ text }: JapaneseLearningProps): JSX.Element => {
  const [processedData, setProcessedData] = useState({
    vocabulary: [],
    sentences: [],
    quizzes: []
  });
  const [showDebug, setShowDebug] = useState(
    process.env.NODE_ENV !== 'production' || 
    window.location.search.includes('debug=true')
  );

  useEffect(() => {
    const processed = processJapaneseText(text);
    setProcessedData(processed);
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
        <Tabs defaultActiveKey="flashcards" items={items} />
      </Card>
    </>
  );
}; 