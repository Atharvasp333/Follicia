/**
 * Migration script to sync existing product stats to ProductEvent table
 * This creates historical ProductEvent records based on lifetime counters
 */

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Prisma client with Neon adapter
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function migrateProductStats() {
  console.log('🚀 Starting product stats migration...\n');

  try {
    // Fetch all products with any stats
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { viewsCount: { gt: 0 } },
          { addToCartCount: { gt: 0 } },
          { purchaseCount: { gt: 0 } },
          { cancelCount: { gt: 0 } },
        ],
      },
      select: {
        id: true,
        name: true,
        viewsCount: true,
        addToCartCount: true,
        purchaseCount: true,
        cancelCount: true,
        createdAt: true,
      },
    });

    console.log(`📊 Found ${products.length} products with stats to migrate\n`);

    if (products.length === 0) {
      console.log('✅ No data to migrate. All done!');
      return;
    }

    let totalEventsCreated = 0;

    // Process each product
    for (const product of products) {
      console.log(`Processing: ${product.name}`);
      
      const events = [];
      
      // Create VIEW events
      for (let i = 0; i < product.viewsCount; i++) {
        events.push({
          productId: product.id,
          type: 'VIEW',
          createdAt: product.createdAt, // Use product creation date as base
        });
      }
      
      // Create CART events
      for (let i = 0; i < product.addToCartCount; i++) {
        events.push({
          productId: product.id,
          type: 'CART',
          createdAt: product.createdAt,
        });
      }
      
      // Create PURCHASE events
      for (let i = 0; i < product.purchaseCount; i++) {
        events.push({
          productId: product.id,
          type: 'PURCHASE',
          createdAt: product.createdAt,
        });
      }
      
      // Create CANCEL events
      for (let i = 0; i < product.cancelCount; i++) {
        events.push({
          productId: product.id,
          type: 'CANCEL',
          createdAt: product.createdAt,
        });
      }

      // Batch create events for this product
      if (events.length > 0) {
        await prisma.productEvent.createMany({
          data: events,
          skipDuplicates: true,
        });
        
        totalEventsCreated += events.length;
        console.log(`  ✓ Created ${events.length} events (${product.viewsCount} views, ${product.addToCartCount} carts, ${product.purchaseCount} purchases, ${product.cancelCount} cancels)`);
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`📈 Total events created: ${totalEventsCreated}`);
    console.log(`\n💡 Note: All migrated events use the product creation date as timestamp.`);
    console.log(`   New events will have accurate timestamps going forward.`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateProductStats()
  .then(() => {
    console.log('\n🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });
