import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { convertToPaise } from "@/lib/price-utils";

// Verify environment variables are loaded at route level
console.log("🔑 Loading Keys:", {
  RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId } = body;

    console.log("📦 Razorpay Order Creation Request:", { amount, orderId });

    // Validate required fields
    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: amount and orderId" },
        { status: 400 }
      );
    }

    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ Razorpay credentials not found in environment");
      return NextResponse.json(
        { error: "Razorpay is not configured on the server" },
        { status: 500 }
      );
    }

    // Lazy load razorpay to avoid initialization errors
    const { razorpay } = await import("@/lib/razorpay");

    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = convertToPaise(Number(amount));

    console.log("💳 Creating Razorpay order:", { amountInPaise, currency: "INR" });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId,
      },
    });

    console.log("✅ Razorpay order created:", razorpayOrder.id);

    // Update the order in database with Razorpay order ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    console.log("✅ Database updated with Razorpay order ID");

    return NextResponse.json({
      success: true,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create Razorpay order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
