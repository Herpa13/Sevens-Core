-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('ADJUSTMENT', 'PO_RECEIPT', 'SALE', 'RETURN', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateTable Company
CREATE TABLE "Company" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "taxId" TEXT,
  "country" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateTable Brand
CREATE TABLE "Brand" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Brand_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Brand_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Brand_companyId_name_key" ON "Brand"("companyId","name");
CREATE UNIQUE INDEX "Brand_companyId_slug_key" ON "Brand"("companyId","slug");
CREATE UNIQUE INDEX "Brand_id_companyId_key" ON "Brand"("id","companyId");

-- CreateTable Warehouse
CREATE TABLE "Warehouse" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Warehouse_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Warehouse_companyId_code_key" ON "Warehouse"("companyId","code");

-- CreateTable Channel
CREATE TABLE "Channel" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Channel_code_key" ON "Channel"("code");

-- CreateTable ChannelSite
CREATE TABLE "ChannelSite" (
  "id" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  CONSTRAINT "ChannelSite_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ChannelSite_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ChannelSite_channelId_code_key" ON "ChannelSite"("channelId","code");

-- CreateTable SellerAccount
CREATE TABLE "SellerAccount" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "channelSiteId" TEXT NOT NULL,
  CONSTRAINT "SellerAccount_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SellerAccount_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "SellerAccount_channelSiteId_fkey" FOREIGN KEY ("channelSiteId") REFERENCES "ChannelSite"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "SellerAccount_companyId_channelSiteId_key" ON "SellerAccount"("companyId","channelSiteId");

-- CreateTable Listing
CREATE TABLE "Listing" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "brandId" TEXT NOT NULL,
  "sellerAccountId" TEXT NOT NULL,
  "variantId" TEXT NOT NULL,
  "price" DECIMAL(18,4),
  "currency" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Listing_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Listing_brandId_companyId_fkey" FOREIGN KEY ("brandId", "companyId") REFERENCES "Brand"("id","companyId") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Listing_sellerAccountId_fkey" FOREIGN KEY ("sellerAccountId") REFERENCES "SellerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "Listing_brandId_companyId_idx" ON "Listing"("brandId","companyId");
CREATE UNIQUE INDEX "Listing_sellerAccountId_variantId_key" ON "Listing"("sellerAccountId","variantId");

-- CreateTable SalesOrder
CREATE TABLE "SalesOrder" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "brandId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SalesOrder_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SalesOrder_brandId_companyId_fkey" FOREIGN KEY ("brandId", "companyId") REFERENCES "Brand"("id","companyId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable Lot
CREATE TABLE "Lot" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "brandId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "variantId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Lot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Lot_brandId_companyId_fkey" FOREIGN KEY ("brandId", "companyId") REFERENCES "Brand"("id","companyId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable StockItem
CREATE TABLE "StockItem" (
  "id" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "variantId" TEXT NOT NULL,
  "lotId" TEXT,
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "StockItem_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "StockItem_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "StockItem_warehouseId_variantId_lotId_key" ON "StockItem"("warehouseId","variantId","lotId");

-- CreateTable InventoryMovement
CREATE TABLE "InventoryMovement" (
  "id" TEXT NOT NULL,
  "stockItemId" TEXT NOT NULL,
  "type" "InventoryMovementType" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "InventoryMovement_stockItemId_fkey" FOREIGN KEY ("stockItemId") REFERENCES "StockItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
