import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIRMATION_ANIMATION_DURATION_MS } from "../lib/constants";

export default function ConfirmationDialog({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeWith = useCallback((action: () => void) => {
    if (closeTimerRef.current !== null) return;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(action, CONFIRMATION_ANIMATION_DURATION_MS);
  }, []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();

    return () => previouslyFocused?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeWith(onCancel);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeWith, onCancel]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <div
      className={`modal-backdrop confirmation-backdrop ${isClosing ? "confirmation-backdrop--closing" : ""}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeWith(onCancel);
      }}
    >
      <section
        className={`confirmation-dialog ${isClosing ? "confirmation-dialog--closing" : ""}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
      >
        <h2 id="confirmation-title">{title}</h2>
        <p id="confirmation-description">{description}</p>
        <div className="confirmation-dialog__actions">
          <button ref={cancelButtonRef} className="button" type="button" onClick={() => closeWith(onCancel)}>
            Cancel
          </button>
          <button className="button button--danger" type="button" onClick={() => closeWith(onConfirm)}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
