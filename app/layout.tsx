import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { CartProvider } from "@/contexts/CartContext";

/* ─── Font loading (Next.js optimised, no @import needed in CSS) ──── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Follicia — AI-Powered Clinical Hair & Scalp Care",
  description:
    "Stop the trial-and-error. Follicia uses AI to analyse your unique scalp biology and deliver a clinical-grade hair regimen formulated exclusively for you.",
  keywords: ["hair care", "scalp analysis", "AI hair", "clinical hair", "personalised hair regimen"],
  openGraph: {
    title: "Follicia — AI-Powered Clinical Hair & Scalp Care",
    description: "Clinical-Chic hair science, now personalised by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <body className="antialiased font-inter">
        <AuthModalProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}
