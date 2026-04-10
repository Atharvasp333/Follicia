import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeFeedback } from "@/lib/gemini";

// POST: Submit new feedback with AI analysis
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawComment, rating, firebaseUid } = body;

    if (!rawComment || rawComment.trim().length === 0) {
      return NextResponse.json(
        { error: "Feedback comment is required" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Get user details from database using Firebase UID
    let user = null;
    if (firebaseUid) {
      user = await prisma.user.findFirst({
        where: { firebaseUid },
        select: { id: true, name: true, email: true }
      });
    }

    // Analyze feedback with Gemini AI
    console.log('🤖 Analyzing feedback with Gemini AI...');
    const analysis = await analyzeFeedback(rawComment);
    console.log('✅ AI Analysis complete:', analysis);

    // Save to database with AI enrichment
    const feedback = await prisma.feedback.create({
      data: {
        rawComment,
        rating,
        userId: user?.id || null,
        userName: user?.name || 'Anonymous',
        userEmail: user?.email || null,
        aiCategory: analysis.aiCategory,
        sentiment: analysis.sentiment,
        aiSummary: analysis.aiSummary,
        urgencyScore: analysis.urgencyScore,
        status: "NEW",
      },
    });

    console.log('💾 Feedback saved to database:', feedback.id);

    return NextResponse.json({
      success: true,
      feedback,
      analysis,
    });
  } catch (error) {
    console.error("❌ Feedback submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

// GET: Retrieve all feedback (admin only)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: any = {};
    if (status) where.status = status;
    if (category) where.aiCategory = category;

    const feedback = await prisma.feedback.findMany({
      where,
      orderBy: [{ urgencyScore: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Feedback fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
