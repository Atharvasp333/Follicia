import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { firebaseUid, email, name, imageUrl } = await req.json();

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { error: 'Missing required fields (firebaseUid, email)' },
        { status: 400 }
      );
    }

    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      // Create new user if not found
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email,
          name: name || 'Follicia Hair Profile', // Default as requested
          imageUrl,
        },
      });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error('Error in sync-user API:', error);
    return NextResponse.json(
      { error: 'Internal server error while syncing user' },
      { status: 500 }
    );
  }
}
