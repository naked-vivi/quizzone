import { useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { builtInQuiz } from "../data/built-in-quiz";
import { STORAGE_VERSION } from "../lib/constants";
import { loadQuizState, saveQuizState } from "../lib/storage";
import { QuizContext } from "./quiz-context";
import { createInitialState, quizReducer } from "./quiz-reducer";

function getBrowserStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

function QuizProvider({ children }: { children: ReactNode }) {
  const [hydrated] = useState(() => loadQuizState(getBrowserStorage()));
  const [persistenceWarning, setPersistenceWarning] = useState(hydrated.warning);
  const [state, dispatch] = useReducer(
    quizReducer,
    createInitialState(hydrated.data.customQuizzes, hydrated.data.highScores),
  );

  useEffect(() => {
    const warning = saveQuizState(getBrowserStorage(), {
      version: STORAGE_VERSION,
      customQuizzes: state.customQuizzes,
      highScores: state.highScores,
    });
    queueMicrotask(() => setPersistenceWarning(warning));
  }, [state.customQuizzes, state.highScores]);

  const quizzes = useMemo(() => [builtInQuiz, ...state.customQuizzes], [state.customQuizzes]);
  const activeQuiz = quizzes.find((quiz) => quiz.id === state.activeQuizId) ?? null;
  const questions = activeQuiz?.questions ?? [];
  const maxPossiblePoints = questions.reduce((total, question) => total + question.points, 0);

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        customQuizzes: state.customQuizzes,
        activeQuiz,
        activeQuizId: state.activeQuizId,
        questions,
        status: state.status,
        index: state.index,
        answer: state.answer,
        points: state.points,
        highscore: state.activeQuizId ? (state.highScores[state.activeQuizId] ?? 0) : 0,
        highScores: state.highScores,
        secondRemaining: state.secondRemaining,
        numQuestions: questions.length,
        maxPossiblePoints,
        persistenceWarning,
        dispatch,
        selectQuiz: (quizId) => dispatch({ type: "selectQuiz", payload: quizId }),
        addQuiz: (quiz) => dispatch({ type: "addQuiz", payload: quiz }),
        deleteQuiz: (quizId) => dispatch({ type: "deleteQuiz", payload: quizId }),
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export default QuizProvider;
