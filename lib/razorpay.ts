import Razorpay from "razorpay";

// Ensure environment variables are loaded correctly
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Detailed logging for debugging
console.log("🔍 Razorpay Environment Check:");
console.log("  - RAZORPAY_KEY_ID:", RAZORPAY_KEY_ID ? "✅ Present" : "❌ Missing");
console.log("  - RAZORPAY_KEY_SECRET:", RAZORPAY_KEY_SECRET ? "✅ Present" : "❌ Missing");

if (!RAZORPAY_KEY_ID) {
  throw new Error("❌ RAZORPAY_KEY_ID is not configured in environment variables");
}

if (!RAZORPAY_KEY_SECRET) {
  throw new Error("❌ RAZORPAY_KEY_SECRET is not configured in environment variables");
}

console.log("✅ Razorpay credentials loaded successfully");

export const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});
