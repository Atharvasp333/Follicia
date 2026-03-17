import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      totalAmount,
      shippingMethod,
      shippingCost,
      shippingAddress,
      items,
    } = body;

    // Validate required fields
    if (!userId || !totalAmount || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure proper type coercion for Prisma
    const orderData = {
      userId: String(userId),
      totalAmount: Number(totalAmount), // Ensure Float
      shippingMethod: shippingMethod ? String(shippingMethod) : "standard",
      shippingCost: Number(shippingCost) || 0, // Ensure Float
      shippingName: shippingAddress?.fullName ? String(shippingAddress.fullName) : null,
      shippingEmail: shippingAddress?.email ? String(shippingAddress.email) : null,
      shippingPhone: shippingAddress?.phone ? String(shippingAddress.phone) : null,
      shippingAddress: shippingAddress?.address ? String(shippingAddress.address) : null,
      shippingCity: shippingAddress?.city ? String(shippingAddress.city) : null,
      shippingState: shippingAddress?.state ? String(shippingAddress.state) : null,
      shippingPincode: shippingAddress?.pincode ? String(shippingAddress.pincode) : null,
      status: "PENDING", // Start as PENDING until payment is confirmed
      items: {
        create: items.map((item: any) => ({
          productId: String(item.productId),
          quantity: parseInt(String(item.quantity), 10), // Ensure Int
          price: Number(item.price), // Ensure Float
        })),
      },
    };

    console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

    // Create order with items
    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: true,
      },
    });

    console.log("Order created successfully:", order.id);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    // Detailed error logging for debugging
    console.error("❌ Order creation failed:");
    console.error("Error type:", error?.constructor?.name);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && "code" in error) {
      console.error("Error code:", (error as any).code);
    }
    
    // Log the full error object for Prisma validation errors
    if (error instanceof Error && error.message.includes("Prisma")) {
      console.error("Full Prisma error:", JSON.stringify(error, null, 2));
    }

    return NextResponse.json(
      { 
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
