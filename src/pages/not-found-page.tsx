import { Link } from "react-router";
import useTitle from "../hooks/use-title";

export default function NotFoundPage() {
  useTitle("Page Not Found");

  return (
    <main className="page empty-state">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="button button--primary" to="/">Return home</Link>
    </main>
  );
}
