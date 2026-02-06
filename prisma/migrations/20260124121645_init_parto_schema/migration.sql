-- CreateEnum
CREATE TYPE "BuyerState" AS ENUM ('NORMAL', 'SPAM_RISK', 'BLOCKED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('DIRECT_REQUEST', 'PART_AD');

-- CreateEnum
CREATE TYPE "LeadState" AS ENUM ('NEW', 'ACTIVE', 'SLA_BREACH', 'DROPPED');

-- CreateEnum
CREATE TYPE "PartCondition" AS ENUM ('NEW', 'USED', 'BOTH');

-- CreateEnum
CREATE TYPE "SupplierLeadStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "LeadOutcome" AS ENUM ('SOLD', 'DISCARDED');

-- CreateEnum
CREATE TYPE "MyLeadStatus" AS ENUM ('ACTION_REQUIRED', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'SOLD');

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "state" "BuyerState" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "source" "LeadSource" NOT NULL DEFAULT 'DIRECT_REQUEST',
    "vehicleMake" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" INTEGER NOT NULL,
    "requestedParts" TEXT[],
    "condition" TEXT NOT NULL,
    "locationText" TEXT NOT NULL,
    "state" "LeadState" NOT NULL DEFAULT 'NEW',
    "slaDeadline" TIMESTAMP(3) NOT NULL,
    "firstEngagementAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierLead" (
    "id" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "whatsAppNumber" TEXT NOT NULL,
    "partsCondition" "PartCondition" NOT NULL DEFAULT 'BOTH',
    "locationText" TEXT NOT NULL,
    "status" "SupplierLeadStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNotes" TEXT,

    CONSTRAINT "SupplierLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "whatsAppNumber" TEXT NOT NULL,
    "partsCondition" "PartCondition" NOT NULL DEFAULT 'BOTH',
    "locationText" TEXT NOT NULL,
    "shopImageUrl" TEXT,
    "shopImagePublicId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadUnlock" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MyLeadStatus" NOT NULL DEFAULT 'ACTION_REQUIRED',
    "outcome" "LeadOutcome",

    CONSTRAINT "LeadUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartAd" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "partId" TEXT,
    "customPartName" TEXT,
    "title" TEXT NOT NULL,
    "images" TEXT[],
    "year" INTEGER NOT NULL,
    "condition" "PartCondition" NOT NULL DEFAULT 'USED',
    "price" DECIMAL(10,2),
    "askForPrice" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "inquiries" INTEGER NOT NULL DEFAULT 0,
    "status" "AdStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PartAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BrandToSupplier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BrandToSupplier_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "VehicleModel_brandId_idx" ON "VehicleModel"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleModel_brandId_slug_key" ON "VehicleModel"("brandId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PartCategory_slug_key" ON "PartCategory"("slug");

-- CreateIndex
CREATE INDEX "Part_categoryId_idx" ON "Part"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Part_categoryId_slug_key" ON "Part"("categoryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_phoneNumber_key" ON "Buyer"("phoneNumber");

-- CreateIndex
CREATE INDEX "Lead_buyerId_idx" ON "Lead"("buyerId");

-- CreateIndex
CREATE INDEX "Lead_state_idx" ON "Lead"("state");

-- CreateIndex
CREATE INDEX "SupplierLead_status_idx" ON "SupplierLead"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_whatsAppNumber_key" ON "Supplier"("whatsAppNumber");

-- CreateIndex
CREATE INDEX "Supplier_whatsAppNumber_idx" ON "Supplier"("whatsAppNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_isActive_idx" ON "Admin"("isActive");

-- CreateIndex
CREATE INDEX "LeadUnlock_supplierId_idx" ON "LeadUnlock"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadUnlock_leadId_supplierId_key" ON "LeadUnlock"("leadId", "supplierId");

-- CreateIndex
CREATE INDEX "PartAd_supplierId_idx" ON "PartAd"("supplierId");

-- CreateIndex
CREATE INDEX "PartAd_status_idx" ON "PartAd"("status");

-- CreateIndex
CREATE INDEX "PartAd_brandId_modelId_status_idx" ON "PartAd"("brandId", "modelId", "status");

-- CreateIndex
CREATE INDEX "PartAd_status_createdAt_idx" ON "PartAd"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "_BrandToSupplier_B_index" ON "_BrandToSupplier"("B");

-- AddForeignKey
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PartCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadUnlock" ADD CONSTRAINT "LeadUnlock_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadUnlock" ADD CONSTRAINT "LeadUnlock_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartAd" ADD CONSTRAINT "PartAd_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartAd" ADD CONSTRAINT "PartAd_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartAd" ADD CONSTRAINT "PartAd_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartAd" ADD CONSTRAINT "PartAd_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PartCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToSupplier" ADD CONSTRAINT "_BrandToSupplier_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToSupplier" ADD CONSTRAINT "_BrandToSupplier_B_fkey" FOREIGN KEY ("B") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
