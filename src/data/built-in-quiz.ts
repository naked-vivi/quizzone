import questionsData from "./questions.json";
import { DEFAULT_POINTS_PER_QUESTION } from "../lib/constants";
import { quizImportPayloadSchema } from "../lib/validators";

const parsed = quizImportPayloadSchema.parse(questionsData);

export const builtInQuiz: QuizDefinition = {
  id: "react-fundamentals",
  title: "The React Quiz",
  description: "Test your React knowledge across 15 focused questions.",
  source: "built-in",
  createdAt: null,
  questions: parsed.questions.map((question, index) => ({
    ...question,
    id: `react-question-${index + 1}`,
    points: question.points ?? DEFAULT_POINTS_PER_QUESTION,
  })),
};
