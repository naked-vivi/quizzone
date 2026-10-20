import { CheckCircle2, ListChecks } from "lucide-react";
import {
  DEFAULT_POINTS_PER_QUESTION,
  FALLBACK_QUIZ_DESCRIPTION,
  PREVIEW_QUESTIONS_DISPLAY_LIMIT,
} from "../lib/constants";

export default function QuizPreview({ payload, fallbackTitle, onSave }: QuizPreviewProps) {
  const totalPoints = payload.questions.reduce(
    (sum, question) => sum + (question.points ?? DEFAULT_POINTS_PER_QUESTION),
    0,
  );

  return (
    <section className="preview-panel" aria-labelledby="preview-title">
      <div className="preview-panel__heading">
        <p className="eyebrow preview-panel__status">
          <CheckCircle2 aria-hidden="true" size={18} />
          Ready to import
        </p>
        <h2 id="preview-title">{payload.title || fallbackTitle}</h2>
        <p className="preview-panel__description">{payload.description || FALLBACK_QUIZ_DESCRIPTION}</p>
      </div>
      <div className="preview-summary">
        <span><ListChecks aria-hidden="true" size={18} />{payload.questions.length} questions</span>
        <span>{totalPoints} total points</span>
      </div>
      <ol className="preview-questions">
        {payload.questions.slice(0, PREVIEW_QUESTIONS_DISPLAY_LIMIT).map((question, index) => (
          <li key={`${question.question}-${index}`}>
            <span>{index + 1}</span>
            <div>
              <strong>{question.question}</strong>
              <small>Correct: {question.options[question.correctOption]}</small>
            </div>
          </li>
        ))}
      </ol>
      {payload.questions.length > PREVIEW_QUESTIONS_DISPLAY_LIMIT && (
        <p className="muted">
          And {payload.questions.length - PREVIEW_QUESTIONS_DISPLAY_LIMIT} more questions
        </p>
      )}
      <button className="button button--primary button--wide" type="button" onClick={onSave}>
        Save to library
      </button>
    </section>
  );
}
