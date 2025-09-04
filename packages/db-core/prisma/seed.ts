import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Papa from 'papaparse';

const prisma = new PrismaClient();

interface BrandCompanyRow {
  brand_id: string;
  company_slug: string;
}

async function main() {
  const csvPath = resolve(__dirname, '../../..', 'docs', 'brand_company_map.csv');
  const file = readFileSync(csvPath, 'utf-8');
  const { data } = Papa.parse<BrandCompanyRow>(file, {
    header: true,
    skipEmptyLines: true,
  });

  const slugToId: Record<string, string> = {};

  for (const row of data) {
    const brandId = row.brand_id?.trim();
    const companySlug = row.company_slug?.trim();
    if (!brandId || !companySlug) continue;

    let companyId = slugToId[companySlug];
    if (!companyId) {
      const existing = await prisma.company.findUnique({ where: { slug: companySlug } });
      if (existing) {
        companyId = existing.id;
      } else {
        const created = await prisma.company.create({ data: { name: companySlug, slug: companySlug } });
        companyId = created.id;
      }
      slugToId[companySlug] = companyId;
    }

    await prisma.brand.update({
      where: { id: brandId },
      data: { companyId },
    });

    // Propagate companyId to child tables
    await prisma.listing.updateMany({ where: { brandId }, data: { companyId } });
    await prisma.salesOrder.updateMany({ where: { brandId }, data: { companyId } });
    await prisma.lot.updateMany({ where: { brandId }, data: { companyId } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
