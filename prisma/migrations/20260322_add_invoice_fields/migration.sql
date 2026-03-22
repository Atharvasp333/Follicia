-- AlterEnum: Add PAID status to OrderStatus
ALTER TYPE "OrderStatus" ADD VALUE 'PAID';

-- AlterTable: Add invoice tracking fields to Order
ALTER TABLE "orders" ADD COLUMN "razorpayInvoiceId" TEXT;
ALTER TABLE "orders" ADD COLUMN "invoiceUrl" TEXT;
ALTER TABLE "orders" ADD COLUMN "invoiceGeneratedAt" TIMESTAMP(3);
