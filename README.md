# Quizzone

Quizzone is a React and TypeScript quiz library that includes a built-in React quiz and lets people import, generate, save, and replay their own quizzes. Custom quizzes and per-quiz high scores persist in the browser.

## Features

- Built-in React quiz plus a library of custom quizzes
- JSON file upload and pasted JSON, including AI responses wrapped in Markdown fences
- Preview and validation before any quiz is saved
- Downloadable JSON template
- Direct quiz generation through Groq when a server key is configured
- Key-free prompt workflow for ChatGPT, Claude, and Gemini, including lessons supplied as PDFs in those assistants
- Per-quiz high scores stored under `quizzone:state:v1`
- Responsive, keyboard-accessible routes and AI dialog

## Local development

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

Vite runs on `http://localhost:4000`. JSON import, quiz play, external AI prompts, and local persistence all work in this mode.

To run the Vercel Function locally, copy the environment example and start Vercel's development server:

```bash
cp .env.example .env.local
# Add GROQ_API_KEY to .env.local
npm run dev:full
```

`GROQ_API_KEY` is read only by `api/generate-quiz.ts`. Never rename it with a `VITE_` prefix because Vite exposes those variables to the browser bundle. `GROQ_MODEL` is optional and defaults to `openai/gpt-oss-20b`.

## Supported JSON format

Download `quizzone-quiz-template.json` from the Import page, or use this shape:

```json
{
  "title": "JavaScript Fundamentals",
  "description": "A short quiz about JavaScript basics.",
  "questions": [
    {
      "question": "Which keyword declares a block-scoped variable?",
      "options": ["var", "let", "define", "static"],
      "correctOption": 1,
      "points": 10
    }
  ]
}
```

The older `{ "questions": [...] }` format remains valid. Uploaded quizzes without a title use the filename; pasted quizzes use `Custom Quiz`. Descriptions default to `Imported quiz` and points default to `10`.

Validation requires 1–100 questions, exactly four non-empty options, a zero-based `correctOption` from 0 to 3, and 1–100 points. Uploads must be `.json` files no larger than 1 MB.

## AI generation

The AI dialog provides two paths:

1. **Generate here** sends lesson text to the server-side Groq endpoint and returns structured, validated JSON.
2. **Use an AI assistant** copies a strict prompt and opens ChatGPT, Claude, or Gemini. For a PDF lesson, attach the PDF in the selected assistant. Quizzone never uploads or parses that PDF. Paste the returned JSON into the Import page for normal validation and preview.

The server accepts `POST /api/generate-quiz` with:

```json
{ "context": "Lesson text", "questionCount": 10 }
```

Context must contain 3–12,000 characters. Question count can be 1–30 and defaults to 10. `GET /api/generate-quiz` returns `{ "enabled": true | false }`. The in-memory limit is five generation attempts per IP per ten minutes; it is best-effort protection for a portfolio demo and is not a distributed production rate limiter.

Before publishing a public deployment, configure a small Groq account spend limit and monitor usage. Lesson text and secrets are not logged by the function.

## Deployment

Deploy the repository to Vercel and add `GROQ_API_KEY` in the project environment settings. `vercel.json` sends direct visits such as `/import` and `/quiz/:quizId` to the SPA while `/api/generate-quiz` is served as a Vercel Function.

If the key is missing or the AI provider is unavailable, the app keeps working and automatically offers the external-assistant workflow.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
