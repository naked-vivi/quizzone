import { Link } from "react-router";
import useQuiz from "../hooks/use-quiz";
import {
  PERCENTAGE_MULTIPLIER,
  SCORE_PERCENTAGE_GREAT,
  SCORE_PERCENTAGE_LOW,
  SCORE_PERCENTAGE_PASS,
  SCORE_PERCENTAGE_PERFECT,
} from "../lib/constants";

function FinishScreen() {
  const { dispatch, points, maxPossiblePoints, highscore, activeQuiz } = useQuiz();
  const percentage = maxPossiblePoints
    ? Math.round((points / maxPossiblePoints) * PERCENTAGE_MULTIPLIER)
    : 0;

  let emoji = "😢";
  if (percentage === SCORE_PERCENTAGE_PERFECT) emoji = "⭐️";
  else if (percentage >= SCORE_PERCENTAGE_GREAT) emoji = "🥳";
  else if (percentage >= SCORE_PERCENTAGE_PASS) emoji = "😊";
  else if (percentage > SCORE_PERCENTAGE_LOW) emoji = "🤨";

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
