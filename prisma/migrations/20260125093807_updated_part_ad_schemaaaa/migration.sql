/*
  Warnings:

  - The `condition` column on the `PartAd` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PartConditionSupplier" AS ENUM ('USED', 'NEW', 'ANY');

-- AlterTable
ALTER TABLE "PartAd" DROP COLUMN "condition",
ADD COLUMN     "condition" "PartConditionSupplier" NOT NULL DEFAULT 'USED';
