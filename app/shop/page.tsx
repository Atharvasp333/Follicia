import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/price-utils";
import ShopClient, { Product } from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop Premium Hair Care Products",
  description:
    "Explore Follicia's curated collection of clinical-grade hair care products. AI-matched serums, treatments, and scalp care solutions for your unique hair DNA.",
  keywords: [
    "Hair Care Products",
    "Premium Hair Serums",
    "Scalp Treatment",
    "Clinical Hair Care",
    "Hair Growth Products",
    "Follicia Shop",
  ],
  openGraph: {
    title: "Shop Premium Hair Care Products | Follicia",
    description:
      "Explore Follicia's curated collection of clinical-grade hair care products. AI-matched serums, treatments, and scalp care solutions for your unique hair DNA.",
    type: "website",
  },
};

// Brand constants for color mapping
const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  seafoamLight: "#4DBCB0",
  gold: "#D4AF37",
};

// Helper function to map DB products to UI format with visual styling
function mapDbProductToUI(dbProduct: any): Product {
  // Assign accent colors based on category
  const categoryColors: Record<string, { accent: string; bg: string }> = {
    "Scalp Care": { accent: B.seafoam, bg: "rgba(42,157,143,0.06)" },
    "Treatments": { accent: B.gold, bg: "rgba(212,175,55,0.06)" },
    "Conditioning": { accent: B.seafoamLight, bg: "rgba(77,188,176,0.06)" },
    "Cleansing": { accent: B.teal, bg: "rgba(13,59,68,0.05)" },
  };

  const colors = categoryColors[dbProduct.category || "Treatments"] || {
    accent: B.seafoam,
    bg: "rgba(42,157,143,0.06)",
  };

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    tagline: dbProduct.tagline || "Premium hair care",
    price: dbProduct.price,
    priceDisplay: dbProduct.priceDisplay || formatPrice(dbProduct.price),
    imageUrl: dbProduct.imageUrl,
    category: dbProduct.category || "Treatments",
    hairType: dbProduct.hairType || [],
    porosity: dbProduct.porosity || [],
    condition: dbProduct.scalpCondition || [],
    badge: dbProduct.badge,
    accent: colors.accent,
    bg: colors.bg,
    rating: dbProduct.rating || 0,
    reviews: dbProduct.reviews || 0,
    description: dbProduct.description || "",
    howToUse: "Apply as directed. Consult product packaging for detailed instructions.",
    stock: dbProduct.stock || 0,
    inventoryCount: dbProduct.inventoryCount || 0,
    lowStockThreshold: dbProduct.lowStockThreshold || 5,
  };
}

export default async function ShopPage() {
  // Fetch products from database
  const dbProducts = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map database products to UI format
  const products: Product[] = dbProducts.map(mapDbProductToUI);

  return <ShopClient products={products} />;
}
