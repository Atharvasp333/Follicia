import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { awardLoyaltyPoints } from "@/lib/loyalty";
import { convertToPaise } from "@/lib/price-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order with items and product details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if invoice already exists
    if (order.razorpayInvoiceId && order.invoiceUrl) {
      console.log("✅ Invoice already exists for order:", orderId);
      return NextResponse.json({
        success: true,
        invoiceId: order.razorpayInvoiceId,
        invoiceUrl: order.invoiceUrl,
        message: "Invoice already generated",
      });
    }

    // Prepare line items for Razorpay invoice
    const lineItems = order.items.map((item) => ({
      name: item.product.name,
      description: item.product.description || item.product.tagline || "Premium hair care product",
      amount: convertToPaise(item.price), // Convert to paise
      currency: "INR",
      quantity: item.quantity,
    }));

    // Add shipping cost as a line item if applicable
    if (order.shippingCost > 0) {
      lineItems.push({
        name: `Shipping - ${order.shippingMethod === 'express' ? 'Express' : 'Standard'}`,
        description: "Delivery charges",
        amount: convertToPaise(order.shippingCost),
        currency: "INR",
        quantity: 1,
      });
    }

    // Prepare customer details
    const customer = {
      name: order.shippingName || order.user.name || "Follicia Customer",
      email: order.shippingEmail || order.user.email,
      contact: order.shippingPhone || "",
      billing_address: order.shippingAddress
        ? {
            line1: order.shippingAddress,
            city: order.shippingCity || "",
            state: order.shippingState || "",
            zipcode: order.shippingPincode || "",
            country: "IN",
          }
        : undefined,
    };

    // Generate invoice number (using order ID with prefix)
    const invoiceNumber = `FOLL-${order.id.slice(-8).toUpperCase()}`;

    // Create invoice via Razorpay API
    const invoiceData = {
      type: "invoice" as const,
      description: `Follicia Laboratory Statement - Order ${invoiceNumber}`,
      partial_payment: false,
      customer,
      line_items: lineItems,
      currency: "INR",
      sms_notify: 1 as const, // Enable SMS notification
      email_notify: 1 as const, // Enable email notification
      draft: "0", // Not a draft, issue immediately
      date: Math.floor(Date.now() / 1000), // Current timestamp
      expire_by: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days expiry
      notes: {
        order_id: order.id,
        lab_analysis_note: `This invoice includes your personalized hair-care regimen based on Lab Analysis ID: ${order.id}`,
        business_name: "Follicia",
        brand_color: "#0D3B44",
      },
      comment: "Thank you for choosing Follicia. Your personalized hair-care regimen has been carefully curated based on your unique follicular profile.",
    };

    console.log("📄 Creating Razorpay invoice for order:", orderId);

    const invoice = await razorpay.invoices.create(invoiceData);

    console.log("✅ Invoice created successfully:", invoice.id);

    // Update order with invoice details and mark as PAID
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayInvoiceId: invoice.id,
        invoiceUrl: invoice.short_url,
        invoiceGeneratedAt: new Date(),
        status: "PAID", // Update status to PAID
      },
    });

    console.log("✅ Order updated with invoice details");

    // Award loyalty points for the completed order
    try {
      const loyaltyResult = await awardLoyaltyPoints(
        order.userId,
        order.id,
        order.totalAmount
      );
      
      if (loyaltyResult.pointsEarned > 0) {
        console.log(
          `🎁 Awarded ${loyaltyResult.pointsEarned} loyalty points (Total: ${loyaltyResult.totalPoints})`
        );
      }
    } catch (loyaltyError) {
      console.error("⚠️ Failed to award loyalty points (non-critical):", loyaltyError);
      // Don't fail the invoice generation if loyalty points fail
    }

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      invoiceUrl: invoice.short_url,
      invoiceNumber,
      message: "Invoice generated successfully",
    });
  } catch (error) {
    console.error("❌ Invoice generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
