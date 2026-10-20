import Option from "./option";
import useQuiz from "../context/use-quiz";

function Question() {
    const { questions, index } = useQuiz();
    const question = questions.at(index);

    if (!question) return null;

    return (<>
        <h4>{question.question}</h4>
        <Option question={question} />
    </>
    )
}

export default Question
