/**
 * Follicia Database Seed Script
 * 
 * This script populates the Product table with initial data.
 * Run with: npx tsx prisma/seed.ts
 */

import { config } from "dotenv";
config();

import { prisma } from "../lib/prisma";
import { productsData } from "../lib/data/products";

async function main() {
  console.log("🌱 Starting database seed...");
  console.log("📍 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Not set");

  // Clear existing products
  console.log("🗑️  Clearing existing products...");
  await prisma.product.deleteMany({});
  console.log("✅ Products cleared");

  // Insert new products
  console.log("📦 Inserting products...");
  const result = await prisma.product.createMany({
    data: productsData,
  });

  console.log(`✅ Successfully seeded ${result.count} products`);
  
  // Verify the data
  const count = await prisma.product.count();
  console.log(`📊 Total products in database: ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
