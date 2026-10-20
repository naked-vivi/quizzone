import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router";
import QuizProvider from "./context/quiz-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QuizProvider>
      <Router />
    </QuizProvider>
  </StrictMode>,
);
