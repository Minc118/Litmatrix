import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://litmatrix:litmatrix@localhost:5432/litmatrix",
  },
  strict: true,
});
