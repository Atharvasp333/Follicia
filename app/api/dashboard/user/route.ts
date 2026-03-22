import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        hairType: true,
        porosity: true,
        scalpCondition: true,
        porosityScore: true,
        scalpHealth: true,
        primaryConcern: true,
        hairAnalysis: true,
        targetTags: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user, updatedAt: user.updatedAt });
  } catch (error) {
    console.error("Dashboard user API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
