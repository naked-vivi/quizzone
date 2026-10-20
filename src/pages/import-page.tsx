import { useRef, useState, type ChangeEvent } from "react";
import { Bot, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router";
import AiGeneratorModal from "../components/ai-generator-modal";
import QuizPreview from "../components/quiz-preview";
import useQuiz from "../context/use-quiz";
import useTitle from "../hooks/use-title";
import {
  createCustomQuiz,
  filenameToTitle,
  MAX_QUIZ_FILE_SIZE,
  parseQuizJson,
  serializeQuizTemplate,
} from "../lib/quiz-import";
import type { QuizImportPayload } from "../type";

export default function ImportPage() {
  useTitle("Custom Quiz");

  const [jsonText, setJsonText] = useState("");
  const [preview, setPreview] = useState<QuizImportPayload | null>(null);
  const [fallbackTitle, setFallbackTitle] = useState("Custom Quiz");
  const [error, setError] = useState<string | null>(null);
  const [showAi, setShowAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addQuiz } = useQuiz();
  const navigate = useNavigate();

  function validateAndPreview(value: string, title = "Custom Quiz") {
    try {
      const parsed = parseQuizJson(value);
      setJsonText(value);
      setFallbackTitle(title);
      setPreview(parsed);
      setError(null);
    } catch (validationError) {
      setPreview(null);
      setError(validationError instanceof Error ? validationError.message : "The quiz could not be validated.");
    }
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Choose a .json file.");
      setPreview(null);
      return;
    }
    if (file.size > MAX_QUIZ_FILE_SIZE) {
      setError("The JSON file must be 1 MB or smaller.");
      setPreview(null);
      return;
    }
    validateAndPreview(await file.text(), filenameToTitle(file.name));
    event.target.value = "";
  }

  function downloadTemplate() {
    const blob = new Blob([serializeQuizTemplate()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quizzone-quiz-template.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function saveQuiz() {
    if (!preview) return;
    const quiz = createCustomQuiz(preview, fallbackTitle);
    addQuiz(quiz);
    navigate(`/quiz/${quiz.id}`);
  }

  function handleAiGenerated(payload: QuizImportPayload) {
    const value = JSON.stringify(payload, null, 2);
    setJsonText(value);
    setFallbackTitle("AI Quiz");
    setPreview(payload);
    setError(null);
  }

  return (
    <main className="page import-page">
      <section className="page-intro">
        <h1>Import your own quiz</h1>
        <p>Use the template, paste valid quiz JSON, or ask AI to shape lesson material into questions.</p>
      </section>

      <div className="import-actions">
        <button className="action-tile" type="button" onClick={() => fileInputRef.current?.click()}>
          <Upload aria-hidden="true" size={24} />
          <span><strong>Upload JSON</strong><small>Choose a file up to 1 MB</small></span>
        </button>
        <input ref={fileInputRef} className="visually-hidden" aria-label="Upload quiz JSON" type="file" accept="application/json,.json" onChange={handleFile} />
        <button className="action-tile" type="button" onClick={downloadTemplate}>
          <Download aria-hidden="true" size={24} />
          <span><strong>Download template</strong><small>Start with the supported format</small></span>
        </button>
        <button className="action-tile action-tile--accent" type="button" onClick={() => setShowAi(true)}>
          <Bot aria-hidden="true" size={24} />
          <span><strong>Generate with AI</strong><small>Use Groq or your favorite assistant</small></span>
        </button>
      </div>

      <section className="json-editor" aria-labelledby="json-editor-title">
        <div>
          <h2 id="json-editor-title">Paste quiz JSON</h2>
          <p>Markdown code fences from AI responses are accepted.</p>
        </div>
        <textarea
          className="no-scrollbar"
          value={jsonText}
          onChange={(event) => {
            setJsonText(event.target.value);
            setPreview(null);
            setError(null);
          }}
          rows={15}
          spellCheck={false}
          placeholder={'{\n  "title": "My quiz",\n  "questions": [ ... ]\n}'}
          aria-label="Quiz JSON"
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--primary" type="button" disabled={!jsonText.trim()} onClick={() => validateAndPreview(jsonText)}>
          Preview quiz
        </button>
      </section>

      {preview && <QuizPreview payload={preview} fallbackTitle={fallbackTitle} onSave={saveQuiz} />}
      {showAi && <AiGeneratorModal onClose={() => setShowAi(false)} onGenerated={handleAiGenerated} />}
    </main>
  );
}
