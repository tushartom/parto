/*
  Warnings:

  - Added the required column `city` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locality` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "locality" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
