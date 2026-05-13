import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.item.deleteMany();
  await prisma.watchlistItem.deleteMany();

  const perfume = await prisma.item.create({
    data: {
      name: "Dior Sauvage EDT 100ml",
      brand: "Dior",
      category: "PERFUME",
      condition: "LIKE_NEW",
      buyPrice: 18,
      buyDate: new Date("2026-04-10"),
      notes: "Barely used, 80% full",
      status: "SOLD",
      listing: {
        create: { listingPrice: 55, listingDate: new Date("2026-04-11") },
      },
      sale: {
        create: {
          salePrice: 52,
          platformFee: 0,
          shippingCost: 3.5,
          profit: 52 - 0 - 3.5 - 18,
          saleDate: new Date("2026-04-18"),
        },
      },
    },
  });

  const shirt = await prisma.item.create({
    data: {
      name: "Ralph Lauren Polo Shirt XL",
      brand: "Ralph Lauren",
      category: "MENS_CLOTHING",
      condition: "GOOD",
      buyPrice: 6,
      buyDate: new Date("2026-05-01"),
      status: "LISTED",
      listing: {
        create: { listingPrice: 25, listingDate: new Date("2026-05-02") },
      },
    },
  });

  const phone = await prisma.item.create({
    data: {
      name: "iPhone 13 Pro 128GB Space Grey",
      brand: "Apple",
      category: "ELECTRONICS",
      condition: "GOOD",
      buyPrice: 280,
      buyDate: new Date("2026-05-05"),
      notes: "Minor scratches on back, screen perfect",
      status: "BOUGHT",
    },
  });

  await prisma.watchlistItem.createMany({
    data: [
      {
        keywords: "hugo boss polo shirt",
        category: "MENS_CLOTHING",
        maxPrice: 8,
        notes: "Resells for €20-35",
        isActive: true,
      },
      {
        keywords: "armani exchange jacket",
        category: "MENS_CLOTHING",
        maxPrice: 20,
        notes: "Sizes M-XL only",
        isActive: true,
      },
      {
        keywords: "creed aventus perfume",
        category: "PERFUME",
        maxPrice: 80,
        notes: "Any size, massive margins",
        isActive: true,
      },
    ],
  });

  console.log("Seeded:", { perfume: perfume.id, shirt: shirt.id, phone: phone.id });
}

main().catch(console.error).finally(() => prisma.$disconnect());
