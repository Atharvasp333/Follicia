/**
 * Verify Feedback Pipeline Code (No Database Required)
 * Run with: npx tsx scripts/verify-feedback-code.ts
 */

import fs from "fs";
import path from "path";

console.log("🔍 Verifying Feedback Pipeline Implementation...\n");

const checks = [
  {
    name: "Gemini AI Engine",
    path: "lib/gemini.ts",
    required: ["analyzeFeedback", "FeedbackAnalysis", "GoogleGenerativeAI"],
  },
  {
    name: "Feedback API Route",
    path: "app/api/feedback/route.ts",
    required: ["POST", "GET", "prisma", "analyzeFeedback"],
  },
  {
    name: "Feedback Update Route",
    path: "app/api/feedback/[id]/route.ts",
    required: ["PATCH", "prisma"],
  },
  {
    name: "Customer Feedback Page",
    path: "app/dashboard/feedback/page.tsx",
    required: ["FeedbackPage", "useAuthModal", "Star", "Sparkles"],
  },
  {
    name: "Admin Feedback Dashboard",
    path: "app/admin/feedback/page.tsx",
    required: ["AdminFeedbackPage", "Feedback", "FeedbackCard", "StatCard"],
  },
  {
    name: "Prisma Schema",
    path: "prisma/schema.prisma",
    required: [
      "model Feedback",
      "FeedbackCategory",
      "FeedbackSentiment",
      "FeedbackStatus",
    ],
  },
  {
    name: "Dashboard Layout (Nav Link)",
    path: "app/dashboard/layout.tsx",
    required: ["Share Feedback", "/dashboard/feedback", "MessageSquare"],
  },
  {
    name: "Admin Sidebar (Nav Link)",
    path: "components/admin/Sidebar.tsx",
    required: ["AI Feedback", "/admin/feedback", "MessageSquare"],
  },
];

let allPassed = true;

for (const check of checks) {
  const filePath = path.join(process.cwd(), check.path);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${check.name}`);
    console.log(`   File not found: ${check.path}\n`);
    allPassed = false;
    continue;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const missingItems: string[] = [];

  for (const item of check.required) {
    if (!content.includes(item)) {
      missingItems.push(item);
    }
  }

  if (missingItems.length > 0) {
    console.log(`⚠️  ${check.name}`);
    console.log(`   Missing: ${missingItems.join(", ")}\n`);
    allPassed = false;
  } else {
    console.log(`✅ ${check.name}`);
  }
}

console.log("\n" + "=".repeat(50));

if (allPassed) {
  console.log("✅ All code checks passed!");
  console.log("\nNext steps:");
  console.log("1. Ensure database connection is available");
  console.log("2. Run: npx prisma db push");
  console.log("3. Run: npm run setup:feedback");
  console.log("4. Run: npm run seed:feedback (optional)");
  console.log("5. Test at /dashboard/feedback and /admin/feedback");
} else {
  console.log("❌ Some checks failed. Please review the issues above.");
}

console.log("=".repeat(50) + "\n");

// Check for Gemini API key
if (process.env.GEMINI_API_KEY) {
  console.log("✅ GEMINI_API_KEY is configured");
} else {
  console.log("⚠️  GEMINI_API_KEY not found in environment");
  console.log("   Add to .env: GEMINI_API_KEY=your_key_here");
  console.log("   Get key: https://makersuite.google.com/app/apikey");
}

console.log("\n📚 Documentation:");
console.log("   - Quick Start: QUICK_START.md");
console.log("   - Full Guide: FEEDBACK_PIPELINE_README.md");
console.log("   - Testing: TEST_FEEDBACK_SETUP.md");
console.log("");
