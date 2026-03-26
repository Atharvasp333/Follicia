import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { firebaseUid, email, name, imageUrl } = await req.json();

    console.log('🔄 Syncing user:', { firebaseUid, email, name });

    if (!firebaseUid || !email) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields (firebaseUid, email)' },
        { status: 400 }
      );
    }

    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: {
        id: true,
        email: true,
        name: true,
        firebaseUid: true,
        hairType: true,
        porosity: true,
        scalpCondition: true,
        imageUrl: true,
        plan: true,
        planName: true,
      },
    });

    if (!user) {
      console.log('👤 Creating new user');
      // Create new user if not found
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          name: name || 'Follicia Hair Profile', // Default as requested
          imageUrl,
        },
        select: {
          id: true,
          email: true,
          name: true,
          firebaseUid: true,
          hairType: true,
          porosity: true,
          scalpCondition: true,
          imageUrl: true,
          plan: true,
          planName: true,
        },
      });
      console.log('✅ User created:', user.id);
    } else {
      console.log('✅ User found:', user.id);
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error in sync-user API:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Internal server error while syncing user', details: error.message },
      { status: 500 }
    );
  }
}
