import { NextResponse } from "next/server";

export async function POST() {
  // Stub: Person D will wire this to DB.
  return NextResponse.json({ ok: true });
}
