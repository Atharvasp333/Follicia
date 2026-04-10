-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('PAYMENT', 'PRODUCT', 'WEBSITE', 'DELIVERY');

-- CreateEnum
CREATE TYPE "FeedbackSentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('NEW', 'REVIEWED', 'RESOLVED');

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT,
    "userEmail" TEXT,
    "rawComment" TEXT NOT NULL,
    "rating" INTEGER,
    "aiCategory" "FeedbackCategory",
    "sentiment" "FeedbackSentiment",
    "aiSummary" TEXT,
    "urgencyScore" INTEGER,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_status_urgencyScore_idx" ON "feedback"("status", "urgencyScore");

-- CreateIndex
CREATE INDEX "feedback_aiCategory_createdAt_idx" ON "feedback"("aiCategory", "createdAt");
