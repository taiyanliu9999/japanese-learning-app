declare module 'react';
declare module 'react/jsx-runtime';
declare module 'antd';
declare module '@ant-design/icons';
declare module 'howler';
declare module 'wanakana';
declare module 'recharts';

interface VocabularyItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  example: string;
  isFavorite: boolean;
  lastReviewed?: Date;
  proficiency: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface UserSettings {
  darkMode: boolean;
  furiganaDisplay: 'always' | 'hover' | 'never';
  audioAutoPlay: boolean;
  dailyGoal: number;
  notificationsEnabled: boolean;
}

interface StudyProgress {
  totalWords: number;
  learnedWords: number;
  accuracy: number;
  studyTime: number;
  streak: number;
} 