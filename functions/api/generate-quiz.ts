import { handleGenerateQuiz } from "../../api/generate-quiz";

interface CloudflareFunctionContext {
  request: Request;
  env: QuizApiEnvironment;
}

export function onRequest({ request, env }: CloudflareFunctionContext): Promise<Response> {
  return handleGenerateQuiz(request, env);
}
