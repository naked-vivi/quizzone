import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Check, Copy, ExternalLink, LoaderCircle, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { buildAssistantUrl, buildExternalAiPrompt } from "../lib/ai-prompt";
import {
  CLIPBOARD_FEEDBACK_DURATION_MS,
  DEFAULT_AI_QUESTIONS,
  MAX_AI_QUESTIONS,
  MAX_CONTEXT_LENGTH,
  MIN_AI_QUESTIONS,
} from "../lib/constants";
import { aiGeneratorFormSchema } from "../lib/validators";

export default function AiGeneratorModal({ onClose, onGenerated }: AiGeneratorModalProps) {
  const [directEnabled, setDirectEnabled] = useState<boolean | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [assistantNotice, setAssistantNotice] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AiGeneratorFormValues>({
    resolver: zodResolver(aiGeneratorFormSchema),
    defaultValues: {
      mode: "direct",
      context: "",
      questionCount: DEFAULT_AI_QUESTIONS,
      usePdf: false,
    },
  });
  const [mode, context, questionCount, usePdf] = useWatch({
    control,
    name: ["mode", "context", "questionCount", "usePdf"],
  });

  const externalPrompt = buildExternalAiPrompt({ context, questionCount, usePdf });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const controller = new AbortController();
    fetch("/api/generate-quiz", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Status unavailable");
        return response.json() as Promise<{ enabled: boolean }>;
      })
      .then((data) => setDirectEnabled(data.enabled))
      .catch((fetchError: unknown) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
        setDirectEnabled(false);
      });
    return () => {
      controller.abort();
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = Array.from(
          modalRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href]',
          ) ?? [],
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1)!;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function changeMode(nextMode: AiGeneratorMode) {
    setValue("mode", nextMode, { shouldValidate: true });
    setRequestError(null);
  }

  const generateQuiz = handleSubmit(async ({ context: lessonContext, questionCount: count }) => {
    setRequestError(null);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: lessonContext, questionCount: count }),
      });
      const data = (await response.json()) as {
        quiz?: QuizImportPayload;
        error?: { message?: string };
      };
      if (!response.ok || !data.quiz) {
        throw new Error(data.error?.message || "The quiz could not be generated.");
      }
      onGenerated(data.quiz);
      onClose();
    } catch (generationError) {
      setRequestError(
        generationError instanceof Error
          ? generationError.message
          : "The quiz could not be generated.",
      );
    }
  });

  async function copyPrompt(notice = "Prompt copied.") {
    try {
      await navigator.clipboard.writeText(externalPrompt);
      setCopied(true);
      setAssistantNotice(notice);
      window.setTimeout(() => setCopied(false), CLIPBOARD_FEEDBACK_DURATION_MS);
    } catch {
      setRequestError("Copy was blocked. Select the prompt below and copy it manually.");
    }
  }

  function openAssistant(assistant: AiAssistant) {
    setRequestError(null);
    setAssistantNotice(null);
    const newWindow = window.open(buildAssistantUrl(assistant, externalPrompt), "_blank");
    if (newWindow) newWindow.opener = null;
    void copyPrompt(
      assistant === "ChatGPT"
        ? "Prompt added to ChatGPT and copied."
        : `Prompt copied. Paste it into ${assistant}.`,
    );
    if (!newWindow) setRequestError(`Your browser blocked ${assistant}. Allow popups and try again.`);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section ref={modalRef} className="modal no-scrollbar" role="dialog" aria-modal="true" aria-labelledby="ai-modal-title">
        <div className="modal__header">
          <h2 id="ai-modal-title">Turn a lesson into a quiz</h2>
          <button ref={closeButtonRef} className="icon-button" type="button" onClick={onClose} aria-label="Close AI dialog">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="tab-list" role="tablist" aria-label="AI generation method">
          <button role="tab" aria-selected={mode === "direct"} onClick={() => changeMode("direct")}>Generate here</button>
          <button role="tab" aria-selected={mode === "external"} onClick={() => changeMode("external")}>Use an AI assistant</button>
        </div>

        {mode === "direct" ? (
          <form className="stack" onSubmit={generateQuiz} noValidate>
            {directEnabled === false && (
              <div className="inline-notice" role="status">
                Direct generation is not configured. The external assistant workflow is ready to use.
                <button type="button" onClick={() => changeMode("external")}>Use an assistant</button>
              </div>
            )}
            <label>
              Lesson context
              <textarea
                className="no-scrollbar"
                {...register("context")}
                maxLength={MAX_CONTEXT_LENGTH}
                rows={8}
                placeholder="Paste lesson notes, an article, or study material…"
                required
              />
              <small>{context.length.toLocaleString()} / {MAX_CONTEXT_LENGTH.toLocaleString()} characters</small>
              {errors.context && <span className="form-error" role="alert">{errors.context.message}</span>}
            </label>
            <label className="short-field">
              Number of questions
              <input
                type="number"
                min={MIN_AI_QUESTIONS}
                max={MAX_AI_QUESTIONS}
                {...register("questionCount", { valueAsNumber: true })}
              />
              {errors.questionCount && <span className="form-error" role="alert">{errors.questionCount.message}</span>}
            </label>
            {requestError && <p className="form-error" role="alert">{requestError}</p>}
            <button className="button button--primary" disabled={directEnabled !== true || isSubmitting}>
              {isSubmitting ? <LoaderCircle className="spin" aria-hidden="true" size={18} /> : <Bot aria-hidden="true" size={18} />}
              {isSubmitting ? "Generating…" : "Generate quiz"}
            </button>
          </form>
        ) : (
          <div className="stack">
            <label className="checkbox-field">
              <input type="checkbox" {...register("usePdf")} />
              I will attach a lesson PDF in the AI assistant
            </label>
            {!usePdf && (
              <label>
                Lesson context
                <textarea className="no-scrollbar" rows={5} {...register("context")} placeholder="Paste your lesson, or leave the placeholder in the prompt…" />
              </label>
            )}
            <label className="short-field">
              Number of questions
              <input
                type="number"
                min={MIN_AI_QUESTIONS}
                max={MAX_AI_QUESTIONS}
                {...register("questionCount", { valueAsNumber: true })}
              />
              {errors.questionCount && <span className="form-error" role="alert">{errors.questionCount.message}</span>}
            </label>
            <label>
              Generated prompt
              <textarea className="prompt-output no-scrollbar" rows={8} readOnly value={externalPrompt} onFocus={(event) => event.currentTarget.select()} />
            </label>
            <div className="assistant-actions">
              <button className="button button--secondary" type="button" onClick={() => copyPrompt()}>
                {copied ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}
                {copied ? "Copied" : "Copy prompt"}
              </button>
              {(["ChatGPT", "Claude", "Gemini"] as AiAssistant[]).map((assistant) => (
                <button className="button button--ghost" type="button" key={assistant} onClick={() => openAssistant(assistant)}>
                  {assistant}<ExternalLink aria-hidden="true" size={16} />
                </button>
              ))}
            </div>
            {assistantNotice && <p className="assistant-notice" role="status">{assistantNotice}</p>}
            <p className="muted assistant-return-note">Paste the returned JSON into Quizzone’s import field to validate and save.</p>
            {requestError && <p className="form-error" role="alert">{requestError}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
