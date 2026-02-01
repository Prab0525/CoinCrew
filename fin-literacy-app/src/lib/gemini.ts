// Minimal helper. Person B will expand prompts + parsing.
// For MVP stubs, we can return mocked data if GEMINI_API_KEY missing.
import { geminiGenerate } from "@/lib/geminiGenerate";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function callGeminiText(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Mock fallback for local dev
    return "MOCK_RESPONSE";
  }

  // Keep it simple: direct REST call.
  // Person B can replace with official SDK if desired.
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
    encodeURIComponent(GEMINI_API_KEY);

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini error: ${resp.status} ${errText}`);
  }

  const data = await resp.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
  return text || "NO_TEXT_RETURNED";
}
