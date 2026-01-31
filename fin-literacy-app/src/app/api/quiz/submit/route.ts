import { NextResponse } from "next/server";
import type { QuizSubmitRequest, QuizSubmitResponse } from "@/types/api";

export async function POST(req: Request) {
  const body = (await req.json()) as QuizSubmitRequest;

  const total = body.quiz.questions.length;
  let score = 0;

  const answerMap = new Map(body.answers.map((a) => [a.questionId, a.chosenIndex]));
  for (const q of body.quiz.questions) {
    if (answerMap.get(q.id) === q.correctIndex) score++;
  }

  const coinsEarned = Math.max(5, score * 5);
  const response: QuizSubmitResponse = {
    score,
    total,
    coinsEarned,
    feedback: score === total ? "Perfect! Great job." : "Nice work — keep going!",
  };

  return NextResponse.json(response);
}
