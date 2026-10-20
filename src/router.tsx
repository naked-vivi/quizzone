import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import RootLayout from "@/components/root-layout";
import Loader from "@/components/shared/loader";
import RouteErrorBoundary from "@/components/shared/route-error-boundary";
import { lazyPage } from "@/lib/router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <RouteErrorBoundary />,
    HydrateFallback: Loader,
    children: [
      { index: true, lazy: lazyPage(() => import("@/pages/home-page")) },
      { path: "import", lazy: lazyPage(() => import("@/pages/import-page")) },
      { path: "quiz/:quizId", lazy: lazyPage(() => import("@/pages/quiz-page")) },
    ],
  },
  {
    path: "*",
    lazy: lazyPage(() => import("@/pages/not-found-page")),
    HydrateFallback: Loader,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
