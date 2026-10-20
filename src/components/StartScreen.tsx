import type { AppDispatch } from "../type";

interface StartScreenProps {
    numQuestions: number;
    dispatch: AppDispatch;
}

function StartScreen({ numQuestions, dispatch }: StartScreenProps) {
    return (
        <div className="start">
            <h2 className="">Welcome to The React Quiz!</h2>
            <h3 className="">{numQuestions} questions to test your React mastery</h3>
            <button className="btn btn-ui" onClick={() => dispatch({ type: "start" })}>Let's start</button>
        </div>
    )
}

export default StartScreen
