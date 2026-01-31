import { NextResponse } from "next/server";
import type { QuizGenerateRequest, QuizGenerateResponse } from "@/types/api";

export async function POST(req: Request) {
  const body = (await req.json()) as QuizGenerateRequest;

  const response: QuizGenerateResponse = {
    topic: body.topic && body.topic !== "Surprise me" ? body.topic : "Budgeting",
    difficulty: body.difficulty ?? "easy",
    questions: [
      {
        id: "q1",
        question: "If you earn 10 coins and spend 6, how many coins are left?",
        choices: ["2", "3", "4", "6"],
        correctIndex: 2,
        explanation: "10 - 6 = 4 coins left.",
      },
      {
        id: "q2",
        question: "Which is a NEED?",
        choices: ["Candy", "Rent", "Video game", "New shoes for style"],
        correctIndex: 1,
        explanation: "Rent/shelter is a need.",
      },
    ],
  };

  return NextResponse.json(response);
}
