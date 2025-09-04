-- Make companyId columns NOT NULL
ALTER TABLE "Brand" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Listing" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "SalesOrder" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Lot" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Warehouse" ALTER COLUMN "companyId" SET NOT NULL;

-- Unique constraints and indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_companyId_name_key" ON "Brand"("companyId", "name");
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_companyId_slug_key" ON "Brand"("companyId", "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_id_companyId_key" ON "Brand"("id", "companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "Warehouse_companyId_code_key" ON "Warehouse"("companyId", "code");
CREATE INDEX IF NOT EXISTS "Listing_brandId_companyId_idx" ON "Listing"("brandId", "companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "Listing_sellerAccountId_variantId_key" ON "Listing"("sellerAccountId", "variantId");

-- Foreign keys
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_brandId_companyId_fkey" FOREIGN KEY ("brandId", "companyId") REFERENCES "Brand"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SalesOrder" ADD CONSTRAINT "SalesOrder_brandId_companyId_fkey" FOREIGN KEY ("brandId", "companyId") REFERENCES "Brand"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_brandId_companyId_fkey" FOREIGN KEY ("brandId", "companyId") REFERENCES "Brand"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
