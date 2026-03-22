import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const limitParam = req.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          status: true,
          totalAmount: true,
          shippingCity: true,
          createdAt: true,
          razorpayInvoiceId: true,
          invoiceUrl: true,
          invoiceGeneratedAt: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  category: true,
                  priceDisplay: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error("Dashboard orders API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
