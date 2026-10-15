const { execSync } = require("child_process");

// Fallback DATABASE_URL if not provided in environment
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

try {
  console.log("⚡ Generating Prisma Client with DATABASE_URL:", process.env.DATABASE_URL);
  execSync("npx prisma generate", {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  console.error("❌ Postinstall prisma generate error:", err);
  process.exit(1);
}
