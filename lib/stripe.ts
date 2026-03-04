/**
 * Follicia — Stripe Server-Side Client
 *
 * Guarded so the app doesn't crash when STRIPE_SECRET_KEY is missing.
 * Stripe functionality should only be invoked after checking `stripe !== null`.
 */
import Stripe from "stripe";

// TODO: Replace placeholder key in .env before going live
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;

if (
    STRIPE_SECRET_KEY &&
    STRIPE_SECRET_KEY !== "sk_test_XXXX" &&
    STRIPE_SECRET_KEY.startsWith("sk_")
) {
    stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: "2026-02-25.clover",
        typescript: true,
    });
} else {
    // Non-fatal warning — payments simply won't work until the key is set
    if (process.env.NODE_ENV === "development") {
        console.warn(
            "⚠️  Stripe: STRIPE_SECRET_KEY not configured. " +
            "Payment features are disabled. Set sk_live_* or sk_test_* in .env to enable."
        );
    }
}

export { stripe };
