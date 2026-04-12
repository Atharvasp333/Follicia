import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function verifyFeedbackSeeding() {
  console.log('🔍 Verifying feedback seeding...\n');

  // Total count
  const total = await prisma.feedback.count();
  console.log(`📊 Total feedback entries: ${total}`);

  // Category distribution
  console.log('\n📁 Category Distribution:');
  const categories = await prisma.feedback.groupBy({
    by: ['aiCategory'],
    _count: true,
  });
  categories.forEach((cat) => {
    const percentage = ((cat._count / total) * 100).toFixed(1);
    console.log(`   ${cat.aiCategory}: ${cat._count} (${percentage}%)`);
  });

  // Sentiment distribution
  console.log('\n😊 Sentiment Distribution:');
  const sentiments = await prisma.feedback.groupBy({
    by: ['sentiment'],
    _count: true,
  });
  sentiments.forEach((sent) => {
    const percentage = ((sent._count / total) * 100).toFixed(1);
    console.log(`   ${sent.sentiment}: ${sent._count} (${percentage}%)`);
  });

  // Status distribution
  console.log('\n📋 Status Distribution:');
  const statuses = await prisma.feedback.groupBy({
    by: ['status'],
    _count: true,
  });
  statuses.forEach((status) => {
    const percentage = ((status._count / total) * 100).toFixed(1);
    console.log(`   ${status.status}: ${status._count} (${percentage}%)`);
  });

  // Urgency score analysis
  console.log('\n🚨 Urgency Score Analysis:');
  const urgencyStats = await prisma.feedback.aggregate({
    _avg: { urgencyScore: true },
    _min: { urgencyScore: true },
    _max: { urgencyScore: true },
  });
  console.log(`   Average: ${urgencyStats._avg.urgencyScore?.toFixed(2)}`);
  console.log(`   Min: ${urgencyStats._min.urgencyScore}`);
  console.log(`   Max: ${urgencyStats._max.urgencyScore}`);

  // High urgency items (8-10)
  const highUrgency = await prisma.feedback.count({
    where: {
      urgencyScore: { gte: 8 },
    },
  });
  console.log(`   High urgency (8-10): ${highUrgency}`);

  // Sample entries
  console.log('\n📝 Sample Entries:');
  const samples = await prisma.feedback.findMany({
    take: 3,
    orderBy: { urgencyScore: 'desc' },
    select: {
      aiCategory: true,
      sentiment: true,
      urgencyScore: true,
      aiSummary: true,
      status: true,
    },
  });
  samples.forEach((sample, idx) => {
    console.log(`\n   ${idx + 1}. ${sample.aiCategory} | ${sample.sentiment} | Urgency: ${sample.urgencyScore}`);
    console.log(`      Status: ${sample.status}`);
    console.log(`      Summary: ${sample.aiSummary}`);
  });

  console.log('\n✅ Verification complete!');
  
  await prisma.$disconnect();
}

verifyFeedbackSeeding();
