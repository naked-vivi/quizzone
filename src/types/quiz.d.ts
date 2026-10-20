export {};

declare global {
  interface QuizQuestion {
    id: string;
    question: string;
    options: [string, string, string, string];
    correctOption: number;
    points: number;
  }

  interface QuizImportQuestion {
    question: string;
    options: [string, string, string, string];
    correctOption: 0 | 1 | 2 | 3;
    points?: number;
  }

  interface QuizImportPayload {
    title?: string;
    description?: string;
    questions: QuizImportQuestion[];
  }

  interface QuizDefinition {
    id: string;
    title: string;
    description: string;
    source: "built-in" | "custom";
    createdAt: string | null;
    questions: QuizQuestion[];
  }

  interface PersistedQuizState {
    version: 1;
    customQuizzes: QuizDefinition[];
    highScores: Record<string, number>;
  }

  type QuizStatus = "ready" | "active" | "finished";
}
