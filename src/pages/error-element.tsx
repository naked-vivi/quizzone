import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import useTitle from "../hooks/use-title";

export default function ErrorElement() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText || `Request failed with status ${error.status}.`
    : error instanceof Error
      ? error.message
      : "The page could not be loaded.";

  useTitle("Something Went Wrong");

  return (
    <main className="page empty-state route-state">
      <h1>Something went wrong</h1>
      <p>{message}</p>
      <Link className="button button--primary" to="/">Return home</Link>
    </main>
  );
}
