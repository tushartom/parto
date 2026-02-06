-- AlterTable
ALTER TABLE "PartAd" ADD COLUMN     "deliveryOption" TEXT,
ADD COLUMN     "supplierNote" VARCHAR(255),
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "PartAd" ADD CONSTRAINT "PartAd_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE SET NULL ON UPDATE CASCADE;
