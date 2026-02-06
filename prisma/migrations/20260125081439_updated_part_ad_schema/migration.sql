/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `PartAd` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `PartAd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PartAd" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PartAd_slug_key" ON "PartAd"("slug");
