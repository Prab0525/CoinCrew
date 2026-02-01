import { NextResponse } from "next/server";
import type { QuizGenerateRequest, QuizGenerateResponse } from "@/types/api";
import { callGeminiText } from "@/lib/gemini";

export async function POST(req: Request) {
  const body = (await req.json()) as QuizGenerateRequest;

  const difficulty = body.difficulty ?? "easy";

  // Map difficulty string to a simple level number
  const level = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

  try {
    const prompt = `
Return ONLY a JSON array of 10 financial literacy multiple choice questions for Level ${level} (difficulty: ${
      level === 1 ? "easy" : level === 2 ? "medium" : "hard"
    }).

Each question should have a \"question\" string, an \"options\" array of 4 strings, and an \"answerIndex\" indicating the correct option (0-3). Keep questions age-appropriate for the difficulty.

Format ONLY as valid JSON array, for example:
[
  {"question":"...","options":["A","B","C","D"],"answerIndex":0}
]
`;

    const geminiText = await callGeminiText(prompt);
    let jsonText = geminiText.replace(/```json|```/g, "").trim();
    const generated = JSON.parse(jsonText);

    // Ensure we have exactly 10 items and normalized keys
    const questions = generated
      .slice(0, 10)
      .map((q: any, idx: number) => ({
        id: `q${idx + 1}`,
        question: q.question,
        choices: q.options,
        correctIndex: q.answerIndex,
        explanation: q.explanation || "",
      }));

    const response: QuizGenerateResponse = {
      topic: body.topic && body.topic !== "Surprise me" ? body.topic : "Financial Literacy",
      difficulty,
      questions,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Failed to generate questions:", err);

    // Fallback mocks per difficulty (10 items each)
    const mock: Record<string, any[]> = {
      easy: [
        { question: "What is budgeting?", options: ["Making a spending plan", "Saving all your money", "Avoiding spending", "Earning more money"], answerIndex: 0 },
        { question: "Which is a NEED?", options: ["Video game", "Candy", "Food", "New shoes for style"], answerIndex: 2 },
        { question: "What does saving money mean?", options: ["Spending it quickly", "Keeping money for future use", "Investing in stocks", "Borrowing from friends"], answerIndex: 1 },
        { question: "If you earn 10 coins and spend 3, how much is left?", options: ["7", "5", "13", "3"], answerIndex: 0 },
        { question: "What is a want?", options: ["Food", "Water", "A toy", "Shelter"], answerIndex: 2 },
        { question: "Where can you keep your money safe?", options: ["Under your bed", "A bank", "Your pocket", "A hole in the ground"], answerIndex: 1 },
        { question: "What does 'income' mean?", options: ["Money you spend", "Money you earn", "Money you borrow", "Money you find"], answerIndex: 1 },
        { question: "What is the first step in budgeting?", options: ["Spend money", "Track your income and expenses", "Invest", "Borrow money"], answerIndex: 1 },
        { question: "Which is NOT a financial goal?", options: ["Saving for college", "Buying a house", "Eating pizza", "Saving for retirement"], answerIndex: 2 },
        { question: "What helps you manage your money?", options: ["Ignoring bills", "A budget", "Spending more", "Not checking your balance"], answerIndex: 1 },
      ],
      medium: [
        { question: "What is compound interest?", options: ["Interest on your interest", "Simple multiplication", "A bank fee", "A type of loan"], answerIndex: 0 },
        { question: "If you invest $100 at 5% annual interest, how much will you have after 1 year?", options: ["$105", "$95", "$110", "$100"], answerIndex: 0 },
        { question: "What is a credit score used for?", options: ["Your age", "How responsible you are with money", "Your height", "Your favorite color"], answerIndex: 1 },
        { question: "Which is an asset?", options: ["Credit card debt", "A car you own", "A loan", "A bill you owe"], answerIndex: 1 },
        { question: "What does 'inflation' mean?", options: ["Blowing up balloons", "Prices going up over time", "Interest rates", "Taxes"], answerIndex: 1 },
        { question: "What's the benefit of diversifying investments?", options: ["Making more money", "Reducing risk", "Easier taxes", "Lower fees"], answerIndex: 1 },
        { question: "How should you build an emergency fund?", options: ["Spend it all", "Save 3-6 months of expenses", "Invest in stocks", "Keep it at home"], answerIndex: 1 },
        { question: "What is a 401(k)?", options: ["A bank account", "A retirement savings plan", "A credit card", "A loan"], answerIndex: 1 },
        { question: "What does ROI stand for?", options: ["Return on Investment", "Rate of Income", "Retirement Option Index", "Risk of Inflation"], answerIndex: 0 },
        { question: "Which minimizes risk when investing?", options: ["Putting all in one stock", "Diversification", "Day trading", "Ignoring losses"], answerIndex: 1 },
      ],
      hard: [
        { question: "What is the relationship between bond prices and interest rates?", options: ["Direct", "Inverse", "No relationship", "Exponential"], answerIndex: 1 },
        { question: "How does tax-loss harvesting work?", options: ["Growing crops", "Using losses to offset gains", "Finding money", "A farming method"], answerIndex: 1 },
        { question: "What is a derivative in finance?", options: ["A math term", "A contract based on underlying assets", "A bank fee", "An investment"], answerIndex: 1 },
        { question: "What does 'beta' measure in stocks?", options: ["Quality", "Volatility compared to market", "Company size", "Profit margin"], answerIndex: 1 },
        { question: "What is quantitative easing?", options: ["Losing money", "Central bank buying bonds to increase money supply", "Reducing taxes", "An accounting method"], answerIndex: 1 },
        { question: "How do hedge funds typically operate?", options: ["Openly regulated", "Using aggressive strategies with pooled capital", "Low risk", "Only long positions"], answerIndex: 1 },
        { question: "What is negative correlation?", options: ["Bad feelings", "Assets moving opposite directions", "Loss of money", "Inflation"], answerIndex: 1 },
        { question: "What does 'contango' refer to?", options: ["A dance", "Future prices higher than spot prices", "Interest rates", "Currency exchange"], answerIndex: 1 },
        { question: "How is standard deviation used in investing?", options: ["Measuring average", "Measuring volatility/risk", "Calculating profit", "Determining debt"], answerIndex: 1 },
        { question: "What is the Sharpe ratio used for?", options: ["Comparing stocks", "Risk-adjusted returns analysis", "Company valuation", "Market timing"], answerIndex: 1 },
      ],
    };

    const selected = mock[difficulty as keyof typeof mock] || mock.easy;
    const questions = selected.slice(0, 10).map((q, idx) => ({
      id: `q${idx + 1}`,
      question: q.question,
      choices: q.options,
      correctIndex: q.answerIndex,
      explanation: "",
    }));

    const response: QuizGenerateResponse = {
      topic: body.topic && body.topic !== "Surprise me" ? body.topic : "Financial Literacy",
      difficulty,
      questions,
    };

    return NextResponse.json(response);
  }
}
