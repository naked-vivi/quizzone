import { useEffect } from "react"
import useQuiz from "../context/useQuiz";

function Timer() {
    const { dispatch, secondRemaining } = useQuiz();
    const mins = Math.floor(secondRemaining / 60);
    const seconds = secondRemaining % 60;

    useEffect(() => {
        const id = setInterval(() => {
            dispatch({ type: "tick" })
        }, 1000)

        return () => clearInterval(id) // clean up the timer
    }, [dispatch])
    return <div className="timer" aria-label={`${mins} minutes ${seconds} seconds remaining`}>{String(mins).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div>
}

export default Timer
