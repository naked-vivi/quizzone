import Option from "./option";
import type { AppDispatch, QuizQuestion } from "../type";

interface QuestionProps {
    question?: QuizQuestion;
    answer: number | null;
    dispatch: AppDispatch;
}

function Question({ question, answer, dispatch }: QuestionProps) {
    if (!question) return null;

    return (<>
        <h4>{question.question}</h4>
        <Option question={question} answer={answer} dispatch={dispatch} />
    </>
    )
}

export default Question
