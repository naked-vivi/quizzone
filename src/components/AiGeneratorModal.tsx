import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Check, Copy, ExternalLink, LoaderCircle, X } from "lucide-react";
import { buildAssistantUrl, buildExternalAiPrompt, type AiAssistant } from "../lib/aiPrompt";
import type { QuizImportPayload } from "../type";

interface AiGeneratorModalProps {
  onClose: () => void;
  onGenerated: (payload: QuizImportPayload) => void;
}

type Mode = "direct" | "external";

export default function AiGeneratorModal({ onClose, onGenerated }: AiGeneratorModalProps) {
  const [mode, setMode] = useState<Mode>("direct");
  const [context, setContext] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [usePdf, setUsePdf] = useState(false);
  const [directEnabled, setDirectEnabled] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [assistantNotice, setAssistantNotice] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);

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

  async function handleGenerate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, questionCount }),
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
      setError(
        generationError instanceof Error
          ? generationError.message
          : "The quiz could not be generated.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyPrompt(notice = "Prompt copied.") {
    try {
      await navigator.clipboard.writeText(externalPrompt);
      setCopied(true);
      setAssistantNotice(notice);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copy was blocked. Select the prompt below and copy it manually.");
    }
  }

  function openAssistant(assistant: AiAssistant) {
    setError(null);
    setAssistantNotice(null);
    const newWindow = window.open(buildAssistantUrl(assistant, externalPrompt), "_blank");
    if (newWindow) newWindow.opener = null;
    void copyPrompt(
      assistant === "ChatGPT"
        ? "Prompt added to ChatGPT and copied."
        : `Prompt copied. Paste it into ${assistant}.`,
    );
    if (!newWindow) setError(`Your browser blocked ${assistant}. Allow popups and try again.`);
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
          <button role="tab" aria-selected={mode === "direct"} onClick={() => setMode("direct")}>Generate here</button>
          <button role="tab" aria-selected={mode === "external"} onClick={() => setMode("external")}>Use an AI assistant</button>
        </div>

        {mode === "direct" ? (
          <form className="stack" onSubmit={handleGenerate}>
            {directEnabled === false && (
              <div className="inline-notice" role="status">
                Direct generation is not configured. The external assistant workflow is ready to use.
                <button type="button" onClick={() => setMode("external")}>Use an assistant</button>
              </div>
            )}
            <label>
              Lesson context
              <textarea
                className="no-scrollbar"
                value={context}
                onChange={(event) => setContext(event.target.value)}
                minLength={3}
                maxLength={12000}
                rows={8}
                placeholder="Paste lesson notes, an article, or study material…"
                required
              />
              <small>{context.length.toLocaleString()} / 12,000 characters</small>
            </label>
            <label className="short-field">
              Number of questions
              <input type="number" min={1} max={30} value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button--primary" disabled={directEnabled !== true || isGenerating}>
              {isGenerating ? <LoaderCircle className="spin" aria-hidden="true" size={18} /> : <Bot aria-hidden="true" size={18} />}
              {isGenerating ? "Generating…" : "Generate quiz"}
            </button>
          </form>
        ) : (
          <div className="stack">
            <label className="checkbox-field">
              <input type="checkbox" checked={usePdf} onChange={(event) => setUsePdf(event.target.checked)} />
              I will attach a lesson PDF in the AI assistant
            </label>
            {!usePdf && (
              <label>
                Lesson context
                <textarea className="no-scrollbar" rows={5} value={context} onChange={(event) => setContext(event.target.value)} placeholder="Paste your lesson, or leave the placeholder in the prompt…" />
              </label>
            )}
            <label className="short-field">
              Number of questions
              <input type="number" min={1} max={30} value={questionCount} onChange={(event) => setQuestionCount(Math.min(30, Math.max(1, Number(event.target.value) || 10)))} />
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
            <p className="muted assistant-return-note">Paste the returned JSON into the import field after you come back. Quizzone will validate it before saving.</p>
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
