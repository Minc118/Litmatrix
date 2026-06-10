import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://litmatrix:litmatrix@localhost:5432/litmatrix",
  },
  strict: true,
});
