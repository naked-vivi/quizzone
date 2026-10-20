declare global {
  interface AiGeneratorModalProps {
    onClose: () => void;
    onGenerated: (payload: QuizImportPayload) => void;
  }

  interface ConfirmationDialogProps {
    title: string;
    description: string;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
  }

  interface OptionProps {
    question: QuizQuestion;
  }

  interface QuizCardProps {
    quiz: QuizDefinition;
    highScore: number;
    onDelete?: () => void;
  }

  interface QuizPreviewProps {
    payload: QuizImportPayload;
    fallbackTitle: string;
    onSave: () => void;
  }
}

export {};
