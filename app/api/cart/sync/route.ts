import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Sync cart items to database
export async function POST(req: Request) {
  try {
    const { userId, items } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items must be an array" }, { status: 400 });
    }

    // Clear existing cart items for this user
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    // Insert new cart items
    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map((item: any) => ({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return NextResponse.json(
      { error: "Failed to sync cart" },
      { status: 500 }
    );
  }
}
