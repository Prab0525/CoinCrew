import type { AgeRange, QuizTopic } from "@/utils/constants";

export type DocsExplainRequest = {
  ageRange: AgeRange;
  docText: string;
  docType?: string; // optional hint: "government", "school", "bank", etc.
};

export type DocsExplainResponse = {
  oneSentence: string;
  breakdown: string[];
  keyDetails: {
    deadlines?: string[];
    amounts?: string[];
    actions?: string[];
  };
  glossary: { term: string; meaning: string }[];
  tags?: string[]; // optional
};

export type QuizGenerateRequest = {
  ageRange: AgeRange;
  topic?: QuizTopic | "Surprise me";
  difficulty?: "easy" | "medium" | "hard";
};

export type QuizQuestion = {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizGenerateResponse = {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
};

export type QuizSubmitRequest = {
  answers: { questionId: string; chosenIndex: number }[];
  quiz: QuizGenerateResponse; // include quiz payload for MVP (no DB dependency yet)
};

export type QuizSubmitResponse = {
  score: number;
  total: number;
  coinsEarned: number;
  feedback: string;
};

export type UserMeResponse = {
  userId: string;
  ageRange: AgeRange;
  coins: number;
  level: number;
  equipped: {
    hatId?: string;
    backgroundId?: string;
    accessoryId?: string;
  };
  ownedItemIds: string[];
};
