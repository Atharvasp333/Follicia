/**
 * Setup script for the Feedback Pipeline
 * Run with: npx tsx scripts/setup-feedback.ts
 */

import { prisma } from "../lib/prisma";

async function main() {
  console.log("🚀 Setting up Feedback Pipeline...\n");

  // Check if Feedback table exists by trying to count records
  try {
    const count = await prisma.feedback.count();
    console.log("✅ Feedback table exists");
    console.log(`📊 Current feedback count: ${count}\n`);
  } catch (error) {
    console.error("❌ Feedback table does not exist");
    console.error("Please run: npx prisma db push\n");
    process.exit(1);
  }

  // Verify Gemini API key
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not found in environment variables");
    console.warn("Please add it to your .env file\n");
  } else {
    console.log("✅ GEMINI_API_KEY is configured\n");
  }

  // Create a test feedback entry (optional)
  const createTest = process.argv.includes("--test");
  if (createTest) {
    console.log("Creating test feedback entry...");
    const testFeedback = await prisma.feedback.create({
      data: {
        rawComment:
          "The hair serum is amazing! My hair feels so much softer and healthier.",
        rating: 5,
        userName: "Test User",
        userEmail: "test@follicia.com",
        aiCategory: "PRODUCT",
        sentiment: "POSITIVE",
        aiSummary: "Customer loves the hair serum and reports improved hair health",
        urgencyScore: 2,
        status: "NEW",
      },
    });
    console.log("✅ Test feedback created:", testFeedback.id, "\n");
  }

  console.log("🎉 Feedback Pipeline setup complete!\n");
  console.log("Next steps:");
  console.log("1. Customer view: http://localhost:3000/dashboard/feedback");
  console.log("2. Admin view: http://localhost:3000/admin/feedback");
  console.log("\nTo create test data, run: npx tsx scripts/setup-feedback.ts --test");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
