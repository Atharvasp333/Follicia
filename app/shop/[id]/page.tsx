import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";

type Props = {
  params: { id: string };
};

// Generate dynamic metadata for each product
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  // Create a clean description (first 160 characters)
  const description =
    product.description && product.description.length > 160
      ? product.description.substring(0, 157) + "..."
      : product.description || `${product.name} - Premium hair care product from Follicia`;

  const imageUrl = product.imageUrl || "/placeholder-product.jpg";
  const absoluteImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${process.env.NEXT_PUBLIC_BASE_URL || "https://follicia.com"}${imageUrl}`;

  return {
    title: product.name,
    description,
    keywords: [
      product.name,
      product.category || "Hair Care",
      ...product.hairType,
      ...product.scalpCondition,
      "Follicia",
      "Premium Hair Care",
      "Clinical Hair Treatment",
    ],
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: `${product.name} - Follicia Hair Care Product`,
        },
      ],
      siteName: "Follicia",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: `/shop/${product.id}`,
    },
  };
}

// Generate static params for all products (optional, for static generation)
// Commented out for Vercel deployment - pages will be dynamically rendered
// export async function generateStaticParams() {
//   const products = await prisma.product.findMany({
//     where: { isActive: true },
//     select: { id: true },
//   });

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

// Force dynamic rendering for Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
