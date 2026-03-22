import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await req.json();

    // Keep stock and inventoryCount in sync
    if (body.inventoryCount !== undefined && body.stock === undefined) {
      body.stock = body.inventoryCount;
    }
    if (body.stock !== undefined && body.inventoryCount === undefined) {
      body.inventoryCount = body.stock;
    }

    const product = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
