/**
 * Data Injection Script: Boost Conversion Rates
 * Creates realistic orders to achieve target conversion rates (40-60% for top products)
 * without disrupting existing ProductEvent view/click data
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

// Target conversion rates by tier
const CONVERSION_TARGETS = {
  TOP_TIER: 0.55,      // 55% for top 3 products
  MID_TIER: 0.40,      // 40% for mid-tier products
  LOW_TIER: 0.25,      // 25% for new/low-tier products
};

async function boostConversions() {
  console.log('🚀 Starting conversion boost script...\n');

  try {
    // 1. Get or create a test user for orders
    let testUser = await prisma.user.findFirst({
      where: { email: 'test-analytics@follicia.com' },
    });

    if (!testUser) {
      console.log('📝 Creating test user for analytics orders...');
      testUser = await prisma.user.create({
        data: {
          email: 'test-analytics@follicia.com',
          name: 'Analytics Test User',
          plan: 'gold',
          planName: 'Gold',
        },
      });
      console.log('✓ Test user created\n');
    }

    // 2. Fetch all products
    const products = await prisma.product.findMany({
      orderBy: {
        viewsCount: 'desc',
      },
    });

    console.log(`📊 Found ${products.length} products to process\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found. Please seed products first.');
      return;
    }

    // 3. For each product, get view counts and current sales
    const productStats = await Promise.all(
      products.map(async (product, index) => {
        // Count views from ProductEvent using raw query as fallback
        let viewCount = 0;
        try {
          const viewResult: any = await prisma.$queryRaw`
            SELECT COUNT(*) as count 
            FROM product_events 
            WHERE "productId" = ${product.id} AND type = 'VIEW'
          `;
          viewCount = parseInt(viewResult[0]?.count || '0');
        } catch (e) {
          // Fallback to viewsCount if ProductEvent table doesn't exist
          viewCount = product.viewsCount || 0;
        }

        // Count current sales from OrderItems
        const salesResult: any = await prisma.$queryRaw`
          SELECT COALESCE(SUM(oi.quantity), 0) as total
          FROM order_items oi
          INNER JOIN orders o ON oi."orderId" = o.id
          WHERE oi."productId" = ${product.id}
            AND o.status IN ('PAID', 'SHIPPED', 'DELIVERED')
        `;
        const currentSales = parseInt(salesResult[0]?.total || '0');
      
        // Determine tier based on position
        let targetRate: number;
        let tier: string;
        
        if (index < 3) {
          targetRate = CONVERSION_TARGETS.TOP_TIER;
          tier = 'TOP';
        } else if (index < 8) {
          targetRate = CONVERSION_TARGETS.MID_TIER;
          tier = 'MID';
        } else {
          targetRate = CONVERSION_TARGETS.LOW_TIER;
          tier = 'LOW';
        }

        // Calculate required sales to hit target
        const targetSales = Math.ceil(viewCount * targetRate);
        const salesNeeded = Math.max(0, targetSales - currentSales);
        
        const currentRate = viewCount > 0 ? ((currentSales / viewCount) * 100).toFixed(2) : '0.00';
        const targetRatePercent = (targetRate * 100).toFixed(0);

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          viewCount,
          currentSales,
          currentRate,
          targetRate,
          targetRatePercent,
          salesNeeded,
          tier,
        };
      })
    );

    // 4. Display plan
    console.log('📋 Conversion Boost Plan:\n');
    console.log('─'.repeat(100));
    console.log(
      'Product'.padEnd(35),
      'Tier'.padEnd(6),
      'Views'.padEnd(8),
      'Current'.padEnd(10),
      'Target'.padEnd(10),
      'Orders Needed'
    );
    console.log('─'.repeat(100));

    let totalOrdersToCreate = 0;
    productStats.forEach(stat => {
      if (stat.salesNeeded > 0) {
        console.log(
          stat.name.substring(0, 33).padEnd(35),
          stat.tier.padEnd(6),
          stat.viewCount.toString().padEnd(8),
          `${stat.currentRate}%`.padEnd(10),
          `${stat.targetRatePercent}%`.padEnd(10),
          stat.salesNeeded.toString()
        );
        totalOrdersToCreate += stat.salesNeeded;
      }
    });
    console.log('─'.repeat(100));
    console.log(`\n📦 Total orders to create: ${totalOrdersToCreate}\n`);

    if (totalOrdersToCreate === 0) {
      console.log('✅ All products already meet or exceed target conversion rates!');
      return;
    }

    // 5. Confirm before proceeding
    console.log('⏳ Creating orders in 3 seconds... (Press Ctrl+C to cancel)\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 6. Create orders with distributed timestamps
    let ordersCreated = 0;
    const now = new Date();

    for (const stat of productStats) {
      if (stat.salesNeeded === 0) continue;

      console.log(`\n📦 Creating ${stat.salesNeeded} orders for: ${stat.name}`);

      // Distribute orders across last 7 days
      for (let i = 0; i < stat.salesNeeded; i++) {
        // Random timestamp within last 7 days
        const daysAgo = Math.floor(Math.random() * 7);
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        const orderDate = new Date(now);
        orderDate.setDate(orderDate.getDate() - daysAgo);
        orderDate.setHours(orderDate.getHours() - hoursAgo);
        orderDate.setMinutes(orderDate.getMinutes() - minutesAgo);

        // Random quantity (1-2 items per order for realism)
        const quantity = Math.random() > 0.7 ? 2 : 1;
        const totalAmount = stat.price * quantity;

        // Create order with item
        await prisma.order.create({
          data: {
            userId: testUser.id,
            status: Math.random() > 0.5 ? 'PAID' : 'DELIVERED',
            totalAmount,
            shippingMethod: 'standard',
            shippingCost: 0,
            shippingName: 'Analytics Test User',
            shippingEmail: 'test-analytics@follicia.com',
            shippingPhone: '9999999999',
            shippingAddress: 'Test Address',
            shippingCity: 'Mumbai',
            shippingState: 'Maharashtra',
            shippingPincode: '400001',
            createdAt: orderDate,
            updatedAt: orderDate,
            items: {
              create: {
                productId: stat.id,
                quantity,
                price: stat.price,
              },
            },
          },
        });

        ordersCreated++;
        
        // Progress indicator
        if (ordersCreated % 10 === 0) {
          process.stdout.write(`  ✓ ${ordersCreated}/${totalOrdersToCreate} orders created...\r`);
        }
      }

      console.log(`  ✓ Completed ${stat.salesNeeded} orders for ${stat.name}`);
    }

    console.log(`\n\n✅ Conversion boost complete!`);
    console.log(`📈 Total orders created: ${ordersCreated}`);
    console.log(`\n💡 Refresh your Analytics Dashboard to see the updated conversion rates!`);
    console.log(`   Expected rates: Top products ~55%, Mid-tier ~40%, Others ~25%\n`);

  } catch (error) {
    console.error('❌ Error boosting conversions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
boostConversions()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });
