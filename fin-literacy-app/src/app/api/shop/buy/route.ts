import { NextResponse } from "next/server";
import { user, shopItems } from "@/lib/shopDb";

export async function POST(req: Request) {
  const { itemId } = await req.json();

  const item = shopItems.find(i => i.id === itemId);

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (user.coins < item.price) {
    return NextResponse.json({ error: "Not enough coins" }, { status: 400 });
  }

  // Deduct coins
  user.coins -= item.price;

  // Add item to inventory
  user.inventory.push(item);

  return NextResponse.json({
    success: true,
    coins: user.coins,
    inventory: user.inventory,
  });
}
