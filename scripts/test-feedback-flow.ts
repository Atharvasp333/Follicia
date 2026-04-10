import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { analyzeFeedback } from "../lib/gemini";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function testFeedbackFlow() {
  console.log("🧪 Testing Feedback Flow with Gemini AI...\n");

  const testFeedbacks = [
    {
      rawComment: "Payment failed multiple times! I lost money and still no order confirmation.",
      rating: 1,
      userName: "Test User 1",
      userEmail: "test1@example.com",
    },
    {
      rawComment: "The hair serum is amazing! My hair feels so soft and healthy now.",
      rating: 5,
      userName: "Test User 2",
      userEmail: "test2@example.com",
    },
    {
      rawComment: "Website is slow and keeps crashing during checkout.",
      rating: 2,
      userName: "Test User 3",
      userEmail: "test3@example.com",
    },
    {
      rawComment: "My package never arrived. Tracking shows delivered but I didn't receive it.",
      rating: 1,
      userName: "Test User 4",
      userEmail: "test4@example.com",
    },
    {
      rawComment: "Good product quality but a bit expensive.",
      rating: 4,
      userName: "Test User 5",
      userEmail: "test5@example.com",
    },
  ];

  for (const feedback of testFeedbacks) {
    console.log(`📝 Processing: "${feedback.rawComment}"`);
    
    try {
      // Analyze with Gemini
      const analysis = await analyzeFeedback(feedback.rawComment);
      console.log(`   ✅ AI Analysis:`);
      console.log(`      Category: ${analysis.aiCategory}`);
      console.log(`      Sentiment: ${analysis.sentiment}`);
      console.log(`      Urgency: ${analysis.urgencyScore}/10`);
      console.log(`      Summary: ${analysis.aiSummary}`);

      // Save to database
      const saved = await prisma.feedback.create({
        data: {
          rawComment: feedback.rawComment,
          rating: feedback.rating,
          userName: feedback.userName,
          userEmail: feedback.userEmail,
          aiCategory: analysis.aiCategory,
          sentiment: analysis.sentiment,
          aiSummary: analysis.aiSummary,
          urgencyScore: analysis.urgencyScore,
          status: "NEW",
        },
      });

      console.log(`   💾 Saved to database with ID: ${saved.id}\n`);
    } catch (error) {
      console.error(`   ❌ Error:`, error);
    }
  }

  // Display summary
  console.log("\n📊 Database Summary:");
  const total = await prisma.feedback.count();
  const byCategory = await prisma.feedback.groupBy({
    by: ["aiCategory"],
    _count: true,
  });
  const bySentiment = await prisma.feedback.groupBy({
    by: ["sentiment"],
    _count: true,
  });

  console.log(`   Total Feedback: ${total}`);
  console.log(`   By Category:`, byCategory);
  console.log(`   By Sentiment:`, bySentiment);

  await prisma.$disconnect();
}

testFeedbackFlow().catch(console.error);
