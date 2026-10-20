import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PersistenceBanner from "./components/PersistenceBanner";
import HomePage from "./pages/HomePage";
import ImportPage from "./pages/ImportPage";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <div className="app">
      <Header />
      <PersistenceBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
