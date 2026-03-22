import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields for verification" },
        { status: 400 }
      );
    }

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verify signature
    if (generatedSignature === razorpay_signature) {
      console.log("✅ Payment signature verified successfully");

      // Update order status to PROCESSING and save payment ID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PROCESSING",
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      console.log("✅ Order status updated to PROCESSING");

      // Automatically generate invoice after successful payment
      try {
        console.log("📄 Triggering invoice generation for order:", orderId);
        
        const invoiceResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/razorpay/invoice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        });

        const invoiceResult = await invoiceResponse.json();
        
        if (invoiceResult.success) {
          console.log("✅ Invoice generated successfully:", invoiceResult.invoiceId);
        } else {
          console.error("⚠️ Invoice generation failed:", invoiceResult.error);
          // Don't fail the payment verification if invoice generation fails
        }
      } catch (invoiceError) {
        console.error("⚠️ Invoice generation error (non-critical):", invoiceError);
        // Continue with payment verification success even if invoice fails
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      console.error("❌ Payment signature verification failed");
      
      // Log failed payment attempt
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELLED",
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
