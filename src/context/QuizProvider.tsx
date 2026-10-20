import { useReducer, type ReactNode } from "react"
import questionsData from "../data/questions.json";
import type { State, Action, QuizQuestion } from "../type";
import { QuizContext } from "./QuizContext";

const SECS_PER_QUESTION = 30;
const questions: QuizQuestion[] = questionsData.questions.map((question, index) => ({
    ...question,
    id: index + 1,
}));

const initialState: State = {
    questions,
    status: "ready", //loading, error, ready, active, finished
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondRemaining: 0,
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "dataReceived":
            return { ...state, questions: action.payload, status: "ready" }
        case "dataFailed":
            return { ...state, status: "error" }
        case "start":
            return { ...state, status: "active", secondRemaining: state.questions.length * SECS_PER_QUESTION }

        case "newAnswer": {
            const question = state.questions.at(state.index);
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question?.correctOption
                    ? state.points + question.points : state.points
            }
        }

        case "nextQuestion":
            return { ...state, index: state.index + 1, answer: null }

        case "finish":
            return {
                ...state,
                status: "finished",
                highscore: state.points > state.highscore ? state.points : state.highscore
            }

        case "restart":
            return {
                ...initialState, questions: state.questions, status: "ready"
            }

        case "tick":
            return {
                ...state, secondRemaining: state.secondRemaining - 1,
                status: state.secondRemaining === 0 ? "finished" : state.status
            }

        default:
            throw new Error("Action unknown");
    }
}

function QuizProvider({ children }: { children: ReactNode }) {
    const [{ questions, status, index, answer, points, highscore, secondRemaining }, dispatch] = useReducer(reducer, initialState)
    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0)

    return (
        <QuizContext.Provider value={{
            questions,
            status,
            index,
            answer,
            points,
            highscore,
            secondRemaining,
            numQuestions,
            maxPossiblePoints,
            dispatch,
        }}>
            {children}
        </QuizContext.Provider>
    )
}

export default QuizProvider
