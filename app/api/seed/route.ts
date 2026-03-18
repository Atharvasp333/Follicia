import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productsData } from "@/lib/data/products";

export async function POST() {
  try {
    console.log("🌱 Starting database seed...");

    // Get all existing products
    const existingProducts = await prisma.product.findMany();
    console.log(`📊 Found ${existingProducts.length} existing products`);

    let updatedCount = 0;
    let createdCount = 0;

    for (const productData of productsData) {
      // Find existing product by name
      const existing = existingProducts.find((p) => p.name === productData.name);

      if (existing) {
        // Update existing product with imageUrl and other data
        await prisma.product.update({
          where: { id: existing.id },
          data: productData,
        });
        updatedCount++;
        console.log(`✅ Updated: ${productData.name}`);
      } else {
        // Create new product
        await prisma.product.create({
          data: productData,
        });
        createdCount++;
        console.log(`✨ Created: ${productData.name}`);
      }
    }

    console.log(`✅ Successfully seeded: ${createdCount} created, ${updatedCount} updated`);

    // Verify the data
    const count = await prisma.product.count();
    console.log(`📊 Total products in database: ${count}`);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded products: ${createdCount} created, ${updatedCount} updated`,
      totalProducts: count,
      created: createdCount,
      updated: updatedCount,
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
