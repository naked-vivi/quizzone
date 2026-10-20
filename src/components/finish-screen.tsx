import { Link } from "react-router";
import useQuiz from "../context/use-quiz";

function FinishScreen() {
  const { dispatch, points, maxPossiblePoints, highscore, activeQuiz } = useQuiz();
  const percentage = maxPossiblePoints ? Math.round((points / maxPossiblePoints) * 100) : 0;

  let emoji = "😢";
  if (percentage === 100) emoji = "⭐️";
  else if (percentage >= 80) emoji = "🥳";
  else if (percentage >= 50) emoji = "😊";
  else if (percentage > 0) emoji = "🤨";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxPossiblePoints} ({percentage}%)
      </p>
      <p className="highscore">{activeQuiz?.title} highscore: {highscore} points</p>
      <div className="finish-actions">
        <button className="btn btn-ui" onClick={() => dispatch({ type: "restart" })}>Restart</button>
        <Link className="btn btn-ui" to="/">All quizzes</Link>
      </div>
    </>
  );
}

export default FinishScreen;
