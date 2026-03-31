import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma with Neon adapter
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

async function seedRewardCoupons() {
  try {
    console.log('🎁 Seeding reward coupons...');

    const coupons = [
      {
        code: 'SAVE50',
        discountAmount: 50,
        pointsRequired: 100,
        isActive: true,
      },
      {
        code: 'SAVE100',
        discountAmount: 100,
        pointsRequired: 200,
        isActive: true,
      },
      {
        code: 'SAVE200',
        discountAmount: 200,
        pointsRequired: 400,
        isActive: true,
      },
      {
        code: 'SAVE500',
        discountAmount: 500,
        pointsRequired: 1000,
        isActive: true,
      },
      {
        code: 'PREMIUM250',
        discountAmount: 250,
        pointsRequired: 500,
        isActive: true,
      },
    ];

    for (const coupon of coupons) {
      // Check if coupon already exists
      const existing = await prisma.rewardCoupon.findUnique({
        where: { code: coupon.code },
      });

      if (existing) {
        console.log(`⚠️  Coupon ${coupon.code} already exists, skipping...`);
        continue;
      }

      await prisma.rewardCoupon.create({
        data: coupon,
      });

      console.log(
        `✅ Created coupon: ${coupon.code} (₹${coupon.discountAmount} off for ${coupon.pointsRequired} points)`
      );
    }

    console.log('\n🎉 Reward coupons seeded successfully!');
    console.log('\n📋 Available Coupons:');
    
    const allCoupons = await prisma.rewardCoupon.findMany({
      where: { isActive: true },
      orderBy: { pointsRequired: 'asc' },
    });

    allCoupons.forEach((coupon) => {
      console.log(
        `  - ${coupon.code}: ₹${coupon.discountAmount} off (${coupon.pointsRequired} points)`
      );
    });
  } catch (error) {
    console.error('❌ Error seeding reward coupons:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedRewardCoupons();
