import React, { useState, useEffect } from 'react';
import { Typography, Card, Tabs } from 'antd';
import { FlashcardSection } from './FlashcardSection';
import { ReadingSection } from './ReadingSection';
import { QuizSection } from './QuizSection';
import { processJapaneseText } from '../utils/textProcessor';

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
    <Card>
      <Title level={2}>日本語学習</Title>
      <Tabs defaultActiveKey="flashcards" items={items} />
    </Card>
  );
}; 