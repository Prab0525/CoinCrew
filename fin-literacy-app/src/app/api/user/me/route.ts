import { NextResponse } from "next/server";
import type { UserMeResponse } from "@/types/api";

export async function GET() {
  const response: UserMeResponse = {
    userId: "guest_user",
    ageRange: "12-15",
    coins: 100,
    level: 1,
    equipped: { hatId: "hat_blue" },
    ownedItemIds: ["hat_blue"],
  };
  return NextResponse.json(response);
}
