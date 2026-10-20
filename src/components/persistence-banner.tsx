import { AlertTriangle } from "lucide-react";
import useQuiz from "../hooks/use-quiz";

export default function PersistenceBanner() {
  const { persistenceWarning } = useQuiz();
  if (!persistenceWarning) return null;

  return (
    <div className="storage-warning" role="status">
      <AlertTriangle aria-hidden="true" size={18} />
      {persistenceWarning}
    </div>
  );
}
