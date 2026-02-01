import { Schema, model, models } from "mongoose";

const DocChunkSchema = new Schema(
  {
    userId: { type: String, required: true }, // guest or auth id
    docType: { type: String, default: "unknown" },

    // SAFE: a redacted summary or short excerpt WITHOUT personal info
    safeSummary: { type: String, required: true },

    // Vector embedding for Atlas Vector Search
    embedding: { type: [Number], required: true },

    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const DocChunk = models.DocChunk || model("DocChunk", DocChunkSchema);
