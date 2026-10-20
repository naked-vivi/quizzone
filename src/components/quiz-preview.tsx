import { CheckCircle2, ListChecks, Save } from "lucide-react";
import type { QuizImportPayload } from "../type";

interface QuizPreviewProps {
  payload: QuizImportPayload;
  fallbackTitle: string;
  onSave: () => void;
}

export default function QuizPreview({ payload, fallbackTitle, onSave }: QuizPreviewProps) {
  const totalPoints = payload.questions.reduce((sum, question) => sum + (question.points ?? 10), 0);

  return (
    <section className="preview-panel" aria-labelledby="preview-title">
      <div className="preview-panel__heading">
        <span className="preview-panel__icon"><CheckCircle2 aria-hidden="true" size={23} /></span>
        <div>
          <p className="eyebrow">Ready to import</p>
          <h2 id="preview-title">{payload.title || fallbackTitle}</h2>
          <p>{payload.description || "Imported quiz"}</p>
        </div>
      </div>
      <div className="preview-summary">
        <span><ListChecks aria-hidden="true" size={18} />{payload.questions.length} questions</span>
        <span>{totalPoints} total points</span>
      </div>
      <ol className="preview-questions">
        {payload.questions.slice(0, 3).map((question, index) => (
          <li key={`${question.question}-${index}`}>
            <span>{index + 1}</span>
            <div>
              <strong>{question.question}</strong>
              <small>Correct: {question.options[question.correctOption]}</small>
            </div>
          </li>
        ))}
      </ol>
      {payload.questions.length > 3 && (
        <p className="muted">And {payload.questions.length - 3} more questions</p>
      )}
      <button className="button button--primary button--wide" type="button" onClick={onSave}>
        <Save aria-hidden="true" size={18} /> Save to library
      </button>
    </section>
  );
}
