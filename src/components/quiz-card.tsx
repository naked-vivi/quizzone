import { BookOpen, Clock3, Play, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { SECS_PER_QUESTION } from "../lib/constants";

export default function QuizCard({ quiz, highScore, onDelete }: QuizCardProps) {
  const maxPoints = quiz.questions.reduce((total, question) => total + question.points, 0);

  return (
    <article className="quiz-card">
      <div className="quiz-card__topline">
        <span className={`source-pill source-pill--${quiz.source}`}>
          {quiz.source === "built-in" ? "Built in" : "Custom"}
        </span>
        {onDelete && (
          <button
            className="icon-button"
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${quiz.title}`}
          >
            <Trash2 aria-hidden="true" size={18} />
          </button>
        )}
      </div>
      <div>
        <h2>{quiz.title}</h2>
        <p>{quiz.description}</p>
      </div>
      <div className="quiz-card__meta">
        <span><BookOpen aria-hidden="true" size={17} />{quiz.questions.length} questions</span>
        <span><Clock3 aria-hidden="true" size={17} />{quiz.questions.length * SECS_PER_QUESTION}s</span>
      </div>
      <div className="score-line">
        Best score <strong>{highScore}/{maxPoints}</strong>
      </div>
      <Link className="button button--primary button--wide" to={`/quiz/${quiz.id}`}>
        <Play aria-hidden="true" size={18} />
        Play quiz
      </Link>
    </article>
  );
}
