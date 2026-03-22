import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { targetTags } = await req.json();

    if (!targetTags || !Array.isArray(targetTags) || targetTags.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid target tags' },
        { status: 400 }
      );
    }

    // Find products that match any of the target tags
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        aiMatchTag: {
          in: targetTags
        }
      },
      orderBy: {
        rating: 'desc'
      },
      take: 3
    });

    // If we don't have enough matches, get top-rated products
    if (products.length < 3) {
      const additionalProducts = await prisma.product.findMany({
        where: {
          isActive: true,
          id: {
            notIn: products.map(p => p.id)
          }
        },
        orderBy: {
          rating: 'desc'
        },
        take: 3 - products.length
      });

      products.push(...additionalProducts);
    }

    // Ensure we have a good mix: cleanser, treatment, serum
    const categorized = {
      cleanser: products.find(p => p.category?.toLowerCase().includes('shampoo') || p.category?.toLowerCase().includes('wash')),
      treatment: products.find(p => p.category?.toLowerCase().includes('mask') || p.category?.toLowerCase().includes('conditioner')),
      serum: products.find(p => p.category?.toLowerCase().includes('serum') || p.category?.toLowerCase().includes('oil'))
    };

    // Build final recommendation list
    const recommendations = [
      categorized.cleanser,
      categorized.treatment,
      categorized.serum
    ].filter(Boolean);

    // Fill remaining slots with other products
    if (recommendations.length < 3) {
      const remaining = products.filter(p => !recommendations.find(r => r?.id === p.id));
      recommendations.push(...remaining.slice(0, 3 - recommendations.length));
    }

    return NextResponse.json({
      success: true,
      data: recommendations.slice(0, 3)
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
