import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/backend/db/schema",
  out: "./src/backend/db/migrations",
  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL!,
  },
});
