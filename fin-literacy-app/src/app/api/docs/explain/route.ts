import { NextResponse } from "next/server";
import type { DocsExplainRequest, DocsExplainResponse } from "@/types/api";

export async function POST(req: Request) {
  const body = (await req.json()) as DocsExplainRequest;

  const response: DocsExplainResponse = {
    oneSentence: `This is a simple explanation for age range ${body.ageRange}.`,
    breakdown: [
      "What this is: a letter or document about money or services.",
      "Why it matters: it may affect support, deadlines, or payments.",
      "What to look for: dates, amounts, and required actions.",
    ],
    keyDetails: {
      deadlines: [],
      amounts: [],
      actions: ["Check if there is a deadline and ask a trusted adult if unsure."],
    },
    glossary: [
      { term: "Deadline", meaning: "The last date you can do something." },
      { term: "Benefit", meaning: "Money or help you may receive from a program." },
    ],
    tags: ["mvp", "mock"],
  };

  return NextResponse.json(response);
}
