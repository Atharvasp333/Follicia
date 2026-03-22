/**
 * Set test stock values to demonstrate different states
 * Run with: npx tsx scripts/set-test-stock.ts
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

async function setTestStock() {
  console.log('🧪 Setting test stock values...\n');

  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    if (products.length === 0) {
      console.log('❌ No products found');
      return;
    }

    // Set different stock levels to demonstrate all states
    const updates = [
      { index: 0, stock: 0, state: 'Out of Stock' },      // 0 units
      { index: 1, stock: 1, state: 'Low Stock' },         // 1 unit
      { index: 2, stock: 3, state: 'Low Stock' },         // 3 units
      { index: 3, stock: 5, state: 'Low Stock' },         // 5 units (threshold)
      { index: 4, stock: 10, state: 'In Stock' },         // 10 units
      { index: 5, stock: 25, state: 'In Stock' },         // 25 units
      { index: 6, stock: 50, state: 'In Stock' },         // 50 units
      { index: 7, stock: 100, state: 'In Stock' },        // 100 units
      { index: 8, stock: 15, state: 'In Stock' },         // 15 units (refill amount)
      { index: 9, stock: 2, state: 'Low Stock' },         // 2 units
    ];

    for (const update of updates) {
      if (update.index < products.length) {
        const product = products[update.index];
        await prisma.product.update({
          where: { id: product.id },
          data: {
            stock: update.stock,
            inventoryCount: update.stock,
          },
        });
        console.log(`✅ ${product.name.padEnd(35)} → ${update.stock.toString().padStart(3)} units (${update.state})`);
      }
    }

    console.log('\n✨ Test stock values set successfully!');
    console.log('\n📊 Summary:');
    console.log('   - 1 product with 0 stock (Out of Stock)');
    console.log('   - 4 products with 1-5 stock (Low Stock)');
    console.log('   - 5 products with 6+ stock (In Stock)');
    console.log('\n💡 Now visit /shop to see the different states!');

  } catch (error) {
    console.error('❌ Error setting test stock:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setTestStock();
