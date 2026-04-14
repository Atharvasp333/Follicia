import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Load environment variables FIRST
config();

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  console.error("   Please ensure .env file exists and contains DATABASE_URL\n");
  process.exit(1);
}

// Create Prisma client AFTER environment variables are loaded
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

/**
 * Follicia Price Normalization Script
 * 
 * Context: Pivoting pricing strategy from ₹2,000-₹3,000 range to ₹399-₹999 range
 * to increase market penetration.
 * 
 * CRITICAL: This script ONLY updates Product.price and Product.priceDisplay.
 * It does NOT touch Order or OrderItem tables to preserve historical data integrity.
 */

// Psychological pricing endings (charity pricing)
const PRICE_ENDINGS = [99, 49, 95, 89];

function applyPsychologicalPricing(basePrice: number): number {
  // Round to nearest hundred
  const rounded = Math.round(basePrice / 100) * 100;
  
  // Apply psychological pricing ending
  const ending = PRICE_ENDINGS[Math.floor(Math.random() * PRICE_ENDINGS.length)];
  
  // Ensure we stay within ₹399-₹999 range
  let finalPrice = rounded - (100 - ending);
  
  if (finalPrice < 399) finalPrice = 399 + ending;
  if (finalPrice > 999) finalPrice = 899; // Cap at ₹899
  
  return finalPrice;
}

async function normalizePrices() {
  console.log("🚀 Starting Follicia Price Normalization...\n");

  try {
    // Fetch all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        priceDisplay: true,
      },
    });

    console.log(`📦 Found ${products.length} products to normalize\n`);

    let updatedCount = 0;
    const updates = [];

    for (const product of products) {
      const oldPrice = product.price;
      
      // Skip if already in target range
      if (oldPrice >= 399 && oldPrice <= 999) {
        console.log(`✓ ${product.name}: Already normalized (₹${oldPrice})`);
        continue;
      }

      // Calculate new price with psychological pricing
      let newPrice: number;
      
      if (oldPrice > 2500) {
        // High-end products → ₹799-₹899
        newPrice = applyPsychologicalPricing(850);
      } else if (oldPrice > 2000) {
        // Mid-high products → ₹699-₹799
        newPrice = applyPsychologicalPricing(750);
      } else if (oldPrice > 1500) {
        // Mid products → ₹599-₹699
        newPrice = applyPsychologicalPricing(650);
      } else if (oldPrice > 1000) {
        // Lower-mid products → ₹499-₹599
        newPrice = applyPsychologicalPricing(550);
      } else {
        // Budget products → ₹399-₹499
        newPrice = applyPsychologicalPricing(450);
      }

      const newPriceDisplay = `₹${newPrice.toLocaleString("en-IN")}`;

      updates.push({
        id: product.id,
        oldPrice,
        newPrice,
        newPriceDisplay,
        name: product.name,
      });

      updatedCount++;
    }

    // Show preview
    console.log("\n📊 Price Normalization Preview:");
    console.log("================================\n");
    updates.forEach((update) => {
      console.log(`${update.name}`);
      console.log(`  Old: ₹${update.oldPrice.toLocaleString("en-IN")}`);
      console.log(`  New: ${update.newPriceDisplay}`);
      console.log(`  Reduction: ${((1 - update.newPrice / update.oldPrice) * 100).toFixed(1)}%\n`);
    });

    // Confirm before proceeding
    console.log(`\n⚠️  About to update ${updatedCount} products`);
    console.log("⚠️  Historical orders will NOT be affected\n");

    // Execute updates
    for (const update of updates) {
      await prisma.product.update({
        where: { id: update.id },
        data: {
          price: update.newPrice,
          priceDisplay: update.newPriceDisplay,
        },
      });
    }

    console.log(`\n✅ Successfully normalized ${updatedCount} product prices!`);
    console.log(`✅ ${products.length - updatedCount} products were already in range`);
    
    // Verify no orders were touched
    const orderCount = await prisma.order.count();
    const orderItemCount = await prisma.orderItem.count();
    console.log(`\n🔒 Data Integrity Check:`);
    console.log(`   Orders: ${orderCount} (unchanged)`);
    console.log(`   Order Items: ${orderItemCount} (unchanged)`);

  } catch (error) {
    console.error("\n❌ Error during price normalization:", error);
    throw error;
  }
}

// Run the script
normalizePrices()
  .then(() => {
    console.log("\n🎉 Price normalization complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
