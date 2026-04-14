import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import fs from "fs";
import path from "path";

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
 * Restore Product Prices from Backup
 * 
 * Restores product prices from a backup JSON file.
 * Use this if you need to rollback the price normalization.
 */

async function restoreProducts() {
  console.log("🔄 Starting product price restoration...\n");

  try {
    // Find the most recent backup file
    const backupsDir = path.join(process.cwd(), "backups");
    
    if (!fs.existsSync(backupsDir)) {
      console.error("❌ No backups directory found!");
      console.error("   Please run 'npm run backup:prices' first\n");
      process.exit(1);
    }

    const backupFiles = fs.readdirSync(backupsDir)
      .filter(file => file.startsWith("product-prices-backup-") && file.endsWith(".json"))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      console.error("❌ No backup files found!");
      console.error("   Please run 'npm run backup:prices' first\n");
      process.exit(1);
    }

    // Use the most recent backup
    const backupFile = backupFiles[0];
    const backupPath = path.join(backupsDir, backupFile);

    console.log(`📁 Using backup file: ${backupFile}\n`);

    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));

    console.log(`📊 Backup Information:`);
    console.log(`   Date: ${new Date(backupData.backupDate).toLocaleString()}`);
    console.log(`   Products: ${backupData.productCount}`);
    console.log(`   Purpose: ${backupData.metadata.purpose}\n`);

    // Confirm restoration
    console.log("⚠️  WARNING: This will restore all product prices to their backed-up values");
    console.log("⚠️  Current prices will be overwritten\n");

    let restoredCount = 0;
    const errors = [];

    // Restore each product
    for (const product of backupData.products) {
      try {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: product.price,
            priceDisplay: product.priceDisplay,
          },
        });
        restoredCount++;
      } catch (error) {
        errors.push({
          productId: product.id,
          productName: product.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log(`\n✅ Restoration completed!`);
    console.log(`   Successfully restored: ${restoredCount} products`);
    
    if (errors.length > 0) {
      console.log(`   ⚠️  Errors: ${errors.length} products`);
      console.log("\n❌ Products that failed to restore:");
      errors.forEach((err) => {
        console.log(`   - ${err.productName} (${err.productId}): ${err.error}`);
      });
    }

    // Display sample of restored products
    console.log("\n📋 Sample of restored products:");
    console.log("================================\n");
    backupData.products.slice(0, 5).forEach((product: any) => {
      console.log(`${product.name}`);
      console.log(`  Restored Price: ₹${product.price.toLocaleString("en-IN")}`);
      console.log(`  Display: ${product.priceDisplay || "N/A"}\n`);
    });

    console.log("✅ Price restoration complete!");
    console.log("🔍 Please verify prices in the admin panel\n");

  } catch (error) {
    console.error("\n❌ Restoration failed:", error);
    throw error;
  }
}

// Run the restoration
restoreProducts()
  .then(() => {
    console.log("✅ Restoration process complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
