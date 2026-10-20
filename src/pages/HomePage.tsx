import { Upload } from "lucide-react";
import { Link } from "react-router-dom";
import QuizCard from "../components/QuizCard";
import useQuiz from "../context/useQuiz";

export default function HomePage() {
  const { quizzes, highScores, deleteQuiz } = useQuiz();
  const builtInQuiz = quizzes.find((quiz) => quiz.source === "built-in")!;
  const customQuizzes = quizzes.filter((quiz) => quiz.source === "custom");

  function handleDelete(quizId: string, title: string) {
    if (window.confirm(`Delete “${title}”? Its high score will also be removed.`)) {
      deleteQuiz(quizId);
    }
  }

  return (
    <main className="page home-page">
      <section className="home-heading">
        <h2>Welcome to Quizzone!</h2>
        <h3>Choose the React quiz or import your own</h3>
      </section>

      <section className="start-options" aria-label="Quiz choices">
        <QuizCard quiz={builtInQuiz} highScore={highScores[builtInQuiz.id] ?? 0} />
        <Link className="import-card" to="/import">
          <Upload aria-hidden="true" size={36} />
          <h2>Import Custom Quiz</h2>
          <p>Upload or paste JSON, download a template, or generate questions with AI.</p>
          <span>Import quiz →</span>
        </Link>
      </section>

      {customQuizzes.length > 0 && (
        <section className="custom-library" aria-labelledby="custom-quizzes-heading">
          <h2 id="custom-quizzes-heading">Your Custom Quizzes</h2>
          <div className="quiz-grid">
          {customQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              highScore={highScores[quiz.id] ?? 0}
              onDelete={
                quiz.source === "custom"
                  ? () => handleDelete(quiz.id, quiz.title)
                  : undefined
              }
            />
          ))}
          </div>
        </section>
      )}
    </main>
  );
}
