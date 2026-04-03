import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Hair Quiz - Discover Your Hair DNA",
  description:
    "Take Follicia's 90-second AI-powered hair quiz to discover your unique hair DNA. Get personalized product recommendations based on your scalp biology, porosity, and hair goals.",
  keywords: [
    "Hair Quiz",
    "AI Hair Analysis",
    "Hair DNA Test",
    "Scalp Analysis",
    "Hair Type Quiz",
    "Personalized Hair Care",
    "Hair Porosity Test",
  ],
  openGraph: {
    title: "AI Hair Quiz - Discover Your Hair DNA | Follicia",
    description:
      "Take Follicia's 90-second AI-powered hair quiz to discover your unique hair DNA. Get personalized product recommendations based on your scalp biology.",
    type: "website",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
