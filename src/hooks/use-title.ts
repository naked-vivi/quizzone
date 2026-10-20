import { useEffect } from "react";
import { APP_TITLE } from "../lib/constants";

export default function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${APP_TITLE}`;

    return () => {
      document.title = APP_TITLE;
    };
  }, [title]);
}
