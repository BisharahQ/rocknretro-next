import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Load JSON data
  const productsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'products.json'), 'utf-8')
  );
  const settingsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'settings.json'), 'utf-8')
  );
  const sectionsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'sections.json'), 'utf-8')
  );
  const ordersData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'orders.json'), 'utf-8')
  );

  // Seed products (preserve IDs)
  console.log(`Seeding ${productsData.length} products...`);
  for (const p of productsData) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        type: p.type,
        size: p.size,
        cat: p.cat,
        price: p.price,
        img: p.img,
        images: p.images,
        badge: p.badge ?? null,
        sold: p.sold ?? false,
        reserved: p.reserved ?? false,
        description: p.description ?? null,
        featured: p.featured ?? false,
      },
    });
  }

  // Reset product autoincrement sequence
  const maxProductId = Math.max(...productsData.map((p: { id: number }) => p.id));
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), ${maxProductId})`
  );
  console.log(`Product sequence reset to ${maxProductId}`);

  // Seed settings
  console.log('Seeding settings...');
  await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, reservationDays: settingsData.reservationDays ?? 2 },
  });

  // Seed site config
  console.log('Seeding site config...');
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, data: sectionsData },
  });

  // Seed orders (if any)
  if (ordersData.length > 0) {
    console.log(`Seeding ${ordersData.length} orders...`);
    for (const o of ordersData) {
      await prisma.order.upsert({
        where: { id: o.id },
        update: {},
        create: {
          id: o.id,
          customerName: o.customer.name,
          customerPhone: o.customer.phone,
          customerNotes: o.customer.notes ?? null,
          subtotal: o.subtotal,
          total: o.total,
          status: o.status,
          reservedUntil: new Date(o.reservedUntil),
          createdAt: new Date(o.createdAt),
          items: {
            create: o.items.map((item: { productId: number; name: string; price: number; quantity: number; image: string }) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
      });
    }

    const maxOrderId = Math.max(...ordersData.map((o: { id: number }) => o.id));
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"Order"', 'id'), ${maxOrderId})`
    );
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
