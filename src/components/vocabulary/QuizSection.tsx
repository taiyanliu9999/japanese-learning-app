import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Button, Card, Radio, Space, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd/lib/radio';

interface QuizSectionProps {
  quizData: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export const QuizSection = ({ quizData }: QuizSectionProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({} as Record<number, string>);

  const handleAnswerSelect = (e: RadioChangeEvent) => {
    setSelectedAnswer(e.target.value);
    setAnswers({ ...answers, [currentIndex]: e.target.value });
  };

  const handleNext = () => {
    if (selectedAnswer === quizData[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(answers[currentIndex + 1] || '');
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnswers({});
  };

  if (showResult) {
    return (
      <Card className="quiz-result">
        <Typography.Title level={3}>Quiz Results</Typography.Title>
        <Typography.Text>
          Your score: {score} out of {quizData.length}
        </Typography.Text>
        <Button type="primary" onClick={handleRetry}>
          Try Again
        </Button>
      </Card>
    );
  }

  const currentQuiz = quizData[currentIndex];

  return (
    <Card className="quiz-section">
      <Typography.Title level={4}>
        Question {currentIndex + 1} of {quizData.length}
      </Typography.Title>
      <Typography.Text>{currentQuiz.question}</Typography.Text>
      <Radio.Group 
        onChange={handleAnswerSelect} 
        value={selectedAnswer}
        className="quiz-options"
      >
        <Space direction="vertical">
          {currentQuiz.options.map((option, index) => (
            <Radio key={index} value={option}>
              {option}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      <Button 
        type="primary" 
        onClick={handleNext}
        disabled={!selectedAnswer}
        className="quiz-next-button"
      >
        {currentIndex === quizData.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </Card>
  );
}; 