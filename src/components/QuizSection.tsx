import React, { useState } from 'react';
import { Card, Radio, Button, Space, Progress, message } from 'antd';
import type { RadioChangeEvent } from 'antd';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuizSectionProps {
  quizData: QuizQuestion[];
}

export const QuizSection: React.FC<QuizSectionProps> = ({ quizData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = quizData[currentIndex];
  const progress = (Object.keys(answers).length / quizData.length) * 100;

  const handleAnswerChange = (e: RadioChangeEvent) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      message.warning('答えを選んでください。');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: selectedAnswer
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
      message.success('正解です！');
    } else {
      message.error('不正解です。');
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Quiz completed
      message.success(`クイズ完了！スコア: ${score}/${quizData.length}`);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnswers({});
  };

  if (!quizData.length) {
    return <div>問題がありません。</div>;
  }

  if (currentIndex >= quizData.length) {
    return (
      <Card className="quiz-result">
        <h2>クイズ完了！</h2>
        <Progress
          type="circle"
          percent={Math.round((score / quizData.length) * 100)}
          format={() => `${score}/${quizData.length}`}
        />
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" onClick={handleRetry}>
            もう一度
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="quiz-section">
      <Progress percent={progress} />
      
      <Card className="quiz-card">
        <h3>問題 {currentIndex + 1}</h3>
        <p className="question">{currentQuestion.question}</p>

        <Radio.Group
          onChange={handleAnswerChange}
          value={selectedAnswer}
          disabled={showResult}
        >
          <Space direction="vertical">
            {currentQuestion.options.map((option, index) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        {!showResult ? (
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            style={{ marginTop: '20px' }}
          >
            回答する
          </Button>
        ) : (
          <div className="result-section">
            {currentQuestion.explanation && (
              <p className="explanation">{currentQuestion.explanation}</p>
            )}
            <Button
              type="primary"
              onClick={handleNext}
              style={{ marginTop: '20px' }}
            >
              {currentIndex === quizData.length - 1 ? '結果を見る' : '次へ'}
            </Button>
          </div>
        )}
      </Card>

      <style jsx>{`
        .quiz-section {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .quiz-card {
          margin-top: 20px;
        }

        .question {
          font-size: 18px;
          margin: 20px 0;
        }

        .result-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .explanation {
          margin: 10px 0;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .quiz-result {
          text-align: center;
          padding: 40px;
        }
      `}</style>
    </div>
  );
}; 