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

export const JapaneseLearning: React.FC<JapaneseLearningProps> = ({ text }) => {
  const [processedData, setProcessedData] = useState({
    vocabulary: [],
    sentences: [],
    quiz: []
  });

  useEffect(() => {
    const data = processJapaneseText(text);
    setProcessedData(data);
  }, [text]);

  return (
    <div className="japanese-learning-container">
      <Title level={2} className="text-center mb-8">日本語学習</Title>
      
      <Tabs defaultActiveKey="vocabulary" centered>
        <TabPane tab="単語学習" key="vocabulary">
          <FlashcardSection vocabulary={processedData.vocabulary} />
        </TabPane>
        
        <TabPane tab="読解学習" key="reading">
          <ReadingSection 
            sentences={processedData.sentences}
            vocabulary={processedData.vocabulary}
          />
        </TabPane>
        
        <TabPane tab="理解テスト" key="quiz">
          <QuizSection quizData={processedData.quiz} />
        </TabPane>
      </Tabs>
    </div>
  );
}; 