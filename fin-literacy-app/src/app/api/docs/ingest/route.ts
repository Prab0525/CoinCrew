import { NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { DocChunk } from "@/models/DocChunk";
import { embedText } from "@/lib/geminiEmbeddings";

const BodySchema = z.object({
  userId: z.string().min(1),
  docType: z.string().optional(),
  docText: z.string().min(50).max(20000),
});

function makeSafeSummary(docText: string) {
  // MVP SAFE STRATEGY (no AI needed yet):
  // 1) Remove emails, phone numbers
  // 2) Remove long numbers (IDs)
  // 3) Keep first ~800 chars
  const redacted = docText
    .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, "[REDACTED_EMAIL]")
    .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[REDACTED_PHONE]")
    .replace(/\b\d{6,}\b/g, "[REDACTED_ID]");

  return redacted.slice(0, 800);
}

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { userId, docText } = parsed.data;
  const docType = parsed.data.docType ?? "unknown";

  // ✅ Create safeSummary ONLY (raw docText never stored)
  const safeSummary = makeSafeSummary(docText);

  // Embedding on safeSummary (not raw doc)
  const embedding = await embedText(safeSummary);
  console.log("EMBEDDING_DIMS:", embedding.length);


  await dbConnect();
  const saved = await DocChunk.create({
    userId,
    docType,
    safeSummary,
    embedding,
    tags: ["ingested"],
  });

  return NextResponse.json({ ok: true, id: saved._id.toString() });
}
