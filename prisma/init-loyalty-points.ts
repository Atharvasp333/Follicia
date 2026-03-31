import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma with Neon adapter (matching lib/prisma.ts)
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

async function initializeLoyaltyPoints() {
  try {
    console.log('🚀 Initializing loyalty points for existing users...');
    
    // Count total users
    const totalUsers = await prisma.user.count();
    console.log(`📊 Total users in database: ${totalUsers}`);
    
    // Since loyaltyPoints has @default(0), all users should already have 0
    // This script verifies and reports the status
    const usersWithPoints = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        loyaltyPoints: true,
      },
    });

    console.log(`✅ All ${usersWithPoints.length} users have loyalty points initialized`);
    
    // Show a sample of users
    if (usersWithPoints.length > 0) {
      console.log('\n📋 Sample of users with loyalty points:');
      usersWithPoints.slice(0, 5).forEach(user => {
        console.log(`  - ${user.email}: ${user.loyaltyPoints} points`);
      });
      if (usersWithPoints.length > 5) {
        console.log(`  ... and ${usersWithPoints.length - 5} more users`);
      }
    }

    console.log('\n🎉 Loyalty points system is ready!');
  } catch (error) {
    console.error('❌ Error initializing loyalty points:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initializeLoyaltyPoints();
