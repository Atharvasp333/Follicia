import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch user's cart from database
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            priceDisplay: true,
            imageUrl: true,
            category: true,
          },
        },
      },
    });

    // Transform to CartItem format
    const items = cartItems.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      priceDisplay: item.product.priceDisplay || `₹${item.product.price.toLocaleString("en-IN")}`,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
      category: item.product.category,
    }));

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// DELETE - Clear user's cart
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
