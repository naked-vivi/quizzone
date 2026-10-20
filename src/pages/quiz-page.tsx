import { useEffect } from "react";
import { Link, useParams } from "react-router";
import FinishScreen from "../components/finish-screen";
import Footer from "../components/footer";
import NextButton from "../components/next-button";
import Progress from "../components/progress";
import Question from "../components/question";
import StartScreen from "../components/start-screen";
import Timer from "../components/timer";
import useQuiz from "../context/use-quiz";
import useTitle from "../hooks/use-title";

export default function QuizPage() {
  const { quizId } = useParams();
  const { quizzes, activeQuizId, status, selectQuiz } = useQuiz();
  const quiz = quizzes.find((item) => item.id === quizId);
  const quizExists = Boolean(quiz);

  useTitle(quiz?.title ?? "Quiz Not Found");

  useEffect(() => {
    if (quizId && quizExists && activeQuizId !== quizId) selectQuiz(quizId);
  }, [activeQuizId, quizExists, quizId, selectQuiz]);

  if (!quizId || !quizExists) {
    return (
      <main className="page empty-state">
        <h1>Quiz not found</h1>
        <p>This quiz may have been deleted or the link may be incorrect.</p>
        <Link className="button button--primary" to="/">Return to library</Link>
      </main>
    );
  }

  if (activeQuizId !== quizId) return <main className="page"><p>Preparing quiz…</p></main>;

  return (
    <main className="page quiz-page">
      {status === "ready" && <StartScreen />}
      {status === "active" && (
        <section className="quiz-session" aria-live="polite">
          <Progress />
          <Question />
          <Footer>
            <Timer />
            <NextButton />
          </Footer>
        </section>
      )}
      {status === "finished" && <FinishScreen />}
    </main>
  );
}
