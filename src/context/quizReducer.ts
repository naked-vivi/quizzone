import { builtInQuiz } from "../data/builtInQuiz";
import type { Action, QuizDefinition, State } from "../type";

const SECS_PER_QUESTION = 30;

export function createInitialState(
  customQuizzes: QuizDefinition[],
  highScores: Record<string, number>,
): State {
  return {
    customQuizzes,
    highScores,
    activeQuizId: null,
    status: "ready",
    index: 0,
    answer: null,
    points: 0,
    secondRemaining: 0,
  };
}

function getQuiz(state: State): QuizDefinition | undefined {
  if (state.activeQuizId === builtInQuiz.id) return builtInQuiz;
  return state.customQuizzes.find((quiz) => quiz.id === state.activeQuizId);
}

export function quizReducer(state: State, action: Action): State {
  switch (action.type) {
    case "selectQuiz": {
      if (state.activeQuizId === action.payload) return state;
      return {
        ...state,
        activeQuizId: action.payload,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        secondRemaining: 0,
      };
    }
    case "addQuiz":
      return { ...state, customQuizzes: [...state.customQuizzes, action.payload] };
    case "deleteQuiz": {
      const highScores = { ...state.highScores };
      delete highScores[action.payload];
      const deletedActiveQuiz = state.activeQuizId === action.payload;
      return {
        ...state,
        customQuizzes: state.customQuizzes.filter((quiz) => quiz.id !== action.payload),
        highScores,
        activeQuizId: deletedActiveQuiz ? null : state.activeQuizId,
        status: deletedActiveQuiz ? "ready" : state.status,
        index: deletedActiveQuiz ? 0 : state.index,
        answer: deletedActiveQuiz ? null : state.answer,
        points: deletedActiveQuiz ? 0 : state.points,
        secondRemaining: deletedActiveQuiz ? 0 : state.secondRemaining,
      };
    }
    case "start": {
      const quiz = getQuiz(state);
      if (!quiz) return state;
      return {
        ...state,
        status: "active",
        index: 0,
        answer: null,
        points: 0,
        secondRemaining: quiz.questions.length * SECS_PER_QUESTION,
      };
    }
    case "newAnswer": {
      if (state.answer !== null) return state;
      const question = getQuiz(state)?.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question?.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish": {
      if (!state.activeQuizId) return { ...state, status: "finished" };
      return {
        ...state,
        status: "finished",
        highScores: {
          ...state.highScores,
          [state.activeQuizId]: Math.max(
            state.points,
            state.highScores[state.activeQuizId] ?? 0,
          ),
        },
      };
    }
    case "restart":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        secondRemaining: 0,
      };
    case "tick": {
      if (state.status !== "active") return state;
      if (state.secondRemaining <= 1) {
        if (!state.activeQuizId) return { ...state, status: "finished", secondRemaining: 0 };
        return {
          ...state,
          status: "finished",
          secondRemaining: 0,
          highScores: {
            ...state.highScores,
            [state.activeQuizId]: Math.max(
              state.points,
              state.highScores[state.activeQuizId] ?? 0,
            ),
          },
        };
      }
      return { ...state, secondRemaining: state.secondRemaining - 1 };
    }
    default:
      return state;
  }
}
