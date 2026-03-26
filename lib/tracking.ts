/**
 * Track product interaction events for analytics
 */

type EventType = "viewsCount" | "addToCartCount" | "purchaseCount" | "cancelCount";

export async function trackProductEvent(productId: string, eventType: EventType): Promise<void> {
  try {
    await fetch("/api/stats/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        eventType,
      }),
    });
    // Fire and forget - don't wait for response or handle errors in UI
  } catch (error) {
    // Silently fail - tracking should not disrupt user experience
    console.error("Failed to track event:", error);
  }
}
