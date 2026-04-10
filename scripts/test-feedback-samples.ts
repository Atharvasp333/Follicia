/**
 * Create sample feedback entries for testing
 * Run with: npx tsx scripts/test-feedback-samples.ts
 */

import { prisma } from "../lib/prisma";
import { analyzeFeedback } from "../lib/gemini";

const sampleFeedback = [
  {
    rawComment:
      "My payment failed three times! This is frustrating. I need my order urgently.",
    rating: 1,
    userName: "Sarah Johnson",
    userEmail: "sarah@example.com",
  },
  {
    rawComment:
      "The hair serum is absolutely amazing! My hair has never felt this soft and healthy. Will definitely order again!",
    rating: 5,
    userName: "Emily Chen",
    userEmail: "emily@example.com",
  },
  {
    rawComment:
      "The website keeps crashing when I try to checkout. Very annoying experience.",
    rating: 2,
    userName: "Michael Brown",
    userEmail: "michael@example.com",
  },
  {
    rawComment:
      "Delivery took 2 weeks instead of the promised 5 days. Product is good but shipping is terrible.",
    rating: 3,
    userName: "Jessica Lee",
    userEmail: "jessica@example.com",
  },
  {
    rawComment:
      "The shampoo smells wonderful and works great for my curly hair. Highly recommend!",
    rating: 5,
    userName: "David Martinez",
    userEmail: "david@example.com",
  },
  {
    rawComment:
      "Product arrived damaged. The bottle was leaking everywhere. Need a replacement ASAP.",
    rating: 1,
    userName: "Amanda Wilson",
    userEmail: "amanda@example.com",
  },
  {
    rawComment:
      "Good product but a bit expensive. Would be nice to have more discount options.",
    rating: 4,
    userName: "Robert Taylor",
    userEmail: "robert@example.com",
  },
  {
    rawComment:
      "The quiz feature is really helpful! Got perfect product recommendations for my hair type.",
    rating: 5,
    userName: "Lisa Anderson",
    userEmail: "lisa@example.com",
  },
];

async function main() {
  console.log("🧪 Creating sample feedback entries with AI analysis...\n");

  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "⚠️  GEMINI_API_KEY not found. Creating samples without AI analysis..."
    );
  }

  let successCount = 0;
  let errorCount = 0;

  for (const sample of sampleFeedback) {
    try {
      console.log(`Processing: "${sample.rawComment.substring(0, 50)}..."`);

      let analysis = null;
      if (process.env.GEMINI_API_KEY) {
        try {
          analysis = await analyzeFeedback(sample.rawComment);
          console.log(
            `  ✓ AI Analysis: ${analysis.category} | ${analysis.sentiment} | Urgency: ${analysis.urgencyScore}/10`
          );
        } catch (error) {
          console.log("  ⚠️  AI analysis failed, using defaults");
        }
      }

      const feedback = await prisma.feedback.create({
        data: {
          rawComment: sample.rawComment,
          rating: sample.rating,
          userName: sample.userName,
          userEmail: sample.userEmail,
          aiCategory: analysis?.category || "PRODUCT",
          sentiment: analysis?.sentiment || "NEUTRAL",
          aiSummary: analysis?.summary || sample.rawComment.substring(0, 100),
          urgencyScore: analysis?.urgencyScore || 5,
          status: "NEW",
        },
      });

      console.log(`  ✅ Created feedback: ${feedback.id}\n`);
      successCount++;

      // Add delay to respect API rate limits
      if (process.env.GEMINI_API_KEY) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`  ❌ Error:`, error);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Successfully created: ${successCount} feedback entries`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} entries`);
  }
  console.log("=".repeat(50) + "\n");

  // Show summary statistics
  const stats = await prisma.feedback.groupBy({
    by: ["aiCategory", "sentiment"],
    _count: true,
  });

  console.log("📊 Feedback Statistics:");
  console.log(JSON.stringify(stats, null, 2));

  console.log("\n🎉 Sample data creation complete!");
  console.log("\nView the results:");
  console.log("- Admin Dashboard: http://localhost:3000/admin/feedback");
  console.log("- Prisma Studio: npx prisma studio");
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
