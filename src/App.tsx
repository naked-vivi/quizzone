import { useReducer } from "react";
import Header from "./components/Header"
import Page from "./components/Page"
import Loader from "./components/Loader";
import ErrorMessage from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Timer from "./components/Timer";
import Footer from "./components/Footer";
import { initialState, quizReducer } from "./quizReducer";

function App() {
  const [{
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondRemaining,
  }, dispatch] = useReducer(quizReducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (total, question) => total + question.points,
    0,
  );

  return (
    <div className="app">
      <Header />
      <Page >
        {status === "loading" && <Loader />}
        {status === "error" && <ErrorMessage />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" &&
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions.at(index)}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer
                secondRemaining={secondRemaining}
                dispatch={dispatch}
              />
              <NextButton
                answer={answer}
                index={index}
                numQuestions={numQuestions}
                dispatch={dispatch}
              />
            </Footer>
          </>
        }
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Page>
    </div>
  )
}

export default App
