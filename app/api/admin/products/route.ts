import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Creating product:", body.name);

    // Validation
    if (!body.name || !body.description || body.price === undefined || body.stock === undefined) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, description, price, and stock are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        tagline: body.tagline || null,
        price: parseFloat(body.price),
        priceDisplay: body.priceDisplay || `₹${parseFloat(body.price).toLocaleString("en-IN")}`,
        imageUrl: body.imageUrl || null,
        category: body.category || null,
        stock: parseInt(body.stock),
        inventoryCount: parseInt(body.inventoryCount || body.stock),
        lowStockThreshold: parseInt(body.lowStockThreshold || 5),
        badge: body.badge || null,
        aiMatchTag: body.aiMatchTag || null,
        ingredients: body.ingredients || [],
        hairType: body.hairType || [],
        porosity: body.porosity || [],
        scalpCondition: body.scalpCondition || [],
        isActive: body.isActive !== undefined ? body.isActive : true,
        // Initialize analytics counters
        viewsCount: 0,
        addToCartCount: 0,
        purchaseCount: 0,
        cancelCount: 0,
        rating: 0,
        reviews: 0,
      },
    });

    console.log("✅ Product created:", product.id);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Failed to create product:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { success: false, error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}
