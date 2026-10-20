import useQuiz from "../context/useQuiz";

function StartScreen() {
  const { activeQuiz, numQuestions, dispatch, highscore, maxPossiblePoints } = useQuiz();
  if (!activeQuiz) return null;

  return (
    <div className="start">
      <h2>{activeQuiz.title}</h2>
      <h3>{numQuestions} questions to test your knowledge</h3>
      <p>{activeQuiz.description}</p>
      <p className="highscore">Highscore: {highscore}/{maxPossiblePoints} points</p>
      <button className="btn btn-ui" onClick={() => dispatch({ type: "start" })}>Let's start</button>
    </div>
  );
}

export default StartScreen;
