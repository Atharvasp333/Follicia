/**
 * One-time script to sync stock and inventoryCount columns
 * Run with: npx tsx scripts/sync-inventory.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { config } from 'dotenv';

// Load environment variables
config();

// Create Prisma client with Neon adapter
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function syncInventory() {
  console.log('🔄 Starting inventory sync...');

  try {
    // Get all products
    const products = await prisma.product.findMany();
    console.log(`📦 Found ${products.length} products`);

    // Update each product to ensure stock and inventoryCount are in sync
    let updated = 0;
    for (const product of products) {
      // Use inventoryCount as the source of truth
      if (product.stock !== product.inventoryCount) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            stock: product.inventoryCount,
          },
        });
        console.log(`✅ Synced ${product.name}: stock=${product.stock} → ${product.inventoryCount}`);
        updated++;
      }
    }

    console.log(`\n✨ Sync complete! Updated ${updated} products.`);
  } catch (error) {
    console.error('❌ Error syncing inventory:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

syncInventory();
