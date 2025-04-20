interface VocabularyProgress {
  id: string;
  proficiency: number;
}

interface StudySession {
  date: string;
  duration: number;
  vocabularyReviewed: number;
  quizzesTaken: number;
  correctAnswers: number;
}

interface StudyProgress {
  vocabulary: VocabularyProgress[];
  studySessions: StudySession[];
  totalStudyTime: number;
  totalVocabularyReviewed: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
}

export class ProgressManager {
  private static readonly STORAGE_KEY = 'japanese_learning_progress';

  static saveProgress(progress: StudyProgress): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static getProgress(): StudyProgress {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return this.createInitialProgress();
    }
    return JSON.parse(stored);
  }

  static updateVocabularyProgress(wordId: string, proficiency: number): void {
    const progress = this.getProgress();
    const vocab = progress.vocabulary.find((v: VocabularyProgress) => v.id === wordId);
    if (vocab) {
      vocab.proficiency = Math.min(Math.max(0, proficiency), 5);
      this.saveProgress(progress);
    }
  }

  static addStudySession(session: StudySession): void {
    const progress = this.getProgress();
    progress.studySessions.push(session);
    progress.totalStudyTime += session.duration;
    progress.totalVocabularyReviewed += session.vocabularyReviewed;
    progress.averageAccuracy = this.calculateAverageAccuracy(progress.studySessions);
    this.saveProgress(progress);
  }

  static getStudyStreak(): number {
    const progress = this.getProgress();
    let streak = 0;
    const today = new Date();
    const sessions = progress.studySessions
      .map((s: StudySession) => new Date(s.date))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime());

    if (sessions.length === 0) return 0;

    // Check if studied today
    const lastStudyDate = sessions[0];
    const isStudiedToday = lastStudyDate.toDateString() === today.toDateString();
    if (!isStudiedToday) return 0;

    streak = 1;
    for (let i = 1; i < sessions.length; i++) {
      const currentDate = sessions[i];
      const previousDate = sessions[i - 1];
      const dayDiff = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private static createInitialProgress(): StudyProgress {
    return {
      vocabulary: [],
      studySessions: [],
      totalStudyTime: 0,
      totalVocabularyReviewed: 0,
      averageAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0
    };
  }

  private static calculateAverageAccuracy(sessions: StudySession[]): number {
    if (sessions.length === 0) return 0;
    const totalCorrect = sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
    const totalQuizzes = sessions.reduce((sum, session) => sum + session.quizzesTaken, 0);
    return totalQuizzes > 0 ? (totalCorrect / totalQuizzes) * 100 : 0;
  }
} 