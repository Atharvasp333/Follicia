/**
 * Quick script to check current stock values
 * Run with: npx tsx scripts/check-stock.ts
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

async function checkStock() {
  console.log('📊 Checking current stock values...\n');

  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        inventoryCount: true,
        lowStockThreshold: true,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`Found ${products.length} products:\n`);
    console.log('┌─────────────────────────────────────┬───────┬───────────┬───────────┬────────┐');
    console.log('│ Product Name                        │ Stock │ Inventory │ Threshold │ Active │');
    console.log('├─────────────────────────────────────┼───────┼───────────┼───────────┼────────┤');

    products.forEach((product) => {
      const name = product.name.padEnd(35).substring(0, 35);
      const stock = product.stock.toString().padStart(5);
      const inventory = product.inventoryCount.toString().padStart(9);
      const threshold = product.lowStockThreshold.toString().padStart(9);
      const active = (product.isActive ? 'Yes' : 'No').padStart(6);
      
      console.log(`│ ${name} │ ${stock} │ ${inventory} │ ${threshold} │ ${active} │`);
    });

    console.log('└─────────────────────────────────────┴───────┴───────────┴───────────┴────────┘');

    // Summary
    const outOfStock = products.filter(p => p.inventoryCount === 0).length;
    const lowStock = products.filter(p => p.inventoryCount > 0 && p.inventoryCount < p.lowStockThreshold).length;
    const inStock = products.filter(p => p.inventoryCount >= p.lowStockThreshold).length;
    const hidden = products.filter(p => !p.isActive).length;

    console.log('\n📈 Summary:');
    console.log(`   Total Products: ${products.length}`);
    console.log(`   Out of Stock: ${outOfStock}`);
    console.log(`   Low Stock: ${lowStock}`);
    console.log(`   In Stock: ${inStock}`);
    console.log(`   Hidden: ${hidden}`);

  } catch (error) {
    console.error('❌ Error checking stock:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkStock();
