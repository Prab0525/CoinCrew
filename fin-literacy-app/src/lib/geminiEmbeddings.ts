import { geminiGenerate } from "@/lib/geminiGenerate";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in .env.local");
const apiKey: string = GEMINI_API_KEY;

export async function embedText(text: string): Promise<number[]> {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=" +
    encodeURIComponent(apiKey);
    

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Gemini embed error: ${resp.status} ${t}`);
  }

  const data = await resp.json();
  const values = data?.embedding?.values;
  if (!Array.isArray(values)) throw new Error("No embedding returned");
  return values as number[];
}
