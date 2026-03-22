import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Reset all product stock to 0
    await prisma.product.updateMany({
      data: { 
        stock: 0,
        inventoryCount: 0 
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "All product stock reset to 0" 
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to reset inventory:", error);
    return NextResponse.json(
      { error: "Failed to reset inventory" },
      { status: 500 }
    );
  }
}
