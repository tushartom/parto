/*
  Warnings:

  - You are about to drop the column `outcome` on the `LeadUnlock` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `LeadUnlock` table. All the data in the column will be lost.
  - You are about to drop the column `unlockedAt` on the `LeadUnlock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LeadUnlock" DROP COLUMN "outcome",
DROP COLUMN "status",
DROP COLUMN "unlockedAt",
ADD COLUMN     "firstInteractedAt" TIMESTAMP(3),
ADD COLUMN     "hasInteracted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isIgnored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStarred" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "LeadOutcome";

-- DropEnum
DROP TYPE "MyLeadStatus";
