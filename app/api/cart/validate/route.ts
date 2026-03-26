import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cart Validation API
 * Validates cart items against current inventory and prices
 * Ensures stock availability and price integrity
 */
export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items array is required" },
        { status: 400 }
      );
    }

    const validationResults = [];
    let totalAmount = 0;
    let hasErrors = false;

    for (const item of items) {
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
        validationResults.push({
          productId: item.productId,
          valid: false,
          error: "Product not found",
        });
        hasErrors = true;
        continue;
      }

      if (!product.isActive) {
        validationResults.push({
          productId: item.productId,
          name: product.name,
          valid: false,
          error: "Product is no longer available",
        });
        hasErrors = true;
        continue;
      }

      if (product.inventoryCount === 0) {
        validationResults.push({
          productId: item.productId,
          name: product.name,
          valid: false,
          error: "Out of stock",
          availableStock: 0,
        });
        hasErrors = true;
        continue;
      }

      if (product.inventoryCount < item.quantity) {
        validationResults.push({
          productId: item.productId,
          name: product.name,
          valid: false,
          error: "Insufficient stock",
          availableStock: product.inventoryCount,
          requestedQuantity: item.quantity,
        });
        hasErrors = true;
        continue;
      }

      // PRICE TAMPERING PROTECTION: Verify price matches
      if (Math.abs(product.price - item.price) > 0.01) {
        validationResults.push({
          productId: item.productId,
          name: product.name,
          valid: false,
          error: "Price mismatch",
          currentPrice: product.price,
          submittedPrice: item.price,
        });
        hasErrors = true;
        continue;
      }

      // Item is valid
      validationResults.push({
        productId: item.productId,
        name: product.name,
        valid: true,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    return NextResponse.json({
      success: !hasErrors,
      validationResults,
      totalAmount,
      message: hasErrors
        ? "Some items in your cart have issues"
        : "All items validated successfully",
    });
  } catch (error) {
    console.error("Error validating cart:", error);
    return NextResponse.json(
      { error: "Failed to validate cart" },
      { status: 500 }
    );
  }
}
