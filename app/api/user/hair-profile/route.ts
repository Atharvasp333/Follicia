import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Get Firebase UID from query parameter (sent from client)
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get('uid');
    
    if (!firebaseUid) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Find user by Firebase UID
    const user = await prisma.user.findFirst({
      where: { firebaseUid },
      select: {
        id: true,
        email: true,
        name: true,
        hairType: true,
        porosity: true,
        scalpCondition: true,
        porosityScore: true,
        scalpHealth: true,
        primaryConcern: true,
        hairAnalysis: true,
        targetTags: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Hair profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
