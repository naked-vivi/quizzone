import useQuiz from "../context/use-quiz";

function Progress() {
    const { index, numQuestions, points, maxPossiblePoints, answer } = useQuiz();
    return (
        <header className="progress">
            <progress aria-label="Quiz progress" max={numQuestions} value={index + Number(answer !== null)} />
            <p>Question <strong>{index + 1}</strong>/{numQuestions}</p>
            <p><strong>{points}</strong>/{maxPossiblePoints}</p>
        </header>
    )
}

export default Progress
