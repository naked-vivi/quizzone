// * Quiz timing & scoring
export const SECS_PER_QUESTION = 30;
export const SECS_PER_MINUTE = 60;
export const MILLISECONDS_PER_SECOND = 1000;
export const TIMER_INTERVAL_MS = MILLISECONDS_PER_SECOND;
export const DEFAULT_POINTS_PER_QUESTION = 10;
export const MIN_POINTS = 1;
export const MAX_POINTS = 100;

// * Quiz size limits
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 100;
export const OPTIONS_COUNT = 4;

// * File & Import limits
export const MAX_QUIZ_FILE_SIZE = 1024 * 1024;
export const FALLBACK_QUIZ_TITLE = "Custom Quiz";
export const FALLBACK_QUIZ_DESCRIPTION = "Imported quiz";
export const AI_FALLBACK_QUIZ_TITLE = "AI Quiz";
export const PREVIEW_QUESTIONS_DISPLAY_LIMIT = 3;

// * Score tiers (percentages)
export const PERCENTAGE_MULTIPLIER = 100;
export const SCORE_PERCENTAGE_PERFECT = 100;
export const SCORE_PERCENTAGE_GREAT = 80;
export const SCORE_PERCENTAGE_PASS = 50;
export const SCORE_PERCENTAGE_LOW = 0;

// * AI generation limits & settings
export const MIN_CONTEXT_LENGTH = 3;
export const MAX_CONTEXT_LENGTH = 12000;
export const MIN_AI_QUESTIONS = 1;
export const MAX_AI_QUESTIONS = 30;
export const DEFAULT_AI_QUESTIONS = 10;
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";
export const CLIPBOARD_FEEDBACK_DURATION_MS = 1800;
export const CONFIRMATION_ANIMATION_DURATION_MS = 180;

// * App metadata & downloads
export const APP_TITLE = "Quizzone | Build, play, improve";
export const QUIZ_TEMPLATE_FILENAME = "quizzone-quiz-template.json";
export const JSON_MIME_TYPE = "application/json";

// * Storage
export const STORAGE_KEY = "quizzone:state:v1";
export const STORAGE_VERSION = 1 as const;
