const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme',
      country: 'ES',
      currency: 'EUR',
    },
  });

  await prisma.brand.upsert({
    where: { id: 'brand-acme' },
    update: {},
    create: {
      id: 'brand-acme',
      companyId: company.id,
      name: 'Acme',
      slug: 'acme-brand',
    },
  });

  const channel = await prisma.channel.upsert({
    where: { code: 'amazon' },
    update: {},
    create: {
      code: 'amazon',
      name: 'Amazon',
      sites: {
        create: [{ code: 'ES' }, { code: 'IT' }],
      },
    },
    include: { sites: true },
  });

  for (const site of channel.sites) {
    await prisma.sellerAccount.upsert({
      where: {
        companyId_channelSiteId: { companyId: company.id, channelSiteId: site.id },
      },
      update: {},
      create: {
        companyId: company.id,
        channelSiteId: site.id,
      },
    });
  }

  const warehouse = await prisma.warehouse.upsert({
    where: { companyId_code: { companyId: company.id, code: 'MAIN' } },
    update: {},
    create: {
      companyId: company.id,
      code: 'MAIN',
    },
  });

  const stockItem = await prisma.stockItem.upsert({
    where: {
      warehouseId_variantId_lotId: {
        warehouseId: warehouse.id,
        variantId: 'variant-demo',
        lotId: null,
      },
    },
    update: { quantity: 100 },
    create: {
      warehouseId: warehouse.id,
      variantId: 'variant-demo',
      quantity: 100,
    },
  });

  await prisma.inventoryMovement.create({
    data: {
      stockItemId: stockItem.id,
      type: 'ADJUSTMENT',
      quantity: 100,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
