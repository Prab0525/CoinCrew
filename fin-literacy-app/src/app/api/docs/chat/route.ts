import { NextResponse } from "next/server";
import { z } from "zod";
import { ageStyle } from "@/lib/ageStyle";
import { geminiGenerate } from "@/lib/geminiGenerate";

export const runtime = "nodejs";

const BodySchema = z.object({
  ageRange: z.enum(["8-11", "12-15", "16-18"]),
  safeSummary: z.string().min(1).max(2000),
  message: z.string().min(1).max(500),
});


export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { ageRange, safeSummary, message } = parsed.data;
  const style = ageStyle(ageRange);

  const prompt = `
You are a safe financial literacy helper for youth.

Audience: ${style.level}
Rules:
${style.rules.map(r => `- ${r}`).join("\n")}
- Do NOT give legal advice.
- Do NOT request or repeat personal info.
- If serious: say talk to a trusted adult/case worker.

Context (safe summary of the document):
${safeSummary}

User question:
${message}

Answer in a helpful, calm way.
`;

  const reply = await geminiGenerate(prompt);
  return NextResponse.json({ ok: true, reply });
}
