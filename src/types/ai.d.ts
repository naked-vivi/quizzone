declare global {
  type AiAssistant = "ChatGPT" | "Claude" | "Gemini";
  type AiGeneratorMode = "direct" | "external";

  interface QuizApiEnvironment {
    GROQ_API_KEY?: string;
    GROQ_MODEL?: string;
  }
}

export { };
