import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { embedText } from "@/lib/geminiEmbeddings";

const BodySchema = z.object({
  userId: z.string().min(1),
  query: z.string().min(3).max(300),
  limit: z.number().int().min(1).max(10).default(5),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { userId, query, limit } = parsed.data;

  // ✅ CREATE THE EMBEDDING (THIS WAS MISSING)
  const queryEmbedding = await embedText(query);

  await dbConnect();

  const results = await mongoose.connection
    .collection("docchunks")
    .aggregate([
      {
        $vectorSearch: {
          index: "docchunks_embedding_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 200,
          limit: limit * 5,
        },
      },
      { $match: { userId } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          docType: 1,
          safeSummary: 1,
          tags: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ])
    .toArray();

  return NextResponse.json({ ok: true, results });
}
