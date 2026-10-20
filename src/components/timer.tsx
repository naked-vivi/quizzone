import { useEffect } from "react";
import useQuiz from "../hooks/use-quiz";
import { SECS_PER_MINUTE, TIMER_INTERVAL_MS } from "../lib/constants";

function Timer() {
  const { dispatch, secondRemaining } = useQuiz();
  const mins = Math.floor(secondRemaining / SECS_PER_MINUTE);
  const seconds = secondRemaining % SECS_PER_MINUTE;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div
      className="timer"
      aria-label={`${mins} minutes ${seconds} seconds remaining`}
    >
      {String(mins).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}

export default Timer;
