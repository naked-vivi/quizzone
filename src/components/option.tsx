import useQuiz from "../context/useQuiz";
import type { QuizQuestion } from "../type";

interface OptionProps {
    question: QuizQuestion;
}

function Option({ question }: OptionProps) {
    const { dispatch, answer } = useQuiz();
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
                    aria-pressed={index === answer}
                    onClick={() => dispatch({ type: "newAnswer", payload: index })}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}

export default Option
