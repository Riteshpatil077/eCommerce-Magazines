/*
  Warnings:

  - A unique constraint covering the columns `[userId,magazineId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Magazine" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_magazineId_key" ON "Subscription"("userId", "magazineId");
