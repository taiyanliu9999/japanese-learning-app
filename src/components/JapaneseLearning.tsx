import React, { useState, useEffect } from 'react';
import { Typography, Card, Tabs, Button } from 'antd';
import { FlashcardSection } from './FlashcardSection';
import { ReadingSection } from './ReadingSection';
import { QuizSection } from './QuizSection';
import { processJapaneseText } from '../utils/textProcessor';

const { Title } = Typography;
const { TabPane } = Tabs;

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

  return (
    <Card>
      <Title level={2}>日本語学習</Title>
      <Tabs defaultActiveKey="flashcards">
        <TabPane tab="単語カード" key="flashcards">
          <FlashcardSection vocabulary={processedData.vocabulary} />
        </TabPane>
        
        <TabPane tab="読解練習" key="reading">
          <ReadingSection 
            sentences={processedData.sentences}
            vocabulary={processedData.vocabulary}
          />
        </TabPane>
        
        <TabPane tab="理解テスト" key="quiz">
          <QuizSection quizData={processedData.quizzes} />
        </TabPane>
      </Tabs>
    </Card>
  );
}; 