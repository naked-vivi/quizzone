export default function Loader() {
  return (
    <main className="page route-loader" aria-live="polite" aria-busy="true">
      <span className="route-loader__spinner" aria-hidden="true" />
      <p>Loading…</p>
    </main>
  );
}
