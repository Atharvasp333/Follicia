import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Follicia — Clinical-Chic Hair & Scalp Care",
  description:
    "Personalized, AI-powered hair care solutions. Clinically formulated, beautifully designed for you.",
  keywords: ["hair care", "scalp health", "AI beauty", "clinical", "personalized"],
  authors: [{ name: "Follicia" }],
  openGraph: {
    title: "Follicia — Clinical-Chic Hair & Scalp Care",
    description: "Personalized, AI-powered hair care solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
