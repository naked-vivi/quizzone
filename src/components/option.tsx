import type { AppDispatch, QuizQuestion } from "../type";

interface optionProps {
    question: QuizQuestion;
    answer: number | null;
    dispatch: AppDispatch;
}

function Option({ question, answer, dispatch }: optionProps) {
    const hasAnswered = answer !== null;

    return (
        <div className="options">
            {question.options.map((option, index) => (
                <button
                    className={`btn btn-option ${index === answer ? "answer" : ""} 
                    ${hasAnswered ?
                            index === question.correctOption ? "correct" : "wrong"
                            : ""
                        }`}
                    key={option}
                    disabled={hasAnswered}
                    onClick={() => dispatch({ type: "newAnswer", payload: index })}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}

export default Option
