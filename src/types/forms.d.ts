declare global {
  interface QuizImportFormValues {
    jsonText: string;
  }

  interface AiGeneratorFormValues {
    mode: AiGeneratorMode;
    context: string;
    questionCount: number;
    usePdf: boolean;
  }

  interface ExternalAiPromptOptions {
    context: string;
    questionCount: number;
    usePdf: boolean;
  }
}

export {};
