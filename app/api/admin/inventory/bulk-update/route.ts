import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { updates } = body; // Array of { id: string, inventoryCount: number }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // Perform bulk updates
    await Promise.all(
      updates.map((update: { id: string; inventoryCount: number }) =>
        prisma.product.update({
          where: { id: update.id },
          data: { 
            inventoryCount: update.inventoryCount,
            stock: update.inventoryCount // Keep both in sync
          },
        })
      )
    );

    return NextResponse.json({ 
      success: true,
      message: `Updated ${updates.length} products` 
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to bulk update inventory:", error);
    return NextResponse.json(
      { error: "Failed to bulk update inventory" },
      { status: 500 }
    );
  }
}
