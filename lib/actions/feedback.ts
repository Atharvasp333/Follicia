'use server';

import { prisma } from '@/lib/prisma';
import { analyzeFeedback } from '@/lib/gemini';
import { auth } from '@clerk/nextjs/server';

export async function submitFeedback(formData: {
  rating: number;
  rawComment: string;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { firebaseUid: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Call Gemini API to analyze feedback
    const analysis = await analyzeFeedback(formData.rawComment);

    // Save to database with AI analysis
    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        userName: user.name || 'Anonymous',
        userEmail: user.email,
        rawComment: formData.rawComment,
        rating: formData.rating,
        aiCategory: analysis.aiCategory,
        sentiment: analysis.sentiment,
        aiSummary: analysis.aiSummary,
        urgencyScore: analysis.urgencyScore,
        status: 'NEW'
      }
    });

    return { success: true, feedback };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit feedback' 
    };
  }
}
