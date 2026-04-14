/**
 * Follicia Price Formatting Utilities
 * 
 * Centralized price formatting for consistent display across the application.
 * Supports psychological pricing and Indian currency formatting.
 */

export interface PriceFormatOptions {
  showSymbol?: boolean;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format price with Indian Rupee symbol and locale
 * 
 * @param price - Price in rupees
 * @param options - Formatting options
 * @returns Formatted price string (e.g., "₹899")
 */
export function formatPrice(
  price: number,
  options: PriceFormatOptions = {}
): string {
  const {
    showSymbol = true,
    locale = "en-IN",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  const formatted = price.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format price for display with psychological pricing emphasis
 * 
 * @param price - Price in rupees
 * @returns Formatted price with styling hints
 */
export function formatPriceWithEmphasis(price: number): {
  main: string;
  decimal: string;
  full: string;
} {
  const priceStr = price.toString();
  const hasDecimal = priceStr.includes(".");

  if (hasDecimal) {
    const [main, decimal] = priceStr.split(".");
    return {
      main: `₹${parseInt(main).toLocaleString("en-IN")}`,
      decimal: `.${decimal}`,
      full: formatPrice(price),
    };
  }

  return {
    main: formatPrice(price),
    decimal: "",
    full: formatPrice(price),
  };
}

/**
 * Convert price to paise for Razorpay API
 * Razorpay requires amount in smallest currency unit (paise)
 * 
 * @param priceInRupees - Price in rupees
 * @returns Price in paise (₹1 = 100 paise)
 */
export function convertToPaise(priceInRupees: number): number {
  return Math.round(priceInRupees * 100);
}

/**
 * Convert paise to rupees
 * 
 * @param priceInPaise - Price in paise
 * @returns Price in rupees
 */
export function convertToRupees(priceInPaise: number): number {
  return priceInPaise / 100;
}

/**
 * Calculate discount percentage
 * 
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage (e.g., 25 for 25% off)
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Apply discount to price
 * 
 * @param price - Original price
 * @param discountPercentage - Discount percentage (e.g., 20 for 20% off)
 * @returns Discounted price
 */
export function applyDiscount(
  price: number,
  discountPercentage: number
): number {
  return Math.round(price * (1 - discountPercentage / 100));
}

/**
 * Format currency for admin/analytics (supports lakhs notation)
 * 
 * @param amount - Amount in rupees
 * @returns Formatted string (e.g., "₹2.5L" for ₹250,000)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    return formatPrice(amount);
  }
}

/**
 * Validate price is within acceptable range
 * 
 * @param price - Price to validate
 * @param min - Minimum acceptable price (default: ₹399)
 * @param max - Maximum acceptable price (default: ₹999)
 * @returns True if price is valid
 */
export function isValidPrice(
  price: number,
  min: number = 399,
  max: number = 999
): boolean {
  return price >= min && price <= max && price > 0;
}

/**
 * Get price range label for filtering/display
 * 
 * @param price - Price in rupees
 * @returns Range label (e.g., "₹400-₹500")
 */
export function getPriceRangeLabel(price: number): string {
  if (price < 500) return "₹399-₹499";
  if (price < 600) return "₹500-₹599";
  if (price < 700) return "₹600-₹699";
  if (price < 800) return "₹700-₹799";
  if (price < 900) return "₹800-₹899";
  return "₹900-₹999";
}
