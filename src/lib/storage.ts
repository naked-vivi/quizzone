import { STORAGE_KEY, STORAGE_VERSION } from "./constants";
import { persistedQuizStateSchema } from "./validators";

export const QUIZZONE_STORAGE_KEY = STORAGE_KEY;

export const emptyPersistedState: PersistedQuizState = {
  version: STORAGE_VERSION,
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
    const raw = storage.getItem(STORAGE_KEY);
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
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch {
    return "Changes could not be saved. Check your browser storage settings.";
  }
}
