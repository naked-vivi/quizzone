import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import ErrorElement from "@/pages/error-element";
import HomePage from "@/pages/home-page";
import ImportPage from "@/pages/import-page";
import NotFoundPage from "@/pages/not-found-page";
import QuizPage from "@/pages/quiz-page";
import RootLayout from "@/pages/root-layout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorElement />,
    children: [
      { index: true, Component: HomePage },
      { path: "import", Component: ImportPage },
      { path: "quiz/:quizId", Component: QuizPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
