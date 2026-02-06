// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { brands, categories, locations } = require("./inventoryData");
const { Pool } = require("pg");
require("dotenv").config(); // Ensure variables are loaded

// 1. Initialize the database driver
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Pass the adapter to the client
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log("🚀 Starting Seeding Process...");

  // 1. Seed Admin Accounts
  const admins = [
    {
      email: "tushartom735@gmail.com",
      name: "Tushar SuperAdmin",
      role: "SUPER_ADMIN",
    },
    {
      email: "udemytushar290@gmail.com",
      name: "Tushar Test Admin",
      role: "ADMIN",
    },
  ];

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: { ...admin, isActive: true },
    });
  }
  console.log("✅ Admins Seeded.");

  // 2. Seed Brands and Models
  for (const brandData of brands) {
    const brand = await prisma.brand.upsert({
      where: { slug: brandData.slug },
      update: { name: brandData.name },
      create: { name: brandData.name, slug: brandData.slug },
    });

    for (const modelData of brandData.models) {
      await prisma.vehicleModel.upsert({
        where: {
          brandId_slug: { brandId: brand.id, slug: modelData.slug },
        },
        update: {
          startYear: modelData.startYear,
          endYear: modelData.endYear || null,
        },
        create: {
          name: modelData.name,
          slug: modelData.slug,
          startYear: modelData.startYear,
          endYear: modelData.endYear || null,
          brandId: brand.id,
        },
      });
    }
  }
  console.log("✅ Brands and Models Seeded.");

  // 3. Seed Categories and Parts
  for (const catData of categories) {
    const category = await prisma.partCategory.upsert({
      where: { slug: catData.slug },
      update: { name: catData.name },
      create: { name: catData.name, slug: catData.slug },
    });

    for (const partName of catData.parts) {
      const partSlug = partName
        .toLowerCase()
        .replace(/[\s()]+/g, "-") // replace space and brackets with dash
        .replace(/-+$/, ""); // remove trailing dash

      await prisma.part.upsert({
        where: {
          categoryId_slug: { categoryId: category.id, slug: partSlug },
        },
        update: {},
        create: {
          name: partName,
          slug: partSlug,
          categoryId: category.id,
        },
      });
    }
  }
  console.log("✅ Categories and Parts Seeded.");

  console.log("📍 Seeding Locations...");
  for (const cityData of locations) {
    const city = await prisma.city.upsert({
      where: { slug: cityData.slug },
      update: { state: cityData.state, name: cityData.name },
      create: {
        name: cityData.name,
        slug: cityData.slug,
        state: cityData.state,
      },
    });

    for (const locData of cityData.localities) {
      await prisma.locality.upsert({
        where: {
          cityId_slug: { cityId: city.id, slug: locData.slug },
        },
        update: { name: locData.name },
        create: {
          name: locData.name,
          slug: locData.slug,
          cityId: city.id,
        },
      });
    }
  }
  console.log("✅ Cities and Localities Seeded.");

  console.log("🔥 Full Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
