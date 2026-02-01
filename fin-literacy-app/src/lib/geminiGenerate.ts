const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";

export async function geminiGenerate(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY in .env.local");

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=` +
    encodeURIComponent(apiKey);

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3 },
    }),
  });

  if (!resp.ok) throw new Error(await resp.text());
  const data = await resp.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}
