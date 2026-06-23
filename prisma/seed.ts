import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database with Preorders...");

  // Delete all existing preorders
  await prisma.preorder.deleteMany({});

  await prisma.preorder.create({
    data: {
      name: "Multi variant 3",
      productCount: 1,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: null,
      status: "Inactive",
    },
  });

  await prisma.preorder.create({
    data: {
      name: "Multi variant 2",
      productCount: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: new Date("2025-12-15T20:27:00"),
      status: "Active",
    },
  });

  await prisma.preorder.create({
    data: {
      name: "Multi variants 1",
      productCount: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: null,
      status: "Active",
    },
  });

  await prisma.preorder.create({
    data: {
      name: "Partial payment",
      productCount: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      status: "Active",
    },
  });

  await prisma.preorder.create({
    data: {
      name: "Shipping not sure",
      productCount: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      status: "Active",
    },
  });

  await prisma.preorder.create({
    data: {
      name: "Full payment",
      productCount: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      status: "Active",
    },
  });

  await prisma.preorder.create({
    data: {
      name: "Coming soon",
      productCount: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-11T04:42:00"),
      endsAt: null,
      status: "Active",
    },
  });

  await prisma.preorder.create({
    data: {
      name: "With ends",
      productCount: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-14T15:59:00"),
      endsAt: new Date("2025-08-20T15:59:00"),
      status: "Active",
    },
  });

  console.log("✅ Database seeded with 8 preorders successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
