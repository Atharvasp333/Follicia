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

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        tagline: body.tagline,
        price: body.price,
        priceDisplay: body.priceDisplay,
        imageUrl: body.imageUrl,
        category: body.category,
        stock: body.stock,
        inventoryCount: body.inventoryCount || 0,
        lowStockThreshold: body.lowStockThreshold || 5,
        badge: body.badge,
        aiMatchTag: body.aiMatchTag,
        ingredients: body.ingredients || [],
        hairType: body.hairType || [],
        porosity: body.porosity || [],
        scalpCondition: body.scalpCondition || [],
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
