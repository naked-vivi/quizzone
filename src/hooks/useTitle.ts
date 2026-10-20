import { useEffect } from "react";

const APP_TITLE = "Quizzone";

export default function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${APP_TITLE}`;

    return () => {
      document.title = APP_TITLE;
    };
  }, [title]);
}
