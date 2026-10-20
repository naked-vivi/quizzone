import type { Dispatch } from "react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctOption: number;
  points: number;
}

export interface QuizImportQuestion {
  question: string;
  options: [string, string, string, string];
  correctOption: 0 | 1 | 2 | 3;
  points?: number;
}

export interface QuizImportPayload {
  title?: string;
  description?: string;
  questions: QuizImportQuestion[];
}

export interface QuizDefinition {
  id: string;
  title: string;
  description: string;
  source: "built-in" | "custom";
  createdAt: string | null;
  questions: QuizQuestion[];
}

export interface PersistedQuizState {
  version: 1;
  customQuizzes: QuizDefinition[];
  highScores: Record<string, number>;
}

export type QuizStatus = "ready" | "active" | "finished";

export type State = {
  customQuizzes: QuizDefinition[];
  highScores: Record<string, number>;
  activeQuizId: string | null;
  status: QuizStatus;
  index: number;
  answer: number | null;
  points: number;
  secondRemaining: number;
};

export type Action =
  | { type: "selectQuiz"; payload: string }
  | { type: "addQuiz"; payload: QuizDefinition }
  | { type: "deleteQuiz"; payload: string }
  | { type: "start" }
  | { type: "newAnswer"; payload: number }
  | { type: "nextQuestion" }
  | { type: "finish" }
  | { type: "restart" }
  | { type: "tick" };

export type AppDispatch = Dispatch<Action>;

export type ProgressProps = {
  index: number;
  numQuestions: number;
  points: number;
  maxPossiblePoints: number;
  answer: number | null;
};
