import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are a Senior Trichologist at Follicia Laboratories. You will receive structured form data and a user's personal notes.

Your Goal: Synthesize this into a 'Scientific Hair DNA' profile.

Scoring Metrics:
- Porosity Score (1-100): 1-30 is Low (repels moisture), 70-100 is High (damaged/absorbent)
- Scalp Health (1-100): 100 is perfectly balanced; lower scores indicate extreme oil or dryness

Output Format: Return ONLY a JSON object with this exact structure:
{
  "porosityScore": number,
  "scalpHealth": number,
  "primaryConcern": "string",
  "analysis": "A 2-sentence professional clinical summary.",
  "targetTags": ["frizz-control", "bond-repair", etc]
}

Examples:

Input: {texture: 3, porosityChecks: ["absorbs-instantly"], chemicalHistory: ["bleach"], clinicalNotes: "Bleached it last month, now it snaps when wet."}
Output: {"porosityScore": 92, "scalpHealth": 65, "primaryConcern": "Protein damage and high porosity", "analysis": "Your hair exhibits severe protein loss from bleaching, resulting in compromised structural integrity. The high porosity indicates damaged cuticles that absorb moisture rapidly but cannot retain it.", "targetTags": ["protein-repair", "moisture-lock", "bond-repair"]}

Input: {texture: 1, porosityChecks: ["stays-wet"], scalp: "oily", clinicalNotes: "My hair gets flat and greasy by the end of the day."}
Output: {"porosityScore": 25, "scalpHealth": 40, "primaryConcern": "Excess sebum production", "analysis": "Your scalp produces excessive sebum, leading to rapid oil buildup and flat hair. The low porosity prevents moisture absorption, causing product buildup.", "targetTags": ["volume-boost", "clarifying", "oil-control"]}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { texture, porosityChecks, scalp, chemicalHistory, clinicalNotes, userId } = body;

    // Validate required fields
    if (!texture || !porosityChecks || !scalp || !chemicalHistory) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare input for AI
    const userInput = {
      texture,
      porosityChecks,
      scalp,
      chemicalHistory,
      clinicalNotes: clinicalNotes || 'No additional notes provided.'
    };

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `${SYSTEM_PROMPT}\n\nUser Input:\n${JSON.stringify(userInput, null, 2)}\n\nProvide your analysis as a JSON object:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate AI response structure
    if (
      typeof analysis.porosityScore !== 'number' ||
      typeof analysis.scalpHealth !== 'number' ||
      !analysis.primaryConcern ||
      !analysis.analysis ||
      !Array.isArray(analysis.targetTags)
    ) {
      throw new Error('AI response missing required fields');
    }

    // If user is authenticated, save to database
    if (userId) {
      try {
        const user = await prisma.user.findFirst({
          where: { firebaseUid: userId }
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              porosityScore: analysis.porosityScore,
              scalpHealth: analysis.scalpHealth,
              primaryConcern: analysis.primaryConcern,
              hairAnalysis: analysis.analysis,
              targetTags: analysis.targetTags,
              // Also update basic fields
              hairType: texture.toString(),
              porosity: analysis.porosityScore > 70 ? 'high' : analysis.porosityScore < 30 ? 'low' : 'medium',
              scalpCondition: scalp
            }
          });
        }
      } catch (dbError) {
        console.error('Database update error:', dbError);
        // Continue even if DB update fails
      }
    }

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('AI Diagnosis Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      },
      { status: 500 }
    );
  }
}
