import type { PersistedQuizState } from "../type";
import { persistedQuizStateSchema } from "./quizSchema";

export const QUIZZONE_STORAGE_KEY = "quizzone:state:v1";

export const emptyPersistedState: PersistedQuizState = {
  version: 1,
  customQuizzes: [],
  highScores: {},
};

export function loadQuizState(storage: Storage | undefined): {
  data: PersistedQuizState;
  warning: string | null;
} {
  if (!storage) {
    return { data: emptyPersistedState, warning: "Saved quizzes are unavailable in this browser." };
  }

  try {
    const raw = storage.getItem(QUIZZONE_STORAGE_KEY);
    if (!raw) return { data: emptyPersistedState, warning: null };
    const parsed = persistedQuizStateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) throw new Error("Invalid saved state");
    return { data: parsed.data, warning: null };
  } catch {
    return {
      data: emptyPersistedState,
      warning: "Saved quiz data could not be read. You can still use Quizzone in this tab.",
    };
  }
}

export function saveQuizState(storage: Storage | undefined, state: PersistedQuizState): string | null {
  if (!storage) return "Changes cannot be saved in this browser.";
  try {
    storage.setItem(QUIZZONE_STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch {
    return "Changes could not be saved. Check your browser storage settings.";
  }
}
