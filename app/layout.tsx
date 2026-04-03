import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { CartProvider } from "@/contexts/CartContext";
import ToastProvider from "@/components/ToastProvider";

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
  title: {
    default: "Follicia | Scientific Hair Atelier",
    template: "Follicia | %s",
  },
  description:
    "Follicia is a premium, AI-powered hair care platform providing clinical-grade diagnostics and personalized serums based on your unique Hair DNA.",
  keywords: [
    "Hair Care",
    "AI Hair Quiz",
    "Scalp Health",
    "Clinical Hair DNA",
    "Personalized Serums",
    "Hair Analysis",
    "Scalp Treatment",
    "Premium Hair Products",
    "AI Hair Diagnostics",
    "Hair Care Science",
  ],
  authors: [{ name: "Follicia" }],
  creator: "Follicia",
  publisher: "Follicia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://follicia.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Follicia",
    title: "Follicia | Scientific Hair Atelier",
    description:
      "Follicia is a premium, AI-powered hair care platform providing clinical-grade diagnostics and personalized serums based on your unique Hair DNA.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Follicia - AI-Powered Hair Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Follicia | Scientific Hair Atelier",
    description:
      "Follicia is a premium, AI-powered hair care platform providing clinical-grade diagnostics and personalized serums based on your unique Hair DNA.",
    images: ["/og-image.jpg"],
    creator: "@follicia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
            <ToastProvider />
          </CartProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}
