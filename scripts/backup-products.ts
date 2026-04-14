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
 * Backup Product Prices Before Normalization
 * 
 * Creates a JSON backup of all product prices that can be used
 * to restore prices if needed.
 */

async function backupProducts() {
  console.log("📦 Starting product price backup...\n");

  try {
    // Fetch all products with relevant fields
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        priceDisplay: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`✓ Found ${products.length} products to backup\n`);

    // Create backup object with metadata
    const backup = {
      backupDate: new Date().toISOString(),
      productCount: products.length,
      products: products,
      metadata: {
        purpose: "Pre-price-normalization backup",
        canRestore: true,
        instructions: "Use restore-products.ts script to restore these prices",
      },
    };

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
      console.log("✓ Created backups directory\n");
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    const filename = `product-prices-backup-${timestamp}.json`;
    const filepath = path.join(backupsDir, filename);

    // Write backup file
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), "utf-8");

    console.log("✅ Backup completed successfully!\n");
    console.log(`📁 Backup file: ${filepath}`);
    console.log(`📊 Products backed up: ${products.length}`);
    console.log(`💾 File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB\n`);

    // Display sample of backed up products
    console.log("📋 Sample of backed up products:");
    console.log("================================\n");
    products.slice(0, 5).forEach((product) => {
      console.log(`${product.name}`);
      console.log(`  ID: ${product.id}`);
      console.log(`  Price: ₹${product.price.toLocaleString("en-IN")}`);
      console.log(`  Display: ${product.priceDisplay || "N/A"}\n`);
    });

    if (products.length > 5) {
      console.log(`... and ${products.length - 5} more products\n`);
    }

    console.log("🔒 This backup can be used to restore prices if needed");
    console.log("📝 To restore: npm run restore:prices\n");

  } catch (error) {
    console.error("\n❌ Backup failed:", error);
    throw error;
  }
}

// Run the backup
backupProducts()
  .then(() => {
    console.log("✅ Backup process complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
