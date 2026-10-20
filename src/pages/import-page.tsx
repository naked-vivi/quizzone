import { useRef, useState, type ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Download, Upload } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import AiGeneratorModal from "../components/ai-generator-modal";
import QuizPreview from "../components/quiz-preview";
import useQuiz from "../hooks/use-quiz";
import useTitle from "../hooks/use-title";
import {
  AI_FALLBACK_QUIZ_TITLE,
  FALLBACK_QUIZ_TITLE,
  JSON_MIME_TYPE,
  MAX_QUIZ_FILE_SIZE,
  QUIZ_TEMPLATE_FILENAME,
} from "../lib/constants";
import {
  createCustomQuiz,
  filenameToTitle,
  parseQuizJson,
  serializeQuizTemplate,
} from "../lib/quiz-import";
import { quizImportFormSchema } from "../lib/validators";

export default function ImportPage() {
  useTitle("Custom Quiz");

  const [preview, setPreview] = useState<QuizImportPayload | null>(null);
  const [fallbackTitle, setFallbackTitle] = useState(FALLBACK_QUIZ_TITLE);
  const [showAi, setShowAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addQuiz } = useQuiz();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<QuizImportFormValues>({
    resolver: zodResolver(quizImportFormSchema),
    defaultValues: { jsonText: "" },
  });
  const jsonText = useWatch({ control, name: "jsonText" });

  function validateAndPreview(value: string, title = FALLBACK_QUIZ_TITLE) {
    try {
      const parsed = parseQuizJson(value);
      setValue("jsonText", value);
      setFallbackTitle(title);
      setPreview(parsed);
      clearErrors("jsonText");
    } catch (validationError) {
      setPreview(null);
      setError("jsonText", {
        type: "validate",
        message:
          validationError instanceof Error
            ? validationError.message
            : "The quiz could not be validated.",
      });
    }
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("jsonText", { type: "file", message: "Choose a .json file." });
      setPreview(null);
      return;
    }
    if (file.size > MAX_QUIZ_FILE_SIZE) {
      setError("jsonText", { type: "file", message: "The JSON file must be 1 MB or smaller." });
      setPreview(null);
      return;
    }
    validateAndPreview(await file.text(), filenameToTitle(file.name));
    event.target.value = "";
  }

  function downloadTemplate() {
    const blob = new Blob([serializeQuizTemplate()], { type: JSON_MIME_TYPE });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = QUIZ_TEMPLATE_FILENAME;
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
    setValue("jsonText", value);
    setFallbackTitle(AI_FALLBACK_QUIZ_TITLE);
    setPreview(payload);
    clearErrors("jsonText");
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

      <form
        className="json-editor"
        aria-labelledby="json-editor-title"
        onSubmit={handleSubmit(({ jsonText: value }) => validateAndPreview(value))}
        noValidate
      >
        <div>
          <h2 id="json-editor-title">Paste quiz JSON</h2>
          <p>Markdown code fences from AI responses are accepted.</p>
        </div>
        <textarea
          className="no-scrollbar"
          {...register("jsonText", {
            onChange: () => {
              setPreview(null);
              clearErrors("jsonText");
            },
          })}
          rows={15}
          spellCheck={false}
          placeholder={'{\n  "title": "My quiz",\n  "questions": [ ... ]\n}'}
          aria-label="Quiz JSON"
        />
        {errors.jsonText && <p className="form-error" role="alert">{errors.jsonText.message}</p>}
        <button className="button button--primary" type="submit" disabled={!jsonText.trim()}>
          Preview quiz
        </button>
      </form>

      {preview && <QuizPreview payload={preview} fallbackTitle={fallbackTitle} onSave={saveQuiz} />}
      {showAi && <AiGeneratorModal onClose={() => setShowAi(false)} onGenerated={handleAiGenerated} />}
    </main>
  );
}
