import { NextResponse } from "next/server";
import { z } from "zod";
import { ageStyle } from "@/lib/ageStyle";
import { geminiGenerate } from "@/lib/geminiGenerate";
import { dbConnect } from "@/lib/db";
import { DocChunk } from "@/models/DocChunk";
import { embedText } from "@/lib/geminiEmbeddings";

export const runtime = "nodejs";

const BodySchema = z.object({
  userId: z.string().min(1),
  ageRange: z.enum(["8-11", "12-15", "16-18"]),
  docType: z.string().optional(),
  docText: z.string().min(50).max(30000),
});

function redact(docText: string) {
  return docText
    .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, "[REDACTED_EMAIL]")
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[REDACTED_PHONE]")
    .replace(/\b\d{6,}\b/g, "[REDACTED_ID]");
}

// Gemini “generateContent” helper (no SDK needed)


function safeJsonParse(text: string) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, ageRange, docText } = parsed.data;
  const docType = parsed.data.docType ?? "unknown";

  const style = ageStyle(ageRange);
  const redactedText = redact(docText);

  const prompt = `
You help kids/teens understand government/financial documents safely.

Audience: ${style.level}
Rules:
${style.rules.map(r => `- ${r}`).join("\n")}
- Do NOT give legal advice.
- Do NOT repeat personal info.
- If serious (court/eviction/debt collection): say "talk to a trusted adult/case worker".

Return ONLY valid JSON exactly matching this schema:
{
  "oneSentence": string,
  "breakdown": string[],
  "keyDetails": {
    "deadline": string | null,
    "amount": string | null,
    "whoIsItFrom": string | null,
    "whatToDoNext": string
  },
  "glossary": { "term": string, "meaning": string }[],
  "safeSummary": string
}

Document type: ${docType}
Document text (already redacted):
---
${redactedText.slice(0, 12000)}
---
`;

  const raw = await geminiGenerate(prompt);
  const explained = safeJsonParse(raw);

  // ✅ store only safeSummary for vector search (no docText)
  const safeSummary = String(explained.safeSummary || "").slice(0, 1200);
  const embedding = await embedText(safeSummary);

  await dbConnect();
  const saved = await DocChunk.create({
    userId,
    docType,
    safeSummary,
    embedding,
    tags: ["explained", ageRange],
  });

  return NextResponse.json({ ok: true, docId: saved._id.toString(), ...explained });
}
