export const AGE_RANGES = ["8-11", "12-15", "16-18"] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export const QUIZ_TOPICS = [
  "Saving",
  "Spending",
  "Budgeting",
  "Needs vs Wants",
  "Bills & Deadlines",
] as const;

export type QuizTopic = (typeof QUIZ_TOPICS)[number];

// MVP shop items (predictable pricing; no randomness)
export const SHOP_ITEMS = [
  { id: "hat_blue", name: "Blue Hat", price: 50, type: "hat" },
  { id: "hat_star", name: "Star Cap", price: 75, type: "hat" },
  { id: "bg_sky", name: "Sky Background", price: 60, type: "background" },
  { id: "bg_room", name: "Cozy Room", price: 90, type: "background" },
  { id: "acc_glasses", name: "Cool Glasses", price: 80, type: "accessory" },
  { id: "acc_backpack", name: "Backpack", price: 110, type: "accessory" },
] as const;
