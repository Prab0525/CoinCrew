import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env.local");

// Type assertion: tell TypeScript MONGODB_URI is a string
const mongoUri: string = MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongo:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached = global._mongo ?? { conn: null, promise: null };
global._mongo = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: "fin_literacy_app" });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
