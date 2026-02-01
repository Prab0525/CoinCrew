export type AgeRange = "8-11" | "12-15" | "16-18";

export function ageStyle(ageRange: AgeRange) {
  if (ageRange === "8-11") {
    return {
      level: "kid" as const,
      rules: [
        "Use very simple words (Grade 3–5).",
        "Short sentences.",
        "Friendly, calm tone.",
        "Explain confusing words with tiny examples.",
        "Give 1–2 actions max."
      ],
    };
  }

  if (ageRange === "12-15") {
    return {
      level: "teen" as const,
      rules: [
        "Simple but not baby-ish.",
        "Explain key terms briefly.",
        "Give clear steps and why they matter.",
        "No legal advice; suggest trusted adult/case worker if serious."
      ],
    };
  }

  return {
    level: "olderTeen" as const,
    rules: [
      "More detailed and mature tone.",
      "Include specifics like deadlines/amounts if present.",
      "Still no legal advice; suggest trusted adult/case worker when needed."
    ],
  };
}
