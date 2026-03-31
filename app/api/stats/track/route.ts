import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type EventType = "viewsCount" | "addToCartCount" | "purchaseCount" | "cancelCount";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, eventType } = body;

    // Validate input
    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Invalid productId" },
        { status: 400 }
      );
    }

    const validEvents: EventType[] = ["viewsCount", "addToCartCount", "purchaseCount", "cancelCount"];
    if (!eventType || !validEvents.includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid eventType. Must be one of: viewsCount, addToCartCount, purchaseCount, cancelCount" },
        { status: 400 }
      );
    }

    // Map eventType to ProductEvent type
    const eventTypeMap: Record<EventType, string> = {
      viewsCount: "VIEW",
      addToCartCount: "CART",
      purchaseCount: "PURCHASE",
      cancelCount: "CANCEL",
    };

    // Use transaction to ensure both operations succeed or fail together
    const [updatedProduct, productEvent] = await prisma.$transaction([
      // Update lifetime counter
      prisma.product.update({
        where: { id: productId },
        data: {
          [eventType]: {
            increment: 1,
          },
        },
        select: {
          id: true,
          name: true,
          viewsCount: true,
          addToCartCount: true,
          purchaseCount: true,
          cancelCount: true,
        },
      }),
      // Create ProductEvent record for time-based analytics
      prisma.productEvent.create({
        data: {
          productId,
          type: eventTypeMap[eventType as EventType],
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error tracking product event:", error);
    
    // Handle product not found
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    );
  }
}
