import type { Dispatch } from "react";

declare global {
  type Action =
    | { type: "selectQuiz"; payload: string }
    | { type: "addQuiz"; payload: QuizDefinition }
    | { type: "deleteQuiz"; payload: string }
    | { type: "start" }
    | { type: "newAnswer"; payload: number }
    | { type: "nextQuestion" }
    | { type: "finish" }
    | { type: "restart" }
    | { type: "tick" };

  type AppDispatch = Dispatch<Action>;

  type State = {
    customQuizzes: QuizDefinition[];
    highScores: Record<string, number>;
    activeQuizId: string | null;
    status: QuizStatus;
    index: number;
    answer: number | null;
    points: number;
    secondRemaining: number;
  };

  type ProgressProps = {
    index: number;
    numQuestions: number;
    points: number;
    maxPossiblePoints: number;
    answer: number | null;
  };

  interface QuizContextValue {
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
    dispatch: AppDispatch;
    selectQuiz: (quizId: string) => void;
    addQuiz: (quiz: QuizDefinition) => void;
    deleteQuiz: (quizId: string) => void;
  }
}

export {};
