import { createContext, type Dispatch } from "react";
import type { Action, QuizDefinition, QuizQuestion, QuizStatus } from "../type";

export interface QuizContextValue {
  quizzes: QuizDefinition[];
  customQuizzes: QuizDefinition[];
  activeQuiz: QuizDefinition | null;
  activeQuizId: string | null;
  questions: QuizQuestion[];
  status: QuizStatus;
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  highScores: Record<string, number>;
  secondRemaining: number;
  numQuestions: number;
  maxPossiblePoints: number;
  persistenceWarning: string | null;
  dispatch: Dispatch<Action>;
  selectQuiz: (quizId: string) => void;
  addQuiz: (quiz: QuizDefinition) => void;
  deleteQuiz: (quizId: string) => void;
}

export const QuizContext = createContext<QuizContextValue | undefined>(undefined);
