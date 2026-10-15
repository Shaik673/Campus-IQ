const { execSync } = require("child_process");

// Fallback DATABASE_URL if not provided in Vercel environment
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

console.log("📦 Build Environment Initialized. DATABASE_URL:", process.env.DATABASE_URL);

try {
  console.log("🚀 Pushing database schema (prisma db push)...");
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("🌱 Seeding database FAQs and demo users...");
  execSync("npx tsx prisma/seed.ts", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("🌱 Seeding extended FAQs dataset...");
  execSync("npx tsx prisma/seed-more.ts", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("⚡ Building Next.js application...");
  execSync("npx next build", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("✅ Build and seed completed successfully!");
} catch (err) {
  console.error("❌ Build pipeline failed:", err);
  process.exit(1);
}
