import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, plan, planName } = body;

    console.log('📝 Update plan request:', { userId, plan, planName });

    if (!userId) {
      console.error('❌ Missing userId');
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!plan) {
      console.error('❌ Missing plan');
      return NextResponse.json(
        { success: false, error: 'Plan is required' },
        { status: 400 }
      );
    }

    if (!planName) {
      console.error('❌ Missing planName');
      return NextResponse.json(
        { success: false, error: 'Plan name is required' },
        { status: 400 }
      );
    }

    // Validate plan tier
    const validPlans = ['bronze', 'silver', 'gold'];
    if (!validPlans.includes(plan.toLowerCase())) {
      console.error('❌ Invalid plan tier:', plan);
      return NextResponse.json(
        { success: false, error: 'Invalid plan tier' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed, updating user...');

    // Update user plan
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: plan.toLowerCase(),
        planName,
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        planName: true,
      },
    });

    console.log('✅ User updated:', updatedUser);

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('❌ Plan update error:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to update plan', details: error.message },
      { status: 500 }
    );
  }
}
