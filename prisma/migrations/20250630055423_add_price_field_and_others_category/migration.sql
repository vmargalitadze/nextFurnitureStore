-- AlterEnum
ALTER TYPE "ProductType" ADD VALUE 'OTHERS';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "price" DECIMAL(12,2);
