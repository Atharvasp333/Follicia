import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      totalAmount: clientTotalAmount,
      shippingMethod,
      shippingCost: clientShippingCost,
      couponId,
      discountAmount: clientDiscountAmount,
      shippingAddress,
      items,
    } = body;

    // Validate required fields
    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // PRICE TAMPERING PROTECTION: Recalculate total on server
    console.log("🔒 Validating prices and calculating server-side total...");
    
    let serverSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      // Fetch current product price from database
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          price: true,
          inventoryCount: true,
          isActive: true,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `Product ${product.name} is no longer available` },
          { status: 400 }
        );
      }

      // STOCK LOCK: Validate stock availability
      if (product.inventoryCount < item.quantity) {
        return NextResponse.json(
          { 
            error: `Insufficient stock for ${product.name}. Available: ${product.inventoryCount}, Requested: ${item.quantity}` 
          },
          { status: 400 }
        );
      }

      // Use server-side price (not client-submitted price)
      const itemTotal = product.price * item.quantity;
      serverSubtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        quantity: parseInt(String(item.quantity), 10),
        price: product.price, // Use server price, not client price
      });
    }

    // Calculate server-side shipping cost
    const serverShippingCost = shippingMethod === "express" ? 299 : serverSubtotal >= 2999 ? 0 : 199;
    
    // Validate and calculate server-side discount
    let serverDiscountAmount = 0;
    if (couponId) {
      console.log("🎫 Validating coupon:", couponId);
      
      // Fetch coupon from database
      const coupon = await prisma.rewardCoupon.findUnique({
        where: { id: couponId },
        select: {
          id: true,
          code: true,
          discountAmount: true,
          isActive: true,
        },
      });
      
      if (!coupon) {
        return NextResponse.json(
          { error: "Invalid coupon" },
          { status: 400 }
        );
      }
      
      if (!coupon.isActive) {
        return NextResponse.json(
          { error: "Coupon is no longer active" },
          { status: 400 }
        );
      }
      
      // Verify user has redeemed this coupon
      const userCoupon = await prisma.userCoupon.findUnique({
        where: {
          userId_couponId: {
            userId: String(userId),
            couponId: couponId,
          },
        },
      });
      
      if (!userCoupon) {
        return NextResponse.json(
          { error: "You have not redeemed this coupon" },
          { status: 400 }
        );
      }
      
      // Check if coupon has already been used in a previous order
      const previousOrder = await prisma.order.findFirst({
        where: {
          userId: String(userId),
          couponId: couponId,
          status: {
            in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
          },
        },
      });
      
      if (previousOrder) {
        return NextResponse.json(
          { error: `Coupon ${coupon.code} has already been used in a previous order` },
          { status: 400 }
        );
      }
      
      serverDiscountAmount = coupon.discountAmount;
      console.log(`✅ Coupon validated: ${coupon.code} - ₹${serverDiscountAmount} discount`);
    }
    
    const serverTotalAmount = serverSubtotal + serverShippingCost - serverDiscountAmount;

    // Verify client total matches server total (within 1 rupee tolerance for rounding)
    if (Math.abs(serverTotalAmount - clientTotalAmount) > 1) {
      console.error(`⚠️ Price mismatch detected! Client: ${clientTotalAmount}, Server: ${serverTotalAmount}`);
      return NextResponse.json(
        { 
          error: "Price mismatch detected. Please refresh your cart and try again.",
          serverTotal: serverTotalAmount,
          clientTotal: clientTotalAmount,
        },
        { status: 400 }
      );
    }

    console.log(`✅ Price validation passed. Total: ₹${serverTotalAmount}`);

    // Ensure proper type coercion for Prisma
    const orderData = {
      userId: String(userId),
      totalAmount: serverTotalAmount, // Use server-calculated total
      shippingMethod: shippingMethod ? String(shippingMethod) : "standard",
      shippingCost: serverShippingCost, // Use server-calculated shipping
      couponId: couponId ? String(couponId) : null,
      discountAmount: serverDiscountAmount,
      shippingName: shippingAddress?.fullName ? String(shippingAddress.fullName) : null,
      shippingEmail: shippingAddress?.email ? String(shippingAddress.email) : null,
      shippingPhone: shippingAddress?.phone ? String(shippingAddress.phone) : null,
      shippingAddress: shippingAddress?.address ? String(shippingAddress.address) : null,
      shippingCity: shippingAddress?.city ? String(shippingAddress.city) : null,
      shippingState: shippingAddress?.state ? String(shippingAddress.state) : null,
      shippingPincode: shippingAddress?.pincode ? String(shippingAddress.pincode) : null,
      status: "PENDING" as const, // Start as PENDING until payment is confirmed
      items: {
        create: validatedItems,
      },
    };

    console.log("Creating order with validated data:", JSON.stringify(orderData, null, 2));

    // Create order with items
    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: true,
      },
    });

    console.log("✅ Order created successfully:", order.id);

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
